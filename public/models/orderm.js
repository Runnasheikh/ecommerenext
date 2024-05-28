import mongoose from 'mongoose';
const { Schema } = mongoose;

const orderSchema = new Schema({
  email: { type: String, required: true },
  orderId: { type: String, required: true },
  paymentInfo: { type: String, default: '' },
  products:{type:Object,required:true} ,
  address: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, default: "pending" },
  orderStatus: { type: String, default: "unshipped" },
}, { timestamps: true });

mongoose.models = {}
export default mongoose.model('Order', orderSchema);
