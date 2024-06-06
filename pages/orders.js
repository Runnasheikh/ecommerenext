import orderm from '@/public/models/orderm'
import mongoose from 'mongoose'
import { useRouter } from 'next/router'


import React from 'react'

const Orders = ({order}) => {
  const router = useRouter()
  const products = order.products
  // console.log(order)
 
  return (
    <div>
      <section class="text-gray-600 body-font overflow-hidden">
  <div class="container px-5 py-24 mx-auto">
    <div class="lg:w-4/5 mx-auto flex flex-wrap">
      <div class="lg:w-1/2 w-full lg:pr-10 lg:py-6 mb-6 lg:mb-0">
        <h2 class="text-sm title-font text-gray-500 tracking-widest">wearcode.com</h2>
        <h1 class="text-gray-900 text-3xl title-font font-medium mb-4">ORDERid - {order.orderId}</h1>
        <h1 class="text-gray-900 text-3xl title-font font-medium mb-4">email - {order.email}</h1>
        <p class="leading-relaxed mb-4">your orders has been placed {order.status}</p>
        <div class="flex mb-4">
          <a class="flex-grow text-center  py-2 text-lg px-1">item description</a>
          <a class="flex-grow text-center  border-gray-300 py-2 text-lg px-1">Reviews</a>
          <a class="flex-grow  text-center border-gray-300 py-2 text-lg px-1">item total</a>
        </div>
       
        {Object.keys(products).map((item)=>{
          return <div key={item} class="flex border-t border-b mb-6 border-gray-200 py-2">
          <span class="text-gray-500">{products[item].name}({products[item].size}/{products[item].variant})</span>
          <span class="m-auto text-gray-900">{products[item].qty}</span>
          <span class="m-auto text-gray-900">{products[item].price}</span>
        </div>
        })}
        <div class="flex flex-col" >
          <span class="title-font font-medium text-2xl text-gray-900"> subtotal {order.amount}</span>
          <div className='my-6'>

          <button class="flex mx-0 text-white bg-pink-500 border-0 py-2 px-6 focus:outline-none hover:bg-pink-600 rounded">track order</button>

          </div>
          
        </div>
      </div>
      {Object.keys(products).map((item)=>{
      <img alt="ecommerce" class="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded" src={products[item].img}/>
    })}
      </div>
  </div>
</section>
    </div>
  )
}

export async function getServerSideProps(context) {
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(process.env.NEXT_PUBLIC_MONGODB);
  }

  const order = await orderm.findById(context.query.id);
  

  return {
    props: {
      order: JSON.parse(JSON.stringify(order)),
      
    },
  };
}

export default Orders
