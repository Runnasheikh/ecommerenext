
import React, { useContext, useEffect, useState } from 'react'
import Image from 'next/image'

import { useRef } from 'react'
import {AiOutlineShoppingCart ,AiOutlineClose, AiFillMinusCircle, AiFillPlusCircle} from "react-icons/ai"
import {BsFillBagCheckFill} from "react-icons/bs"
import {MdAccountCircle} from "react-icons/md"

import Link from 'next/link'
import CartContext from '@/context/cartContext'
import { useRouter } from 'next/router'
const Navbar = () => {
  const [dropdown, setDropdown] = useState(false)
  const [sidebar, setsidebar] = useState(false)
  const toggleDropdown = ()=>{
    setDropdown(!dropdown)
  }
  const { cart,removeFromCart,addToCart,clearCart,subtotal ,buyNow,key,user,logout} = useContext(CartContext);


  const ref  = useRef()
  const toggleCart = ()=>{
    // if(ref.current.classList.contains('translate-x-full')){
    //   ref.current.classList.remove('translate-x-full')
    //   ref.current.classList.add('translate-x-0')
    // }else if(!ref.current.classList.contains('translate-x-full')){
    //   ref.current.classList.remove('translate-x-0')
    //   ref.current.classList.add('translate-x-full')

    // }
    // console.log("your ref"+ref)
    setsidebar(!sidebar)
  }
  const router = useRouter()

  useEffect(()=>{
    Object.keys(cart).length !==0 && setsidebar(true)
  
    let exempted = ['/checkout','/order','/orders']
    if(exempted.includes(router.pathname)){
      setsidebar(false)
    }
  },[])
  return (
    <div className={`flex flex-col md:flex-row md:justify-start justify-center items-center py-2 shadow-md sticky z-10 `}>
    <div className="logo mx-5 sticky">
      <Link href={'/'}><Image width={150} height={150} src="/bwhite.png" alt="" /></Link>
    </div>
    <div className="nav flex justify-center">
      <ul className="flex items-center  space-x-4 font-bold md:text-xl">
        <Link href={"/tshirt"}><li>Tshirts</li></Link>
        <Link href={"/hoddie"}><li>Hoodies</li>
        </Link>
        <Link href={"/stickers"}><li>Stickers</li></Link>
        <Link href={"/mugs"}><li>mugs</li></Link>
      </ul>
    </div>
    <div  className='flex cart cursor-pointer absolute right-0 top-4 mx-5'>
      <span  onMouseOver={()=>{setDropdown(true)}} onMouseLeave={()=>{setDropdown(false)}}>
    {dropdown && <div onMouseOver={()=>{setDropdown(true)}} onMouseLeave={()=>{setDropdown(false)}}
    className="absolute right-8 bg-white shadow-lg border top-5 py-4 rounded-md px-5 w-32">
      <ul>
        <Link href={'/order'}> <li className='py-1 text-sm hover:text-pink-500 font-bold '>order</li></Link>
        <Link href={'/myaccount'}> <li className='py-1 text-sm hover:text-pink-500 font-bold'>account</li></Link>
        <li onClick={logout} className='py-1 text-sm hover:text-pink-500 font-bold'>logout</li>
      </ul>
    </div>}
      {user.value &&  <MdAccountCircle className="text-xl md:text-2xl mx-2"/>}
      </span>
     {!user.value &&<Link href={"/login"}>
    <button className='bg-pink-600 px-2 py-1'>login</button>
     </Link>}
     <AiOutlineShoppingCart onClick={toggleCart} className="text-xl md:text-2xl"/>
    </div>
    
    <div ref={ref} className={`w-72 h-[100vh] sideCart absolute top-0 overflow-x-scroll  bg-pink-100 p-10  transition-all ${sidebar?'right-0':'-right-96'} `} > 
    {/* ${Object.keys(cart).length !==0 ? 'translate-x-0':'translate-x-full'}`} */}

      <h3 className="font-bold text-xl">Shopping Cart</h3>
      <span onClick={toggleCart} className=" absolute top-5 right-2 cursor-pointer text-2xl text-pink-500">
        <AiOutlineClose/>
      </span>
      
<ol className='list-decimal font-semibold'>
{
    Object.keys(cart).length==0 && <div  className='my-4 font-semibold'>not present in the cart</div>
  }
  {
    Object.keys(cart).map((k)=>{
      return  <li keys={k}>
      <div className='item flex my-5'>
      <div className='w-2/3 font-semibold'>{cart[k].name} ({cart[k].size} / {cart[k].variant})</div>
      <div className='flex font-semibold items-center justify-center w-1/3 text-lg'>
   <AiFillMinusCircle onClick={()=>removeFromCart(k,1,cart[k].price,cart[k].name,cart[k].size,cart[k].variant)} className='cursor-pointertext-pink-500'/>
   <span className='mx-2 text-sm'>{cart[k].qty}</span>
   
      <AiFillPlusCircle  onClick={()=>addToCart(k,1,cart[k].price,cart[k].name,cart[k].size,cart[k].variant)} className='cursor-pointertext-pink-500'/>
      </div>
       </div> 
     </li>
    })
  }
</ol>
<div className='font-bold my-12'>subtotal:{subtotal}</div>
<div className="flex">
<Link href={'/checkout'}>
<button disabled={Object.keys(cart).length == 0} className=" disabled:bg-purple-300 flex mr-2 mt-16 text-white bg-pink-500 border-0 py-2 px-2 focus:outline-none hover:bg-pink-600 rounded text-sm ">
  <BsFillBagCheckFill className='m-1'/>
   check out
  </button>
</Link>
<button disabled={Object.keys(cart).length == 0} onClick={clearCart} className="disabled:bg-purple-300 flex mr-2 mt-16 text-white bg-pink-500 border-0 py-2 px-2 focus:outline-none hover:bg-pink-600 rounded text-sm">
  
  
  clear cart
  </button>
</div>
    </div>
</div>

  )
}

export default Navbar
