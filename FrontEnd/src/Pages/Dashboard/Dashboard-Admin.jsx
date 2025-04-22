import React, { useEffect, useState } from "react";
import "boxicons";
import DataTable from "../../Component/DataTable/DataTable.jsx";
import Status from "../../Component/Status/Status.jsx";
import { useAuth } from "../../Auth/AuthProvider.jsx";

// เพิ่มตรง import
const fetchWorkerCurrentWork = async (username) => {
  try {
    const requestOptions = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      method: "GET",
      redirect: "follow",
    };
    const response = await fetch(
      `http://localhost:3000/report/getReportByUserFixing/${username}`,
      requestOptions
    );
    const data = await response.json();
    const formattedData = data.map((item) => [
      item.report_id,
      item.client_id,
      item.client_branch_id,
      item.createAt.split("T")[0],
      item.createAt.split("T")[1].split(".")[0],
    ]);
    return formattedData;
  } catch (error) {
    console.error("Error fetching current work:", error);
    return [];
  }
};

const fetchReport = async () => {
  try {
    const requestOptions = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
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
    return [];
  }
};

const fetchAccepted = async () => {
  try {
    const requestOptions = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      method: "GET",
      redirect: "follow",
    };
    const response = await fetch(
      `http://localhost:3000/report/getReportByStatus/done`,
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
    return [];
  }
};

const DashboardAdmin = () => {
  const { user } = useAuth();
  const [submittedWork, setSubmittedWork] = useState([]);
  const [testUnReadReport, setTestUnReadReport] = useState([]);
  const [currentWorkList, setCurrentWorkList] = useState([]);

  useEffect(() => {
    (async () => {
      setTestUnReadReport(await fetchReport());
      setSubmittedWork(await fetchAccepted());
      setCurrentWorkList(await fetchWorkerCurrentWork(user.username));
    })();
  }, []);
  return (
    <div className="flex flex-col w-full h-[calc(100vh-100px)] rounded drop-shadow gap-2 overflow-hidden">
  <div className="w-full rounded drop-shadow">
    <Status role={user.role} company={user.client} />
  </div>

  {/* ตารางทั้งหมดจัดให้อยู่ในตาราง 2x2 */}
  <div className="grid grid-cols-2 grid-rows-2 gap-4 overflow-auto p-2">
    <div className="bg-white rounded shadow p-2">
      <DataTable
        tIcon="calendar-check"
        colIcon="calendar-check"
        tName="Current Work"
        title={["Serial", "Company", "Branch", "Date", "Time"]}
        data={currentWorkList}
        hasButton={false}
        itemPerPage={5} 
      />
    </div>

    <div className="bg-white rounded shadow p-2">
      <DataTable
        tIcon="wrench"
        colIcon="wrench"
        tName="Submitted Work"
        title={["Serial Number", "Worker Name", "Date", "Time"]}
        data={submittedWork}
        hasButton={false}
        itemPerPage={5}
      />
    </div>

    <div className="bg-white rounded shadow p-2 col-span-2">
      <DataTable
        colIcon="news"
        tIcon="news"
        tName="Report"
        title={["Serial Number", "Date & Time", "Problem"]}
        data={testUnReadReport}
        hasButton={false}
        itemPerPage={5}
      />
    </div>
  </div>
</div>

  );
};

export default DashboardAdmin;
