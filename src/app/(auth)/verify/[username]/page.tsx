'use client'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { verifySchema } from '@/schemas/verifySchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z  from 'zod'



const VerifyCode = () => {


    const router = useRouter()
    const params = useParams<{username: string}>()
     
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
    });


    const onSubmit = async(data: z.infer<typeof verifySchema>) => {
         
        try {

            console.log(data);
            
            const response =  await axios.post<ApiResponse>(`/api/verify-code`, {
            username: params.username,
            code: data.code
            })
            toast(response.data.message)
            router.replace('/sign-in')

        } catch (error:any) {
            console.error("Error in signup of user", error);
            const axiosError = error as AxiosError<ApiResponse>;
            
            toast(axiosError.response?.data.message);
        }
    }

   


return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-6 space-y-8 bg-white rounded-lg shadow-md">
      <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify Account
          </h1>
          <p className="mb-4">
            Enter the verification Code sent to your email
          </p>
        </div>

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-6'
            >
            <FormField
            name="code"
             control={form.control}
              render={({field}) => (
                <FormItem>
                 <FormLabel> Verification Code  </FormLabel>
                <FormControl>
                <Input  placeholder='code' {...field} />
                </FormControl>
              <FormMessage />
            </FormItem>
            )}
            />
            <Button type='submit' className='cursor-pointer'>
               submit
            </Button>

            </form>
        </Form>

      </div>
    </div>
                
               
  )
}

export default VerifyCode