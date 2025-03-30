import { useRef, useState } from "react";
import SweetAlert from "sweetalert2";
import "boxicons";
import "../Report-Box/ReportBox.css";
import { getAdminAndWorker } from "../../Component/user";

const testReport = [];

const testWorker = getAdminAndWorker();

const getRandomWorker = () => {
  const worker = testWorker[Math.floor(Math.random() * testWorker.length)];
  return [worker.display_name, worker.display_role];
};


const getRandomDate = (start, end) => {
  const date = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const getRandomTime = () => {
  const hours = String(Math.floor(Math.random() * 24)).padStart(2, "0");
  const minutes = String(Math.floor(Math.random() * 60)).padStart(2, "0");
  const seconds = String(Math.floor(Math.random() * 60)).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
};

const generateReportData = (count) => {
  for (let i = 0; i < count; i++) {
    const year = 2023;
    const serialNumber = `FTX=${year}-${String(
      Math.floor(Math.random() * 1000)
    ).padStart(3, "0")}`;
    const sender = getRandomWorker();
    const date = getRandomDate(new Date(2022, 0, 1), new Date());
    const time = getRandomTime();

    testReport.push({
      serial: serialNumber,
      sender: sender[0],
      role: sender[1],
      date: date,
      time: time,
    });
  }
};

generateReportData(20);

const filterList = {
  Company: [...new Set(testReport.map((report) => report.company))],
};

const SubmittedWork = () => {
  function confirmAccept(totalReport) {
    SweetAlert.fire({
      title: "Are you sure?",
      text: "You need to approve " + totalReport + " work(s)?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#B3B4AD",
      confirmButtonText: "Accept",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        SweetAlert.fire({
          title: "Congratulations! ",
          text: "Work(s) Approved!",
          icon: "success",
          confirmButtonColor: "#16a34a",
        });
      }
    });
  }

  const handleConfirmAccept = () => {
    confirmAccept(checkedCount);
  };

  function confirmReject(totalReport) {
    SweetAlert.fire({
      title: "Are you sure?",
      text: "You need to reject " + totalReport + " Work(s)?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#B3B4AD",
      confirmButtonText: "Sure",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        SweetAlert.fire({
          title: "Congratulations! ",
          text: totalReport + "Work(s) Rejected!",
          icon: "success",
          confirmButtonColor: "#dc2626",
        });
      }
    });
  }

  const handleConfirmReject = () => {
    confirmReject(checkedCount);
  };

  const filterBoxRef = useRef();
  const [checkedItems, setCheckedItems] = useState({});

  const handleItemCheck = (serial) => {
    setCheckedItems((prevState) => ({
      ...prevState,
      [serial]: !prevState[serial],
    }));
  };

  const toggleAllItemCheckBox = (e) => {
    const checked = e.target.checked;
    const updatedCheckedItems = {};
    testReport.forEach((report) => {
      updatedCheckedItems[report.serial] = checked;
    });
    setCheckedItems(updatedCheckedItems);
  };

  const checkedCount = Object.values(checkedItems).filter(Boolean).length;

  const toggleFilterBox = () => {
    filterBoxRef.current.classList.toggle("hidden");
  };

  return (
    <div className="report-box-admin grid gap-2">
      <div className="report-box-list flex flex-col gap-2 flex-1 bg-white p-1 drop-shadow-md rounded-lg">
        <div className="report-box-list-bar bg-primary p-2 rounded-[8px] drop-shadow flex items-center justify-between sticky top-0 z-10 text-nowrap">
          <div className="report-box-list-header flex gap-1 justify-center items-center">
            <box-icon
              name="check"
              type="regular"
              size="md"
              color="white"
            ></box-icon>
            <h2 className="text-white">Submitted Work</h2>
          </div>
          <div className="report-box-list-tool flex gap-2 items-center">
            <div className="report-box-search flex flex-col justify-center items-center gap-2">
              <div className="report-box-search-box flex gap-2">
                <button
                  className="flex justify-center items-center w-fit h-fit"
                  onClick={toggleFilterBox}
                >
                  <box-icon
                    name="filter"
                    type="regular"
                    size="sm"
                    color="#FD6E28"
                  ></box-icon>
                </button>
                <input
                  type="text"
                  placeholder="Search"
                  name="report-box-search"
                />
                <button className="flex justify-center items-center w-fit h-fit">
                  <box-icon
                    name="search"
                    type="regular"
                    size="sm"
                    color="#FD6E28"
                  ></box-icon>
                </button>
              </div>
              <div className="filter-box hidden" ref={filterBoxRef}>
                {Object.keys(filterList).map((key) => (
                  <div className="filter-item flex flex-col" key={key}>
                    <h4 className="text-white w-full text-center bg-primary rounded-[4px]">
                      {key}
                    </h4>
                    {filterList[key].map((item) => (
                      <div className="filter-list" key={item}>
                        <input
                          type="checkbox"
                          name={key + item}
                          id={key}
                          defaultChecked={false}
                        />
                        <label htmlFor={key}>{item}</label>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="report-box-list-body min-fit w-full gap-1 grid">
          <div className="report-box-list-header min-w-fit grid grid-cols-7 w-full h-[48px] justify-between items-center p-2 bg-white border-2 border-secondary rounded-[8px] drop-shadow text-secondary">
            <div className="min-w-fit report-box-select-all rounded flex gap-1 items-center">
              <input
                className="cursor-pointer "
                type="checkbox"
                name="report-box-select-all"
                id="report-select-all"
                value=""
                onChange={toggleAllItemCheckBox}
              />
              <label htmlFor="report-select-all" className="text-center w-full">
                <span className="text-center font-bold text-secondary">
                  Serial Number
                </span>
              </label>
            </div>
            <div className="min-w-fit w-full text-center font-bold col-span-2">
              Worker Name
            </div>
            <div className="min-w-fit w-full text-center font-bold">Role</div>
            <div className="min-w-fit w-full text-center font-bold">Date</div>
            <div className="min-w-fit w-full text-center font-bold">Time</div>
          </div>

          <div className="report-box-list-container overflow-scroll grid max-h-[552px] border-b-2 border-t-2 border-primary gap-1 pt-1 pb-1">
            {testReport.map((report, index) => (
              <div
                className="report-box-list-item min-w-fit grid grid-cols-7 w-full h-[48px] justify-between items-center p-2 bg-white border-2 border-primary rounded-[8px] drop-shadow cursor-pointer hover:brightness-90 transition-all duration-200"
                key={index}
                onClick={() => handleItemCheck(report.serial)}
              >
                <span className="flex gap-2 items-center">
                  <input
                    type="checkbox"
                    name="work-item-checkbox"
                    id={index}
                    checked={checkedItems[report.serial] || false}
                    onChange={() => handleItemCheck(report.serial)}
                  />
                  <box-icon
                    name="spray-can"
                    type="regular"
                    size="sm"
                    color="#FD6E28"
                  ></box-icon>
                  {report.serial}
                </span>
                <span className="min-w-fit w-full text-center col-span-2">
                  {report.sender}
                </span>
                <span className="min-w-fit w-full text-center">
                  {report.role}
                </span>
                <span className="min-w-fit w-full text-center">
                  {report.date}
                </span>
                <span className="min-w-fit w-full text-center">
                  {report.time}
                </span>
                <div className="flex justify-end items-center w-full h-full">
                <button
                  className="flex justify-center items-center w-1/4 h-full text-white z-50 rounded bg-secondary hover:brightness-110"
                  onClick={() => Confirm()}
                >
                  <box-icon name="show" type="regular" color="white"></box-icon>
                </button>
              </div>
              </div>
            ))}
          </div>
        </div>
        <div className="report-box-footer flex  justify-between w-full bottom-0 h-[48px] bg-white p-1 border-2 border-primary rounded-[8px]">
          <div className="report-box-checked-count flex justify-start items-center bg-primary rounded px-2">
            <span className="text-white">{checkedCount} selected</span>
          </div>
          <div className="flex gap-2">
            <button
              className="flex justify-center items-center gap-1 px-2 text-white rounded bg-red-600 hover:brightness-110"
              onClick={() => handleConfirmReject()}
            >
              <span>Reject</span>
              <box-icon name="x" type="regular " color="white"></box-icon>
            </button>
            <button
              className="flex justify-center items-center gap-1 px-2 text-white rounded bg-green-600 hover:brightness-110"
              onClick={() => handleConfirmAccept()}
            >
              <span>Approve</span>
              <box-icon name="check" type="regular " color="white"></box-icon>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmittedWork;
