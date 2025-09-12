"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/sidebar";

import Link from "next/link";
import { Building2, Grid2X2, HouseIcon, Hospital, Ambulance, Bandage } from "lucide-react";
import SidebarData from "@/mockData/Sidebardata.json";

const iconMap = {
  HouseIcon,
  Building2,
  Grid2X2,
  Bandage,
  Hospital,
  Ambulance,
};

export function AppSidebar() {

  return (
    <Sidebar variant="sidebar" className="absolute">
      <SidebarContent className="bg-white pt-[100px] pl-2 rounded-2xl">
        <SidebarGroup>
          <SidebarMenu>
            {Object.values(SidebarData).map((item, index) => {
              const Icon = iconMap[item.logo as keyof typeof iconMap] || HouseIcon;
              return (
                <SidebarMenuItem key={index}>
                  <Link href={item.url}>
                    <SidebarMenuButton
                      className="flex cursor-pointer hover:bg-gray-200 transition"
                      tooltip={item.title}
                    >
                      <Icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}