import connectDb from "@/middleware/mongoose";
import orderm from "@/public/models/orderm";
import Product from "@/public/models/product";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: "rzp_test_iZrG14NDYMdlpz",
  key_secret: "el0s0mAZ2LJeNS3Yh94swRBh",
});

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { razorpayPaymentId, amount, orderId } = req.body;

  if (!razorpayPaymentId || !amount || !orderId) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  try {
    console.log("Initiating refund process for paymentId:", razorpayPaymentId, "and amount:", amount);
    const refund = await razorpay.payments.refund(razorpayPaymentId, {
      amount: amount * 100,
    });
    console.log("Refund successful:", refund);

    console.log("Updating order status in the database for orderId:", orderId);
    const updatedOrder = await orderm.findOneAndUpdate(
      { orderId: orderId },
      { status: "cancelled", razorpayPaymentId: JSON.stringify(req.body) },
      { new: true }
    );
    let products = updatedOrder.products;
   
    for (let slug in products) {
      
      await Product.findOneAndUpdate({ slug: slug }, { $inc: { "availableQty": + products[slug].qty } });
    }
    res.status(200).json({ status: "success", message: "ha ha ha." });
    if (!updatedOrder) {
      console.error("Order not found for orderId:", orderId);
      return res.status(404).json({ error: "Order not found" });
    }

    console.log("Order status updated successfully:", updatedOrder);
    res.status(200).json({ status: "success", refund, order: updatedOrder,razorpayPaymentId });
  } catch (error) {
    console.error("Error during refund or updating order:", error);

    if (error.response) {
      console.error("Razorpay response error:", error.response.body);
      return res.status(error.response.statusCode).json({
        error: error.response.body,
      });
    } else {
      console.error("Unexpected error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
export default connectDb(handler);