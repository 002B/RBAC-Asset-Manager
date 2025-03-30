import React from "react";
import { useAuth } from "../../Auth/AuthProvider";
import UnassignedWorkAdmin from "./UnassignedWork-Admin";
import UnassignedWorkWorker from "./UnassignedWork-Worker";

const UnassignedWork = () => {
  const { user } = useAuth();

  if (user.role === "super_admin" || user.role === "admin") {
    return <UnassignedWorkAdmin />;
  } else {
    return <UnassignedWorkWorker />;
  }
};

export default UnassignedWork;
