// src/Component/Status/Status.jsx
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
  const [itemCount, setItemCount] = useState(0);
  const [badItemCount, setBadItemCount] = useState(0);
  const [reportPendingCount, setReportPendingCount] = useState(0);
  const [nextCheck, setNextCheck] = useState("N/A");

  useEffect(() => {
    const fetchData = async () => {
      if (role === "member") {
        const res = await fetch(`http://localhost:3000/item/getItemList/count/${company}/${branch}`);
        const count = await res.text();
        setItemCount(count);

        const badItems = await getBadItemBranch(company, branch);
        setBadItemCount(badItems.length);

        const reportCount = await getLogReportPendingCount(company);
        setReportPendingCount(reportCount);

        const nextCheckValue = await getNextCheck(company, branch);
        setNextCheck(nextCheckValue);
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
            <h1>{itemCount}</h1>
          </div>
          <box-icon name="spray-can" color="white" size="lg"></box-icon>
        </div>
        <div className="flex justify-between items-center status-box">
          <div className="count-title p-1 m-1">
            <h3>Need Action</h3>
            <h1>{badItemCount}</h1>
          </div>
          <box-icon name="wrench" color="white" size="lg"></box-icon>
        </div>
        <div className="flex justify-between items-center status-box">
          <div className="count-title p-1 m-1">
            <h3>Report Sent</h3>
            <h1>{reportPendingCount}</h1>
          </div>
          <box-icon name="send" color="white" size="lg"></box-icon>
        </div>
        <div className="flex justify-between items-center status-box">
          <div className="count-title p-1 m-1">
            <h3>Next Check</h3>
            <h1>{nextCheck}</h1>
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
            <h1>{getItemCompanyCount(company)}</h1>
          </div>
          <box-icon name="spray-can" color="white" size="lg"></box-icon>
        </div>
        <div className="flex justify-between items-center status-box">
          <div className="count-title p-1 m-1">
            <h3>Member</h3>
            <h1>{getUserCount(company)}</h1>
          </div>
          <box-icon name="user" color="white" size="lg"></box-icon>
        </div>
        <div className="flex justify-between items-center status-box">
          <div className="count-title p-1 m-1">
            <h3>Branch</h3>
            <h1>{getBranchCount(company)}</h1>
          </div>
          <box-icon name="git-branch" color="white" size="lg"></box-icon>
        </div>
        <div className="flex justify-between items-center status-box">  
          <div className="count-title p-1 m-1"> 
            <h3>Report Sent</h3>
            <h1>{getLogReportPendingCount(company)}</h1>
          </div>
          <box-icon name="send" color="white" size="lg"></box-icon>
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
            <h1>{getAllItemCompanyCount()}</h1>
          </div>
          <box-icon name="spray-can" color="white" size="lg"></box-icon>
        </div>
        <div className="flex justify-between items-center status-box">
          <div className="count-title p-1 m-1">
            <h3>Total Report</h3>
            <h1>{getAllLogReportCount()}</h1>
          </div>
          <box-icon name="news" color="white" size="lg"></box-icon>
        </div>
        <div className="flex justify-between items-center status-box">
          <div className="count-title p-1 m-1">
            <h3>Total User</h3>
            <h1>{getAllUserCount()}</h1>
          </div>
          <box-icon name="user" color="white" size="lg"></box-icon>
        </div>
        <div className="flex justify-between items-center status-box">
          <div className="count-title p-1 m-1">
            <h3>Total Actions</h3>
            <h1>{getAllLogReportPendingCount()}</h1>
          </div>  
          <box-icon name="wrench" color="white" size="lg"></box-icon>
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
