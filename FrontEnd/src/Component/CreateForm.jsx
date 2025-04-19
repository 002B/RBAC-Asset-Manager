import { useState } from "react";
import PropTypes from "prop-types";
import SweetAlert from "sweetalert2";
import "boxicons";
import './CreateForm.css';

async function sendReport(data) {
  try {
    const res = await fetch("http://localhost:3000/log/createLogReport/SCB/SCB_2/test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return res.ok;
  } catch (err) {
    console.error(err);
    return false;
  }
}

function CreateForm({ onClose }) {
  const [forms, setForms] = useState([
    { id: 1, serialNumber: '', company: '', location: '', problem: '', isCollapsed: false }
  ]);
  const [isSending, setIsSending] = useState(false);

  const handleChange = (id, e) => {
    const { name, value } = e.target;
    setForms(forms.map(f => f.id === id ? { ...f, [name]: value } : f));
  };

  const addNewForm = () => {
    const newId = forms.length ? Math.max(...forms.map(f => f.id)) + 1 : 1;
    setForms([...forms, { 
      id: newId, 
      serialNumber: '', 
      company: '', 
      location: '', 
      problem: '', 
      isCollapsed: false 
    }]);
  };

  const toggleCollapse = (id) => {
    setForms(forms.map(f => f.id === id ? { ...f, isCollapsed: !f.isCollapsed } : f));
  };

  const removeForm = (id) => {
    if (forms.length === 1) {
      SweetAlert.fire({
        title: "Cannot remove",
        text: "You must have at least one report",
        icon: "warning",
        confirmButtonColor: "#4F46E5",
      });
      return;
    }

    SweetAlert.fire({
      title: "Are you sure?",
      text: "You want to remove this report?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#4F46E5",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Remove",
    }).then((result) => {
      if (result.isConfirmed) {
        setForms(forms.filter(f => f.id !== id));
      }
    });
  };

  const confirmSend = async () => {
    const emptyFields = forms.some(form => 
      !form.serialNumber || !form.company || !form.location || !form.problem
    );
    
    if (emptyFields) {
      SweetAlert.fire({
        title: "Incomplete Forms",
        text: "Please fill all required fields before submitting",
        icon: "warning",
        confirmButtonColor: "#4F46E5",
      });
      return;
    }

    const result = await SweetAlert.fire({
      title: "Are you sure?",
      text: `You want to send ${forms.length} report${forms.length > 1 ? 's' : ''}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#4F46E5",
      cancelButtonColor: "#6B7280",
      confirmButtonText: `Send ${forms.length} Report${forms.length > 1 ? 's' : ''}`,
    });

    if (result.isConfirmed) {
      setIsSending(true);
      try {
        const success = await Promise.all(forms.map(form => sendReport(form)));
        if (success.every(Boolean)) {
          SweetAlert.fire({
            title: "Success!",
            text: `Your ${forms.length} report${forms.length > 1 ? 's were' : ' was'} sent successfully`,
            icon: "success",
            confirmButtonColor: "#4F46E5",
          });
          setForms([{ id: 1, serialNumber: '', company: '', location: '', problem: '', isCollapsed: false }]);
        } else {
          SweetAlert.fire({
            title: "Error",
            text: "Some reports failed to send. Please try again.",
            icon: "error",
            confirmButtonColor: "#4F46E5",
          });
        }
      } finally {
        setIsSending(false);
      }
    }
  };

  const confirmClose = () => {
    const hasUnsavedData = forms.some(form => 
      form.serialNumber || form.company || form.location || form.problem
    );

    if (hasUnsavedData) {
      SweetAlert.fire({
        title: "Unsaved Changes",
        text: "You have unsaved changes. Are you sure you want to close?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#4F46E5",
        cancelButtonColor: "#6B7280",
        confirmButtonText: "Yes, close it",
      }).then((result) => {
        if (result.isConfirmed) {
          onClose();
        }
      });
    } else {
      onClose();
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      confirmClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-md flex items-center justify-center p-4 z-50"
      onClick={handleOverlayClick}
    >
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] rounded-2xl bg-white shadow-xl overflow-hidden border-gray-100 flex flex-col form-container"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header - เปลี่ยนเป็นสี -primary-color (#2f6690) */}
        <div className="sticky top-0 z-10 p-6 bg-[#2f6690] text-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
                <box-icon name="file" type="solid" color="white" size="md"></box-icon>
              </div>
              <div>
                <h1 className="text-2xl font-bold">Create Report</h1>
                <p className="text-sm text-white text-opacity-90">
                  {forms.length} report{forms.length !== 1 ? 's' : ''} ready
                </p>
              </div>
            </div>
            <button 
              onClick={confirmClose}
              className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-all"
              aria-label="Close"
            >
              <box-icon name="x" color="white"></box-icon>
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6 relative z-10 bg-[#D9DCD6]">
          <div className="space-y-5">
            {forms.map((form, index) => (
              <div 
                key={form.id} 
                className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md ${
                  form.isCollapsed ? 'pb-0' : ''
                }`}
              >
                <div 
                  className={`flex justify-between items-center p-4 cursor-pointer bg-gradient-to-r from-gray-50 to-white ${
                    form.isCollapsed ? 'border-b-0' : 'border-b border-gray-200'
                  }`}
                  onClick={() => toggleCollapse(form.id)}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCollapse(form.id);
                      }}
                      className="p-2 text-gray-500 hover:text-[#2f6690] rounded-lg hover:bg-gray-100 transition-all duration-200"
                      aria-label={form.isCollapsed ? "Expand" : "Collapse"}
                    >
                      <box-icon name={form.isCollapsed ? 'chevron-down' : 'chevron-up'}></box-icon>
                    </button>
                    <h2 className="text-lg font-semibold text-gray-800">
                      Report {index + 1}
                    </h2>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeForm(form.id);
                    }}
                    className="p-2 text-red-500 hover:text-white rounded-lg hover:bg-red-500 transition-all duration-200"
                    aria-label="Remove report"
                  >
                    <box-icon name="trash" size="sm"></box-icon>
                  </button>
                </div>

                <div className={`${form.isCollapsed ? 'hidden' : 'p-5'}`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-4">
                      {["serialNumber", "company", "location"].map((field) => (
                        <label key={field} className="block">
                          <span className="text-sm font-medium text-gray-700 capitalize mb-2 block flex items-center">
                            {field === "serialNumber" ? "Serial Number" : field.replace(/([A-Z])/g, ' $1').trim()}
                            <span className="text-red-500 ml-1">*</span>
                          </span>
                          <input
                            type="text"
                            name={field}
                            value={form[field]}
                            onChange={(e) => handleChange(form.id, e)}
                            className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-[#81c3d7] focus:border-[#3a7ca5] p-3 bg-white text-sm shadow-sm border transition-all duration-200"
                            placeholder={`Enter ${field}`}
                            required
                          />
                        </label>
                      ))}
                    </div>

                    <div className="space-y-4">
                      <label className="block">
                        <span className="text-sm font-medium text-gray-700 mb-2 block flex items-center">
                          Problem Description
                          <span className="text-red-500 ml-1">*</span>
                        </span>
                        <textarea
                          name="problem"
                          value={form.problem}
                          onChange={(e) => handleChange(form.id, e)}
                          className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-[#81c3d7] focus:border-[#3a7ca5] p-3 bg-white text-sm shadow-sm min-h-[120px] border transition-all duration-200"
                          placeholder="Describe the problem in detail..."
                          required
                        />
                      </label>

                      <div className="mt-4 p-4 bg-[#81c3d7] bg-opacity-30 rounded-lg flex items-start gap-3 border border-[#3a7ca5] border-opacity-30 shadow-inner">
                        <box-icon 
                          name="info-circle" 
                          type="solid" 
                          color="#16425b"
                          class="flex-shrink-0"
                        ></box-icon>
                        <p className="text-sm text-[#16425b] leading-relaxed">
                          <span className="font-medium">Include:</span> When it occurred, error messages, and steps to reproduce. We'll respond within 24 hrs.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-gray-200 p-4 flex justify-between items-center z-10 shadow-sm">
          <button
            onClick={addNewForm}
            className="flex items-center gap-2 px-4 py-2.5 text-[#2f6690] font-medium rounded-lg border border-[#3a7ca5] hover:bg-[#81c3d7] hover:bg-opacity-20 transition-all duration-200 hover:shadow-sm"
            aria-label="Add another report"
          >
            <box-icon name="plus" color="#2f6690"></box-icon>
            <span>Add Another Report</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={confirmSend}
              disabled={isSending}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#FF6700] text-white font-medium rounded-lg shadow-md hover:shadow-lg hover:bg-[#FF6700]/90 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
              aria-label="Send reports"
            >
              {isSending ? (
                <>
                  <box-icon name="loader-circle" animation="spin" color="white"></box-icon>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <box-icon name="send" color="white"></box-icon>
                  <span>Send {forms.length} Report{forms.length !== 1 ? 's' : ''}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

CreateForm.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default CreateForm;