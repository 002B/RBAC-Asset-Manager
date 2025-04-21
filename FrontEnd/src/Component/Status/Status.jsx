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
  useEffect(() => {
    const fetchData = async () => {
      if (role === "Member") {


        const itemInBranchCountResponse = await fetch(`http://localhost:3000/item/getItemList/count/${company}/${branch}`);
        const itemInBranchCount = await itemInBranchCountResponse.text();
        setMemberItemCount(parseInt(itemInBranchCount));

        const reportPendingInBranchCountResponse = await fetch(`http://localhost:3000/report/getReportStatusByBranch/count/${company}/${branch}/pending`);
        const reportPendingInBranchCount = await reportPendingInBranchCountResponse.text();
        setMemberReportPendingCount(parseInt(reportPendingInBranchCount));

        const badItemInBranchCountResponse = await fetch(`http://localhost:3000/report/getReportStatusByBranch/count/${company}/${branch}/accepted`);
        const badItemInBranchCount = await badItemInBranchCountResponse.text();
        setMemberBadItemCount(parseInt(badItemInBranchCount));

        const nextCheckResponse = await fetch(`http://localhost:3000/company/getNextCheck/${company}/${branch}`);
        const nextCheckValue = await nextCheckResponse.text();
        setMemberNextCheck(nextCheckValue.replace('"', "").replace('"', ""));


      }else if(role === "Super Member"){


        const branchURL = branch !== "All Branches" ? `/${branch}` : "";
        const itemInBranchCountResponse = await fetch(`http://localhost:3000/item/getItemList/count/${company}`);
        const itemInBranchCount = await itemInBranchCountResponse.text();
        setSuperMemberItemCount(parseInt(itemInBranchCount));

        const reportPendingInBranchCountResponse = await fetch(`${ branch !== "All Branches" ? `http://localhost:3000/report/getReportStatusByBranch/count/${company}/${branch}/pending` : `http://localhost:3000/report/getReportStatusByCom/count/${company}/pending`}`);
        const reportPendingInBranchCount = await reportPendingInBranchCountResponse.text();
        setSuperMemberReportPendingCount(parseInt(reportPendingInBranchCount));

        const badItemInBranchCountResponse = await fetch(`${ branch !== "All Branches" ? `http://localhost:3000/report/getReportStatusByBranch/count/${company}/${branch}/accepted` : `http://localhost:3000/report/getReportStatusByCom/count/${company}/accepted`}`);
        const badItemInBranchCount = await badItemInBranchCountResponse.text();
        setSuperMemberBadItemCount(parseInt(badItemInBranchCount));

        const totalUserResponse = await fetch(`http://localhost:3000/users/getUsersCount/${company}`);
        const totalUser = await totalUserResponse.text();
        setSuperMemberTotalUser(parseInt(totalUser));

        const branchResponse = await fetch(`http://localhost:3000/company/getAllBranch/${company}`);
        const branches = await branchResponse.json();
        setSuperMemberTotalBranch(branches.length);


      }else if(role === "Admin"){


        const itemInBranchCountResponse = await fetch(`http://localhost:3000/item/getAllItem/count`);
        const itemInBranchCount = await itemInBranchCountResponse.text();
        setAdminItemCount(parseInt(itemInBranchCount));

        const reportPendingInBranchCountResponse = await fetch(`http://localhost:3000/report/getAllReportByStatus/count/pending`);
        const reportPendingInBranchCount = await reportPendingInBranchCountResponse.text();
        setAdminReportPendingCount(parseInt(reportPendingInBranchCount));

        const badItemInBranchCountResponse = await fetch(`http://localhost:3000/report/getAllReportByStatus/count/accepted`);
        const badItemInBranchCount = await badItemInBranchCountResponse.text();
        setAdminBadItemCount(parseInt(badItemInBranchCount));

        const totalUserResponse = await fetch(`http://localhost:3000/users/getAllUsers`);
        const totalUser = await totalUserResponse.json();
        AdminSetTotalUser(totalUser.length);
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
