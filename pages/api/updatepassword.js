import connectDb from '@/pages/api/mongoose';
import User from '@/pages/api/models/User';
import cryptoJs from 'crypto-js';
import jsonwebtoken from 'jsonwebtoken'
const handler = async (req, res) => {
    if (req.method == 'POST') {
        let token = req.body.token
        let user = jsonwebtoken.verify(token, process.env.JWT_SECRET )
        let dbuser = await User.findOne({email:user.email})
        const bytes = cryptoJs.AES.decrypt(dbuser.password, process.env.JWT_SECRET);
        let decryptedPass = bytes.toString(cryptoJs.enc.Utf8);

        if (decryptedPass == req.body.password && req.body.npassword === req.body.cpassword){
            await User.findOneAndUpdate({email: user.email}, {password:
                 cryptoJs.AES.encrypt(req.body.cpassword, process.env.JWT_SECRET).toString()})
            res.status(200).json({ success: true })
            return
        }
        
        else {
            res.status(200).json({ success: false })
        }
    }
    else {
        res.status(400).json({ error: "error" })
    }
}

export default connectDb(handler);