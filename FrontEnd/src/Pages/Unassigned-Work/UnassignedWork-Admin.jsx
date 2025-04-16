import { useState, useEffect, useRef } from "react";
import SweetAlert from "sweetalert2";
import "boxicons";
import "./UnassignedWork.css";

const UnassignedWorkAdmin = () => {
  const [workList, setWorkList] = useState([]);
  const [workerList, setWorkerList] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [selectedWorker, setSelectedWorker] = useState("");
  const filterBoxRef = useRef();

  // ดึงข้อมูลงานที่ยังไม่ได้มอบหมาย
  useEffect(() => {
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };

    fetch("http://localhost:3000/report/getReportByStatus/accepted", requestOptions)
      .then((response) => response.json())
      .then((data) => setWorkList(data))
      .catch((error) => console.error("Error fetching unassigned work:", error));
  }, []);

  // ดึงข้อมูลผู้ใช้งาน (workers)
  useEffect(() => {
    fetch("http://localhost:3000/users/getOperatorUser")
      .then((response) => response.json())
      .then((data) => setWorkerList(data))
      .catch((error) => console.error("Error fetching worker data:", error));
  }, []);

  const toggleSelectedWorker = (worker) => {
    if (selectedWorker === worker) {
      setSelectedWorker("");
    } else {
      setSelectedWorker(worker);
    }
  };

  const handleItemCheck = (serial) => {
    setCheckedItems((prevState) => ({
      ...prevState,
      [serial]: !prevState[serial],
    }));
  };

  const toggleAllItemCheckBox = (e) => {
    const checked = e.target.checked;
    const updatedCheckedItems = {};
    workList.forEach((work) => {
      updatedCheckedItems[work.report_id] = checked;
    });
    setCheckedItems(updatedCheckedItems);
  };

  const handleConfirmAssign = () => {
    const checkedCount = Object.values(checkedItems).filter(Boolean).length;
    confirmAssign(selectedWorker, checkedCount);
  };

  function confirmAssign(worker, totalWork) {
    SweetAlert.fire({
      title: "Are you sure?",
      text: `You need to assign ${totalWork} work(s) to ${worker}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#FD6E28",
      cancelButtonColor: "#B3B4AD",
      confirmButtonText: "Sure",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        SweetAlert.fire({
          title: "Congratulations!",
          text: "Work Assigned!",
          icon: "success",
          confirmButtonColor: "#FD6E28",
        });
      }
    });
  }

  return (
    <div className="unassigned-work-admin flex gap-2">
      <div className="worker-list flex flex-col gap-2 flex-1 bg-white p-1 drop-shadow-md rounded-lg ">
        <div className="worker-list-bar bg-secondary p-2 rounded-[8px] drop-shadow flex items-center border-2 border-white justify-between sticky top-0 z-10">
          <div className="worker-list-header flex gap-1 justify-center items-center">
            <box-icon name="user" type="regular" size="md" color="white"></box-icon>
            <h2 className="text-white">Worker</h2>
          </div>
        </div>
        <div className="worker-list-container grid gap-1 max-h-[600px] overflow-y-scroll border-t-2 border-b-2 border-secondary pt-1 pb-1">
          {workerList.map((worker) => (
            <div
              className={`worker-list-item grid grid-cols-4 w-full h-[48px] justify-between items-center p-2 border-2 border-secondary rounded-[8px] cursor-pointer drop-shadow transition-all duration-200 ${
                selectedWorker === worker.display_name
                  ? "text-white bg-secondary"
                  : "text-secondary bg-white"
              }`}
              key={worker._id}
              onClick={() => toggleSelectedWorker(worker.display_name)}
            >
              <span className="col-span-2 flex gap-2 items-center">
                <box-icon name="user-circle" type="regular" size="sm" color={selectedWorker === worker.display_name ? "white" : "#473366"}></box-icon>
                <span>{worker.display_name}</span>
              </span>
              <span className="w-full flex gap-2 items-center justify-center">
                <span>{worker.role}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="unassigned-work-list flex flex-col gap-2 min-w-fit flex-1 bg-white p-1 drop-shadow-md rounded-lg">
        <div className="unassigned-work-list-bar bg-primary p-2 rounded-[8px] drop-shadow flex items-center justify-between sticky top-0 z-10 text-nowrap">
          <div className="unassigned-work-list-header flex gap-1 justify-center items-center">
            <box-icon name="list-plus" type="regular" size="md" color="white"></box-icon>
            <h2 className="text-white">Unassigned Work</h2>
          </div>
        </div>
        <div className="unassigned-work-list-container grid max-h-[552px] overflow-scroll border-b-2 border-t-2 border-primary gap-1 pt-1 pb-1">
          {workList.map((work) => (
            <div
              className="unassigned-work-list-item grid grid-cols-10 overflow-scroll w-full h-[48px] justify-between items-center p-2 bg-white border-2 border-primary rounded-[8px] drop-shadow cursor-pointer hover:brightness-90 transition-all duration-200"
              key={work.report_id}
              onClick={() => handleItemCheck(work.report_id)}
            >
              <span className="flex gap-2 items-center col-span-3">
                <input
                  type="checkbox"
                  name="work-item-checkbox"
                  id={work.report_id}
                  checked={checkedItems[work.report_id] || false}
                  onChange={() => handleItemCheck(work.report_id)}
                />
                <box-icon name="spray-can" type="regular" size="sm" color="#FD6E28"></box-icon>
                {work.report_id}
              </span>
              <span className="col-span-2">{work.client_id}</span>
              <span className="col-span-2">{work.client_branch_id}</span>
              <span className="col-span-2">{work.createAt}</span>
            </div>
          ))}
        </div>
        <div className="unassigned-work-footer flex justify-between w-full bottom-0 h-[48px] bg-white p-1 border-2 border-primary rounded-[8px]">
          <div className="unassigned-work-checked-count flex justify-start items-center bg-primary rounded px-2">
            <span className="text-white">
              {Object.values(checkedItems).filter(Boolean).length} selected
            </span>
          </div>
          <button
            className="flex justify-center items-center gap-1 px-2 text-white rounded bg-green-600 hover:brightness-110"
            onClick={handleConfirmAssign}
          >
            <span>Assign Work</span>
            <box-icon name="plus" type="regular" color="white"></box-icon>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnassignedWorkAdmin;
