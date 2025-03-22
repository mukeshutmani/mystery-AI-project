'use client';
import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CardHeader, CardContent, Card } from '@/components/ui/card';
import { useCompletion } from 'ai/react';
import { toast } from 'react-toastify'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import * as z from 'zod';
import { ApiResponse } from '@/types/ApiResponse';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { messagesSchema } from '@/schemas/messageSchema';

import {useQuery} from '@tanstack/react-query'




export default function SendMessage() {
 

  const [Loading, setLoading] = useState(false);

  const fetchSuggestedMessages = async () => {
    try {

      if(!Loading){
            return
      }
      console.log("Fetching Suggested Messages");
      
      const response = await axios.post('/api/suggest-message')
      const extractData = response.data?.choices[0]?.message?.content ;
      const replaceData = extractData.replace(/[{}]/g, "").trim();
      const data: string = replaceData.replace(/\\boxed"/g, "").replace(/"$/, "") 
      return data;
     
    } catch (error: any) {
      console.error('Error Suggesting messages:', error);
    } 
  };

  

 const {data, isLoading: QueryLoading , error:any, refetch, isFetching } = useQuery({
    queryKey: ["questions"],
    queryFn: fetchSuggestedMessages
 })
 console.log(QueryLoading);



  const initialMessageString =
   "What's your favorite movie?||Do you have any pets?||What's your dream job?";

   const {
    complete,
    completion,
    isLoading: isSuggestLoading,
    error,
  } = useCompletion({
    api: '/api/suggest-messages',
    initialCompletion: initialMessageString,
  });


  const specialChar = '||';

  const parseStringMessages = (data: string): string[] => {
    return data.split(specialChar);
  };



  const params = useParams<{ username: string }>();
  const username = params.username;

  const form = useForm<z.infer<typeof messagesSchema>>({
    resolver: zodResolver(messagesSchema),
  });

  const messageContent = form.watch('content');

  const handleMessageClick = (message: string) => {
    form.setValue('content', message);
  };

  


  const onSubmit = async (data: z.infer<typeof messagesSchema>) => {
    setLoading(true);
    try {
      const response = await axios.post<ApiResponse>('/api/send-message', {
        ...data,
        username,
      });

      toast.success(response.data.message, {position: "top-right"});
      form.reset({ ...form.getValues(), content: '' });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message, {position: "top-right"});
    } finally {
      setLoading(false);
    }
  };




 
   


  return (
    <div className="container mx-auto my-8 p-6  rounded max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Public Profile Link
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your anonymous message here"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            {Loading ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" disabled={Loading || !messageContent}>
                Send It
              </Button>
            )}
          </div>
        </form>
      </Form>

      <div className="space-y-4 my-8 cursor-pointer">
        <div className="space-y-2">
          <Button
            
            onClick={() => refetch()}
            className="my-4 cursor-pointer"
            disabled={isFetching }
          >
           { isFetching ? "Loading..." : "Suggest Messages"}
          </Button>
          <p>Click on any message below to select it.</p>
        </div>
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">Messages</h3>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            {error ? (
              <p className="text-red-500">{error.message}</p>
            ) : (
              parseStringMessages(data || completion).map((message, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="mb-2"
                  onClick={() => handleMessageClick(message)}
                >
                  {message}
                </Button>
              ))
            )}
          </CardContent>
        </Card>
      </div>
      <Separator className="my-6" />
      <div className="text-center">
        <div className="mb-4">Get Your Message Board</div>
        <Link href={'/sign-up'}>
          <Button>Create Your Account</Button>
        </Link>
      </div>
    </div>
  );
}