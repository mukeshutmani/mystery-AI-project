"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import * as z from "zod";
import {  useDebounceCallback } from "usehooks-ts";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {Loader2} from "lucide-react"

const page = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debounced = useDebounceCallback(setUsername, 500);
  const router = useRouter();

  // zod implementation
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsername = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage("");

        try {
          // we can also use react query
          const response = await axios.get(
            `/api/check-username-unique?username=${username}`
          );
          console.log(response);
          
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          console.log(axiosError);
          setUsernameMessage(
            axiosError.response?.data.message ?? "Error Checking User"
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsername();
  }, [username]);



  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/signup", data);
      console.log(response);
      
      toast(response.data.message);
    //   router.replace(`/verify${username}`);
    router.replace('/sign-in')
    } catch (error) {
      console.error("Error in signup of user", error);
      const axiosError = error as AxiosError<ApiResponse>;
      //  console.log(axiosError);
      let errorMessage = axiosError.response?.data.message;
      toast("Signup Error", { description: errorMessage });
      setIsSubmitting(false);
    }
  };


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-6 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Myster Feedback
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>
         
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}
           className="space-y-6">
            <FormField
             name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel> Username </FormLabel>
                  <FormControl>
                    <Input placeholder="username"
                     {...field} 
                     onChange={(e) => {
                      field.onChange(e)
                      debounced(e.target.value)
                     }}
                     />
                  </FormControl>
                     {isCheckingUsername && <Loader2 className="animate-spin"/>}
                      <p className={`text-sm ${usernameMessage === "Username is unique" ? "text-green-500" :" text-red-600"}`}>
                        test {usernameMessage}
                      </p>
                  <FormMessage />
                </FormItem>
              )} 
             />

          <FormField
             name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel> Email </FormLabel>
                  <FormControl>
                    <Input placeholder="email"
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
         >
           {isSubmitting ? (
             <>
             <Loader2 className="mr-4 h-4 w-4 animate-spin" /> 
               Please wait
             </>
           ): ("SignUp")}
         </Button>
          </form>
        </Form>

        <div className=" text-center mt-4">
           <p>
            Alredy a member?{' '}
            <Link href={'/sign-in'} className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
           </p>
        </div>
      </div>
    </div>
  );
};

export default page;
