"use client";

import { useSession, signOut } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const DashboardPage = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div
        className={cn(
          "flex justify-center items-center min-h-screen container"
        )}
      >
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div
      className={cn("flex justify-center items-center min-h-screen container")}
    >
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold">
            Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <p className="text-lg">
              Welcome,{" "}
              <span className="font-medium">
                {session?.user?.phoneNumber || "User"}
              </span>
            </p>
            <Button
              onClick={() => signOut()}
              className="w-full bg-red-500 hover:bg-red-600 text-white"
            >
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
