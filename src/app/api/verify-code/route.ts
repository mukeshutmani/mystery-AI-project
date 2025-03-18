import dbConnect from "@/lib/dbConnent";
import UserModel from "@/models/user.model";


export async function POST(request: Request) {
    
    await dbConnect()

    try {
     const {username, code} = await request.json()

    const decodedUsername =  decodeURIComponent(username);

    const user = await UserModel.findOne({username: decodedUsername});
    if(!user){
        return Response.json(
            { success: false, message: "User not found" },
            { status: 404 }
        );
    }

    const isCodeValid = user.verifyCode === code
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if(isCodeValid && isCodeNotExpired){
            user.isVerified = true
            await user.save();

            return Response.json(
                { success: true, message: "Account verified Successfully" },
                { status: 200 }
            );
    }  else if(!isCodeNotExpired){
        return Response.json(
            { success: false, message: "Verification code is expired please signup again to get a new code " },
            { status: 400 }
        );
    } else {
        return Response.json(
            { success: false, message: "Incoorect Verification Code" },
            { status: 400 }
        );
    }
    
    } catch (error:any) {
        console.error("Error Verifying Code ", error);
        return Response.json(
          { success: false, message: "Error Verifying Code" },
          { status: 500 }
        );
        
    }

}