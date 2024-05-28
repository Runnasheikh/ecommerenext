import mongoose from "mongoose";

const connectDb = handler => async (req, res) => {
    if (mongoose.connections[0].readyState) {
        return handler(req, res);
    }
    
    try {
        await mongoose.connect('mongodb://localhost:27017/wearthecode', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then(()=>{

            console.log('MongoDB Connected');
        });
    } catch (error) {
        console.error('MongoDB Connection Failed', error);
        res.status(500).json({ error: 'Database connection failed' });
        return;
    }
    
    return handler(req, res);
};

export default connectDb;
