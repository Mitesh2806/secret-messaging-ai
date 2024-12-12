import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/model/User";
import { Message } from "@/src/model/User";

export async function POST(request: Request) {
    await dbConnect();

    const {username, title,content} = await request.json();
    try{
        const user = await UserModel.findOne({username});
        if(!user){
            return Response.json({success:false, message:"User not found"},{status:404});
        }
        if(!user.isAcceptingMessage){
            return Response.json({success:false, message:"User is not accepting messages"},{status:400});
        }
        const newMessage = {title, content, createdAt:new Date()};
        user.messages.push(newMessage as Message);
        await user.save();
        return Response.json({success:true, message:"Message sent successfully"},{status:200});
    }catch(error){
        console.log("Failed to send message:", error);
        return Response.json({success:false, message:"Failed to send message"},{status:500});
    }
}