import CartContext from "@/context/cartContext";
import connectDb from "@/middleware/mongoose";
import Order from "@/public/models/orderm";
import Product from "@/public/models/product";
import { useContext } from "react";

const Razorpay = require("razorpay");
const shortid = require("shortid");

const handler = async (req, res) => {

  if (req.method === "POST") {
    const { amount, email, address, cart,clearCart,phone } = req.body; // Assuming these details are sent in the request body

    try {
      let sumTotal = 0;
     
      for (let slug in cart) {
        let product = await Product.findOne({ slug: slug });
        // console.log(typeof(phone))
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
        if (product.price !== cart[slug].price) {
            res.status(400).json({ error: `Product price has changed for ${slug}` }) ;
            
          
        }
        sumTotal += product.price * cart[slug].qty;
      }
      console.log(`Calculated sumTotal: ${sumTotal}`);

      // Ensure to compare amount in the smallest unit to avoid floating point issues
      if (sumTotal !== amount) {
        return res.status(400).json({ error: `Subtotal does not match. Calculated: ${sumTotal}, Provided: ${amount}` });
      }

      const razorpay = new Razorpay({
        key_id: "rzp_test_iZrG14NDYMdlpz",
        key_secret: "el0s0mAZ2LJeNS3Yh94swRBh",
      });

      const payment_capture = 1;
      const currency = "INR";
      const options = {
        amount: amount * 100, // Amount in paise
        currency,
        receipt: shortid.generate(),
        payment_capture,
      };

      const response = await razorpay.orders.create(options);

      // Save order details in MongoDB
      const newOrder = new Order({
        email: email,
        orderId: response.id,
        paymentInfo: "",
        products: cart,
        address: address,
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
