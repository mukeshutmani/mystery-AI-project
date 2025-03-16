import { sendVerificationEmail } from "@/helpers/sendVerificationEmails";
import dbConnect from "@/lib/dbConnent";
import UserModel from "@/models/user.model";
import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";





export async function POST(request: NextRequest) {
        await dbConnect()

    try {

        const {username, email, password} =  await request.json();
        const existingUserVerifiedByUsername = await UserModel.findOne({username, isVerified: true});

        if(existingUserVerifiedByUsername) {
               return Response.json(
                {   
                    messsage:"Username is already exists",
                    success: false
                },
                { status: 400 }
               )
         }

       const existingUserbyEmail  = await UserModel.findOne({email});

       const otp = Math.floor(100000 + Math.random()*900000).toString()
       
       if(existingUserbyEmail) {

            if(existingUserbyEmail.isVerified) {
                return Response.json(
                    {   
                        messsage: "User Already exists wih this email ",
                        success: false
                    },
                    {status: 400})
             } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserbyEmail.password = hashedPassword;
                existingUserbyEmail.verifyCode = otp;
                existingUserbyEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);

                await existingUserbyEmail.save()

             }



       } else {
         const hashedPassword = await bcrypt.hash(password, 10);
         const expiryDate = new Date();
         expiryDate.setHours(expiryDate.getHours() + 1);

        const newUser = new UserModel({
            username,
            email,
            password: hashedPassword,
            verifyCode: otp,
            verifyCodeExpiry: expiryDate,
            isVerified: false,
            isAcceptingMessage: true,
            messages: []
         })

          await newUser.save();
       }

       // send verification Email

      const emailResponse = await sendVerificationEmail(email, username, otp)
      console.log(emailResponse);

        if(!emailResponse.success) {
                return Response.json(
                    {   
                        messsage:emailResponse.message,
                        success: false
                    },
                    {status: 500}
                )
       } 

       return Response.json(
        {   
            messsage: "User Registered Successfully. please verify your email",
            success: true
        },
        {status: 201}
    )

       
      

            
    } catch (error) {
            console.error("Error While Resgistring User", error);

            return Response.json(
                {
                    success: false,
                    message: "Error while registring user"
                },
                {
                    status: 500
                }
            )
        }
}



