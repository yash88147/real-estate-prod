"use client";
import Navbar from "@/components/Navbar";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar"; // Import useSidebar
import { NAVBAR_HEIGHT } from "@/lib/constants";
import React, { useEffect, useState } from "react";
import AppSidebar from "@/components/AppSidebar"; // Corrected the import name
import { useGetAuthUserQuery } from "@/state/api";
import { cn } from "@/lib/utils"; // Import cn utility
import { usePathname, useRouter } from "next/navigation";

const DashboardContent = ({ children }: { children: React.ReactNode }) => {
  const { data: authUser, isLoading:authLoading } = useGetAuthUserQuery();
  const { open } = useSidebar(); // Get the sidebar state
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading,setIsLoading] = useState(true);
  useEffect(() => {
    if(authUser){
      const userRole = authUser.userRole?.toLowerCase();
      if(
        (userRole === "manager" && pathname.startsWith("/tenants")) || 
        (userRole === "tenant" && pathname.startsWith("/managers")) 
      ){
        router.push(
          userRole === "manager" ? 
            "/managers/properties" : 
            "/tenants/favorites",
          {scroll : false}
        )
      }
      else{
        setIsLoading(false);
      }
    }
  },[authUser,router,pathname]);
  if(authLoading || isLoading) return <>Loading...</>;
  if (!authUser?.userRole) return null;

  return (
    <div className="min-h-screen w-full bg-primary-100">
      <Navbar />
      <div style={{ paddingTop: `${NAVBAR_HEIGHT}px` }}>
        <main className="flex">
          <AppSidebar userType={authUser?.userRole.toLowerCase()} />
          {/* Apply conditional padding-left to the main content area */}
          <div
            className={cn(
              "flex-grow transition-all duration-300",
              // These values depend on your sidebar's width in open/closed states
              open ? "ml-[191px]" : "pl-[50px]"
            )}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <DashboardContent>{children}</DashboardContent>
    </SidebarProvider>
  );
};

export default DashboardLayout;