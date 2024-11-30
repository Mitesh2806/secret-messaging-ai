 import { getServerSession } from "next-auth";
 import { authOptions } from "../auth/[...nextauth]/options";
 import dbConnect from "@/src/lib/dbConnect";
 import UserModel from "@/src/model/User";
 import { User } from "next-auth";

 export async function POST(request: Request) {
     await dbConnect();
     try {
         const session = await getServerSession(authOptions);
         const user = session?.user as User;
         if(!session||!session.user){
             return Response.json({success:false, message:"Unauthorized"},{status:401});
         }
         const userId = user._id;
         const {acceptMessages} = await request.json();
         try{
           const updatedUser = await UserModel.findByIdAndUpdate(userId, {isAcceptingMessage:acceptMessages}, {new:true});
           if(!updatedUser){
            return Response.json({success:false, message:"User not found"},{status:404});
           }
           return Response.json({success:true, message:"User status updated to accept message"},{status:200});
         }
         catch(error){
             console.log("Failed to update user status to accept message");
             return Response.json({success:false, message:"Failed to update user status to accept message"},{status:500});
         }
         }catch (error) {
           Response.json({success:false},{status:500})
       }
        
 };
 export async function GET(request: Request) {
     await dbConnect();
     try {
         const session = await getServerSession(authOptions);
         const user = session?.user as User;
         if(!session||!session.user){
             return Response.json({success:false, message:"Unauthorized"},{status:401});
         }
         const userId = user._id;
         try{
           const updatedUser = await UserModel.findById(userId);
           if(!updatedUser){
            return Response.json({success:false, message:"User not found"},{status:404});
           }
           return Response.json({success:true, isAcceptingMessage:updatedUser.isAcceptingMessage},{status:200});
         }
         catch(error){
             console.log("Failed to update user status to accept message");
             return Response.json({success:false, message:"Failed to update user status to accept message"},{status:500});
         }
         }catch (error) {
           Response.json({success:false},{status:500})
       }
        
 };
 