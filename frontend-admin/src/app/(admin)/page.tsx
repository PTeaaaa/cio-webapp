import type { Metadata } from "next";
import React from "react";
import WelcomeCard from "@/components-my/home/WelcomeCard";
import UserCountCard from "@/components-my/user/UserCountCard";
import TestFetchButton from "@/components/testPurpose";

export const metadata: Metadata = { 
  title:
    "CIOSite - edit",
  description: "CIO site edit page for admin",
};

export default function Homepage() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-1">
      <div className="col-span-1">
        <WelcomeCard />
      </div>

      <div className="col-span-1">
        <UserCountCard />
      </div>

      <div className="col-span-1">
        <TestFetchButton />
      </div>
    </div>
  );
}
