import connectDb from "@/middleware/mongoose"
import User from "@/public/models/User"
var cryptoJS = require('crypto-js')



  const handler =  async  (req,res)=>{
    if(req.method == 'POST'){
       console.log(req.body)
       const {name,email} = req.body
       const u = User({name,email,password:cryptoJS.AES.encrypt(req.body.password,process.env.JWT_SECRET).toString()})
       await u.save()
        res.status(200).json({sucess:'success'})
    }else{
        res.status(400).json({error:"Method not allowed"})
    }
}
export default connectDb(handler)