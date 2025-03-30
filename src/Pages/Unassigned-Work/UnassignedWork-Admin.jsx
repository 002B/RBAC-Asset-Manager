import { useRef, useState } from "react";
import SweetAlert from "sweetalert2";
import "boxicons";
import "./UnassignedWork.css";
import workList from '../../json/report.json';
import { getAdminAndWorker } from "../../Component/user";

const workerList = getAdminAndWorker();

const filterList = {
  Company: [...new Set(workList.map((work) => work.company))],
};

const UnassignedWorkAdmin = () => {

  function confirmAssign(worker, totalWork) {
    SweetAlert.fire({
      title: "Are you sure?",
      text: "You need to assign " + totalWork + " work(s) to " + worker,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#FD6E28",
      cancelButtonColor: "#B3B4AD",
      confirmButtonText: "Sure",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        SweetAlert.fire({
          title: "Congratulations! ",
          text: "Work Assigned!",
          icon: "success",
          confirmButtonColor: "#FD6E28",
        });
      }
    });
  }

  const handleConfirmAssign = () => {
      confirmAssign(selectedWorker, checkedCount);
  }

  const filterBoxRef = useRef();
  const [checkedItems, setCheckedItems] = useState({});
  const [selectedWorker, setSelectedWorker] = useState("");

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
      updatedCheckedItems[work.serial] = checked;
    });
    setCheckedItems(updatedCheckedItems);
  };

  const checkedCount = Object.values(checkedItems).filter(Boolean).length;

  const toggleFilterBox = () => {
    filterBoxRef.current.classList.toggle("hidden");
  };

  return (
    <div className="unassigned-work-admin flex gap-2">
      <div className="worker-list flex flex-col gap-2 flex-1 bg-white p-1 drop-shadow-md rounded-lg ">
        <div className="worker-list-bar bg-secondary p-2 rounded-[8px] drop-shadow flex items-center border-2 border-white justify-between sticky top-0 z-10">
          <div className="worker-list-header flex gap-1 justify-center items-center">
            <box-icon
              name="user"
              type="regular"
              size="md"
              color="white"
            ></box-icon>
            <button type="submit"></button>
            <h2 className="text-white">Worker</h2>
          </div>
          <div className="worker-list-tool flex gap-2">
            <div className="worker-search flex flex-col justify-center items-center gap-2">
              <div className="worker-list-search flex flex-col justify-center items-center gap-2">
                <div className="worker-list-search-box flex gap-2">
                  <input
                    type="text"
                    placeholder="Search"
                    name="worker-search"
                  />
                  <button className="flex justify-center items-center w-fit h-fit">
                    <box-icon
                      name="search"
                      type="regular"
                      size="sm"
                      color="#473366"
                    ></box-icon>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="worker-list-container grid gap-1 max-h-[600px] overflow-y-scroll border-t-2 border-b-2 border-secondary pt-1 pb-1">
          {workerList.map((worker, index) => (
            <div
              className={`worker-list-item grid grid-cols-4 w-full h-[48px] justify-between items-center p-2 border-2 border-secondary rounded-[8px] cursor-pointer drop-shadow transition-all duration-200 hover:brightness-90 ${
                selectedWorker === worker.display_name
                  ? "text-white bg-secondary"
                  : "text-secondary bg-white"
              }`}
              key={index}
              onClick={() => toggleSelectedWorker(worker.display_name)}
            >
              <span className="col-span-2 flex gap-2 items-center">
                <box-icon
                  name="user-circle"
                  type="regular"
                  size="sm"
                  color= {selectedWorker === worker.display_name ? "white" : "#473366"}
                ></box-icon>
                <span>{worker.display_name}</span>
              </span>
              <span className="w-full flex gap-2 items-center justify-center">
                <span>{worker.display_role}</span>
              </span>
              <span>
              <span className="w-full flex gap-2 items-center justify-center">{worker.user}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="unassigned-work-list flex flex-col gap-2 min-w-fit flex-1 bg-white p-1 drop-shadow-md rounded-lg">
        <div className="unassigned-work-list-bar bg-primary p-2 rounded-[8px] drop-shadow flex items-center justify-between sticky top-0 z-10 text-nowrap">
          <div className="unassigned-work-list-header flex gap-1 justify-center items-center">
            <box-icon
              name="list-plus"
              type="regular"
              size="md"
              color="white"
            ></box-icon>
            <h2 className="text-white">Unassigned Work</h2>
          </div>
          <div className="unassigned-work-list-tool flex gap-2 items-center">
            <div className="unassigned-work-select-all bg-white p-1 rounded flex gap-1 items-center">
              <input
                type="checkbox"
                name="unassigned-work-select-all"
                id="work-select-all"
                value=""
                onChange={toggleAllItemCheckBox}
              />
              <label htmlFor="work-select-all">Select All</label>
            </div>
            <div className="unassigned-work-search flex flex-col justify-center items-center gap-2">
              <div className="unassigned-work-search-box flex gap-2">
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
                  name="unassigned-work-search"
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
                        <input type="checkbox" name={key + item} id={item} defaultChecked={false} />
                        <label htmlFor={item}>{item}</label>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="unassigned-work-list-container grid max-h-[552px] overflow-scroll border-b-2 border-t-2 border-primary gap-1 pt-1 pb-1">
          {workList.map((work, index) => (
            <div
              className="unassigned-work-list-item grid grid-cols-10 overflow-scroll w-full h-[48px] justify-between items-center p-2 bg-white border-2 border-primary rounded-[8px] drop-shadow cursor-pointer hover:brightness-90 transition-all duration-200"
              key={index}
              onClick={() => handleItemCheck(work.serial)}
            >
              <span className="flex gap-2 items-center col-span-3">
                <input
                  type="checkbox"
                  name="work-item-checkbox"
                  id={work.serial}
                  checked={checkedItems[work.serial] || false}
                  onChange={() => handleItemCheck(work.serial)}
                />
                <box-icon
                  name="spray-can"
                  type="regular"
                  size="sm"
                  color="#FD6E28"
                ></box-icon>
                {work.serial}
              </span>
              <span className="col-span-2">{work.company}</span>
              <span className="col-span-2">{work.branch}</span>
              <span className="col-span-2">{work.date}</span>
              <div className="flex justify-center items-center w-full h-full">
                <button
                  className="edit-button flex justify-center flex-1 items-center w-full h-full text-white rounded bg-secondary hover:brightness-110"
                  onClick={() => Confirm()}
                >
                  <box-icon name="show" type="regular" color="white"></box-icon>
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="unassigned-work-footer flex  justify-between w-full bottom-0 h-[48px] bg-white p-1 border-2 border-primary rounded-[8px]">
          <div className="unassigned-work-checked-count flex justify-start items-center bg-primary rounded px-2">
            <span className="text-white">{checkedCount} selected</span>
          </div>
          <button
            className="flex justify-center items-center gap-1 px-2 text-white rounded bg-green-600 hover:brightness-110"
            onClick={() => handleConfirmAssign()}
          >
            <span>Assign Work</span>
            <box-icon name="plus" type="regular " color="white"></box-icon>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnassignedWorkAdmin;
