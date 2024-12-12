import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function DELETE(request: Request, {params}:{params:{messageid:string}}) {
    const messageId = params.messageid;
    await dbConnect();
 
        const session = await getServerSession(authOptions);
        const user = session?.user as User;
        const _user: User = session?.user;
        if(!session||!session.user){
            return Response.json({success:false, message:"Unauthorized"},{status:401});
        }
        try{
           const updateResult = await UserModel.updateOne(
                {
                    _id:_user._id
                },
                {$pull:{messages:{_id:messageId }}}
            )
            if(updateResult.modifiedCount===0){
                return Response.json({success:false, message:"Message not found"},{status:404});
            }
            return Response.json({success:true, message:"Message deleted successfully"},{status:200});
        }catch(error){
            return Response.json({success:false, message:"Failed to delete message"},{status:500});
        }
        
    


};
