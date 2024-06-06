import User from '@/public/models/User';
import connectDb from './middleware/mongoose';
import jwt from 'jsonwebtoken';

const handler = async (req, res) => {
  if (req.method === 'POST') {
    const { token, name, phone, address, pincode, password } = req.body;
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    let userEmail;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userEmail = decoded.email;
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const updates = { name, phone, address, pincode };
    if (password) {
      updates.password = await bcrypt.hash(password, 10);
    }

    try {
      const user = await User.findOneAndUpdate({ email: userEmail }, updates, {
        new: true,
      });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(400).json({ message: 'Invalid request method' });
  }
};

export default connectDb(handler);
