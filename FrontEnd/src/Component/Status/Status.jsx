import React, { useEffect, useState } from "react";
import "./Status.css";
import "boxicons";

const Status = ({ role, company, branch }) => {
  const [MemberItemCount, setMemberItemCount] = useState(0);
  const [MemberReportPendingCount, setMemberReportPendingCount] = useState(0);
  const [MemberBadItemCount, setMemberBadItemCount] = useState(0);
  const [MemberNextCheck, setMemberNextCheck] = useState("N/A");

  const [superMemberItemCount, setSuperMemberItemCount] = useState(0);
  const [superMemberReportPendingCount, setSuperMemberReportPendingCount] = useState(0);
  const [superMemberBadItemCount, setSuperMemberBadItemCount] = useState(0);
  const [superMemberTotalUser, setSuperMemberTotalUser] = useState(0);
  const [superMemberTotalBranch, setSuperMemberTotalBranch] = useState(0);

  const [AdminItemCount, setAdminItemCount] = useState(0);
  const [AdminReportPendingCount, setAdminReportPendingCount] = useState(0);
  const [AdminBadItemCount, setAdminBadItemCount] = useState(0);
  const [AdminTotalUser, AdminSetTotalUser] = useState(0);

  const authHeaders = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (role === "Member" && branch !== "All Branches") {
          const itemInBranchCount = await fetch(`http://localhost:3000/item/getItemList/count/${company}/${branch}`, authHeaders);
          setMemberItemCount(parseInt(await itemInBranchCount.text()));

          const reportPendingCount = await fetch(`http://localhost:3000/report/getReportStatusByBranch/count/${company}/${branch}/pending`, authHeaders);
          setMemberReportPendingCount(parseInt(await reportPendingCount.text()));

          const badItemCount = await fetch(`http://localhost:3000/report/getReportStatusByBranch/count/${company}/${branch}/accepted`, authHeaders);
          setMemberBadItemCount(parseInt(await badItemCount.text()));

          const nextCheck = await fetch(`http://localhost:3000/company/getNextCheck/${company}/${branch}`, authHeaders);
          setMemberNextCheck((await nextCheck.text()).replace(/"/g, ""));
        }

        else if (role === "Super Member") {

          const itemInBranchCount = await fetch(`http://localhost:3000/item/getItemList/count/${company}`, authHeaders);
          setSuperMemberItemCount(parseInt(await itemInBranchCount.text()));

          const reportPendingURL = branch !== "All Branches"
            ? `http://localhost:3000/report/getReportStatusByBranch/count/${company}/${branch}/pending`
            : `http://localhost:3000/report/getReportStatusByCom/count/${company}/pending`;
          const reportPending = await fetch(reportPendingURL, authHeaders);
          setSuperMemberReportPendingCount(parseInt(await reportPending.text()));

          const badItemURL = branch !== "All Branches"
            ? `http://localhost:3000/report/getReportStatusByBranch/count/${company}/${branch}/accepted`
            : `http://localhost:3000/report/getReportStatusByCom/count/${company}/accepted`;
          const badItem = await fetch(badItemURL, authHeaders);
          setSuperMemberBadItemCount(parseInt(await badItem.text()));

          const totalUser = await fetch(`http://localhost:3000/users/getUsersCount/${company}`, authHeaders);
          setSuperMemberTotalUser(parseInt(await totalUser.text()));

          const branches = await fetch(`http://localhost:3000/company/getAllBranch/${company}`, authHeaders);
          setSuperMemberTotalBranch((await branches.json()).length);
        }

        else if (role === "Admin") {
          const itemCount = await fetch(`http://localhost:3000/item/getAllItem/count`, authHeaders);
          setAdminItemCount(parseInt(await itemCount.text()));

          const reportCount = await fetch(`http://localhost:3000/report/getAllReportByStatus/count/pending`, authHeaders);
          setAdminReportPendingCount(parseInt(await reportCount.text()));

          const badItemCount = await fetch(`http://localhost:3000/report/getAllReportByStatus/count/accepted`, authHeaders);
          setAdminBadItemCount(parseInt(await badItemCount.text()));

          const totalUsers = await fetch(`http://localhost:3000/users/getAllUsers`, authHeaders);
          AdminSetTotalUser((await totalUsers.json()).length);
        }
      } catch (error) {
        console.error("Fetch error in Status component:", error);
      }
    };

    fetchData();
  }, [role, company, branch]);

  if (role === "Member") {
    return (
      <div className="status-container flex w-full justify-between">
        <div className="flex justify-between items-center status-box bg-primary ">
          <div className="count-title p-1 m-1">
            <h3>Installed</h3>
            <h1>{MemberItemCount}</h1>
          </div>
          <box-icon name="spray-can" color="white" size="lg"></box-icon>
        </div>
        <div className="flex justify-between items-center status-box bg-primary">
          <div className="count-title p-1 m-1">
            <h3>Report Sent</h3>
            <h1>{MemberReportPendingCount}</h1>
          </div>
          <box-icon name="send" color="white" size="lg"></box-icon>
        </div>
        <div className="flex justify-between items-center status-box bg-secondary">
          <div className="count-title p-1 m-1">
            <h3>Need Action</h3>
            <h1>{MemberBadItemCount}</h1>
          </div>
          <box-icon name="wrench" color="white" size="lg"></box-icon>
        </div>
        <div className="flex justify-between items-center status-box bg-primary">
          <div className="count-title p-1 m-1">
            <h3>Next Check</h3>
            <h1>{MemberNextCheck}</h1>
          </div>
          <box-icon name="calendar" color="white" size="lg"></box-icon>
        </div>
      </div>
    );
  }

  if (role === "Super Member") {
    return (
      <div className="status-container flex w-full justify-between">
        <div className="flex justify-between items-center status-box bg-primary">
          <div className="count-title p-1 m-1">
            <h3>Total Item</h3>
            <h1>{superMemberItemCount}</h1>
          </div>
          <box-icon name="spray-can" color="white" size="lg"></box-icon>
        </div>
        <div className="flex justify-between items-center status-box bg-secondary">
          <div className="count-title p-1 m-1">
            <h3>Member</h3>
            <h1>{superMemberTotalUser}</h1>
          </div>
          <box-icon name="user" color="white" size="lg"></box-icon>
        </div>
        <div className="flex justify-between items-center status-box bg-primary">
          <div className="count-title p-1 m-1">
            <h3>Branch</h3>
            <h1>{superMemberTotalBranch}</h1>
          </div>
          <box-icon name="git-branch" color="white" size="lg"></box-icon>
        </div>
        <div className="flex justify-between items-center status-box bg-secondary">  
          <div className="count-title p-1 m-1"> 
            <h3>Report Sent</h3>
            <h1>{superMemberReportPendingCount}</h1>
          </div>
          <box-icon name="send" color="white" size="lg"></box-icon>
        </div>
        <div className="flex justify-between items-center status-box bg-primary">
          <div className="count-title p-1 m-1">
            <h3>Need Action</h3>
            <h1>{superMemberBadItemCount}</h1>
          </div>
          <box-icon name="wrench" color="white" size="lg"></box-icon>
        </div>
      </div>

      
    );
  }

  if (role === "Admin") {
    return (
      <div className="status-container flex w-full justify-between">
        <div className="flex justify-between items-center status-box bg-primary">
          <div className="count-title p-1 m-1">
            <h3>Total Installed</h3>
            <h1>{AdminItemCount}</h1>
          </div>
          <box-icon name="spray-can" color="white" size="lg"></box-icon>
        </div>
        <div className="flex justify-between items-center status-box bg-secondary">
          <div className="count-title p-1 m-1">
            <h3>Total Report</h3>
            <h1>{AdminReportPendingCount}</h1>
          </div>
          <box-icon name="news" color="white" size="lg"></box-icon>
        </div>
        <div className="flex justify-between items-center status-box bg-primary">
          <div className="count-title p-1 m-1">
            <h3>Need Action</h3>
            <h1>{AdminBadItemCount}</h1>
          </div>  
          <box-icon name="wrench" color="white" size="lg"></box-icon>
        </div>
        <div className="flex justify-between items-center status-box bg-secondary">
          <div className="count-title p-1 m-1">
            <h3>Total User</h3>
            <h1>{AdminTotalUser}</h1>
          </div>
          <box-icon name="user" color="white" size="lg"></box-icon>
        </div>
      </div>
    );
  }

  if (role === "Super Admin") {
    return (
      <div className="status-container flex w-full justify-between">
        <div className="flex justify-between items-center status-box bg-primary">
          <div className="count-title p-1 m-1">
            <h3>Total Installed</h3>
            <h1>{getAllItemCompanyCount()}</h1>
          </div>
          <box-icon name="spray-can" color="white" size="lg"></box-icon>
        </div>
        <div className="flex justify-between items-center status-box bg-secondary">
          <div className="count-title p-1 m-1">
            <h3>Total Client</h3>
            <h1>{getCompanyCount()}</h1>
          </div>
          <box-icon name="buildings" color="white" size="lg"></box-icon>
        </div>
        <div className="flex justify-between items-center status-box bg-primary">
          <div className="count-title p-1 m-1">
            <h3>Total User</h3>
            <h1>{getAllUserCount()}</h1>
          </div>
          <box-icon name="user" color="white" size="lg"></box-icon>
        </div>
        <div className="flex justify-between items-center status-box bg-secondary">
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
