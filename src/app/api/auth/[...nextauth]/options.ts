import { NextAuthOptions } from "next-auth";
import CredentialsProvider  from "next-auth/providers/credentials";
import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/model/User";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials:{
                username:{
                    label:"Email",
                    type:"text"
                },
                password:{
                    label:"Password",
                    type:"password"
                }
            },
            async authorize(credentials:any):Promise<any>{
                await dbConnect();
                try{
                    const user =await UserModel.findOne({
                        $or:[{email:credentials.identifier},
                            {username:credentials.identifier}]
                    })
                    if(!user){
                        throw new Error("User not found");
                    }
                    if(!user.isVerified){
                        throw new Error("User is not verified");
                    }
                    const isPasswordCorrect = await bcrypt.compare(credentials.password,user.password);
                    if(isPasswordCorrect){
                        return user;
                    }else{
                        throw new Error("Incorrect password");
                    }
                }catch(err:any){
                    console.log(err);
                }


            }
            
    })
],
    callbacks:{
        async session({session, token}){
            if(token){
              session.user._id = token._id;
              session.user.isVerified = token.isVerified;
              session.user.isAcceptingMessage = token.isAcceptingMessage;
              session.user.role = token.role;
              session.user.username = token.username;  
            }
            return session
        },
        async jwt({token,user}){
            if(user){
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessage = user.isAcceptingMessage;
                token.role = user.role;
                token.username = user.username;
        }
        return token;
    },
    },
    pages: {
        signIn: "/sign-in",
        signOut: "/sign-up",
    },
    session: {
        strategy: "jwt"   
    },
    secret: process.env.NEXTAUTH_SECRET,
}