import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await dbConnect(); // Ensure database connection

  try {
    const { searchParams } = new URL(request.url);
    const queryParams = {
      username: searchParams.get("username"),
    };

    const result = UsernameQuerySchema.safeParse(queryParams);

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return new Response(
        JSON.stringify({
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(", ")
              : "Invalid query parameters",
        }),
        { status: 400 }
      );
    }

    const { username } = result.data;

    // Check if the username is already taken by a verified user
    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Username is already taken",
        }),
        { status: 200 }
      );
    }

    // Check if the username is in use but not yet verified
    const existingUser = await UserModel.findOne({ username });

    if (existingUser) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Username is pending verification",
        }),
        { status: 200 }
      );
    }

    // Username is unique and can be used
    return new Response(
      JSON.stringify({
        success: true,
        message: "Username is unique",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking username:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error checking username",
      }),
      { status: 500 }
    );
  }
}
