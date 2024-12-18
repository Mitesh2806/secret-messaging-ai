import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request) {
    await dbConnect();
    try{
        const session = await getServerSession(authOptions);
        const user = session?.user as User;
        if(!session||!session.user){
            return Response.json({success:false, message:"Unauthorized"},{status:401});
        }
        const userId = new mongoose.Types.ObjectId(user._id);
        try{
            const user = await UserModel.aggregate([
                {$match:{_id:userId}},
                {$unwind:"$messages"},
                {$sort:{'messages.createdAt':-1}},
                {$group:{_id:"$_id", messages:{$push:{
                    content: "$messages.content",
                    title: "$messages.title", 
                    createdAt: "$messages.createdAt",
                  },}}},

                
            ]).exec();
            if(!user|| user.length===0)
                {return Response.json({success:false, message:"User not found"},{status:404})}
            return Response.json({success:true, messages:user[0].messages},{status:200})
        }catch(error){
            console.log("Failed to fetch messages:", error);
            return Response.json({success:false, message:"Failed to fetch messages"},{status:500});
        }
    }catch(error){
        console.log("Failed to fetch messages:", error);
        return Response.json({success:false, message:"Failed to fetch messages"},{status:500});
    }



};
