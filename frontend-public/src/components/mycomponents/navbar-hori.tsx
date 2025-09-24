"use client";

import * as React from "react";
import Link from "next/link";
import SidebarData from "@/mockData/Sidebardata.json";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem } from "@heroui/navbar";
import { Building2, Grid2X2, HouseIcon, Hospital, Ambulance, Bandage } from "lucide-react";

const iconMap = {
  HouseIcon,
  Building2,
  Grid2X2,
  Bandage,
  Hospital,
  Ambulance,
};

export default function NavHori() {
  return (
    <Navbar className="sticky flex justify-center">
      <NavbarContent className="bg-[#198450] rounded-full px-4 py-2 gap-4 justify-center mx-auto max-w-none">
        {Object.values(SidebarData).map((item) => {
          const Icon = iconMap[item.logo as keyof typeof iconMap] || HouseIcon;
          return (
            <NavbarItem key={item.keyMain || item.url}>
              <Link 
                href={item.url}
                className="flex items-center gap-2 px-3 py-2 rounded-full cursor-pointer text-zinc-100 hover:text-black transition-colors duration-200"
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.title}</span>
              </Link>
            </NavbarItem>
          );
        })}
      </NavbarContent>
    </Navbar>
  );
}
