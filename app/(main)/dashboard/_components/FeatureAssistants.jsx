"use client";
import { Button } from "@/components/ui/button";
import { useUser } from "@stackframe/stack";
import React from "react";

function FeatureAssistants() {
  const user = useUser();
  return (
    <div>
        <div className="flex justify-between items-center">
      <div >
        <h2 className="font-medium text-gray-500">My Workspace</h2>
        <h2 className="text-3xl font-bold">
          Welcome back, {user?.displayName}
        </h2>
      </div>
      <button>Profile</button>
      </div>
    </div>
  );
}

export default FeatureAssistants;
