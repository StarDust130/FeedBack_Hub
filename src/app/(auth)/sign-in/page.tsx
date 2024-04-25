"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function Component() {
  const { data: session } = useSession();
  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center">
      {session ? (
        <>
          <p className="text-xl">Signed in as {session.user.email}</p>
          <button
            onClick={() => signOut()}
            className="mt-4 px-4 py-2 bg-white text-black rounded-md shadow-md hover:bg-gray-300"
          >
            Sign out
          </button>
        </>
      ) : (
        <>
          <p className="text-xl">Not signed in</p>
          <button
            onClick={() => signIn()}
            className="mt-4 px-4 py-2 bg-white text-black rounded-md shadow-md hover:bg-gray-300"
          >
            Sign in
          </button>
        </>
      )}
    </div>
  );
}
