import React from "react";
import DataTable from "../../Component/DataTable/DataTable";
import { getAllItem } from "../../Component/file";
import Status from "../../Component/Status/Status";
import { useAuth } from "../../Auth/AuthProvider";

const InventoryAdmin = () => {
  const { user } = useAuth();
  const inventory = getAllItem();

  return (
    <div className="flex flex-col w-full drop-shadow rounded-[8px] gap-2">
      <div>{Status(user.role)}</div>
      <div className="bg-white p-1 rounded-[8px] drop-shadow">
        <DataTable
          colIcon={"spray-can"}
          tIcon="spray-can"
          tName="Fire Extinguisher List"
          title={[
            "Serial Number",
            "Brand",
            "Type",
            "Weight",
            "Install By",
            "Install Date",
            "Exp Date",
            "Location",
            "Color",
            "Next Check",
            "Last Check",
            "Status",
          ]}
          data={inventory}
          hasExport={true}
          hasButton={false}
        />
      </div>
    </div>
  );
};

export default InventoryAdmin;
