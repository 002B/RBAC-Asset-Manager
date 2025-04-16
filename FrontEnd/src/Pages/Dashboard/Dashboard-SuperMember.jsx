import { useState, useEffect } from "react";
import "boxicons";
import Status from "../../Component/Status/Status";
import DataTable from "../../Component/DataTable/DataTable";
import "../../Component/DataTable/DataTable.css";
import CreateForm from "../../Component/CreateForm";
import { useAuth } from "../../Auth/AuthProvider";

// Fetch activity data for the member
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
    return data.map((item) => [item.item_id, item.createAt]);
  } catch (error) {
    console.error("Error fetching inbox data:", error);
    return [];
  }
};

// Fetch login activity data from the API
const fetchLoginActivity = async () => {
  try {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    const response = await fetch("http://localhost:3000/activityLog/all", requestOptions);
    const data = await response.json();
    // Format the data for the table (each entry: [icon, username, date])
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

const testBranch = []; // You can replace this with real branch data
const testTitle = ["Branch", <box-icon name="spray-can" size="sm" color="#473366"></box-icon>];

const DashboardSuperMember = () => {
  const { user } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [testActivity, setTestActivity] = useState([]);
  const [loginActivity, setLoginActivity] = useState([]);

  useEffect(() => {
    (async () => {
      // Fetch activity data
      setTestActivity(await fetchInbox(user));
      // Fetch login activity data
      setLoginActivity(await fetchLoginActivity());
    })();
  }, [user.company, user.selectedBranch]); // Re-fetch when company or branch changes

  const handleButtonClick = () => {
    setShowCreateForm(true);
  };

  return (
    <div className="flex flex-col w-full h-fit rounded drop-shadow">
      <div className="w-full rounded drop-shadow">
        {Status(user.selectedRole, user.company, user.selectedBranch)}
      </div>
      <div className="dashboard-container flex w-full rounded drop-shadow mt-4">
        <div className="big-item">
          <div className="small-item-wrapper">
            <div className="small-item h-fit">
              <DataTable
                tIcon="revision"
                colIcon="send"
                tName="Recent Activity"
                title={["Activity", "Time"]}
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
                data={loginActivity}  // Display the login activity here
                hasButton={false}
                itemPerPage={4}
                hasSearch={false}
              />
            </div>
            <div className="small-item flex flex-col justify-center items-center gap-4">
              <span className="report-icon">
                <box-icon name="comment-error" size="6rem" color="#f16e3d"></box-icon>
              </span>
              <div className="flex flex-col justify-center items-center">
                <h2>Send Request</h2>
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
            title={testTitle}
            data={testBranch}
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
