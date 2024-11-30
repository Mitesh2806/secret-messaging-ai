import { sendVerificationEmail } from "@/src/helpers/sendVerificationEmail";
import UserModel from "@/src/model/User";
import bcrypt from "bcrypt";
export async function POST(request: Request) {
    try {
        const { username, email, password } = await request.json();
        const existingUserVerifiedByUsername = await UserModel.findOne({ username, isVerified: true });
        
        if (existingUserVerifiedByUsername) {
            return Response.json({ success: false, message: "Username already exists" });
        }

        const existingUserByEmail = await UserModel.findOne({ email});
        const verifyCode = (Math.floor(Math.random() * 900000) + 100000).toString();
        if (existingUserByEmail) {
           if(existingUserByEmail.isVerified){
            return Response.json({ success: false, message: "Email already exists" },{status:409});
           }else{
            const hashedPassword = await bcrypt.hash(password, 10);
            existingUserByEmail.password = hashedPassword;
            existingUserByEmail.verifyCode = verifyCode;
            existingUserByEmail.verifyCodeExpires = new Date(Date.now() + 60 * 60 * 1000);
           }
        }
        else{
        const hashedPassword = await bcrypt.hash(password, 10);
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1);
        const newUser =new UserModel({
            username,
            email,
            password: hashedPassword,
            verifyCode: verifyCode,
            verifyCodeExpires: expiryDate,
            isVerified: false,
            isAcceptingMessage: true,
            messages:[]
        })
        await newUser.save();
        }
        
       //send verification email
       const emailResponse = await sendVerificationEmail(
        email,
        username,
        verifyCode
       ) 
       if(!emailResponse.success){
        return Response.json({ success: false, message: emailResponse.message });
       }
       return Response.json({ success: true, message: "Sign up successful" });

    } catch (error) {
        console.log(error);
        return Response.json({ success: false, message: "Failed to sign up" });
    }
}
