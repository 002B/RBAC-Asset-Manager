import React from "react";
import DataTable from "../../Component/DataTable/DataTable";
import { getAllItem } from "../../Component/file";
import ExportExcel from '../../Component/ExcelExport';
import 'boxicons'

const InventoryWorker = () => {
  const inventory = getAllItem();

  return (
    <div className="flex flex-col w-full drop-shadow rounded-[8px] gap-2">
      <div className="bg-white p-2 rounded-[8px] drop-shadow">
        <DataTable
          colIcon={"spray-can"}
          tIcon="spray-can"
          tName="Fire Extinguisher List"
          hasButton={false}
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
        />
      </div>
    </div>
  );
};

export default InventoryWorker;
