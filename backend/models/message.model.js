import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    message:{type:String,required:true},
    user:{type:mongoose.Types.ObjectId,required:true,ref:'User'},
    projectId:{type:mongoose.Types.ObjectId,
        required:true,
    },
},{timestamps:true})

export default mongoose.model('Message',messageSchema)