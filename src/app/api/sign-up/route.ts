import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();
    const existingUserVerifiyByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerifiyByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username already exists 😆",
        },
        { status: 400 }
      );
    }

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    const existingUserVerifiyByEmail = await UserModel.findOne({
      email,
    });

    if (existingUserVerifiyByEmail) {
      if (existingUserVerifiyByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User already exists with this Email😆",
          },
          { status: 400 }
        );
      } else {
        const hashPassword = await bcrypt.hash(password, 10);

        existingUserVerifiyByEmail.password = hashPassword;

        existingUserVerifiyByEmail.verifyCode = verifyCode;
        existingUserVerifiyByEmail.verifyCodeExpiry = new Date(
          Date.now() + 3600000
        );
        await existingUserVerifiyByEmail.save();
      }
    } else {
      const hashPassword = await bcrypt.hash(password, 10);

      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hashPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessages: true,
        messages: [],
      });

      await newUser.save();
    }

    //! Send Verification Email 📧
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );

    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User Registered Successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error while Register User 🤒", error);
    return Response.json(
      {
        success: false,
        message: "Error while Register User 🤒",
      },
      { status: 500 }
    );
  }
}
