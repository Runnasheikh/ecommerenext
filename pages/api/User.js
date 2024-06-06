import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
  name:{type:String ,required:true,default:""},
  email:{type:String ,required:true,unique:true},
  phone: { type: String },
  password:{type:String ,default:''},
  address:{type:String ,default:''},
  pincode:{type:String ,default:''},
  

},{timestamps:true});
mongoose.models ={}
export default mongoose.models.User || mongoose.model('User',userSchema)