import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const querryParams = {
      username: searchParams.get("username"),
    };
    // Validate with zod
    const result = UsernameQuerySchema.safeParse(querryParams);

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];

      return Response.json(
        {
          success: false,
          message: "Invalid username 😯",
          errors: usernameErrors,
        },
        {
          status: 400,
        }
      );
    }

    const { username } = result.data;

    console.log("Checking username ", username);

    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: "Username already taken 😕",
        },
        {
          status: 409,
        }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Username is Available 🥳",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error checking username 😳", error);
    return Response.json(
      {
        success: false,
        message: "An error occured while checking username 🤒",
      },
      {
        status: 500,
      }
    );
  }
}
