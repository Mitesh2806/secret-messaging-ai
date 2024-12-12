import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/model/User";
import { url } from "inspector";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    await dbConnect();
    try{
        const {username, code} = await request.json();
        const decodedUsername = decodeURIComponent(username);
        const user = await UserModel.findOne({username:decodedUsername})
        if(!user){
            return Response.json({success:false, message:"User not found"},{status:404})
        }
        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpires) > new Date( );
        if(isCodeValid && isCodeNotExpired){
            user.isVerified = true;
            await user.save();
            return Response.json({success:true, message:"User verified"},{status:200})
            
        }else if(!isCodeNotExpired){
            return Response.json({success:false, message:"Code expired. Signup again for new code"},{status:400})
        }else{
            if(!isCodeValid){
                return Response.json({success:false, message:"Invalid code"},{status:400})
        }
        }
    }catch(error){
        console.error("Error verifying code:", error);
        return Response.json({success:false, message:"Error verifying code"},{status:500})
    }
}