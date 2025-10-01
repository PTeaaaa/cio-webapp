import SignInForm from "@/components-my/auth/newSignInForm";
import AuthRedirect from "@/components/auth/AuthRedirect";
import { Metadata } from "next";
import Image from "next/image";
import GridShape from "@/components/common/GridShape";

export const metadata: Metadata = {
  title: "CIO admin site - Sign In",
  description: "This is Next.js Signin Page TailAdmin Dashboard Template",
};

export default function SignIn() {
  return (
    <>
      <AuthRedirect />
      <SignInForm />
      <div className="lg:w-1/2 w-full h-full bg-[#033500] dark:bg-white/5 lg:grid items-center hidden">
        <div className="relative items-center justify-center flex z-1">
          {/* <!-- ===== Common Grid Shape Start ===== --> */}
          <GridShape />
          <div className="flex flex-col items-center max-w-xs">
            <Image
              width={231}
              height={48}
              src="/images/logo/MOPHLogo.svg"
              alt="Logo"
              className="mb-3"
            />
            <p className="text-center text-gray-400 dark:text-white/60">
              Chief Information Officer<br />Admin Dashboard
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
