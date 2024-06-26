"use client";

import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ChevronLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CardHeader, CardContent, Card } from "@/components/ui/card";
// import { useCompletion } from "ai/react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import * as z from "zod";
import { ApiResponse } from "@/types/ApiResponse";
import Link from "next/link";
import { useParams } from "next/navigation";
import { msgSchema } from "@/schemas/msgSchema";
import { getSession } from "next-auth/react";

const specialChar = "||";

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar);
};

const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?";

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;

  const form = useForm<z.infer<typeof msgSchema>>({
    resolver: zodResolver(msgSchema),
  });

  const messageContent = form.watch("content");

  const handleMessageClick = (message: string) => {
    form.setValue("content", message);
  };

  const [isLoading, setIsLoading] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  const onSubmit = async (data: z.infer<typeof msgSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        ...data,
        username,
      });

      toast({
        title: response.data.message,
        variant: "default",
      });
      form.reset({ ...form.getValues(), content: "" });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ?? "Failed to sent message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isUserLoggedInFun = async () => {
    // Get the user's session
    const session = await getSession();

    // Check if the session exists and is valid
    if (session) {
      setIsUserLoggedIn(true);
      return true;
    } else {
      setIsUserLoggedIn(false);
      return false;
    }
  };

  return (
    <div className="container mx-auto my-8 p-6  rounded-lg  max-w-4xl border">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Public Profile Link
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your anonymous message here"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            {isLoading ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" disabled={isLoading || !messageContent}>
                Send It
              </Button>
            )}
          </div>
        </form>
      </Form>

      <div className="space-y-4 my-8 ">
        <div className="space-y-2 ">
          <p>Click on any message below to select it.</p>
        </div>
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold ">Messages</h3>
          </CardHeader>
        </Card>
      </div>

      {isUserLoggedIn && (
        <>
          {" "}
          <Separator className="my-6" />
          <div className="text-center">
            <div className="mb-4">Get Your Message Board</div>
            <Link href={"/sign-up"}>
              <Button>Create Your Account</Button>
            </Link>
          </div>
        </>
      )}

      <span className="text-gray-500 font-bold">
        <Link
          href="/dashboard"
          className="flex items-center space-x-1 transition duration-300 ease-in-out hover:text-gary-700 hover:scale-105"
        >
          <ChevronLeft className="h-5 w-5" />
          <span>Go Back</span>
        </Link>
      </span>
    </div>
  );
}
