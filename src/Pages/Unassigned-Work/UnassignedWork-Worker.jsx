import { useRef, useState } from "react";
import SweetAlert from "sweetalert2";
import "boxicons";
import "./UnassignedWork.css";
import placeholderImg from "../../assets/img/placeholder.png";
function Confirm() {
  SweetAlert.fire({
    title: "Are you sure?",
    text: "You need to accept this work?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#FD6E28",
    cancelButtonColor: "#B3B4AD",
    confirmButtonText: "Sure",
  }).then((result) => {
    if (result.isConfirmed) {
      SweetAlert.fire({
        title: "Congratulations! ",
        text: "Work accepted!",
        icon: "success",
        confirmButtonColor: "#FD6E28",
      });
    }
  });
}

const workList = [
  {
    serial: "FTX=2023-001",
    company: "Thaibev",
    branch: "Thaibev_1",
    problem: "place holder for problem description",
    date: "14/11/2022",
  },
  {
    serial: "FTX=2023-002",
    company: "Thaibev",
    branch: "Thaibev_1",
    problem: "place holder for problem description",
    date: "14/11/2022",
  },
  {
    serial: "FTX=2023-003",
    company: "Thaibev",
    branch: "Thaibev_1",
    problem: "place holder for problem description",
    date: "14/11/2022",
  },
  {
    serial: "FTX=2023-054",
    company: "Thaibev",
    branch: "Thaibev_2",
    problem: "place holder for problem description",
    date: "13/11/2022",
  },
  {
    serial: "FTX=2023-055",
    company: "Thaibev",
    branch: "Thaibev_2",
    problem: "place holder for problem description",
    date: "13/11/2022",
  },
  {
    serial: "FTX=2023-056",
    company: "Thaibev",
    branch: "Thaibev_2",
    problem: "place holder for problem description",
    date: "13/11/2022",
  },
  {
    serial: "FTX=2023-057",
    company: "Thaibev",
    branch: "Thaibev_2",
    problem: "place holder for problem description",
    date: "13/11/2022",
  },
  {
    serial: "FTX=2023-101",
    company: "SCB",
    branch: "SCB_1",
    problem: "place holder for problem description",
    date: "12/11/2022",
  },
  {
    serial: "FTX=2023-102",
    company: "SCB",
    branch: "SCB_1",
    problem: "place holder for problem description",
    date: "12/11/2022",
  },
  {
    serial: "FTX=2023-103",
    company: "SCB",
    branch: "SCB_1",
    problem: "place holder for problem description",
    date: "12/11/2022",
  },
  {
    serial: "FTX=2023-104",
    company: "SCB",
    branch: "SCB_1",
    problem: "place holder for problem description",
    date: "12/11/2022",
  },
  {
    serial: "FTX=2023-155",
    company: "SCB",
    branch: "SCB_2",
    problem: "place holder for problem description",
    date: "11/11/2022",
  },
  {
    serial: "FTX=2023-156",
    company: "SCB",
    branch: "SCB_2",
    problem: "place holder for problem description",
    date: "11/11/2022",
  },
];

const filterList = {
  Company: [...new Set(workList.map((work) => work.company))],
};

const UnassignedWork = () => {
  const filterBoxRef = useRef();

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 8;

  const currentData = workList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(workList.length / itemsPerPage);

  const changePage = (page) => {
    setCurrentPage(page);
  };

  const getPaginationRange = () => {
    const start = Math.max(currentPage - 1, 1);
    const end = Math.min(currentPage + 1, totalPages);
    if (end - start < 2) {
      if (start === 1) {
        return [1, 2, 3].slice(0, totalPages);
      } else if (end === totalPages) {
        return [totalPages - 2, totalPages - 1, totalPages];
      }
    }

    return [start, start + 1, start + 2];
  };


  const toggleFilterBox = () => {
    filterBoxRef.current.classList.toggle("hidden");
  };
  return (
    <div className="flex flex-col gap-2">
      <div className="unassigned-work-list-bar bg-primary p-2 rounded-[8px] drop-shadow flex items-center justify-between sticky top-0 z-10">
        <div className="unassigned-work-list-header flex gap-2 justify-center items-center">
          <box-icon
            name="list-plus"
            type="regular"
            size="md"
            color="white"
          ></box-icon>
          <button type="submit"></button>
          <h2 className="text-white">Unassigned Work</h2>
        </div>
        <div className="unassigned-work-list-tool flex gap-2">
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
              <input type="text" placeholder="Search" name="unassigned-work-search"/>
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
                      <input type="checkbox" name={item} id={item} />
                      <label htmlFor={item}>{item}</label>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="unassigned-work-card-container grid grid-cols-4 gap-2">
        {currentData.map((item, index) => (
          <div
            className="unassigned-work-card h-fit flex flex-col items-center flex-1 bg-white drop-shadow-md"
            key={index}
          >
            <div className="unassigned-work-card-detail flex flex-col w-full h-full">
              <div className="unassigned-work-card-header flex flex-col justify-center items-center h-1/2">
                <div className="unassigned-work-card-img flex justify-center items-center w-full h-fit">
                  <img
                    className="w-full h-2/3 object-cover rounded-lg"
                    src={placeholderImg}
                    alt="report-img"
                  />
                </div>
              </div>
              <div className="unassigned-work-card-body flex flex-col justify-center items-center">
                <h3 className="text-secondary text-nowrap">{item.company}</h3>
                <h4>{item.branch}</h4>
                <div className="flex items-center justify-center">
                  <box-icon
                    name="time"
                    type="regular"
                    color="#FD6E28"
                    size="sm"
                  ></box-icon>
                  <span>{item.date}</span>
                </div>
                <div className="flex items-center justify-center">
                  <box-icon
                    name="spray-can"
                    type="regular"
                    color="#FD6E28"
                    size="sm"
                  ></box-icon>
                  <span className="font-bold">{item.serial}</span>
                </div>
              </div>
              <div className="unassigned-work-card-footer flex flex-col w-full gap-1 py-1">
                <div className="flex w-full gap-1">
                  <button
                    className="edit-button flex w-full justify-center items-center w-ful text-white p-1 rounded gap-2"
                    onClick={() => Confirm()}
                  >
                    <box-icon
                      name="show"
                      type="regular"
                      color="white"
                    ></box-icon>
                    <span>View Details</span>
                  </button>
                  <button
                    className="submit-button flex w-full justify-center items-center w-ful text-white p-1 rounded gap-2 bg-primary hover:brightness-110"
                    onClick={() => Confirm()}
                  >
                    <box-icon
                      name="plus"
                      type="regular"
                      color="white"
                    ></box-icon>
                    <span>Accept</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {totalPages > 1 && (
          <div className="pagination w-full bg-white drop-shadow-sm p-1 rounded-lg">
            <button onClick={() => changePage(1)} disabled={currentPage === 1}>
              <box-icon type="solid" name="chevrons-left"></box-icon>
            </button>
            <button
              onClick={() => changePage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <box-icon type="solid" name="chevron-left"></box-icon>
            </button>
            {getPaginationRange().map((page) => (
              <button
                key={page}
                onClick={() => changePage(page)}
                className={currentPage === page ? "active" : ""}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => changePage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <box-icon type="solid" name="chevron-right"></box-icon>
            </button>
            <button
              onClick={() => changePage(totalPages)}
              disabled={currentPage === totalPages}
            >
              <box-icon type="solid" name="chevrons-right"></box-icon>
            </button>
          </div>
        )}
    </div>
  );
};

export default UnassignedWork;
