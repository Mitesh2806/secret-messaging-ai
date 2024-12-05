'use client';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod";
import Link from "next/link";
import {  useEffect, useState } from "react";
import {useDebounceCallback} from "usehooks-ts";
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/src/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/src/types/ApiResponse";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";


 const Page =()=>{
  const[username,setUsername]= useState("");
  const[usernameMessage,setUsernameMessage]= useState("");
  const[isCheckingUsername,setIsCheckingUsername]= useState(false);
  const[isSubmitting,setIsSubmitting]= useState(false);

  const debounced = useDebounceCallback(
    setUsername, 300);
    const {toast} = useToast();
    const router = useRouter();
    //zod validation
    const form = useForm({
      resolver: zodResolver(signUpSchema),
      defaultValues: {
        username: "",
        email: "",
        password: "",
      }
    })

    useEffect(()=>{
      const checkUsernameUnique = async()=>{
        if(username){
          setIsCheckingUsername(true);
          setUsernameMessage("");
          try{
            const response = await axios.get<ApiResponse>(`/api/check-username-unique?username=${username}`); 
            setUsernameMessage(response.data.message);
          }catch(error){
            const axiosError = error as AxiosError<ApiResponse>;
            setUsernameMessage(axiosError.response?.data.message ?? "Error checking username");
        }finally{
            setIsCheckingUsername(false);
        }
      }
    }
    checkUsernameUnique();
    },[username]);

const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
  setIsSubmitting(true);
  try{
    const response = await axios.post<ApiResponse>("/api/sign-up", data);
    toast({
      title: 'Success',
      description: response.data.message,
      variant: "default"
    })
    router.replace(`/verify/${data.username}`);
    setIsSubmitting(false);
  }catch(error){
    console.error("Error signing up:", error);
    const axiosError = error as AxiosError<ApiResponse>;
    let errorMessage = axiosError.response?.data.message ?? "Error signing up";
    toast({
      title: 'Error',
      description: errorMessage,
      variant: "destructive"
    })
    setIsSubmitting(false);
  }
}

  return (
    <div className=" flex min-h-screen justify-center items-center bg-gray-100">
      <div className=" w-full max-w-md p-8 space-y-8 bg-white shadow-md rounded-lg">
        <div className=" text-center">
          <div className=" text-4xl font-extrabold tracking-tight lg:text-5xl mb-6"> Join mystery feedback</div>
          <p className="mb-4"> Sign-up to start!!!</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="username" {...field}
                    onChange={(e) => {debounced(e.target.value); field.onChange(e);}} />
                  </FormControl>
                  {isCheckingUsername && <Loader2 className="animate-spin" />}
                  <p className={`text-sm ${usernameMessage === "Username unique" ? "text-green-500" : "text-red-500"}`}>
                    {usernameMessage}
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="password" {...field} />
                  </FormControl>
                  
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email" {...field} />
                  </FormControl>
                 
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ?(<div><Loader2 className="animate-spin" /></div>) : ("Sign up")}</Button>
          </form>

        </Form>
        <div className="text-center mt-4">
          <p>
            Already a member?{' '}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Page;