import React, { createContext, useContext, useEffect,useState } from "react";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from "@nextui-org/table";

import { useRouter } from "next/router";
import Link from "next/link";
import CartContext from "@/context/cartContext";

const Order =()=> {
  const {clearCart} = useContext(CartContext)
  const [orders, setorders] = useState([])
  const router = useRouter()
  useEffect(() => {
 
    const fetchOrders = async () => {
    
        const a = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/myorder`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token:JSON.parse(localStorage.getItem('myUser')).token }),
        });
        const res = await  a.json()
        setorders(res.orders)
        // console.log(res);
     
    };
  
    if (!localStorage.getItem('myUser')) {
      router.push('/');
    } else {
      fetchOrders();
    }
    if(router.query.clearCart ==1){
      clearCart()
    }
  }, []);
  
  
  return (
    <div className="mt-32">

    <Table hideHeader aria-label="Example static collection table">
      <TableHeader>
    
        <TableColumn>NAME</TableColumn>
        <TableColumn>ROLE</TableColumn>
        <TableColumn>STATUS</TableColumn>
        <TableColumn>newstats</TableColumn>
      </TableHeader>
      <TableBody>
      {orders.map((item) => {
       return <TableRow key={item._id}>
        
          <TableCell>{item.orderId}</TableCell>
          <TableCell>{item.email}</TableCell>
          <TableCell>{item.amount}</TableCell>
          <TableCell>
            <Link href={'/orders?id='+item._id}>details</Link>
          </TableCell>
        </TableRow>
})}
      </TableBody>
    </Table>
    </div>
  );
}



export default Order
