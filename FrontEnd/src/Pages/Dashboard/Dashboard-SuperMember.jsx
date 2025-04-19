import { useState, useEffect } from "react";
import "boxicons";
import Status from "../../Component/Status/Status";
import DataTable from "../../Component/DataTable/DataTable";
import "../../Component/DataTable/DataTable.css";
import CreateForm from "../../Component/CreateForm";
import { useAuth } from "../../Auth/AuthProvider";

const fetchInbox = async (user) => {
  try {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    const url = user.selectedBranch === "All Branches" || !user.selectedBranch
      ? `http://localhost:3000/report/getReportByCom/${user.company}`
      : `http://localhost:3000/report/getReportByBranch/${user.company}/${user.selectedBranch}`;
    const response = await fetch(url, requestOptions);
    const data = await response.json();
    return data.map((item) => [item.report_id, item.item_id, item.createAt, item.status]);
  } catch (error) {
    console.error("Error fetching inbox data:", error);
    return [];
  }
};

const fetchLoginActivity = async () => {
  try {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    const response = await fetch("http://localhost:3000/activitylog/login-logout", requestOptions);
    const data = await response.json();
    return data.map((item) => [
      item.activity === "Log in" ? (
        <box-icon name="log-in-circle" color="green" size="sm"></box-icon>
      ) : (
        <box-icon name="log-out-circle" color="red" size="sm"></box-icon>
      ),
      item.display_name,
      `${item.date} ${item.time}`,
    ]);
  } catch (error) {
    console.error("Error fetching login activity:", error);
    return [];
  }
};

async function fetchBranchWithItemCount(user) {
  try {
    const branchResponse = await fetch(`http://localhost:3000/company/getAllBranch/${user.company}`, {
      method: "GET",
      redirect: "follow",
    });
    const branches = await branchResponse.json();

    const branchWithCounts = await Promise.all(
      branches.map(async (branch) => {
        try {
          const itemRes = await fetch(
            `http://localhost:3000/item/getItemList/count/${user.company}/${branch.client_branch_id}`,
            {
              method: "GET",
              redirect: "follow",
            }
          );
          const itemCount = await itemRes.text();
          return [branch.client_branch_id, itemCount];
        } catch (err) {
          console.error(`Error fetching count for ${branch.client_branch_id}`, err);
          return [branch.client_branch_id, "Error"];
        }
      })
    );

    return branchWithCounts;
  } catch (error) {
    console.error("Error fetching branches:", error);
    return [];
  }
}


const DashboardSuperMember = () => {
  const { user } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [testActivity, setTestActivity] = useState([]);
  const [loginActivity, setLoginActivity] = useState([]);
  const [branchList, setBranchList] = useState([]);
  useEffect(() => {
    (async () => {
      // user.selectedBranch ? user.selectedBranch : user.selectedBranch = user.branch[0];
      setTestActivity(await fetchInbox(user));
      setLoginActivity(await fetchLoginActivity());
      setBranchList(await fetchBranchWithItemCount(user));
    })();
  }, [user.company, user.selectedBranch]);

  const handleButtonClick = () => {
    setShowCreateForm(true);
  };

  return (
    <div className="flex flex-col w-full h-fit rounded drop-shadow">
      <div className="w-full rounded drop-shadow">
        <Status
          role={user.role}
          company={user.company}
          branch={user.selectedBranch ? user.selectedBranch : "All Branches"}
        /></div>
      <div className="dashboard-container flex w-full rounded drop-shadow mt-4">
        <div className="big-item">
          <div className="small-item-wrapper">
            <div className="small-item h-fit">
              <DataTable
                tIcon="revision"
                colIcon="send"
                tName="Report Activity"
                title={["Report ID", "Item ID", "Time", "Status"]}
                data={testActivity}
                hasButton={false}
                itemPerPage={4}
                hasSearch={false}
              />
            </div>
          </div>
          <div className="small-item-wrapper">
            <div className="small-item">
              <DataTable
                tIcon="user"
                tName="Login Activity"
                title={["", "User", "Time"]}
                data={loginActivity}
                hasButton={false}
                itemPerPage={4}
                hasSearch={false}
              />
            </div>
            <div className="small-item flex flex-col justify-center items-center gap-4">
              <span className="report-icon">
                <box-icon name="comment-error" size="6rem" color="#ff6700"></box-icon>
              </span>
              <div className="flex flex-col justify-center items-center">
                <h2 className="text-dark">Send Request</h2>
                <span className="text-gray">Having problems with our product?</span>
                <span className="text-gray">Send us request for an action</span>
              </div>
              <div>
                <button
                  className="send-button flex justify-center items-center bg-secondary p-2"
                  onClick={handleButtonClick}
                >
                  <span className="mr-2 text-white">Send</span>
                  <box-icon color="white" name="send"></box-icon>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="long-item">
          <DataTable
            colIcon="buildings"
            tIcon="buildings"
            tName="Branch"
            title={["Branch", <box-icon name="spray-can" size="sm" color="#16425b"></box-icon>]}
            data={branchList}
            hasButton={false}
            itemPerPage={10}
          />
        </div>
      </div>
      {showCreateForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur">
          <div
            className="absolute inset-0"
            onClick={() => setShowCreateForm(false)}
          ></div>
          <CreateForm
            data={["Name", "Company", "Subject", "Problems", "File", "Submit"]}
            placeholderData={{ Name: user.display_name, Company: user.company }}
          />
        </div>
      )}
    </div>
  );
};

export default DashboardSuperMember;


