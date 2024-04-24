import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Feedback_Hub Verification Email 📧",
      react: VerificationEmail({ username, otp: verifyCode }),
    });

    return { success: true, message: "Email Verify Succesfully 📧🥳" };
  } catch (emailError) {
    console.log("Error by Sending Email 😥", emailError);
    return { success: false, message: "Error by Sending Email 😥" };
  }
}
