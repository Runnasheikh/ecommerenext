import connectDb from "@/middleware/mongoose"
import orderm from "@/public/models/orderm"
import jsonwebtoken from "jsonwebtoken"

const handler = async (req, res) => {
const token = req.body.token
const data =  jsonwebtoken.verify(token,process.env.JWT_SECRET)
console.log(data)
const orders = await orderm.find({email: data.email})
res.status(200).json({orders})
// orders.forEach(order => {
//     console.log(order._id);
//   });

// console.log(Object.keys.orders._id)
}
export default connectDb(handler);