import orderm from "@/pages/api/models/orderm";
import connectDb from "@/pages/api/middleware/mongoose";
import Product from "@/pages/api/models/product";
const crypto = require('crypto');

const handler = async (req, res) => {
  if (req.method === "POST") {
    const { orderId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;

    const secret = "el0s0mAZ2LJeNS3Yh94swRBh";
    const shasum = crypto.createHmac("sha256", secret);
    shasum.update(`${razorpayOrderId}|${razorpayPaymentId}`);
    const digest = shasum.digest("hex");

    if (digest === razorpaySignature) {
      // Payment is verified
     let or =  await orderm.findOneAndUpdate({ orderId: orderId }, { status: "paid",paymentInfo:JSON.stringify({razorpayOrderId,razorpayPaymentId,razorpaySignature})});
      let products = or.products;
   
      for (let slug in products) {
        
        await Product.findOneAndUpdate({ slug: slug }, { $inc: { "availableQty": - products[slug].qty } });
      }

      // res.redirect('/orders')
      res.status(200).json({ status: "success", message: "Payment verified and order updated." });
    } else {
      // Payment verification failed
      res.status(400).json({ status: "failed", message: "Invalid signature." });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
};


export default connectDb(handler);