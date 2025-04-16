import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import DataTable from "../../Component/DataTable/DataTable";
import CreateForm from "../../Component/CreateForm";
import Status from "../../Component/Status/Status";
import { useAuth } from "../../Auth/AuthProvider";
import { getItemBranch } from "../../Component/file";
const fetchInbox = async (user) => {
  try {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    const response = await fetch(
      `http://localhost:3000/report/getReportByBranch/${user.company}/${user.selectedBranch}`,
      requestOptions
    );
    const data = await response.json();
    const formattedData = data.map((item) => [
      item.item_id,
      item.createAt
    ]);
    return formattedData;
  } catch (error) {
    return []
  }
}

const DashboardMember = () => {
  const {user} = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [testActivity, setTestActivity] = useState([]);
    useEffect(() => {
      (async () => {
        user.selectedBranch ? user.selectedBranch : user.selectedBranch = user.branch[0];
        setTestActivity(await fetchInbox(user));
      })()
    }, [user.company, user.selectedBranch])
  const handleButtonClick = () => {
    // setShowCreateForm(!showCreateForm);
    setShowCreateForm(true);
  };

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
              title={["Activity", "Date"]}
              data={testActivity}
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
