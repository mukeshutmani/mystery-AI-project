import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnent";
import UserModel from "@/models/user.model";
import { User } from "next-auth";




export async function POST(request: Request) {
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

  const userId = user._id;
  const { acceptMessages } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptMessages },
      { new: true }
    );

    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "Failed to updated user status to accept messages",
        },
        { status: 401 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Message Acceptance Status updated Succesfuly",
        updatedUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("Failed to updated user status to accespt messages");
    return Response.json(
      {
        success: false,
        message: "Failed to updated user status to accespt messages",
      },
      { status: 500 }
    );
  }
}



// route for isacceptingMessages
export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  // type assert
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      { success: false, message: "Not Authenticated" },
      { status: 401 }
    );
  }

  const userId = user._id;

  try {
    const foundUser = await UserModel.findById(userId);

    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: "User Not Found",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        isAcceptingMessages: foundUser.isAcceptingMessage,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error in getting message acceptance status");
    return Response.json(
      {
        success: false,
        message: "Error in getting message acceptance status",
      },
      { status: 500 }
    );
  }
}
