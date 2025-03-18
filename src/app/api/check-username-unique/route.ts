import dbConnect from "@/lib/dbConnent";
import UserModel from "@/models/user.model";
import { usernameValidation } from "@/schemas/signUpSchema";
// import { request } from "http";
import { z } from "zod";

const usernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  // todo for others routes
  await dbConnect();
  

  try {

    const { searchParams } = new URL(request.url);
    // https://localhost:3000/api/cuu?username=kumar?phone=android
    const queryParams = {
      username: searchParams.get("username"),
    };
    // validate with zod

    const result = usernameQuerySchema.safeParse(queryParams);
    console.log(result);

    if (!result.success) {
      const usernameError = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameError?.length > 0
              ? usernameError.join(", ")
              : "Invalid Query Parameters",
        },
        { status: 400 }
      );
    }

    const { username } = result.data;
    console.log("Username valid... data", result.data);

    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });
     
    console.log(existingVerifiedUser);
    
    if (existingVerifiedUser) {
      return Response.json(
        { success: false, message: "Username is already taken" },
        { status: 400 }
      );
    }

    return Response.json(
      { success: true, message: "Username is unique" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error checking Username", error);
    return Response.json(
      { success: false, message: "Error Checking username" },
      { status: 500 }
    );
  }
}
