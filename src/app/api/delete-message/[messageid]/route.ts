import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnent";
import UserModel from "@/models/user.model";
import { User } from "next-auth";


export async function  DELETE(request: Request, {params}: {params: {messageid: string}}) {

    const messageId = params.messageid;
    await dbConnect();
    

    const session = await getServerSession(authOptions);
    // type assertion
    const user: User = session?.user as User;

    if (!session || !session.user) {
        return Response.json(
        { success: false, message: "Not Authenticated" },
        { status: 401 }
        );
    }

   try {

       const updateResult =  await UserModel.updateOne(
        {
        _id: user._id
        },
        {
            $pull: { messages: {_id: messageId}}
        } )

        if (updateResult.modifiedCount === 0){
            return Response.json(
                { success: false, message: "Message not found or deleted" },
                { status: 404 }
            )
        } 

        return Response.json(
            { success: true, message: "Message deleted successfully" },
            { status: 200 }
        )
     
   } catch (error: any) {
        console.log("Error deleting message", error);
        return Response.json(
            {
                success: false,
                message: "Error deleting message"
            },
            { status: 500 }
        );      

   }


    
}
