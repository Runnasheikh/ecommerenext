import connectDb from "@/middleware/mongoose"
import Product from "@/public/models/product"


  const handler =  async  (req,res)=>{
    if(req.method == 'POST'){
        console.log(req.body)
        for (let i = 0; i < req.body.length; i++) {   
             let p = await Product.findByIdAndUpdate(req.body[i]._id,req.body[i])
        }
        res.status(200).json({sucess:'success'})
    }else{
        res.status(400).json({error:"Method not allowed"})
    }
}
export default connectDb(handler)