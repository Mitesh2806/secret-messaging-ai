import mongoose, { Schema, Document } from 'mongoose';

export interface Message extends Document {
    content: string;
    createdAt: Date;
    title: string;
}

const MessageSchema : Schema<Message>= new Schema({
    title:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now

    }
})
export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    isVerified: boolean;
    verifyCodeExpires: Date;
    isAcceptingMessage: boolean;
    messages:Message[];
   
}

const UserSchema : Schema<User>= new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        match:[/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,'please use a valid email address'],

    },
    password:{
        type:String,
        required:[true, "Password is required"],
        minlength:6
        

    },
    verifyCode:{
        type:String,
        required:[true, "Verify code is required"],
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    verifyCodeExpires:{
        type:Date,
        required:[true, "Verify code expires is required"],
    },
    isAcceptingMessage:{
        type:Boolean,
        default:true
    },
    
    messages:[MessageSchema]

})
    
const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>('User', UserSchema);

export default UserModel;