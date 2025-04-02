import React, { useEffect, useState } from "react";
import DataTable from "../../Component/DataTable/DataTable";
import { getAllItem } from "../../Component/file";
import Status from "../../Component/Status/Status";
import { useAuth } from "../../Auth/AuthProvider";

const InventoryAdmin = () => {
  const { user } = useAuth();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  function convertItemsToArray(items) {
    return items.map(item => [
      item.id,
      item.brand,
      item.type,
      item.capacity,
      item.install_by,
      item.install_date,
      item.exp_date,
      item.location,
      item.color,
      item.next_check,
      item.last_check,
      item.status
    ]);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllItem();
        
        setInventory(convertItemsToArray(data));
      } catch (error) {
        console.error("Error fetching inventory:", error);
        setInventory([]); // Fallback to empty array
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Or your preferred loading state
  }

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
          hasAddItem={true}
        />
      </div>
    </div>
  );
};

export default InventoryAdmin;