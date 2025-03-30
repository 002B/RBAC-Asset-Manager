import { useState } from "react";
import "./Dashboard.css";
import DataTable from "../../Component/DataTable/DataTable";
import CreateForm from "../../Component/CreateForm";
import Status from "../../Component/Status/Status";
import { useAuth } from "../../Auth/AuthProvider";
import { getItemBranch } from "../../Component/file";
const DashboardMember = () => {
  const {user} = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleButtonClick = () => {
    // setShowCreateForm(!showCreateForm);
    setShowCreateForm(true);
  };

  const testActivity = [
    [
      "Install",
      "22/11/2022",
      "14:32:45",
    ],
    [
      "Install",
      "22/11/2022",
      "14:31:45",
    ],
    [
      "Uninstall",
      "22/11/2022",
      "14:30:45",
    ],
    [
      "Change",
      "22/11/2022",
      "14:29:45",
    ],
    [
      "Change",
      "22/11/2022",
      "14:22:45",
    ],
    [
      "Install",
      "22/11/2022",
      "13:32:45",
    ],
    [
      "Uninstall",
      "22/11/2022",
      "12:32:45",
    ],
    [
      "Change",
      "22/11/2022",
      "14:24:45",
    ],
  ];

  const testInbox = [
    [
      "New Changes",
      "22/11/2022",
    ],
    [
      "Report Accepted",
      "22/11/2022",
    ],
    [
      "Report Accepted",
      "15/11/2022",
    ],
    [
      "Report Accepted",
      "08/11/2022",
    ],
    [
      "New Changes",
      "22/11/2022",
    ],
    [
      "New Changes",
      "22/11/2022",
    ],
    [
      "Report Accepted",
      "08/11/2022",
    ],
    [
      "Report Accepted",
      "08/11/2022",
    ],
  ];

  const rawInventory = getItemBranch(user.company, user.selectedBranch);

  const inventory = Object.entries(rawInventory).map(([key, details]) => {
    return [
      key,
      details.location,
      details.status,
    ];
  });

  const testCheckUp = [
    [
      "22/11/2022",
      "2022/4 Check Up",
    ],
    [
      "22/08/2022",
      "2022/3 Check Up",
    ],
    [
      "22/05/2022",
      "2022/2 Check Up",
    ],
    [
      "22/02/2022",
      "2022/1 Check Up",
    ],
  ];

  return (
    <div className="flex flex-col w-full rounded drop-shadow">
      <div className="w-full rounded drop-shadow">
        {Status(user.role, user.company, user.selectedBranch)}
      </div>
      <div className=" dashboard-container flex w-full rounded drop-shadow mt-4">
        <div className="big-item">
          <div className="small-item-wrapper">
          <div className="small-item h-fit">
            <DataTable
              tIcon="revision"
              tName={"Recent Activity"}
              colIcon= {"import"}
              title={["Activity", "Date", "Time"]}
              data={testActivity}
              hasButton={false}
              itemPerPage={4}
              hasSearch={false}
            ></DataTable>
          </div>
          <div className="small-item h-fit">
            <DataTable
              tIcon="message"
              colIcon={"news"}
              tName={"Inbox"}
              title={["Notes", "Time"]}
              data={testInbox}
              hasButton={false}
              itemPerPage={4}
              hasSearch={false}
            ></DataTable>
          </div>
          </div>
          <div className="small-item-wrapper">
          <div className="small-item">
            <div className="countdown w-full flex justify-center items-center flex-col gap-2">
              <div className="flex justify-center items-center">
                <box-icon name="timer" color="#f16e3d" size="lg"></box-icon>
                <h1 className="text-primary">58</h1>
              </div>
              <span className="flex justify-center items-end">
                <h2> Days </h2>
                <h4 className="ml-2"> until next Check Up</h4>
              </span>
            </div>
            <DataTable
              title={[ "", ""]}
              colIcon={"check-square"}
              data={testCheckUp}
              hasButton={false}
              hasPagination={false}
              itemPerPage={4}
              hasSearch={false}
            />
          </div>
          <div className="small-item flex flex-col justify-center items-center gap-4">
            <span className="report-icon">
                <box-icon name="comment-error" size="6rem" color="#f16e3d" ></box-icon>
            </span>
            <div className="flex flex-col justify-center items-center">
                <h2>Send Request</h2>
                <span className="text-gray">Having problems with our product?</span>
                <span className="text-gray">Send us request for an action</span>
            </div>
            <div>
                <button className="send-button flex justify-center items-center bg-secondary p-2" onClick={handleButtonClick}><span className="mr-2 text-white">Send </span><box-icon color="white" name="send"></box-icon></button>
            </div>
          </div>
          </div>
        </div>
        <div className="long-item">
          <DataTable
            tIcon={"spray-can"}
            tName={"Inventory"}
            colIcon={"spray-can"}
            title={["Serial Number", "Location", "Status"]}
            data={inventory}
            hasButton={false}
            itemPerPage={10}
            hasSearch={false}
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
            data={["Name", "Company", "Subject", "Problems" , "File", "Submit"]}
            placeholderData={{Name: user.display_name, Company: user.company}}
          />
        </div>
      )}
    </div>
  );
};

export default DashboardMember;
