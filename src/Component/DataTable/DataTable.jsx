import React, { useState } from "react";
import "./DataTable.css";
import CreateForm from "../CreateForm";
import "boxicons";
import ExportExcel from "../ExcelExport";
const DataTable = ({
  tIcon,
  tName,
  colIcon,
  title = [],
  data = [],
  itemPerPage,
  hasButton = true,
  hasPagination = true,
  hasSearch = true,
  formData = [],
  formPlaceholder = {},
  hasExport = false
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const itemsPerPage = itemPerPage || 10;
  const headerHeight = 32;
  const rowHeight = 40;
  const minTableHeight = rowHeight * itemsPerPage + headerHeight;
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const sortedData = [...data]
    .filter((row) =>
      row[0]?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortConfig.key === null) return 0;

      const colIndex = title.indexOf(sortConfig.key);
      const itemA = a[colIndex];
      const itemB = b[colIndex];

      if (typeof itemA === "number" && typeof itemB === "number") {
        return sortConfig.direction === "asc" ? itemA - itemB : itemB - itemA;
      } else {
        return sortConfig.direction === "asc"
          ? itemA.localeCompare(itemB)
          : itemB.localeCompare(itemA);
      }
    });

  const currentData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

  const handleButtonClick = () => {
    setShowCreateForm(true);
  };

  function colorIcon(data) {
    if (
      data.includes("Good") ||
      data.includes("Login") ||
      data.includes("Install") ||
      data.includes("Report Accepted")
    ) {
      return "green";
    } else if (data.includes("Fixing") || data.includes("Change")) {
      return "#EEE150";
    } else if (
      data.includes("Bad") ||
      data.includes("Uninstall") ||
      data.includes("Logout") ||
      data.includes("Rejected")
    ) {
      return "red";
    } else {
      return "#FD6E28";
    }
  }

  return (
    <div className="data-table-wrapper">
      <div className="table-title flex items-center justify-between flex-wrap">
        <div className="flex items-center">
          {tIcon ? (
            <box-icon name={tIcon} size="sm" color="#4c3575"></box-icon>
          ) : null}
          {tName ? <h2 className="p-2 text-secondary">{tName}</h2> : null}
        </div>
        <div className="flex gap-2 justify-center items-center">
        {hasExport && (
          <button
            className="border-2 border-primary bg-white rounded flex h-full w-full p-1 transition-all duration-300 ease-in-out hover:bg-secondary"
            onClick={() => ExportExcel(data)}
          >
            <box-icon name="export" color="#FD6E28"></box-icon>
            <span className="px-1 text-primary text-center ">Export</span>
          </button>
        )}
        {hasSearch && (
          <div className="search-bar flex gap-2">
            <button className="flex justify-center items-center w-fit h-fit">
              <box-icon
                name="filter"
                type="regular"
                size="sm"
                color="#FD6E28"
              ></box-icon>
            </button>
            <input
              type="text"
              name={tName + "-search"}
              className="search-input"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
        )}
        </div>
      </div>
      <div
        className="data-table-container overflow-scroll"
        style={{ minHeight: minTableHeight }}
      >
        <table className="data-table">
          <thead>
            <tr>
              {colIcon ? <th></th> : null}
              {title.map((header, index) =>
                header === "" ? (
                  <th key={index}></th>
                ) : (
                  <th
                    key={index}
                    onClick={() =>
                      setSortConfig({
                        key: header,
                        direction:
                          sortConfig.key === header &&
                          sortConfig.direction === "asc"
                            ? "desc"
                            : "asc",
                      })
                    }
                    className={`header ${
                      sortConfig.key === header
                        ? sortConfig.direction === "asc"
                          ? "asc"
                          : "desc"
                        : ""
                    }`}
                  >
                    <span className="flex justify-center items-center">
                      {header}{" "}
                      {sortConfig.key === header ? (
                        sortConfig.direction === "asc" ? (
                          <box-icon
                            name="caret-up"
                            size="16px"
                            color="#f16e3d"
                          ></box-icon>
                        ) : (
                          <box-icon
                            name="caret-down"
                            size="16px"
                            color="f16e3d"
                          ></box-icon>
                        )
                      ) : null}
                    </span>
                  </th>
                )
              )}
              {hasButton ? (
                <th className="bg-transparent sticky -right-1"></th>
              ) : null}
            </tr>
          </thead>
          <tbody>
            {currentData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {colIcon ? (
                  <td
                    key={colIcon}
                    className="flex justify-center items-center"
                  >
                    {/* {colIcon} */}
                    <box-icon
                      name={colIcon}
                      size="sm"
                      color={colorIcon(row)}
                      type="regular"
                    ></box-icon>
                  </td>
                ) : null}
                {title.map((_, colIndex) => (
                  <td key={colIndex}>{row[colIndex] || "-"}</td>
                ))}
                {hasButton ? (
                  <td className="bg-white sticky -right-1">
                    <button
                      onClick={handleButtonClick}
                      className="flex justify-center items-center"
                    >
                      <box-icon
                        type="regular"
                        name="edit"
                        size="sm"
                        color="#FD6E28"
                      ></box-icon>
                    </button>
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {hasPagination ? (
        <div className="pagination">
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
      ) : null}
      {showCreateForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur">
          <div
            className="absolute inset-0"
            onClick={() => setShowCreateForm(false)}
          ></div>
          <CreateForm data={formData} placeholderData={formPlaceholder} />
        </div>
      )}
    </div>
  );
};

export default DataTable;
