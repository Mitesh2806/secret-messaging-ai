import { resend } from "../lib/resend";
import VerificationEmail from "@/emails/VerificationEmail";
import { ApiResponse } from "../types/ApiResponse";

export async function sendVerificationEmail( email: string, username: string, verifyCode: string): Promise<ApiResponse> {
    try {
       
       await resend.emails.send({
           from: "miteshmaity_22519@aitpune.edu.in",
           to: email,
           subject: "Verify your email",
           react: VerificationEmail ({ username, otp: verifyCode }),
       });
        return {
            
            success: true,  
            message: "Verification email sent successfully",
        }
    } catch (error) {
        return {
            success: false,
            message: "Failed to send verification email",    
        };
    }
}