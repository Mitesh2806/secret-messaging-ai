'use client';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

import { verifySchema } from "@/src/schemas/verifySchema";
import { ApiResponse } from "@/src/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { set } from "mongoose";
import { useParams, useRouter } from "next/navigation";
import {  useForm } from "react-hook-form";
import * as z from "zod";
import { Form } from "@/components/ui/form";

const VerifyAccount = () =>{
    const router = useRouter();
    const params = useParams<{username:string}>();
    const {toast}= useToast();
    const form = useForm<z.infer<typeof verifySchema>>({
      resolver: zodResolver(verifySchema),
      defaultValues: { code: "" },
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
          try{
           const response = await axios.post(`/api/verify-code`, {username:params.username, code:data.code});
           toast({
               title: 'Success',
               description: response.data.message,
               variant: "default"
           })
           router.replace('sign-in');
          }catch(error){
              console.error("Error signing up:", error);
              const axiosError = error as AxiosError<ApiResponse>;
              let errorMessage = axiosError.response?.data.message ?? "Error signing up";
              toast({
                  title: 'Error',
                  description: axiosError.response?.data.message ?? "Error signing up",
                  variant: "destructive"
              })
              

          }
      }
    return(
        <div className=" flex justify-center items-center min-h-screen bg-gray-100">
            <div className=" w-full max-w-md p-4 space-y-8 bg-white rounded-md shadow-md">
                <div className="text-center">
                    <div className=" text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Verify your account
                    </div>
                    <p className="mb-4">
                        Enter Verification Code sent to your email
                    </p>
                </div>
                <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Verification Code" {...field}
                     />
                  </FormControl>
                  
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
            </form>
          </Form>
            </div>
        </div>
    )
}
export default VerifyAccount;


