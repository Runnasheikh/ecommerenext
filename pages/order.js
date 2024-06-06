import React, { useContext, useEffect, useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/table";
import { useRouter } from "next/router";
import Link from "next/link";
import CartContext from "@/context/cartContext";
import styles from '../styles/order.module.css';
import QRCode from "qrcode";
import Image from "next/image";

const Order = () => {
  const { clearCart } = useContext(CartContext);
  const [orders, setOrders] = useState([]);
  const [lastRazorpayPaymentId, setLastRazorpayPaymentId] = useState('');
  const [qrCodes, setQrCodes] = useState({});
  const router = useRouter();

  const generateQrCode = async (data, orderId) => {
    try {
      const url = await QRCode.toDataURL(data, { errorCorrectionLevel: "H" });
      setQrCodes((prevQrCodes) => ({ ...prevQrCodes, [orderId]: url }));
    } catch (error) {
      console.error("QR code generation failed", error);
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/myorder`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: JSON.parse(localStorage.getItem('myUser')).token }),
        });
        const result = await response.json();
        
        setOrders(result.orders);
        if (result.orders.length > 0) {
          const lastOrder = result.orders[result.orders.length - 1];
          const paymentInfo = JSON.parse(lastOrder.paymentInfo);
          setLastRazorpayPaymentId(paymentInfo.razorpayPaymentId);
          console.log(paymentInfo.razorpayPaymentId);
        }
      
        result.orders.forEach((order) => {
          generateQrCode(JSON.stringify(order), order.orderId);
        });
      } catch (error) {
        console.error("Error fetching orders:", error);
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
          razorpayPaymentId: lastRazorpayPaymentId,
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
        await fetch('http://localhost:3000/api/sendemail', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: order.email,
            amount: order.amount,
            orderId: order.orderId,
          }),
        });
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
          <TableColumn>QR Code</TableColumn>
        </TableHeader>
        <TableBody>
          {orders.map((item) => (
            <TableRow key={item._id}>
              <TableCell>{item.orderId}</TableCell>
              <TableCell>{item.email}</TableCell>
              <TableCell>{item.amount}</TableCell>
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
              <TableCell>
                {item.status !== 'cancelled' && qrCodes[item.orderId] ? (
                  <Image src={qrCodes[item.orderId]} alt={`QR Code for Order ${item.orderId}`} width={200} height={200} />
                ) : (
                  <p>{item.status === 'cancelled' ? "Order Cancelled" : "Loading QR Code..."}</p>
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
