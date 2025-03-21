"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import * as z from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {Loader2} from "lucide-react"
import { signInSchema } from "@/schemas/signInSchema";
import { useState } from "react";
import { signIn } from "next-auth/react";


const page = () => {
 
  const [isSubmitting, setIsSubmitting] = useState(false);

  
  const router = useRouter();

  // zod implementation
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

 

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
      setIsSubmitting(true)

       const result = await signIn('credentials', {
          redirect: false,
          identifier: data.identifier,
          password: data.password,
        })
      
        toast("login Successfully")
        console.log("Result",result);
        

        if(result?.error) {
         
          if(result.error == "CredentialsSignin"){
            toast("login failed" )
          } else {
            // toast(result.error, {description: "Error"})
            toast("login failed")
          }
          setIsSubmitting(false)
        } 
        if(result?.url){
          console.log("URL",result?.url);
          router.replace('/dashboard')
          toast("Login Successfully")
          setIsSubmitting(false)
        }
        
    
  };


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-6 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Myster Feedback
          </h1>
          <p className="mb-4">Login Your Account</p>
        </div>
         
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}
           className="space-y-6">

          <FormField
             name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel> Email/Username </FormLabel>
                  <FormControl>
                    <Input placeholder="identifier"
                     {...field} 
                     />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} 
             />

             {/* // password */}

          <FormField
             name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel> password </FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="password"
                     {...field} 
                     />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} 
             />
          
         <Button
         type="submit" disabled={isSubmitting}
         className="cursor-pointer"
         >
           {isSubmitting ? (
             <>
             <Loader2 className="mr-4 h-4 w-4 animate-spin" /> 
               Please wait
             </>
           ): ("LogIn")}
         </Button>
          </form>
        </Form>

        <div className=" text-center mt-4">
           <p>
            Not Registered{' '}
            <Link href={'/sign-up'} className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
           </p>
        </div>
      </div>
    </div>
  );
};

export default page;
