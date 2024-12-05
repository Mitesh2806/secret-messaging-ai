import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/model/User";
import {z} from "zod";
import { usernameValidation } from "@/src/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username:usernameValidation
})
export async function GET(request: Request) {
    await dbConnect()
    try {
        const {searchParams} = new URL(request.url);
        const queryParam = {
            username:searchParams.get("username")
            
        }
        const result= UsernameQuerySchema.safeParse(queryParam)
        if(!result.success){
            const usernameErrors = result.error.format().username?._errors||[];
            return Response.json({success:false,errors:usernameErrors},{status:400})
        }
        console.log("Request URL:", request.url);
        console.log("Query Params:", queryParam);
        const {username} = result.data;
        const existingVerifiedUser = await UserModel.findOne({username, isVerified:true})
        if(existingVerifiedUser){
            return Response.json({success:false, message:"Username already exists"},{status:409})
            
        }
        return Response.json({success:true, message:"Username unique"},{status:200})

    } catch (error) {
        console.error("Error checking username:", error);   
        return Response.json({success:false},{status:500})
    }
}