import React, { useContext, useEffect, useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/table";
import { useRouter } from "next/router";
import Link from "next/link";
import CartContext from "@/context/cartContext";
import styles from '../styles/order.module.css';

const Order = () => {
  const { clearCart } = useContext(CartContext);
  const [orders, setOrders] = useState([]);
  const [lastRazorpayPaymentId, setLastRazorpayPaymentId] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/myorder`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: JSON.parse(localStorage.getItem('myUser')).token }),
      });
      const result = await response.json();
      
      setOrders(result.orders);

      // Extract and store the razorpayPaymentId of the last order
      if (result.orders.length > 0) {
        const lastOrder = result.orders[result.orders.length - 1];
        const paymentInfo = JSON.parse(lastOrder.paymentInfo);
        setLastRazorpayPaymentId(paymentInfo.razorpayPaymentId);
        console.log(paymentInfo.razorpayPaymentId);
      }
    };

    if (!localStorage.getItem('myUser')) {
      router.push('/');
    } else {
      fetchOrders();
    }

    if (router.query.clearCart == 1) {
      clearCart();
    }
  }, [clearCart, router]);

  const handlePayAgain = async (order) => {
    try {

      const response = await fetch('/api/razorpay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: order.amount, email: order.email, orderId: order.orderId }),
      });

      const data = await response.json();

      if (data.id) {
        const options = {
          key: "rzp_test_iZrG14NDYMdlpz", 
          amount: data.amount,
          currency: data.currency,
          name: "Your Company Name",
          description: "Test Transaction",
          order_id: data.id,
          handler: async function (response) {
            const verifyResponse = await fetch('/api/verifypayment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                orderId: order.orderId,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.status === "success") {
              setOrders((prevOrders) =>
                prevOrders.map((o) =>
                  o.orderId === order.orderId ? { ...o, status: "paid" } : o
                )
              );
            }
          },
        };

        const rzp = new Razorpay(options);
        rzp.open();
      }
    } catch (error) {
      console.error("Payment initiation failed", error);
    }
  };

  const handleCancelOrder = async (order) => {
    try {
     
      const response = await fetch('/api/refund', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          razorpayPaymentId: lastRazorpayPaymentId,  // dynamically get the payment ID
          amount: order.amount,
          orderId: order.orderId
        }),
      });

      const data = await response.json();
      if (data.status === "success") {
        setOrders((prevOrders) =>
          prevOrders.map((o) =>
            o.orderId === order.orderId ? { ...o, status: "cancelled" } : o
          )
        );
      }
    } catch (error) {
      console.error("Refund initiation failed", error);
    }
  };

  return (
    <div className={styles.tableContainer}>
      <Table aria-label="Order Table" className={styles.table}>
        <TableHeader>
          <TableColumn>Order ID</TableColumn>
          <TableColumn>Email</TableColumn>
          <TableColumn>Amount</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn>Details</TableColumn>
          <TableColumn>Action</TableColumn>
          <TableColumn>Cancel Order</TableColumn>
        </TableHeader>
        <TableBody>
          {orders.map((item) => (
            <TableRow key={item._id}>
              <TableCell>{item.orderId}</TableCell>
              <TableCell>{item.email}</TableCell>
              <TableCell>{item.address}</TableCell>
              <TableCell>{item.status}</TableCell>
              <TableCell>
                <Link href={`/orders?id=${item._id}`}>Details</Link>
              </TableCell>
              <TableCell>
                {item.status === 'pending' && (
                  <button onClick={() => handlePayAgain(item)}>Pay Again</button>
                )}
              </TableCell>
              <TableCell>
                {item.status !== 'cancelled' && (
                  <button onClick={() => handleCancelOrder(item)}>Cancel Order</button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Order;
