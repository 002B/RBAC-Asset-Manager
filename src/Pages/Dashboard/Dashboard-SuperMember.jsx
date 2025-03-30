import { useState } from "react";
import "boxicons";
import Status from "../../Component/Status/Status";
import DataTable from "../../Component/DataTable/DataTable";
import "../../Component/DataTable/DataTable.css";
import CreateForm from "../../Component/CreateForm";
import { useAuth } from "../../Auth/AuthProvider";
import boxicons from "boxicons";

const testActivity = [
  ["Central Ladprao sent a request", "22/11/2022"],
  ["Rama II sent a request", "22/11/2022"],
  ["Sukhumvit sent a request", "22/11/2022"],
  ["Bang Kapi sent a request", "22/11/2022"],
  ["Bang Kapi sent a request", "21/11/2022"],
  ["Sukhumvit sent a request", "21/11/2022"],
  ["Sukhumvit sent a request", "20/11/2022"],
  ["Bang Kapi sent a request", "20/11/2022"],
  ["Rama IX sent a request", "19/11/2022"],
  ["Central Ladprao sent a request", "19/11/2022"],
  ["Central Ladprao sent a request", "18/11/2022"],
  ["Rama II sent a request", "17/11/2022"],
  ["Rama II sent a request", "16/11/2022"],
  ["Central Ladprao sent a request", "15/11/2022"],
];

const testBranch = [
  ["Ratchayothin", 69],
  ["Siam square", 34],
  ["Sukhumvit", 54],
  ["Rama II", 204],
  ["Suksawad", 33],
  ["Phra pradaeng", 4],
  ["Chok chai", 78],
  ["Bang ken", 4444],
  ["Rang-sit", 94],
  ["Rama IX", 94],
  ["Suksawad", 33],
  ["Phra pradaeng", 4],
  ["Chok chai", 78],
  ["Bang ken", 4444],
  ["Rang-sit", 94],
  ["Rama IX", 94],
  ["Ratchayothin", 69],
  ["Siam square", 34],
  ["Sukhumvit", 54],
  ["Rama II", 204],
  ["Suksawad", 33],
  ["Phra pradaeng", 4],
  ["Chok chai", 78],
];

const testOnlineUser = [
  [
    <box-icon name="log-in-circle" color="green" size="sm"></box-icon>,
    "Tararus Muraba",
    "14/11/2022 19:45:32",
  ],
  [
    <box-icon name="log-out-circle" color="red" size="sm"></box-icon>,
    "Tararus Muraba",
    "14/11/2022 18:45:32",
  ],
  [
    <box-icon name="log-in-circle" color="green" size="sm"></box-icon>,
    "Tararus Muraba",
    "13/11/2022 17:45:32",
  ],
  [
    <box-icon name="log-out-circle" color="red" size="sm"></box-icon>,
    "Tararus Muraba",
    "12/11/2022 16:45:32",
  ],
  [
    <box-icon name="log-in-circle" color="green" size="sm"></box-icon>,
    "Tararus Muraba",
    "11/11/2022 15:45:32",
  ],
  [
    <box-icon name="log-out-circle" color="red" size="sm"></box-icon>,
    "Tararus Muraba",
    "10/11/2022 14:45:32",
  ],
  [
    <box-icon name="log-in-circle" color="green" size="sm"></box-icon>,
    "Tararus Muraba",
    "9/11/2022 13:45:32",
  ],
  [
    <box-icon name="log-out-circle" color="red" size="sm"></box-icon>,
    "Tararus Muraba",
    "8/11/2022 12:45:32",
  ],
  [
    <box-icon name="log-in-circle" color="green" size="sm"></box-icon>,
    "Tararus Muraba",
    "7/11/2022 11:45:32",
  ],
  [
    <box-icon name="log-out-circle" color="red" size="sm"></box-icon>,
    "Tararus Muraba",
    "6/11/2022 10:45:32",
  ],
];

const testInbox = [
  ["New changes", "22/11/2022"],
  ["Report Accepted", "22/11/2022"],
  ["Report Accepted", "22/11/2022"],
  ["Report Accepted", "22/11/2022"],
  ["Report Accepted ", "22/11/2022"],
];

const testTitle = [
  "Branch",
  <box-icon name="spray-can" size="sm" color="#473366"></box-icon>,
];
const DashboardSuperMember = () => {
  const { user } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleButtonClick = () => {
    setShowCreateForm(true);
  };

  return (
    <div className="flex flex-col w-full h-fit rounded drop-shadow">
      <div className="w-full rounded drop-shadow">
        {Status(user.selectedRole, user.company, user.selectedBranch)}
      </div>
      <div className=" dashboard-container flex w-full rounded drop-shadow mt-4">
        <div className="big-item">
          <div className="small-item-wrapper">
            <div className="small-item h-fit">
              <DataTable
                tIcon="revision"
                colIcon={"send"}
                tName={"Recent Activity"}
                title={["Activity", "Time"]}
                data={testActivity}
                hasButton={false}
                itemPerPage={4}
                hasSearch={false}
              ></DataTable>
            </div>
            <div className="small-item h-fit">
              <DataTable
                tIcon="message"
                colIcon={"receipt"}
                tName={"Inbox"}
                title={["Notes", "Date"]}
                data={testInbox}
                hasButton={false}
                itemPerPage={4}
                hasSearch={false}
              ></DataTable>
            </div>
          </div>
          <div className="small-item-wrapper">
            <div className="small-item">
              <DataTable
                tIcon="user"
                tName={"Login Activity"}
                title={["", "User", "Time"]}
                data={testOnlineUser}
                hasButton={false}
                itemPerPage={4}
                hasSearch={false}
              />
            </div>
            <div className="small-item flex flex-col justify-center items-center gap-4">
              <span className="report-icon">
                <box-icon
                  name="comment-error"
                  size="6rem"
                  color="#f16e3d"
                ></box-icon>
              </span>
              <div className="flex flex-col justify-center items-center">
                <h2>Send Request</h2>
                <span className="text-gray">
                  Having problems with our product?
                </span>
                <span className="text-gray">Send us request for an action</span>
              </div>
              <div>
                <button
                  className="send-button flex justify-center items-center bg-secondary p-2"
                  onClick={handleButtonClick}
                >
                  <span className="mr-2 text-white">Send </span>
                  <box-icon color="white" name="send"></box-icon>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="long-item">
          <DataTable
            colIcon={"buildings"}
            tIcon={"buildings"}
            tName={"Branch"}
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
