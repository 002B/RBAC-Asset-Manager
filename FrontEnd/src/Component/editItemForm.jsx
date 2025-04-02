import { useState, useEffect } from "react";

const EditItemForm = ({ onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    id: initialData?.id,
    company: initialData?.company || "",
    branch: initialData?.branch || "",
    brand: "",
    type: "",
    capacity: "",
    install_by: "",
    install_date: "",
    exp_date: "",
    location: "",
    color: "",
    next_check: "",
    last_check: "",
    status: "",
    log: {
      Install: "",
    },
  });

  // Initialize form with existing data
  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id || "",
        company: initialData.company || "",
        branch: initialData.branch || "",
        brand: initialData.brand || "",
        type: initialData.type || "",
        capacity: initialData.capacity || "",
        install_by: initialData.install_by || "",
        install_date: initialData.install_date || "",
        exp_date: initialData.exp_date || "",
        location: initialData.location || "",
        color: initialData.color || "red",
        next_check: initialData.next_check || "",
        last_check: initialData.last_check || "",
        status: initialData.status || "Good",
        log: {
          Install: initialData.log?.Install || "",
        },
      });
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create a copy of formData without id, company, and branch
      const { id, company, branch, ...requestBody } = formData;
      console.log(requestBody)

      const response = await fetch(
        `http://localhost:3000/item/updateItem/${formData.company}/${formData.branch}/${formData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody), // Only includes the fields we want to update
        }
      );

      if (response.ok) {
        onSubmit();
        onClose();
      } else {
        console.error("Failed to update item");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in formData.log) {
      setFormData({
        ...formData,
        log: {
          ...formData.log,
          [name]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleDelete = async () => {
    try {
      // console.log(formData);
      // console.log(`http://localhost:3000/item/deleteItem/${formData.company}/${formData.branch}/${formData.id}`,)
      const response = await fetch(
        `http://localhost:3000/item/deleteItem/${formData.company}/${formData.branch}/${formData.id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        onSubmit();
        onClose();
      } else {
        console.error("Failed to delete item");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold text-primary mb-4">Edit Item</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 mb-4">
            <div className="grid grid-cols-1 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Company
                </label>
                <select
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="border-2 border-primary rounded w-full p-2"
                >
                  <option value="ThaiBev">ThaiBev</option>
                  <option value="SCB">SCB</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Branch
                </label>
                <select
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  className="border-2 border-primary rounded w-full p-2"
                >
                  {formData.company === "ThaiBev" ? (
                    <>
                      <option value="ThaiBev_1">ThaiBev_1</option>
                      <option value="ThaiBev_2">ThaiBev_2</option>
                    </>
                  ) : (
                    <>
                      <option value="SCB_1">SCB_1</option>
                      <option value="SCB_2">SCB_2</option>
                    </>
                  )}
                </select>
              </div>
              {/* Rest of your form fields */}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Brand
              </label>
              <select
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="border-2 border-primary rounded w-full p-2"
              >
                <option value="SafetyPlus">SafetyPlus</option>
                <option value="SafePro">SafePro</option>
                <option value="Chubb">Chubb</option>
                <option value="FireGuard">FireGuard</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="border-2 border-primary rounded w-full p-2"
              >
                <option value="Foam">Foam</option>
                <option value="Liquid">Liquid</option>
                <option value="Fire Extinguisher">Fire Extinguisher</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Capacity
              </label>
              <select
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                className="border-2 border-primary rounded w-full p-2"
              >
                <option value="3kg">3 KG</option>
                <option value="5kg">5 KG</option>
                <option value="7kg">7 KG</option>
                <option value="10kg">10 KG</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Installed By
              </label>
              <input
                type="text"
                name="install_by"
                value={formData.install_by}
                onChange={handleChange}
                className="border-2 border-primary rounded w-full p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Color
              </label>
              <select
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="border-2 border-primary rounded w-full p-2"
              >
                <option value="red">Red</option>
                <option value="green">Green</option>
                <option value="silver">Silver</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Install Date
              </label>
              <input
                type="date"
                name="install_date"
                value={formData.install_date}
                onChange={handleChange}
                className="border-2 border-primary rounded w-full p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Expiration Date
              </label>
              <input
                type="date"
                name="exp_date"
                value={formData.exp_date}
                onChange={handleChange}
                className="border-2 border-primary rounded w-full p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="border-2 border-primary rounded w-full p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Next Check
              </label>
              <input
                type="date"
                name="next_check"
                value={formData.next_check}
                onChange={handleChange}
                className="border-2 border-primary rounded w-full p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Last Check
              </label>
              <input
                type="date"
                name="last_check"
                value={formData.last_check}
                onChange={handleChange}
                className="border-2 border-primary rounded w-full p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="border-2 border-primary rounded w-full p-2"
              >
                <option value="Good">Good</option>
                <option value="Need Maintenance">Need Maintenance</option>
                <option value="Fixing">Fixing</option>
                <option value="Bad">Bad</option>
                <option value="Expired">Expired</option>
              </select>
            </div>
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={handleDelete}
              className="border-2 border-red-500 bg-red-500 text-white rounded px-4 py-2 transition-all duration-300 ease-in-out hover:bg-red-600 hover:border-red-600"
            >
              Delete
            </button>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="border-2 border-primary bg-white rounded px-4 py-2 text-primary transition-all duration-300 ease-in-out hover:bg-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="border-2 border-primary bg-primary rounded px-4 py-2 text-white transition-all duration-300 ease-in-out hover:bg-secondary hover:border-secondary"
              >
                Confirm Edit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditItemForm;
