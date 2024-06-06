
import React, { useContext, useEffect } from 'react';

import CartContext from '../context/cartContext';
import Script from 'next/script';
import { useRouter } from 'next/router';
import { useState } from "react";
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import orderm from '@/public/models/orderm';

const Myaccount = () => {
  const [name, setname] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [pincode, setPincode] = useState('')
  const [address, setAddres] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [password, setPassowrd] = useState('')
  const [cpassword, csetPassword] = useState('')
  const [npassword, nsetPassword] = useState('')
 
  const [disabled, setdisabled] = useState(true)
  const [orders, setorders] = useState([])
  
  const [myuser, setuser] = useState({value:null})
  useEffect(() => {

    const myuser = JSON.parse(localStorage.getItem('myUser'))
    if(!myuser){
      router.push('/')
    }
    if(myuser && myuser.token){
     setuser(myuser)
     setEmail(myuser.email)
     fetchuser(myuser.token)
    }
    
  }, []);
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
    
  };
  
  const handleSubmit = async () => {
    let data = {
      token: myuser.token,
      name,
      phone,
      address,
      pincode,
      password
    };
    let a = await fetch('http://localhost:3000/api/updateuser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const result = await a.json();
    console.log(result);
    if (result.message === 'User updated successfully') {
      toast.success('User updated successfully!');
    } else {
      toast.error('Error updating user');
    }
  };
  const handlePasswordSubmit = async () => {
    let result;
    if(npassword == cpassword){
      
    
    
    let data = {
      token: myuser.token,
     password,
     cpassword,
     npassword
    };
    let a = await fetch('http://localhost:3000/api/updatepassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      
    });
     result = await a.json();
    console.log(result);
  }
  else{
    toast.error('Passwords do not match')
      return
  }
 
    if (result.success) {
      toast.success('User updated successfully!');
    } else {
      toast.error('Error updating password');
    }
    setPassowrd('')
    csetPassword('')
    nsetPassword()
  };
  const handleChange =async(e)=>{
   
  if(e.target.name == 'name'){
    setname(e.target.value)
  }
  else if(e.target.name == 'phone'){
    setPhone(e.target.value)
  }
 
  else if(e.target.name == 'address'){
    setAddres(e.target.value)
  }
  // else ife.target.name == 'city'){
  //   setCity(e.target.value)
  // }
  else if(e.target.name == 'pincode'){
    setPincode(e.target.value)
  }
  else if(e.target.name == 'password'){
    setPassowrd(e.target.value)
  }
  else if(e.target.name == 'cpassword'){
    csetPassword(e.target.value)
  }
  else if(e.target.name == 'npassword'){
    nsetPassword(e.target.value)
  }
  if(name.length>3 && phone.length>3 && address.length>3 && pincode.length>3){
    
      setdisabled(false)
  
  }else{
    setdisabled(true)
  }
  }
  const { cart, removeFromCart, addToCart, subtotal,clearCart,user } = useContext(CartContext);
  const router = useRouter()
 


 
  


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
            <label htmlFor="pincode" className="leading-7 text-sm text-gray-600">pincode</label>
            <input onChange={handleChange} value={pincode} type="text" id="pincode" name="pincode" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
          </div>
      
      
      </div>
      
      </div>
      
     
      <button onClick={handleSubmit}  className="flex mb-5  m-2 disabled:bg-pink-200 text-white bg-pink-500 border-0 py-2 px-6 focus:outline-none hover:bg-pink-600 rounded text-lg">
             submit
          </button>
    <h2>change password</h2>
    <div className="mx-auto flex my-4">
        <div className="px-2 w-1/2">
          <div className="mb-4">
            <label htmlFor="password" className="leading-7 text-sm text-gray-600">password</label>
            <input onChange={handleChange} value={password} type="password" id="password" name="password" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
          </div>
        </div>
        <div className="px-2 w-1/2">
          <div className="mb-4">
          <label htmlFor="password" className="leading-7 text-sm text-gray-600">confirm password</label>
            <input onChange={handleChange} value={cpassword} type="password" id="cpassword" name="cpassword" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
          
          </div>
        </div>
        <div className="px-2 w-1/2">
          <div className="mb-4">
          <label htmlFor="npassword" className="leading-7 text-sm text-gray-600">new password password</label>
            <input onChange={handleChange} value={npassword} type="password" id="npassword" name="npassword" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
          
          </div>
        </div>
        <button onClick={handlePasswordSubmit}  className="flex mb-5  m-2 disabled:bg-pink-200 text-white bg-pink-500 border-0 py-2 px-6 focus:outline-none hover:bg-pink-600 rounded text-lg">
             password
          </button>
      </div>
    </div>
  );
}

export default Myaccount;
