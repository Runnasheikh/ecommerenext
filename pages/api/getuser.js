
import connectDb from "@/middleware/mongoose";
import User from "@/public/models/User";
import jsonwebtoken from 'jsonwebtoken'

const handler = async (req, res) => {
   if(req.method == 'POST'){
    const token = req.body.token 
  
    const user = jsonwebtoken.verify(token,process.env.JWT_SECRET)
    let  dbuser = await User.findOne({email:user.email})
    const {name,email,address ,pincode,phone} = dbuser
   
    res.status(200).json({name,email,address ,pincode,phone})
   }
    else{
        res.status(400).json({error:"Method not allowed"})
    }

}

export default connectDb(handler);
