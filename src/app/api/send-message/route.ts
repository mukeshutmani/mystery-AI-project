import dbConnect from "@/lib/dbConnent";
import UserModel from "@/models/user.model";
import {Message} from '@/models/user.model'


export async function POST(request: Request) {
    await dbConnect()
    
   const {username, content} = await request.json();

   try {
     
   const user = await UserModel.findOne({username})

   if(!user){
    return Response.json(
        {
          success: false,
          message: "User Not found",
        },
        { status: 404 }
      );
   } 

   // is user accepting the messages
   if(!user.isAcceptingMessage) {
    return Response.json(
        {
          success: false,
          message: "user is not acceting the messages",
        },
        { status: 403 }
      );
   } 
   
   const newMessage = {content, createdAt: new Date()}
   user.messages.push(newMessage as Message)

   await user.save()

    return Response.json(
        {
        success: true,
        message: "Message sent successfully",
        },
        { status: 201 }
    );


    
   } catch (error) {  
    console.log("Error adding messsaging",error);
    return Response.json(
      {
        success: false,
        message: "Internal Server error",
      },
      { status: 500 }
    );
   }

}
