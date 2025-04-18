import React, { useEffect, useState } from "react";
import "./Status.css";
import "boxicons";
import {
  getAllItemCompanyCount,
  getAllLogReportPendingCount,
  getAllLogReportCount,
  getAllUserCount,
  getItemCompanyCount,
  getLogReportPendingCount,
  getUserCount,
  getBranchCount,
  getCompanyCount
} from "../Count.js";
import { getBadItemBranch, getNextCheck } from "../file.js";

const Status = ({ role, company, branch }) => {
  const [memberItemCount, setMemberItemCount] = useState(0);
  const [memberReportPendingCount, setMemberReportPendingCount] = useState(0);
  const [memberBadItemCount, setMemberBadItemCount] = useState(0);
  const [memberNextCheck, setMemberNextCheck] = useState("N/A");


  const [superMemberItemCount, setSuperMemberItemCount] = useState(0);
  const [superMemberReportPendingCount, setSuperMemberReportPendingCount] = useState(0);
  const [superMemberBadItemCount, setSuperMemberBadItemCount] = useState(0);

  const [adminItemCount, setAdminItemCount] = useState(0);
  const [adminReportPendingCount, setAdminReportPendingCount] = useState(0);
  const [adminBadItemCount, setAdminBadItemCount] = useState(0);
  const [adminTotalUser, adminSetTotalUser] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      if (role === "member") {


        const itemInBranchCountResponse = await fetch(`http://localhost:3000/item/getItemList/count/${company}/${branch}`);
        const itemInBranchCount = await itemInBranchCountResponse.text();
        setMemberItemCount(parseInt(itemInBranchCount));

        const reportPendingInBranchCountResponse = await fetch(`http://localhost:3000/report/getReportStatusByBranch/count/${company}/${branch}/pending`);
        const reportPendingInBranchCount = await reportPendingInBranchCountResponse.text();
        setMemberReportPendingCount(parseInt(reportPendingInBranchCount));

        const badItemInBranchCountResponse = await fetch(`http://localhost:3000/report/getReportStatusByBranch/count/${company}/${branch}/accepted`);
        const badItemInBranchCount = await badItemInBranchCountResponse.text();
        setMemberBadItemCount(parseInt(badItemInBranchCount));

        const nextCheckValue = await getNextCheck(company, branch);
        setNextCheck(0);


      }else if(role === "super_member"){


        const itemInBranchCountResponse = await fetch(`http://localhost:3000/item/getItemList/count/${company}${branch !== "All Branches" ? `/${branch}` : ""}`);
        const itemInBranchCount = await itemInBranchCountResponse.text();
        setSuperMemberItemCount(parseInt(itemInBranchCount));

        const reportPendingInBranchCountResponse = await fetch(`${ branch !== "All Branches" ? `http://localhost:3000/report/getReportStatusByBranch/count/${company}/${branch}/pending` : `http://localhost:3000/report/getReportStatusByCom/count/${company}/pending`}`);
        const reportPendingInBranchCount = await reportPendingInBranchCountResponse.text();
        setSuperMemberReportPendingCount(parseInt(reportPendingInBranchCount));

        const badItemInBranchCountResponse = await fetch(`${ branch !== "All Branches" ? `http://localhost:3000/report/getReportStatusByBranch/count/${company}/${branch}/accepted` : `http://localhost:3000/report/getReportStatusByCom/count/${company}/accepted`}`);
        const badItemInBranchCount = await badItemInBranchCountResponse.text();
        setSuperMemberBadItemCount(parseInt(badItemInBranchCount));


      }else if(role === "admin"){


        const itemInBranchCountResponse = await fetch(`http://localhost:3000/item/getAllItem/count`);
        const itemInBranchCount = await itemInBranchCountResponse.text();
        setAdminItemCount(parseInt(itemInBranchCount));

        const reportPendingInBranchCountResponse = await fetch(`http://localhost:3000/report/getAllReportByStatus/count/pending`);
        const reportPendingInBranchCount = await reportPendingInBranchCountResponse.text();
        setAdminReportPendingCount(parseInt(reportPendingInBranchCount));

        const badItemInBranchCountResponse = await fetch(`http://localhost:3000/report/getAllReportByStatus/count/accepted`);
        const badItemInBranchCount = await badItemInBranchCountResponse.text();
        setAdminBadItemCount(parseInt(badItemInBranchCount));

        const totalUserResponse = await fetch(`http://localhost:3000/users/getOperatorUser`);
        const totalUser = await totalUserResponse.json();
        adminSetTotalUser(totalUser.length);
      }
    };
    fetchData();
  }, [role, company, branch]);

  if (role === "member") {
    return (
      <div className="status-container flex w-full justify-between">
        <div className="flex justify-between items-center status-box bg-color-primary ">
          <div className="count-title p-1 m-1">
            <h3>Installed</h3>
            <h1>{memberItemCount}</h1>
          </div>
          <box-icon name="spray-can" color="white" size="lg"></box-icon>
        </div>
        <div className="flex justify-between items-center status-box">
          <div className="count-title p-1 m-1">
            <h3>Report Sent</h3>
            <h1>{memberReportPendingCount}</h1>
          </div>
          <box-icon name="send" color="white" size="lg"></box-icon>
        </div>
        <div className="flex justify-between items-center status-box">
          <div className="count-title p-1 m-1">
            <h3>Need Action</h3>
            <h1>{memberBadItemCount}</h1>
          </div>
          <box-icon name="wrench" color="white" size="lg"></box-icon>
        </div>
        <div className="flex justify-between items-center status-box">
          <div className="count-title p-1 m-1">
            <h3>Next Check</h3>
            <h1>{memberNextCheck}</h1>
          </div>
          <box-icon name="calendar" color="white" size="lg"></box-icon>
        </div>
      </div>
    );
  }

  if (role === "super_member") {
    return (
      <div className="status-container flex w-full justify-between">
        <div className="flex justify-between items-center status-box">
          <div className="count-title p-1 m-1">
            <h3>Total Item</h3>
            <h1>{superMemberItemCount}</h1>
          </div>
          <box-icon name="spray-can" color="white" size="lg"></box-icon>
        </div>
        <div className="flex justify-between items-center status-box">  
          <div className="count-title p-1 m-1"> 
            <h3>Report Sent</h3>
            <h1>{superMemberReportPendingCount}</h1>
          </div>
          <box-icon name="send" color="white" size="lg"></box-icon>
        </div>
        <div className="flex justify-between items-center status-box">
          <div className="count-title p-1 m-1">
            <h3>Need Action</h3>
            <h1>{superMemberBadItemCount}</h1>
          </div>
          <box-icon name="wrench" color="white" size="lg"></box-icon>
        </div>
      </div>

      
    );
  }

  if (role === "admin") {
    return (
      <div className="status-container flex w-full justify-between">
        <div className="flex justify-between items-center status-box">
          <div className="count-title p-1 m-1">
            <h3>Total Installed</h3>
            <h1>{adminItemCount}</h1>
          </div>
          <box-icon name="spray-can" color="white" size="lg"></box-icon>
        </div>
        <div className="flex justify-between items-center status-box">
          <div className="count-title p-1 m-1">
            <h3>Total Report</h3>
            <h1>{adminReportPendingCount}</h1>
          </div>
          <box-icon name="news" color="white" size="lg"></box-icon>
        </div>
        <div className="flex justify-between items-center status-box">
          <div className="count-title p-1 m-1">
            <h3>Need Action</h3>
            <h1>{adminBadItemCount}</h1>
          </div>  
          <box-icon name="wrench" color="white" size="lg"></box-icon>
        </div>
        <div className="flex justify-between items-center status-box">
          <div className="count-title p-1 m-1">
            <h3>Total User</h3>
            <h1>{adminTotalUser}</h1>
          </div>
          <box-icon name="user" color="white" size="lg"></box-icon>
        </div>
      </div>
    );
  }

  if (role === "super_admin") {
    return (
      <div className="status-container flex w-full justify-between">
        <div className="flex justify-between items-center status-box bg-secondary">
          <div className="count-title p-1 m-1">
            <h3>Total Installed</h3>
            <h1>{getAllItemCompanyCount()}</h1>
          </div>
          <box-icon name="spray-can" color="white" size="lg"></box-icon>
        </div>
        <div className="flex justify-between items-center status-box bg-accent">
          <div className="count-title p-1 m-1">
            <h3>Total Client</h3>
            <h1>{getCompanyCount()}</h1>
          </div>
          <box-icon name="buildings" color="white" size="lg"></box-icon>
        </div>
        <div className="flex justify-between items-center status-box bg-highlight">
          <div className="count-title p-1 m-1">
            <h3>Total User</h3>
            <h1>{getAllUserCount()}</h1>
          </div>
          <box-icon name="user" color="white" size="lg"></box-icon>
        </div>
        <div className="flex justify-between items-center status-box bg-error">
          <div className="count-title p-1 m-1">
            <h3>Total Actions</h3>
            <h1>{getAllLogReportPendingCount()}</h1>
          </div>  
          <box-icon name="wrench" color="white" size="lg"></box-icon>
        </div>
      </div>
    );
  }

  return null;
};

export default Status;
