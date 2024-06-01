import React, { useContext, useEffect } from 'react';
import { AiFillMinusCircle, AiFillPlusCircle } from "react-icons/ai";
import { BsFillBagCheckFill } from "react-icons/bs";
import CartContext from '../context/cartContext';
import Script from 'next/script';
import { useRouter } from 'next/router';
import { useState } from "react";
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import orderm from '@/public/models/orderm';
const Checkout = () => {
  const [name, setname] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [pincode, setPincode] = useState('')
  const [address, setAddres] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [disabled, setdisabled] = useState(true)
  const [orders, setorders] = useState([])
  
  const [myuser, setuser] = useState({value:null})
  useEffect(() => {

    const userr = JSON.parse(localStorage.getItem('myUser'))
    if(userr && userr.token){
     setuser(userr)
     setEmail(userr.email)
     fetchuser(userr.token)
    }
    
  }, []);
  const getpincode = async(pin)=>{
    let pins = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/pin`);
    let pinjson = await pins.json()
    if(Object.keys(pinjson).includes(pin)){
      setState(pinjson[pin][1])
      setCity(pinjson[pin][0])
    }else{
      setState('')
      setCity('')
    }
  }
  const fetchuser = async (token) => {
    let data = { token: token };
    console.log(data);
    let a = await fetch('http://localhost:3000/api/getuser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    let res = await a.json();
    console.log(res);
    
      setname(res.name);
      setPhone(res.phone);
      setAddres(res.address);
      setPincode(res.pincode);
      getpincode(res.pincode)
    
  };
  const handleChange =async(e)=>{
   
  if(e.target.name == 'name'){
    setname(e.target.value)
  }
  else if(e.target.name == 'phone'){
    setPhone(e.target.value)
  }
  else if(e.target.name == 'email'){
    setEmail(e.target.value)
  }
  else if(e.target.name == 'address'){
    setAddres(e.target.value)
  }
  // else if(e.target.name == 'city'){
  //   setCity(e.target.value)
  // }
  else if(e.target.name == 'pincode'){
    setPincode(e.target.value)
    if(e.target.value.length == 6){
      getpincode(e.target.value)
    }
  }
  if(name.length>3 && phone.length>3 && address.length>3 && pincode.length>3){
    
      setdisabled(false)
  
  }else{
    setdisabled(true)
  }
  }
  const { cart, removeFromCart, addToCart, subtotal,clearCart,user } = useContext(CartContext);
  const router = useRouter()
  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src ="https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };

      document.body.appendChild(script);
    });
  };


  const makePayment = async () => {
  
   
    const res = await initializeRazorpay();
  
    if (!res) {
      alert("Razorpay SDK Failed to load");
      return;
    }
  
    const orderDetails = {
      amount: subtotal,
      email,
      address,
       cart,
       clearCart,
       phone,
       pincode
    };
  
    try {
      const response = await fetch("/api/razorpay", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderDetails),
      });
  
      if (!response.ok) {
        const errorData = await response.text();
        console.error('Error response from server:', errorData);
        alert('Error creating order: ' + errorData);
        return;
      }
  
      const data = await response.json();
      // console.log(data);
  
      const options = {
        key: "rzp_test_iZrG14NDYMdlpz",
        name: "Manu Arora Pvt Ltd",
        currency: data.currency,
        amount: data.amount,
        order_id: data.id,
        description: "Thank you for your test donation",
        image: "https://manuarora.in/logo.png",
        handler: async function (response) {
          // On successful payment, verify the payment
          const verificationResponse = await fetch("/api/verifypayment", {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
             cart,
             clearCart,
              orderId: data.id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
            }),
           
          });
        
          const verificationData = await verificationResponse.json();
  
          if (verificationData.status === "success") {
           

    
    
    // router.push(`/orders?id=${order._id}`);
    const a = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/myorder`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token:JSON.parse(localStorage.getItem('myUser')).token }),
    });
    const res = await  a.json()
    setorders(res.orders)
   // Log the _id of the first order
if (res.orders.length > 0) {
  
  clearCart()
  router.push(`/orders?id=${res.orders[res.orders.length - 1]._id}`);
}
    
await fetch('http://localhost:3000/api/sendemail', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email,
    amount: subtotal,
    orderId: data.id,
  }),
});
            
          } else {
            alert("Payment verification failed: " + verificationData.message);
            toast.error('wrong credential', {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            
              });
          }
        },
        prefill: {
          name,
          email,
          contact: phone,
        },
      };
  
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Error making payment:', error);
      alert('Error making payment: ' + error.message);
    }
  };
  


  return (
    <div className='container sm:m-auto px-2'>
      <ToastContainer
position="top-right"
autoClose={5000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="light"
/>
      <h1 className="font-bold text-3xl my-8 text-center">Checkout</h1>
      <h2 className='font-bold text-xl'>Delivery Details</h2>
      <div className="mx-auto flex my-4">
        <div className="px-2 w-1/2">
          <div className="mb-4">
            <label htmlFor="name" className="leading-7 text-sm text-gray-600">Name</label>
            <input onChange={handleChange} value={name} type="text" id="name" name="name" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
          </div>
        </div>
        <div className="px-2 w-1/2">
          <div className="mb-4">
            <label htmlFor="email" className="leading-7 text-sm text-gray-600">Email</label>
            {myuser && user.value?
            <input  value={ user.email} type="email" id="email" name="email" className="w-full bg-white rounded border border-gray-300
            focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700
            py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" readOnly/>
              :<input onChange={handleChange} value={email} type="email" id="email" name="email" className="w-full bg-white rounded border border-gray-300
               focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700
               py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
             }
          
          </div>
        </div>
      </div>
      <div className="px-2 w-full">
        <div className="mb-4">
          <label htmlFor="address" onChange={handleChange} value={address} className="leading-7 text-sm text-gray-600">Address</label>
          <textarea onChange={handleChange} value={address} id="address" name="address" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"></textarea>
        </div>
      </div>
      <div className="mx-auto flex my-4">
        <div className="px-2 w-1/2">
          <div className="mb-4">
            <label htmlFor="phone" className="leading-7 text-sm text-gray-600">Phone</label>
            <input onChange={handleChange} value={phone} type="text" id="phone" name="phone" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
          </div>
        </div>
        <div className="px-2 w-1/2">
          <div className="mb-4">
           
            <label htmlFor="pincode" className="leading-7 text-sm text-gray-600">Pincode</label>
            <input onChange={handleChange} value={pincode} type="text" id="pincode" name="pincode" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200
             text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
          </div>
        </div>
      </div>
      <div className="mx-auto flex my-4">
        <div className="px-2 w-1/2">
          <div className="mb-4">
            <label htmlFor="state" className="leading-7 text-sm text-gray-600">State</label>
            <input onChange={handleChange} value={state} type="text" id="state" name="state" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
          </div>
        </div>
        <div className="px-2 w-1/2">
          <div className="mb-4">
          <label htmlFor="city" className="leading-7 text-sm text-gray-600">District </label>
            <input onChange={handleChange} value={city} type="text" id="city" name="city" className="w-full bg-white rounded border border-gray-300
             focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
          </div>
        </div>
      </div>

      <h2 className="font-semibold text-xl">Review Cart</h2>
      <div className="sideCart bg-pink-100 p-6 py-10">
        <ol className="list-decimal font-semibold">
          {Object.keys(cart).length === 0 && <div className="my-4 font-semibold">Not present in the cart</div>}
          {Object.keys(cart).map((k) => (
            <li key={k}>
              <div className="item flex my-5">
                <div className="font-semibold">{cart[k].name} ({cart[k].size}/{cart[k].variant})</div>
                <div className="flex items-center justify-center w-1/3">
                  <AiFillMinusCircle onClick={() => removeFromCart(k, 1, cart[k].price, cart[k].name, cart[k].size, cart[k].variant)} className="cursor-pointer text-pink-500" />
                  <span className="mx-2">{cart[k].qty}</span>
                  <AiFillPlusCircle onClick={() => addToCart(k, 1, cart[k].price, cart[k].name, cart[k].size, cart[k].variant)} className="cursor-pointer text-pink-500" />
                </div>
              </div>
            </li>
          ))}
        </ol>
        <div className="font-bold my-4">Subtotal: ₹{subtotal}</div>
        <div className="flex">
          <button onClick={makePayment} disabled={disabled} className="flex mx-auto disabled:bg-pink-200 text-white bg-pink-500 border-0 py-2 px-6 focus:outline-none hover:bg-pink-600 rounded text-lg">
            <BsFillBagCheckFill className="mr-2 mt-1" /> Pay ₹{subtotal}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
