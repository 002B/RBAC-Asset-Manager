import { useState } from "react";

const AddItemForm = ({ onClose, onSubmit }) => {
  const [company, setCompany] = useState("ThaiBev");
  const [branch, setBranch] = useState("ThaiBev_1");
  const [id, setId] = useState("");
  const today = new Date();
  const expDate = new Date(
    today.getFullYear() + 5,
    today.getMonth(),
    today.getDate()
  );
  const nextCheck = new Date(
    today.getFullYear(),
    today.getMonth() + 3,
    today.getDate()
  );

  const formattedToday = today.toISOString().split("T")[0];
  const formattedExpDate = expDate.toISOString().split("T")[0];
  const formattedNextCheck = nextCheck.toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    brand: "SafetyPlus",
    type: "Foam",
    capacity: "3kg",
    install_by: "admin",
    install_date: formattedToday,
    exp_date: formattedExpDate,
    location: "",
    color: "red",
    next_check: formattedNextCheck,
    last_check: formattedToday,
    status: "Good",
    log: {
      Install: formattedToday,
    },
  });

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

  const handleCompanyChange = (e) => {
    setCompany(e.target.value);
    // Reset branch when company changes
    setBranch(e.target.value === "ThaiBev" ? "ThaiBev_1" : "SCB_1");
  };

  const handleBranchChange = (e) => {
    setBranch(e.target.value);
  };

  const handleIdChange = (e) => {
    setId(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:3000/item/createItem/${company}/${branch}/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        onSubmit();
        onClose();
      } else {
        console.error("Failed to create item");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold text-primary mb-4">Add New Item</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Company
              </label>
              <select
                name="company"
                value={company}
                onChange={handleCompanyChange}
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
                value={branch}
                onChange={handleBranchChange}
                className="border-2 border-primary rounded w-full p-2"
              >
                {company === "ThaiBev" ? (
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
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Serial Number
              </label>
              <input
                type="text"
                name="id"
                value={id}
                onChange={handleIdChange}
                className="border-2 border-primary rounded w-full p-2"
                required
              />
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
                <option value="Expired">Expired</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
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
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItemForm;