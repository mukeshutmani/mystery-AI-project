import { resend } from '@/lib/resend'
import VerificationEmail from '../../emails/VerificationEmail'
import { ApiResponse } from '@/types/ApiResponse'


export async function sendVerificationEmail(
    email:string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
  
    try {

        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Mystery Message | Verification Code',
            react: VerificationEmail({username: username, otp: verifyCode}),
          });
         
        return {
            success: true,
            message: " Verification Email send successfully"
         }


    } catch (emailError) {
         console.error("Error sending Verification emails", emailError)
         return {
            success: false,
            message: "Failed to send Verification Email"
         }
    }



}







