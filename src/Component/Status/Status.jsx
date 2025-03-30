import React from "react";
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
  getItemBranchCount,
  getLogReportAcceptedCount,
  getCompanyCount
} from "../Count.js";
import { getBadItemBranch, getItemBranch, getNextCheck } from "../file.js";

const Status = (role,company,branch) => {

  if (role === "member") {
    return (
      <div className="status-container flex w-full justify-between">
        <div className="flex justify-between items-center status-box">
          <div className="count-title p-1 m-1">
            <h3>Installed</h3>
            <h1>{getItemBranchCount(company,branch)}</h1>
          </div>
          <box-icon name="spray-can" color="white" size="lg"></box-icon>
        </div>
        <div className="flex justify-between items-center status-box">
          <div className="count-title p-1 m-1">
            <h3>Need Action</h3>
            <h1>{(getBadItemBranch(company, branch)).length}</h1>
          </div>
          <box-icon name="wrench" color="white" size="lg"></box-icon>
        </div>
        <div className="flex justify-between items-center status-box">
          <div className="count-title p-1 m-1">
            <h3>Report Sent</h3>
            <h1>{getLogReportPendingCount(company)}</h1>
          </div>
          <box-icon name="send" color="white" size="lg"></box-icon>
        </div>
        <div className="flex justify-between items-center status-box">
          <div className="count-title p-1 m-1">
            <h3>Next Check</h3>
            <h1>{getNextCheck(company,branch)}</h1>
          </div>
          <box-icon name="calendar" color="white" size="lg"></box-icon>
        </div>
      </div>
    )
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
    )
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
    )
  }

  if (role === "super_admin") {
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
            <h3>Total Client</h3>
            <h1>{getCompanyCount()}</h1>
          </div>
          <box-icon name="buildings" color="white" size="lg"></box-icon>
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
    )
  }



  // return (
  //   <div className="status-container flex w-full justify-between">
  //     <div className="flex justify-between items-center status-box">
  //       <div className="count-title p-1 m-1">
  //         {role === "member" ? <h3>Installed</h3> : role === "super_member" ? <h3>Total Item</h3> : role === "admin" || "super_admin" ? <h3>Installed</h3> : <h3></h3>}
  //         {role === "member" ? getItemBranchCount(company, branch) : role === "super_member" ? getItemCompanyCount(company) : role === "admin" || "super_admin" ? getAllItemCompanyCount() : <h3></h3>}
  //       </div>
  //       <box-icon name={role === "member" || "super_member" ? "spray-can" : role === "admin" || "super_admin" ? "spray-can" : "question-mark"} color="white" size="lg"></box-icon>
  //     </div>
  //     <div className="flex justify-between items-center status-box">
  //       <div className="count-title p-1 m-1">
  //         {role === "member" ? <h3>Need Action</h3> : role === "super_member" ? <h3>Member</h3> : role === "admin" || "super_admin" ? <h3>All Action</h3> : <h3></h3>}
  //         {role === "member" ? getLogReportPendingCount(company) : role === "super_member" ? getUserCount(company) : role === "admin" || "super_admin" ? getAllLogReportCount() : <h3></h3>}
  //       </div>
  //       <box-icon name={role === "member" ? "wrench" : role === "super_member" ? "user" : role === "admin" || "super_admin" ? "wrench" : "question-mark"} color="white" size="lg"></box-icon>
  //     </div>
  //     <div className="flex justify-between items-center status-box">
  //       <div className="count-title p-1 m-1">
  //         {role === "member" ? <h3>Report Sent</h3> : role === "super_member" ? <h3>Branch</h3> : role === "admin" || "super_admin" ? <h3>All Request</h3> : <h3></h3>}
  //         {role === "member" ? getLogReportAcceptedCount(company) : role === "super_member" ? getBranchCount(company) : role === "admin" || "super_admin" ? getAllLogReportPendingCount() : <h3></h3>}
  //       </div>
  //       <box-icon name={role === "member" ? "send" : role === "super_member" ? "git-branch" : role === "admin" || "super_admin" ? "news" : "question-mark"} color="white" size="lg"></box-icon>
  //     </div>
  //     <div className="flex justify-between items-center status-box">
  //       <div className="count-title p-1 m-1">
  //         {role === "member" ? <h3>Next Check</h3> : role === "super_member" ? <h3>Report Sent</h3> : role === "admin" || "super_admin" ? <h3>All Member</h3> : <h3></h3>}
  //         {role === "member" ? getNextCheck(company,branch) : role === "super_member" ? getLogReportPendingCount(company) : role === "admin" || "super_admin" ? getAllUserCount() : <h3></h3>}
  //       </div>
  //       <box-icon name={role === "member" ? "calendar" : role === "super_member" ? "send" : role === "admin" || "super_admin" ? "user" : "question-mark"} color="white" size="lg"></box-icon>
  //     </div>
  //   </div>
  // );
};

export default Status;
