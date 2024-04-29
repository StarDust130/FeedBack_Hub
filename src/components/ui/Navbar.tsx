"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./button";
import Image from "next/image";

const Navbar = () => {
  const { data: session } = useSession();

  const user: User = session?.user;

  return (
    <nav className="border-b-[0.5px]  shadow-lg">
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        <Link
          href="/"
          className="flex items-center space-x-2 text-white text-xl font-bold cursor-pointer"
        >
          <Image
            src="https://img.icons8.com/doodle/100/class-dojo.png"
            alt="logo"
            width={40}
            height={40}
          />
          <span>FeedBack-Hub</span>
        </Link>

        <div className="flex items-center space-x-4">
          {session ? (
            <>
              <span className="text-white text-lg">
                Welcome,{" "}
                <span className="capitalize">
                  {user?.username || user?.email}
                </span>
              </span>
              <Button
                onClick={() => signOut()}
                className="bg-gray-800 text-white hover:bg-gray-700"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/sign-in">
                <Button className="bg-gray-800 text-white hover:bg-gray-700">
                  Login
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="text-white border border-white hover:bg-gray-800 hover:border-transparent">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
