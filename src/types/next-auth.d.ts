import 'next-auth';

declare module 'next-auth' {
    interface User{
        _id?: string;
        isVerified?: boolean;
        username?: string;
        isAcceptingMessage?: boolean;
        role: 'admin' | 'supervisor' | 'user';
    }
    interface Session{
        user:{
        _id?: string;
        isVerified?: boolean;
        isAcceptingMessage?: boolean;
        username?: string;
        role: 'admin' | 'supervisor' | 'user';
        }& DefaultSession["user"];
        
    
}}

declare module 'next-auth/jwt' {
    interface JWT{
        _id?: string;
        isVerified?: boolean;
        isAcceptingMessage?: boolean;
        role: 'admin' | 'supervisor' | 'user';
    }
}