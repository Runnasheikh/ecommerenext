import CartContext from "@/context/cartContext";
import connectDb from "@/middleware/mongoose";
import Order from "@/public/models/orderm";

import pincodes from '../../pincodes.json'
import { useContext } from "react";
import Product from "@/public/models/product";

const Razorpay = require("razorpay");


const handler = async (req, res) => {

  if (req.method === "POST") {
    const { amount, email, address, cart,clearCart,phone,pincode,orderId} = req.body; // Assuming these details are sent in the request body
   
    try {
      let sumTotal = 0;
        
      for (let slug in cart) {
        let product = await Product.findOne({ slug: slug });
        if(!Object.keys(pincodes).includes(pincode)){
          res.status(400).json({ error: `this pin is not servicable bro comeon man ` }) ;
          alert(`pincode is not servicable`) ;
          return
        }
        if(phone.length != 10){
          res.status(400).json({ error: `phone number is not valid` }) ;
          alert(`phone number is not valid`) ;
         }
        if (!product) {
          return res.status(400).json({ error: `Product not found: ${slug}` });
        }
        // console.log(`Product found: ${product.name}, Price: ${product.price}, Cart Price: ${cart[slug].price}, Quantity: ${cart[slug].qty}`);
        if(product.price == 0){
          res.status(400).json({ error: `cart is empty` }) ;
          alert("empty")
        }
        

        if(product.availableQty<cart[slug].qty){
          res.status(400).json({ error: `out of stock` }) ;
          alert("out of stock")
        }
        // if (product.price !== cart[slug].price) {
        //     res.status(400).json({ error: `Product price has changed for ${slug}` }) ;
            
          
        // }
        // sumTotal += product.price * cart[slug].qty;
      }
      
      // Ensure to compare amount in the smallest unit to avoid floating point issues
      // console.log(`Calculated sumTotal: ${sumTotal}`);
      // if (sumTotal !== amount) {
      //   return res.status(400).json({ error: `Subtotal does not match. Calculated: ${sumTotal}, Provided: ${amount}` });
      // }

      const razorpay = new Razorpay({
        key_id: "rzp_test_iZrG14NDYMdlpz",
        key_secret: "el0s0mAZ2LJeNS3Yh94swRBh",
      });

      const payment_capture = 1;
      const currency = "INR";
      const options = {
        amount: amount * 100, // Amount in paise
        currency,
       
        payment_capture,
      };

      const response = await razorpay.orders.create(options);

      await Order.findOneAndUpdate({ orderId }, { razorpayOrderId: response.id });

      res.status(200).json(response);
      // Save order details in MongoDB
      const newOrder = new Order({
        email: email,
        orderId: response.id,
        paymentInfo: "",
        products: cart,
        address: req.body.address,
        city: req.body.city,
        phone: req.body.phone,
        name: req.body.name,
        state: req.body.state,
        amount: amount,
        status: "pending", // Initial status
      });

      await newOrder.save();

      res.status(200).json({
        id: response.id,
        currency: response.currency,
        amount: response.amount,
        status: response.status,
        token: response.receipt,
      });
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
};

export default connectDb(handler);
// import connectDb from "@/middleware/mongoose";
// import Order from "@/public/models/orderm";
// import Razorpay from "razorpay";
// import shortid from "shortid";

// const handler = async (req, res) => {
//   if (req.method === "POST") {
//     const { amount, email, orderId } = req.body;

//     try {
//       const razorpay = new Razorpay({
//         key_id: "rzp_test_iZrG14NDYMdlpz",
//         key_secret: "el0s0mAZ2LJeNS3Yh94swRBh",
//       });

//       const options = {
//         amount: amount * 100, // amount in paise
//         currency: "INR",
//         receipt: shortid.generate(),
//         payment_capture: 1,
//       };

//       const response = await razorpay.orders.create(options);

//       await Order.findOneAndUpdate({ orderId }, { razorpayOrderId: response.id });

//       res.status(200).json(response);
//     } catch (err) {
//       console.error(err);
//       res.status(400).json({ error: "Unable to initiate payment" });
//     }
//   } else {
//     res.status(405).json({ error: "Method not allowed" });
//   }
// };

// export default connectDb(handler);
