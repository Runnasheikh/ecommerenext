import connectDb from "@/middleware/mongoose"
import orderm from "@/public/models/orderm"
import jsonwebtoken from "jsonwebtoken"

const handler = async (req, res) => {
const token = req.body.token
const data =  jsonwebtoken.verify(token,process.env.JWT_SECRET)

const orders = await orderm.find({email: data.email})
res.status(200).json({orders})


}
export default connectDb(handler);