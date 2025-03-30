import React from "react";
import { useAuth } from "../../Auth/AuthProvider";
import DataTable from "../../Component/DataTable/DataTable";
import { getItemBranch } from "../../Component/file";
import Status from "../../Component/Status/Status";

const InventoryMember = () => {
  const { user } = useAuth();
  const rawInventory = getItemBranch(user.company, user.selectedBranch);

  const inventory = Object.entries(rawInventory).map(([key, details]) => {
    return [
      key,
      details.brand,
      details.type,
      details.capacity,
      details.install_by,
      details.install_date,
      details.exp_date,
      details.location,
      details.color,
      details.next_check,
      details.last_check,
      details.status,
      details.log,
    ];
  });
  
  return (
    <div className="flex flex-col w-full drop-shadow rounded-[8px]">
      <div className="bg-white rounded-[8px] drop-shadow">
        {Status(user.role, user.company, user.selectedBranch)}
      </div>

      <div className="mt-4 bg-white p-1 rounded-[8px] drop-shadow">
        <DataTable
        tIcon={"spray-can"}
          colIcon={"spray-can"}
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
          formData={["Company","Branch", "Name", "Serial Number","Problem","File","Submit"]}
          formPlaceholder={{Company:user.company, Branch:user.selectedBranch, Name:user.display_name}}
        />
      </div>
    </div>
  );
};

export default InventoryMember;
