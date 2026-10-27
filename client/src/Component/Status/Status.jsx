import React, { useEffect, useState } from "react";
import useAnimatedNumber from "../useAnimatedNumber";
import "./Status.css";
import "boxicons";
import { API_URL } from "../../config/api";

const Status = ({ role, company, branch }) => {
  const [MemberItemCount, setMemberItemCount] = useState(0);
  const animatedMemberItemCount = useAnimatedNumber(MemberItemCount);
  
  const [MemberReportPendingCount, setMemberReportPendingCount] = useState(0);
  const animatedMemberReportPendingCount = useAnimatedNumber(MemberReportPendingCount);
  
  const [MemberBadItemCount, setMemberBadItemCount] = useState(0);
  const animatedMemberBadItemCount = useAnimatedNumber(MemberBadItemCount);

  const [MemberNextCheck, setMemberNextCheck] = useState("");

  const [superMemberItemCount, setSuperMemberItemCount] = useState(0);
  const animatedSuperMemberItemCount = useAnimatedNumber(superMemberItemCount);
  
  const [superMemberReportPendingCount, setSuperMemberReportPendingCount] = useState(0);
  const animatedSuperMemberReportPendingCount = useAnimatedNumber(superMemberReportPendingCount);
  
  const [superMemberBadItemCount, setSuperMemberBadItemCount] = useState(0);
  const animatedSuperMemberBadItemCount = useAnimatedNumber(superMemberBadItemCount);
  
  const [superMemberTotalUser, setSuperMemberTotalUser] = useState(0);
  const animatedSuperMemberTotalUser = useAnimatedNumber(superMemberTotalUser);
  
  const [superMemberTotalBranch, setSuperMemberTotalBranch] = useState(0);
  const animatedSuperMemberTotalBranch = useAnimatedNumber(superMemberTotalBranch);
  
  const [AdminItemCount, setAdminItemCount] = useState(0);
  const animatedAdminItemCount = useAnimatedNumber(AdminItemCount);
  
  const [AdminReportPendingCount, setAdminReportPendingCount] = useState(0);
  const animatedAdminReportPendingCount = useAnimatedNumber(AdminReportPendingCount);
  
  const [AdminBadItemCount, setAdminBadItemCount] = useState(0);
  const animatedAdminBadItemCount = useAnimatedNumber(AdminBadItemCount);
  
  const [AdminTotalUser, AdminSetTotalUser] = useState(0);
  const animatedAdminTotalUser = useAnimatedNumber(AdminTotalUser);

  const [superAdminItemCount, setSuperAdminItemCount] = useState(0);
  const animatedSuperAdminItemCount = useAnimatedNumber(superAdminItemCount);

  const [superAdminCompanyCount, setSuperAdminCompanyCount] = useState(0);
  const animatedSuperAdminCompanyCount = useAnimatedNumber(superAdminCompanyCount);

  const [superAdminTotalUser, setSuperAdminTotalUser] = useState(0);
  const animatedSuperAdminTotalUser = useAnimatedNumber(superAdminTotalUser);

  const [superAdminActionCount, setSuperAdminActionCount] = useState(0);
  const animatedSuperAdminActionCount = useAnimatedNumber(superAdminActionCount);

  

  const authHeaders = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (role === "Member" && branch !== "All Branches") {
          const itemInBranchCount = await fetch(`${API_URL}/item/getItemList/count/${company}/${branch}`, authHeaders);
          setMemberItemCount(parseInt(await itemInBranchCount.text()));

          const reportPendingCount = await fetch(`${API_URL}/report/getReportStatusByBranch/count/${company}/${branch}/pending`, authHeaders);
          setMemberReportPendingCount(parseInt(await reportPendingCount.text()));

          const badItemCount = await fetch(`${API_URL}/report/getReportStatusByBranch/count/${company}/${branch}/accepted`, authHeaders);
          setMemberBadItemCount(parseInt(await badItemCount.text()));

          const nextCheck = await fetch(`${API_URL}/company/getNextCheck/${company}/${branch}`, authHeaders);
          setMemberNextCheck((await nextCheck.text()).replace(/"/g, ""));
        }

        else if (role === "Super Member") {

          const itemInBranchCount = await fetch(`${API_URL}/item/getItemList/count/${company}`, authHeaders);
          setSuperMemberItemCount(parseInt(await itemInBranchCount.text()));

          const reportPendingURL = branch !== "All Branches"
            ? `${API_URL}/report/getReportStatusByBranch/count/${company}/${branch}/pending`
            : `${API_URL}/report/getReportStatusByCom/count/${company}/pending`;
          const reportPending = await fetch(reportPendingURL, authHeaders);
          setSuperMemberReportPendingCount(parseInt(await reportPending.text()));

          const badItemURL = branch !== "All Branches"
            ? `${API_URL}/report/getReportStatusByBranch/count/${company}/${branch}/accepted`
            : `${API_URL}/report/getReportStatusByCom/count/${company}/accepted`;
          const badItem = await fetch(badItemURL, authHeaders);
          setSuperMemberBadItemCount(parseInt(await badItem.text()));

          const totalUser = await fetch(`${API_URL}/users/getUsersCount/${company}`, authHeaders);
          setSuperMemberTotalUser(parseInt(await totalUser.text()));

          const branches = await fetch(`${API_URL}/company/getAllBranch/${company}`, authHeaders);
          setSuperMemberTotalBranch((await branches.json()).length);
        }

        else if (role === "Admin") {
          const itemCount = await fetch(`${API_URL}/item/getAllItem/count`, authHeaders);
          setAdminItemCount(parseInt(await itemCount.text()) || 0);

          const reportCount = await fetch(`${API_URL}/report/getAllReportByStatus/count/pending`, authHeaders);
          setAdminReportPendingCount(parseInt(await reportCount.text()) || 0);

          const badItemCount = await fetch(`${API_URL}/report/getAllReportByStatus/count/accepted`, authHeaders);
          setAdminBadItemCount(parseInt(await badItemCount.text()) || 0);

          const totalUsers = await fetch(`${API_URL}/users/getAllUsers`, authHeaders);
          const userData = await totalUsers.json();
          AdminSetTotalUser(Array.isArray(userData) ? userData.length : 0);
        }

        else if (role === "Super Admin") {
          const itemCount = await fetch(`${API_URL}/item/getAllItem/count`, authHeaders);
          setSuperAdminItemCount(parseInt(await itemCount.text()) || 0);

          const companyRes = await fetch(`${API_URL}/company/getAllCompany`, authHeaders);
          const companyData = await companyRes.json();
          setSuperAdminCompanyCount(Array.isArray(companyData) ? companyData.length : 0);

          const totalUsers = await fetch(`${API_URL}/users/getAllUsers`, authHeaders);
          const userData = await totalUsers.json();
          setSuperAdminTotalUser(Array.isArray(userData) ? userData.length : 0);

          const reportPending = await fetch(`${API_URL}/report/getAllReportByStatus/count/pending`, authHeaders);
          setSuperAdminActionCount(parseInt(await reportPending.text()) || 0);
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
            <h1>{animatedMemberItemCount}</h1>
          </div>
          <box-icon name="spray-can" color="white" size="lg"></box-icon>
        </div>
        <div className="flex justify-between items-center status-box bg-primary">
          <div className="count-title p-1 m-1">
            <h3>Report Sent</h3>
            <h1>{animatedMemberReportPendingCount}</h1>
          </div>
          <box-icon name="send" color="white" size="lg"></box-icon>
        </div>
        <div className="flex justify-between items-center status-box bg-secondary">
          <div className="count-title p-1 m-1">
            <h3>Need Action</h3>
            <h1>{animatedMemberBadItemCount}</h1>
          </div>
          <box-icon name="wrench" color="white" size="lg"></box-icon>
        </div>
        <div className="flex justify-between items-center status-box bg-primary">
          <div className="count-title p-1 m-1">
            <h3>Next Check</h3>
            <h1>{MemberNextCheck || "N/A"}</h1>
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
            <h1>{animatedSuperMemberItemCount}</h1>
          </div>
          <box-icon name="spray-can" color="white" size="lg"></box-icon>
        </div>
        <div className="flex justify-between items-center status-box bg-secondary">
          <div className="count-title p-1 m-1">
            <h3>Member</h3>
            <h1>{animatedSuperMemberTotalUser}</h1>
          </div>
          <box-icon name="user" color="white" size="lg"></box-icon>
        </div>
        <div className="flex justify-between items-center status-box bg-primary">
          <div className="count-title p-1 m-1">
            <h3>Branch</h3>
            <h1>{animatedSuperMemberTotalBranch}</h1>
          </div>
          <box-icon name="git-branch" color="white" size="lg"></box-icon>
        </div>
        <div className="flex justify-between items-center status-box bg-secondary">  
          <div className="count-title p-1 m-1"> 
            <h3>Report Sent</h3>
            <h1>{animatedSuperMemberReportPendingCount}</h1>
          </div>
          <box-icon name="send" color="white" size="lg"></box-icon>
        </div>
        <div className="flex justify-between items-center status-box bg-primary">
          <div className="count-title p-1 m-1">
            <h3>Need Action</h3>
            <h1>{animatedSuperMemberBadItemCount}</h1>
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
            <h1>{animatedAdminItemCount}</h1>
          </div>
          <box-icon name="spray-can" color="white" size="lg"></box-icon>
        </div>
        <div className="flex justify-between items-center status-box bg-secondary">
          <div className="count-title p-1 m-1">
            <h3>Total Report</h3>
            <h1>{animatedAdminReportPendingCount}</h1>
          </div>
          <box-icon name="news" color="white" size="lg"></box-icon>
        </div>
        <div className="flex justify-between items-center status-box bg-primary">
          <div className="count-title p-1 m-1">
            <h3>Need Action</h3>
            <h1>{animatedAdminBadItemCount}</h1>
          </div>  
          <box-icon name="wrench" color="white" size="lg"></box-icon>
        </div>
        <div className="flex justify-between items-center status-box bg-secondary">
          <div className="count-title p-1 m-1">
            <h3>Total User</h3>
            <h1>{animatedAdminTotalUser}</h1>
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
            <h1>{animatedSuperAdminItemCount}</h1>
          </div>
          <box-icon name="spray-can" color="white" size="lg"></box-icon>
        </div>
        <div className="flex justify-between items-center status-box bg-secondary">
          <div className="count-title p-1 m-1">
            <h3>Total Client</h3>
            <h1>{animatedSuperAdminCompanyCount}</h1>
          </div>
          <box-icon name="buildings" color="white" size="lg"></box-icon>
        </div>
        <div className="flex justify-between items-center status-box bg-primary">
          <div className="count-title p-1 m-1">
            <h3>Total User</h3>
            <h1>{animatedSuperAdminTotalUser}</h1>
          </div>
          <box-icon name="user" color="white" size="lg"></box-icon>
        </div>
        <div className="flex justify-between items-center status-box bg-secondary">
          <div className="count-title p-1 m-1">
            <h3>Total Actions</h3>
            <h1>{animatedSuperAdminActionCount}</h1>
          </div>  
          <box-icon name="wrench" color="white" size="lg"></box-icon>
        </div>
      </div>
    );
  }

  return null;
};

export default Status;
