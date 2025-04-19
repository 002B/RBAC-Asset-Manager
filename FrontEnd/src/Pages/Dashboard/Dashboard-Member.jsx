import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import DataTable from "../../Component/DataTable/DataTable";
import CreateForm from "../../Component/CreateForm";
import Status from "../../Component/Status/Status";
import { useAuth } from "../../Auth/AuthProvider";

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
      item.report_id,
      item.item_id,
      item.createAt,
      item.status,
    ]);
    return formattedData;
  } catch (error) {
    return []
  }
}

const fetchInventory = async (user) => {
  try {
    const response = await fetch(
      `http://localhost:3000/item/getItemList/${user.company}/${user.selectedBranch}`
    );
    const data = await response.json();
    const formattedData = data.map((item) => [
      item.item_id,
      item.item_brand,
      item.item_status,
    ]);
    return formattedData;
  } catch (error) {
    return []
  }
}
const fetchNextCheck = async (user) => {
  try {
    const response = await fetch(
      `http://localhost:3000/company/getNextCheck/${user.company}/${user.selectedBranch}`
    );
    const data = await response.json();

    const [day, month, year] = data.split('/');

    const receivedDate = new Date(year, month - 1, day);
    const today = new Date();
    const differenceInTime = receivedDate.getTime() - today.getTime();
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));

    return differenceInDays;
  } catch (error) {
    console.error('Error fetching next check:', error);
    return null;
  }
}

const fetchLastCheck = async (user) => {
  try {
    const response = await fetch(
      `http://localhost:3000/company/getLastCheck/${user.company}/${user.selectedBranch}`
    );
    const data = await response.json();
    const transformedData = data.map(date => [date]);
    return transformedData;
  } catch (error) {
    console.error('Error fetching last check:', error);
    return null;
  }
}

const DashboardMember = () => {
  const {user} = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [testActivity, setTestActivity] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [checkUp, setCheckUp] = useState([]);
  const [lastCheck, setLastCheck] = useState([]);
    useEffect(() => {
      (async () => {
        user.selectedBranch ? user.selectedBranch : user.selectedBranch = user.branch[0]
        setTestActivity(await fetchInbox(user));
        setInventory(await fetchInventory(user));
        setCheckUp(await fetchNextCheck(user));
        setLastCheck(await fetchLastCheck(user));
      })()
    }, [user.company, user.selectedBranch]);
  const handleButtonClick = () => {
    // setShowCreateForm(!showCreateForm);
    setShowCreateForm(true);
  };

  return (
    <div className="flex flex-col w-full rounded drop-shadow">
      {/* <div className="w-full rounded drop-shadow">
      <Status
          role={user.role}
          company={user.company}
          branch={user.selectedBranch ? user.selectedBranch : user.branch[0]}
        />
      </div> */}
      <div className=" dashboard-container flex w-full rounded drop-shadow mt-4">
        <div className="big-item">
          <div className="small-item-wrapper">
          <div className="small-item h-fit">
            <DataTable
              tIcon="revision"
              tName={"Report Activity"}
              colIcon= {"import"}
              title={["Report ID", "Item ID", "Time", "Status"]}
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
                <box-icon name="timer" color="#ff6700" size="lg"></box-icon>
                <h1 className="text-primary">{checkUp}</h1>
              </div>
              <span className="flex justify-center items-end">
                <h2> Days </h2>
                <h4 className="ml-2"> until next Check Up</h4>
              </span>
            </div>
            <DataTable
              title={["Last Check"]}
              colIcon={"check-square"}
              data={lastCheck}
              hasButton={false}
              hasPagination={false}
              itemPerPage={4}
              hasSearch={false}
            />
          </div>
          <div className="small-item flex flex-col justify-center items-center gap-4">
              <span className="report-icon">
                <box-icon
                  name="comment-error"
                  size="6rem"
                  color="#ff6700"
                ></box-icon>
              </span>
              <div className="flex flex-col justify-center items-center">
                <h2 className="text-dark">Send Request</h2>
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
            tIcon={"spray-can"}
            tName={"Inventory"}
            colIcon={"spray-can"}
            title={["Serial Number", "Brand", "Status"]}
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
