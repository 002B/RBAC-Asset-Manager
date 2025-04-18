import React, { useEffect, useState } from "react";
import "boxicons";
import DataTable from "../../Component/DataTable/DataTable.jsx";
import Status from "../../Component/Status/Status.jsx";
import { useAuth } from "../../Auth/AuthProvider.jsx";

// const submittedWork = [
//   ["FTX=2023-001", "worker001", "14/11/2022", "12:45:32"],
//   ["FTX=2023-002", "worker002", "14/11/2022", "12:45:32"],
//   ["FTX=2023-003", "worker003", "14/11/2022", "12:45:32"],
//   ["FTX=2023-004", "worker004", "14/11/2022", "12:45:32"],
//   ["FTX=2023-005", "worker005", "14/11/2022", "12:45:32"],
//   ["FTX=2023-006", "worker006", "14/11/2022", "12:45:32"],
//   ["FTX=2023-007", "worker007", "14/11/2022", "12:45:32"],
//   ["FTX=2023-008", "worker008", "14/11/2022", "12:45:32"],
//   ["FTX=2023-009", "worker009", "14/11/2022", "12:45:32"],
//   ["FTX=2023-010", "worker010", "14/11/2022", "12:45:32"],
//   ["FTX=2023-011", "worker011", "14/11/2022", "12:45:32"],
// ];

// const testUnReadReport = [
//   ["FTX=2023-001", "User Name", "14/11/2022", "12:45:32"],
//   ["FTX=2023-002", "User Name", "14/11/2022", "12:45:32"],
//   ["FTX=2023-003", "User Name", "14/11/2022", "12:45:32"],
//   ["FTX=2023-004", "User Name", "14/11/2022", "12:45:32"],
//   ["FTX=2023-005", "User Name", "14/11/2022", "12:45:32"],
//   ["FTX=2023-006", "User Name", "14/11/2022", "12:45:32"],
//   ["FTX=2023-007", "User Name", "14/11/2022", "12:45:32"],
//   ["FTX=2023-008", "User Name", "14/11/2022", "12:45:32"],
//   ["FTX=2023-009", "User Name", "14/11/2022", "12:45:32"],
//   ["FTX=2023-010", "User Name", "14/11/2022", "12:45:32"],
//   ["FTX=2023-011", "User Name", "14/11/2022", "12:45:32"],
// ];
const fetchReport = async () => {
  try {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    const response = await fetch(
      `http://localhost:3000/report/getReportByStatus/pending`,
      requestOptions
    );
    const data = await response.json();
    const formattedData = data.map((item) => [
      item.item_id,
      item.createAt,
      item.problem,
    ]);
    return formattedData;
  } catch (error) {
    console.error("Error fetching inventory data:", error);
    return []
  }
};

const fetchAccepted = async () => {
  try {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    const response = await fetch(
      `http://localhost:3000/report/getReportByStatus/accepted`,
      requestOptions
    );
    const data = await response.json();
    const formattedData = data.map((item) => [
      item.item_id,
      item.send_to,
      item.createAt.split("T")[0],
      item.createAt.split("T")[1].split(".")[0],
    ]);
    return formattedData;
  } catch (error) {
    console.error("Error fetching inventory data:", error);
    return []
  }
};

const DashboardAdmin = () => {
  const { user } = useAuth();
  const [submittedWork, setSubmittedWork] = useState([]);
  const [testUnReadReport, setTestUnReadReport] = useState([]);
  useEffect(() => {
    (async () => {
      setTestUnReadReport(await fetchReport())
      setSubmittedWork(await fetchAccepted())
    })()
  }, []);
  return (
    <div className="flex flex-col w-full h-fit rounded drop-shadow gap-2">
      <div className="w-full rounded drop-shadow">
      <Status
          role={user.role}
          company={user.company}
        />
      </div>
      <div className=" dashboard-container flex w-full rounded drop-shadow">
        <div className="big-item">
          <div className="small-item-wrapper">
            <div className="small-item">
              <DataTable
                tIcon="wrench"
                colIcon={"wrench"}
                tName={"Submitted Work"}
                title={["Serial Number", "Worker Name", "Date", "Time"]}
                data={submittedWork}
                hasButton={false}
                itemPerPage={10}
              ></DataTable>
            </div>
          </div>
        </div>
        <div className="big-item">
          <div className="small-item-wrapper">
            <div className="small-item">
              <DataTable
                colIcon={"news"}
                tIcon={"news"}
                tName={"Report"}
                title={["Serial Number", "Date", "Problem"]}
                data={testUnReadReport}
                hasButton={false}
                itemPerPage={10}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
