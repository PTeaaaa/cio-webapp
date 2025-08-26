"use client";
import React from "react";

export default function WelcomeCard() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="font-geistMono font-semibold text-2xl text-center text-gray-900 dark:text-white">
        Welcome to admin page, you can edit the information of CIO here.
      </div>
    </div>
  );
}
