import { useState, useEffect, useRef } from "react";
import SweetAlert from "sweetalert2";
import "boxicons";
import "./ReportBox.css";

const ReportBox = () => {
  const [reportList, setReportList] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const filterBoxRef = useRef();

  // ดึงข้อมูลรายงานที่มีสถานะเป็น 'pending' จาก API
  useEffect(() => {
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };

    fetch("http://localhost:3000/report/getReportByStatus/pending", requestOptions)
      .then((response) => response.json())
      .then((data) => setReportList(data))
      .catch((error) => console.error("Error fetching pending reports:", error));
  }, []);

  const handleItemCheck = (serial) => {
    setCheckedItems((prevState) => ({
      ...prevState,
      [serial]: !prevState[serial],
    }));
  };

  const toggleAllItemCheckBox = (e) => {
    const checked = e.target.checked;
    const updatedCheckedItems = {};
    reportList.forEach((report) => {
      updatedCheckedItems[report.report_id] = checked;
    });
    setCheckedItems(updatedCheckedItems);
  };

  const handleConfirmAccept = () => {
    const checkedCount = Object.values(checkedItems).filter(Boolean).length;
    confirmAccept(checkedCount);
  };

  const handleConfirmReject = () => {
    const checkedCount = Object.values(checkedItems).filter(Boolean).length;
    confirmReject(checkedCount);
  };

  function confirmAccept(totalReport) {
    SweetAlert.fire({
      title: "Are you sure?",
      text: "You need to accept " + totalReport + " report(s)?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#B3B4AD",
      confirmButtonText: "Accept",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        SweetAlert.fire({
          title: "Congratulations! ",
          text: "Report(s) Accepted!",
          icon: "success",
          confirmButtonColor: "#16a34a",
        });
      }
    });
  }

  function confirmReject(totalReport) {
    SweetAlert.fire({
      title: "Are you sure?",
      text: "You need to reject " + totalReport + " report(s)?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#B3B4AD",
      confirmButtonText: "Sure",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        SweetAlert.fire({
          title: "Congratulations! ",
          text: "Report(s) Rejected!",
          icon: "success",
          confirmButtonColor: "#dc2626",
        });
      }
    });
  }

  const checkedCount = Object.values(checkedItems).filter(Boolean).length;

  return (
    <div className="report-box-admin grid gap-2">
      <div className="report-box-list flex flex-col gap-2 flex-1 bg-white p-1 drop-shadow-md rounded-lg">
        <div className="report-box-list-bar bg-primary p-2 rounded-[8px] drop-shadow flex items-center justify-between sticky top-0 z-10 text-nowrap">
          <div className="report-box-list-header flex gap-1 justify-center items-center">
            <box-icon name="comment-error" type="regular" size="md" color="white"></box-icon>
            <h2 className="text-white">Report List</h2>
          </div>
          <div className="report-box-list-tool flex gap-2 items-center">
            <div className="report-box-search flex flex-col justify-center items-center gap-2">
              <div className="report-box-search-box flex gap-2">
                <button className="flex justify-center items-center w-fit h-fit" onClick={() => filterBoxRef.current.classList.toggle("hidden")}>
                  <box-icon name="filter" type="regular" size="sm" color="#FD6E28"></box-icon>
                </button>
                <input type="text" placeholder="Search" name="report-box-search" />
                <button className="flex justify-center items-center w-fit h-fit">
                  <box-icon name="search" type="regular" size="sm" color="#FD6E28"></box-icon>
                </button>
              </div>
              <div className="filter-box hidden" ref={filterBoxRef}>
                {/* Filter box content */}
              </div>
            </div>
          </div>
        </div>
        <div className="report-box-list-body min-fit w-full gap-1 grid">
          <div className="report-box-list-header min-w-fit grid grid-cols-10 w-full h-[48px] justify-between items-center p-2 bg-white border-2 border-secondary rounded-[8px] drop-shadow text-secondary">
            <div className="min-w-fit col-span-2 report-box-select-all rounded flex gap-1 items-center">
              <input className="cursor-pointer" type="checkbox" name="report-box-select-all" id="report-select-all" value="" onChange={toggleAllItemCheckBox} />
              <label htmlFor="report-select-all" className="text-center w-full">
                <span className="text-center font-bold text-secondary">Serial Number</span>
              </label>
            </div>
            <div className="min-w-fit w-full text-center font-bold">Company</div>
            <div className="min-w-fit w-full text-center font-bold">Branch</div>
            <div className="min-w-fit w-full text-center font-bold col-span-2">Sender Name</div>
            <div className="min-w-fit w-full text-center font-bold">Date</div>
            <div className="min-w-fit w-full text-center font-bold">Time</div>
            <div className="min-w-fit w-full text-center font-bold">Image</div>
            <div className="min-w-fit w-full text-center font-bold">Problem</div>
          </div>
          <div className="report-box-list-container overflow-scroll grid max-h-[552px] border-b-2 border-t-2 border-primary gap-1 pt-1 pb-1">
            {reportList.map((report, index) => (
              <div className="report-box-list-item min-w-fit grid grid-cols-10 w-full h-[48px] justify-between items-center p-2 bg-white border-2 border-primary rounded-[8px] drop-shadow cursor-pointer hover:brightness-90 transition-all duration-200" key={index} onClick={() => handleItemCheck(report.report_id)}>
                <span className="flex gap-2 items-center col-span-2">
                  <input type="checkbox" name="work-item-checkbox" id={index} checked={checkedItems[report.report_id] || false} onChange={() => handleItemCheck(report.report_id)} />
                  <box-icon name="spray-can" type="regular" size="sm" color="#FD6E28"></box-icon>
                  {report.report_id}
                </span>
                <span className="min-w-fit w-full text-center">{report.client_id}</span>
                <span className="min-w-fit w-full text-center">{report.client_branch_id}</span>
                <span className="min-w-fit w-full text-center col-span-2">{report.assigner}</span>
                <span className="min-w-fit w-full text-center">{report.createAt}</span>
                <span className="min-w-fit w-full text-center">-</span>
                <span className="min-w-fit w-full text-center">{report.problem ? "Yes" : "No"}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="report-box-footer flex justify-between w-full bottom-0 h-[48px] bg-white p-1 border-2 border-primary rounded-[8px]">
          <div className="report-box-checked-count flex justify-start items-center bg-primary rounded px-2">
            <span className="text-white">{checkedCount} selected</span>
          </div>
          <div className="flex gap-2">
            <button className="flex justify-center items-center gap-1 px-2 text-white rounded bg-red-600 hover:brightness-110" onClick={handleConfirmReject}>
              <span>Reject</span>
              <box-icon name="x" type="regular " color="white"></box-icon>
            </button>
            <button className="flex justify-center items-center gap-1 px-2 text-white rounded bg-green-600 hover:brightness-110" onClick={handleConfirmAccept}>
              <span>Accept</span>
              <box-icon name="check" type="regular " color="white"></box-icon>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportBox;
