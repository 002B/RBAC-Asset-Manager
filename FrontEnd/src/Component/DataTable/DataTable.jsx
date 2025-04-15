import React, { useState, useMemo } from "react";
import "./DataTable.css";
import CreateForm from "../CreateForm";
import "boxicons";
import ExportExcel from "../ExcelExport";
import AddItemForm from "../addItemForm";
import EditItemForm from "../editItemForm";

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
  hasExport = false,
  hasAddItem = false,
  hasEdit = false,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showAddItemForm, setShowAddItemForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const itemsPerPage = itemPerPage || 10;
  const headerHeight = 32;
  const rowHeight = 40;
  const minTableHeight = rowHeight * itemsPerPage + headerHeight;

  const isObjectData = typeof data[0] === "object" && !Array.isArray(data[0]);

  const totalPages = useMemo(() => Math.ceil(data.length / itemsPerPage), [data.length, itemsPerPage]);

  const sortedData = useMemo(() => {
    return [...data]
      .filter((row) => {
        const value = isObjectData ? row[title[0]] : row[0];
        return value?.toString().toLowerCase().includes(searchQuery.toLowerCase());
      })
      .sort((a, b) => {
        if (sortConfig.key === null) return 0;
        const itemA = isObjectData ? a[sortConfig.key] : a[title.indexOf(sortConfig.key)];
        const itemB = isObjectData ? b[sortConfig.key] : b[title.indexOf(sortConfig.key)];
        return typeof itemA === "number" && typeof itemB === "number"
          ? sortConfig.direction === "asc" ? itemA - itemB : itemB - itemA
          : sortConfig.direction === "asc"
          ? itemA?.toString().localeCompare(itemB)
          : itemB?.toString().localeCompare(itemA);
      });
  }, [data, sortConfig, searchQuery, title, isObjectData]);

  const currentData = useMemo(() => {
    return sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  const handleEditClick = (rowData) => {
    const value = isObjectData ? rowData : Object.fromEntries(title.map((key, i) => [key, rowData[i]]));
    setEditingItem({
      ...value,
      company: value.company || "ThaiBev",
      branch: value.branch || "ThaiBev_1",
      log: { Install: value.install_date },
    });
    setShowEditForm(true);
  };

  const colorIcon = (row) => {
    const value = isObjectData ? Object.values(row).join(" ") : row.join(" ");
    if (/Good|Login|Install|Report Accepted/.test(value)) return "green";
    if (/Fixing|Change/.test(value)) return "#EEE150";
    if (/Bad|Uninstall|Logout|Rejected/.test(value)) return "red";
    return "#FD6E28";
  };

  const getPaginationRange = () => {
    const start = Math.max(currentPage - 1, 1);
    const end = Math.min(currentPage + 1, totalPages);
    if (end - start < 2) {
      if (start === 1) return [1, 2, 3].slice(0, totalPages);
      if (end === totalPages) return [totalPages - 2, totalPages - 1, totalPages];
    }
    return [start, start + 1, start + 2];
  };

  return (
    <div className="data-table-wrapper">
      <div className="table-title flex items-center justify-between flex-wrap">
        <div className="flex items-center">
          {tIcon && <box-icon name={tIcon} size="sm" color="#4c3575"></box-icon>}
          {tName && <h2 className="p-2 text-secondary">{tName}</h2>}
        </div>
        <div className="flex gap-2 justify-center items-center">
          {hasExport && (
            <button className="border-2 border-primary bg-white rounded flex p-1 hover:bg-secondary" onClick={() => ExportExcel(data)}>
              <box-icon name="export" color="#FD6E28"></box-icon>
              <span className="px-1 text-primary">Export</span>
            </button>
          )}
          {hasSearch && (
            <div className="search-bar">
              <box-icon name="filter" type="regular" size="sm" color="#FD6E28"></box-icon>
              <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              <box-icon name="search" type="regular" size="sm" color="#FD6E28"></box-icon>
            </div>
          )}
          {hasAddItem && (
            <button className="border-2 border-primary bg-white rounded flex p-1 hover:bg-secondary" onClick={() => setShowAddItemForm(true)}>
              <box-icon name="plus" color="#FD6E28"></box-icon>
              <span className="px-1 text-primary">Add</span>
            </button>
          )}
        </div>
      </div>
      <div className="data-table-container overflow-scroll" style={{ minHeight: minTableHeight }}>
        <table className="data-table">
          <thead>
            <tr>
              {colIcon && <th></th>}
              {title.map((header, index) => (
                <th key={index} onClick={() => setSortConfig({
                  key: header,
                  direction: sortConfig.key === header && sortConfig.direction === "asc" ? "desc" : "asc",
                })}>
                  <span className="flex justify-center items-center">
                    {header}
                    {sortConfig.key === header && (
                      <box-icon name={sortConfig.direction === "asc" ? "caret-up" : "caret-down"} size="16px" color="#f16e3d"></box-icon>
                    )}
                  </span>
                </th>
              ))}
              {(hasButton || hasEdit) && <th className="bg-transparent sticky -right-1"></th>}
            </tr>
          </thead>
          <tbody>
            {currentData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {colIcon && (
                  <td className="flex justify-center items-center">
                    <box-icon name={colIcon} size="sm" color={colorIcon(row)} type="regular"></box-icon>
                  </td>
                )}
                {title.map((key, colIndex) => (
                  <td key={colIndex}>{isObjectData ? row[key] || "-" : row[colIndex] || "-"}</td>
                ))}
                {hasEdit && (
                  <td className="bg-white sticky -right-1">
                    <button onClick={() => handleEditClick(row)} className="flex justify-center items-center">
                      <box-icon type="regular" name="edit" size="sm" color="#FD6E28"></box-icon>
                    </button>
                  </td>
                )}
                {hasButton && (
                  <td className="bg-white sticky -right-1">
                    <button onClick={() => setShowCreateForm(true)} className="flex justify-center items-center">
                      <box-icon type="regular" name="edit" size="sm" color="#FD6E28"></box-icon>
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {hasPagination && (
        <div className="pagination">
          <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
            <box-icon type="solid" name="chevrons-left"></box-icon>
          </button>
          <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
            <box-icon type="solid" name="chevron-left"></box-icon>
          </button>
          {getPaginationRange().map((page) => (
            <button key={page} onClick={() => setCurrentPage(page)} className={currentPage === page ? "active" : ""}>
              {page}
            </button>
          ))}
          <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
            <box-icon type="solid" name="chevron-right"></box-icon>
          </button>
          <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>
            <box-icon type="solid" name="chevrons-right"></box-icon>
          </button>
        </div>
      )}
      {showCreateForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur">
          <div className="absolute inset-0" onClick={() => setShowCreateForm(false)}></div>
          <CreateForm data={formData} placeholderData={formPlaceholder} />
        </div>
      )}
      {showAddItemForm && (
        <AddItemForm onClose={() => setShowAddItemForm(false)} onSubmit={() => setShowAddItemForm(false)} />
      )}
      {showEditForm && (
        <EditItemForm onClose={() => setShowEditForm(false)} onSubmit={() => setShowEditForm(false)} initialData={editingItem} />
      )}
    </div>
  );
};

export default DataTable;