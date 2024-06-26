import connectDb from '@/middleware/mongoose'
import User from '@/public/models/User'

var cryptoJS = require('crypto-js')
var jwt = require('jsonwebtoken')


  const handler =  async  (req,res)=>{
    if(req.method == 'POST'){
        console.log(req.body)
       let user = await User.findOne({"email": req.body.email})
       const bytes  = cryptoJS.AES.decrypt(user.password,process.env.JWT_SECRET);
       let decryptPass = (bytes.toString(cryptoJS.enc.Utf8))
       if(user){
        if(req.body.email == user.email && req.body.password == decryptPass){
            var token  = jwt.sign({email:user.email,name:user.name},process.env.JWT_SECRET,{
                 expiresIn:"5d"
            })
            res.status(200).json({success:true,token,email:user.email})

        }else{
            res.status(200).json({success :false,error:"Invalid Credential"})

        }
    }
    else{
        res.status(200).json({success:false, error:"no user find"})
    }
}
else{
    res.status(200).json({error:"Invalid Method"})
}
}
export default connectDb(handler)