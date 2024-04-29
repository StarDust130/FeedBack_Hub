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
    <nav className="p-4 md:p-6 shadow-gray-500 bg-black text-white border-[0.5px]border-b border-white shadow-sm">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-center gap-3">
        <a href="#" className="text-xl font-bold mb-4 md:mb-0">
          <div className="flex justify-center">
            <div>
              <Image
                src="https://img.icons8.com/doodle/100/class-dojo.png"
                alt="logo"
                width={40}
                height={40}
              />
            </div>
            <div className="font-bold text-center flex justify-center items-center  font-mono ">
              FeedBack-Hub
            </div>
          </div>
        </a>
        {session ? (
          <>
            <span className="mr-4 font-bold text-2xl">
              Welcome ,{" "}
              <span className="capitalize">
                {user?.username || user?.email}{" "}
              </span>
            </span>
            <Button
              onClick={() => signOut()}
              className="w-full md:w-auto bg-slate-100 text-black"
              variant="outline"
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <div className="flex justify-end gap-5">
              <Link href="/sign-in">
                <Button
                  className="w-full md:w-auto bg-slate-100 text-black"
                  variant={"outline"}
                >
                  Login
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button
                  className="w-full md:w-auto text-white"
                  variant={"link"}
                >
                  Sign Up
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
