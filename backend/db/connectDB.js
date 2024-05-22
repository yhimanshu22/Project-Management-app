import mongoose from "mongoose";

const connectDB = async () =>{
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URL,{
            useUnifiedTopology:true,
            useNewUrlParser:true,
            useCreateIndex:true,
            useFindAndModify:false,
        })
        console.log(`mongodb connect :${conn.connection.host}`);
        
    } catch (error) {
        console.error(`Error:${err.message}`);
        process.exit(1);
    }
}