"use client";
import React from "react";
import Badge from "@/components/ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon } from "@/icons";
import { PencilLine } from "lucide-react";


export default function UserCountCard() {
  return (
    <div className="gap-4 font-prompt">
      <div className="grid grid-cols-2 gap-4">
        {/* <!-- Metric Item Start --> */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
          </div>

          <div className="mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                จำนวนผู้ใช้ ณ ขณะนี้
              </span>
              <div className="flex items-center gap-4 mt-1">
                <h4 className="font-bold text-gray-800 text-2xl dark:text-white/90">
                  3,782
                </h4>
                <h4 className="font-bold text-gray-800 text-2xl dark:text-white/90">
                  คน
                </h4>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- Metric Item End --> */}

        {/* <!-- Metric Item Start --> */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <PencilLine className="text-gray-600 dark:text-white/90" />
          </div>
          <div className="flex items-end justify-between mt-5 gap-y-4">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                ข้อมูลที่แก้ไขล่าสุด
              </span>
              <h4 className="mt-2 font-bold text-gray-800 text-2xl dark:text-white/90">
                นายแพทย์สุรัคเมธ มหาศิริมงคล
              </h4>
              <p className="text-base text-gray-500 dark:text-gray-400">
                โดย Admin
              </p>
              <p className="text-base text-gray-500 dark:text-gray-400">
                เวลาที่แก้ไข 19 : 30 น.
              </p>
            </div>
          </div>
        </div>
        {/* <!-- Metric Item End --> */}
      </div>

      {/* <!-- Metric Item Start --> */}
      <div className="flex justify-start py-4">
        <Badge color="success">
          <div className="relative flex items-center justify-center gap-2">
            <div className="relative flex items-center justify-center">
              <span className="h-1.5 w-1.5 bg-success-500 rounded-full"></span>
              <span className="absolute h-1 w-1 bg-green-700 dark:bg-green-300 rounded-full animate-ping opacity-75 dark:opacity-100"></span>
            </div>
            Server Available
          </div>
        </Badge>
      </div>
      {/* <!-- Metric Item End --> */}
    </div>
  );
};
