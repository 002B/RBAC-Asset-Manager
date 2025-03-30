import React from "react";
import { useAuth } from "../../Auth/AuthProvider";
import DataTable from "../../Component/DataTable/DataTable";
import { getItemCompany, getItemBranch } from "../../Component/file";
import Status from "../../Component/Status/Status";

const InventorySuperMember = () => {
  const { user } = useAuth();

  const checkInventory = () => {
    if (user.selectedBranch === "All Branches") {
      const rawInventory = getItemCompany(user.company);
      const inventory = rawInventory.map((item) => {
        const key = item[0];
        const details = item[1];
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
        ];
      });
      return inventory;
    }
    else {
      const rawInventory = getItemBranch(user.company, user.selectedBranch);
      const Inventory = Object.entries(rawInventory).map(([serial, details]) => {
        const { brand, type, capacity, install_by, install_date, exp_date, location, color, next_check, last_check, status, log } = details;
        return [
          serial,    
          brand,     
          type,      
          capacity,  
          install_by,
          install_date,
          exp_date,  
          location,  
          color,     
          next_check,
          last_check,
          status,    
        ];
      });
      return Inventory;
    }
  }
  

  return (
    <div className="flex flex-col w-full drop-shadow rounded-[8px]">
      <div className="bg-white rounded-[8px]">
        {Status(user.selectedRole, user.company, user.selectedBranch)}
      </div>
      <div className="mt-4 bg-white p-2 rounded-[8px] drop-shadow">
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
          data={checkInventory()}
          hasExport={true}
          formData={["Company","Branch", "Name", "Serial Number","Problem","File","Submit"]}
          formPlaceholder={{Company:user.company, Branch:user.selectedBranch, Name:user.display_name}}
        />
      </div>
    </div>
  );
};

export default InventorySuperMember;
