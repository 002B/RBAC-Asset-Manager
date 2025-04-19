import React, { useEffect, useState } from "react";
import DataTable from "../../Component/DataTable/DataTable";
import Status from "../../Component/Status/Status";
import { useAuth } from "../../Auth/AuthProvider";

const InventoryAdmin = () => {
  const { user } = useAuth();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const requestOptions = {
          method: "GET",
          redirect: "follow",
        };
        const response = await fetch(
          `http://localhost:3000/item/getAllItem`,
          requestOptions
        );
        const data = await response.json();
        const formattedData = data.map((item) => [
          item.item_id,
          item.client_id,
          item.client_branch_id,
          item.item_brand,
          item.item_capacity,
          item.item_color,
          item.item_type,
          item.item_class,
          item.item_status,
        ]);
        setInventory(formattedData);
      } catch (error) {
        console.error("Error fetching inventory data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user.company, user.selectedBranch, inventory]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col w-full drop-shadow rounded-[8px]">
      <div className="bg-white rounded-[8px] drop-shadow">
      <Status
          role={user.role}
          company={user.company}
        />
      </div>
      <div className="mt-4 bg-white p-1 rounded-[8px] drop-shadow">
        <DataTable
          tIcon={"spray-can"}
          colIcon={"spray-can"}
          tName="Fire Extinguisher List"
          title={[
            "item_id",
            "client_id",
            "client_branch_id",
            "item_brand",
            "item_capacity",
            "item_color",
            "item_type",
            "item_class",
            "item_status",
          ]}
          data={inventory}
          hasExport={true}
          formData={[
            "Company",
            "Branch",
            "Name",
            "Serial Number",
            "Problem",
            "File",
            "Submit",
          ]}
          formPlaceholder={{
            Company: user.company,
            Branch: user.selectedBranch,
            Name: user.display_name,
          }}
          hasEdit={true}
          hasAddItem={true}
          hasQr={true}
        />
      </div>
    </div>
  );
}
export default InventoryAdmin;