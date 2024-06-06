import connectDb from "@/middleware/mongoose";
import orderm from "@/public/models/orderm";

import jsonwebtoken from "jsonwebtoken"

const handler = async (req, res) => {
const token = req.body.token
const data =  jsonwebtoken.verify(token,process.env.JWT_SECRET)
console.log("your data",data)
const orders = await orderm.find({email: data.email})
console.log(orders)
res.status(200).json({orders})


}
export default connectDb(handler);