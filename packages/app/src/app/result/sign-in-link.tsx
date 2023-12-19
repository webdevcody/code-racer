"use client";

import { signIn } from "next-auth/react";

const SignInLink = () => {
  return (
    <p className="m-auto text  text-sm ">
      <span
        onClick={() =>
          signIn("github", {
            callbackUrl: `${location.origin}`,
          })
        }
        className="text-primary underline cursor-pointer"
      >
        Sign in
      </span>{" "}
      <span className="text-muted-foreground">to save your next race !</span>
    </p>
  );
};

export default SignInLink;
