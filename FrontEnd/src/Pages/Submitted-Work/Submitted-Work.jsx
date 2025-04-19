import { useEffect, useRef, useState } from "react";
import axios from "axios";
import SweetAlert from "sweetalert2";
import "boxicons";
import "../Report-Box/ReportBox.css";

const SubmittedWork = ({ username = "worker" }) => {
  const [reports, setReports] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [companyFilter, setCompanyFilter] = useState("All");

  const filterBoxRef = useRef();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/report/getReportByUserDone/${username}`
      );
      setReports(res.data);
    } catch (err) {
      console.error("Error fetching reports", err);
    }
  };
  const handleViewDetails = (report) => {
    SweetAlert.fire({
      title: `<strong>Report Details</strong>`,
      html: `
        <div style="text-align: left;">
          <p><strong>Report ID:</strong> ${report.report_id}</p>
          <p><strong>Item ID:</strong> ${report.item_id}</p>
          <p><strong>Company:</strong> ${report.client_id}</p>
          <p><strong>Branch:</strong> ${report.client_branch_id}</p>
          <p><strong>Status:</strong> ${report.status}</p>
          <p><strong>Assigner:</strong> ${report.send_by}</p>
          <p><strong>Problem:</strong> ${report.problem}</p>
          <p><strong>Created At:</strong> ${new Date(
            report.createAt
          ).toLocaleString()}</p>
        </div>
      `,
      confirmButtonColor: "#FD6E28",
      confirmButtonText: "Close",
      focusConfirm: false,
    });
  };

  const handleItemCheck = (id) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleFilterBox = () => {
    filterBoxRef.current.classList.toggle("hidden");
  };

  const confirmAccept = (count) => {
    SweetAlert.fire({
      title: "Are you sure?",
      text: `You need to approve ${count} work(s)?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#B3B4AD",
      confirmButtonText: "Accept",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        SweetAlert.fire({
          title: "Congratulations!",
          text: "Work(s) Approved!",
          icon: "success",
          confirmButtonColor: "#16a34a",
        });
      }
    });
  };

  const confirmReject = (count) => {
    SweetAlert.fire({
      title: "Are you sure?",
      text: `You need to reject ${count} work(s)?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#B3B4AD",
      confirmButtonText: "Sure",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        SweetAlert.fire({
          title: "Rejected!",
          text: `${count} Work(s) Rejected!`,
          icon: "success",
          confirmButtonColor: "#dc2626",
        });
      }
    });
  };

  const companyList = Array.from(new Set(reports.map((r) => r.client_id)));

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.report_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.item_id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCompany =
      companyFilter === "All" || report.client_id === companyFilter;

    return matchesSearch && matchesCompany;
  });

  const checkedCount = Object.values(checkedItems).filter(Boolean).length;

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
                <button onClick={toggleFilterBox}>
                  <box-icon
                    name="filter"
                    type="regular"
                    size="sm"
                    color="#FD6E28"
                  />
                </button>
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button>
                  <box-icon
                    name="search"
                    type="regular"
                    size="sm"
                    color="#FD6E28"
                  />
                </button>
              </div>
              <div className="filter-box hidden" ref={filterBoxRef}>
                <div className="filter-item flex flex-col">
                  <h4 className="text-white w-full text-center bg-primary rounded-[4px]">
                    Company
                  </h4>
                  {companyList.map((company) => (
                    <div className="filter-list" key={company}>
                      <input
                        type="checkbox"
                        checked={companyFilter === company}
                        onChange={() =>
                          setCompanyFilter((prev) =>
                            prev === company ? "All" : company
                          )
                        }
                      />
                      <label>{company}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="report-box-list-body min-fit w-full gap-1 grid">
          <div className="report-box-list-header grid grid-cols-7 w-full h-[48px] items-center p-2 bg-white border-2 border-secondary rounded-[8px] drop-shadow text-secondary">
            <div className="report-box-select-all flex gap-1 items-center">
              <label className="font-bold">Report ID</label>
            </div>
            <div className="text-center font-bold">Item ID</div>
            <div className="text-center font-bold">Company</div>
            <div className="text-center font-bold">Branch</div>
            <div className="text-center font-bold">Status</div>
            <div className="text-center font-bold">send_by</div>
            <div className="text-center font-bold">Action</div>
          </div>

          <div className="report-box-list-container overflow-scroll grid max-h-[552px] border-y-2 border-primary gap-1 py-1">
            {filteredReports.map((report, index) => (
              <div
                key={index}
                className="report-box-list-item grid grid-cols-7 w-full h-[48px] items-center p-2 bg-white border-2 border-primary rounded-[8px] drop-shadow hover:brightness-90 transition-all duration-200 cursor-pointer"
                onClick={() => handleItemCheck(report.report_id)}
              >
                <span className="flex items-center gap-2">
                  <box-icon name="file" color="#FD6E28" size="sm" />
                  {report.report_id}
                </span>
                <span className="text-center">{report.item_id}</span>
                <span className="text-center">{report.client_id}</span>
                <span className="text-center">{report.client_branch_id}</span>
                <span className="text-center">{report.status}</span>
                <span className="text-center">{report.send_by}</span>
                <span className="flex justify-center">
                  <button
                    className="flex items-center gap-1 text-white text-sm font-medium bg-secondary  px-4 py-1.5 rounded-lg shadow hover:bg-secondary  transition duration-200"
                    onClick={(e) => {
                      e.stopPropagation(); // ป้องกันไม่ให้ checkbox ติดด้วย
                      handleViewDetails(report);
                    }}
                  >
                    <box-icon
                      name="show"
                      type="regular"
                      color="white"
                      size="sm"
                    />
                    View
                  </button>
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="report-box-footer flex justify-between w-full h-[48px] bg-white p-1 border-2 border-primary rounded-[8px]">
          <div className="bg-highlight text-white px-2 rounded flex items-center">
            {checkedCount} selected
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmittedWork;
