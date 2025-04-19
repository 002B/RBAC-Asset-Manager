import { useState, useEffect } from "react";

const AddItemForm = ({ onClose, onSubmit }) => {
  const [company, setCompany] = useState(""); 
  const [branch, setBranch] = useState(""); 

  const [companyBranchData, setCompanyBranchData] = useState({});
  const [isLoading, setIsLoading] = useState(true); 
  const [formData, setFormData] = useState({
    item_client: "", 
    item_client_branch: "", 
    item_brand: "SafetyPlus",
    item_capacity: "3kg",
    item_color: "red",
    item_type: "foam",
    item_class: "ABC",
  });

  useEffect(() => {
    const fetchCompanyBranches = async () => {
      try {
        const response = await fetch("http://localhost:3000/company/getCompanyBranch");
        const data = await response.json();

        if (response.ok) {
          setCompanyBranchData(data);
          setIsLoading(false); 
        } else {
          console.error("Failed to fetch company and branch data");
        }
      } catch (error) {
        console.error("Error fetching company branches:", error);
        setIsLoading(false);
      }
    };

    fetchCompanyBranches();
  }, []); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCompanyChange = (e) => {
    const selectedCompany = e.target.value;
    setCompany(selectedCompany);
    setFormData({
      ...formData,
      item_client: selectedCompany,
      item_client_branch: "", 
    });
  };

  const handleBranchChange = (e) => {
    setBranch(e.target.value);
    setFormData({
      ...formData,
      item_client_branch: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const requestBody = {
        item_client: formData.item_client,
        item_client_branch: formData.item_client_branch,
        item_brand: formData.item_brand,
        item_capacity: formData.item_capacity,
        item_color: formData.item_color,
        item_type: formData.item_type,
        item_class: formData.item_class,
      };

      const response = await fetch(
        `http://localhost:3000/item/createItem/${company}/${branch}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
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

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-xl font-bold text-primary mb-4">Loading...</h2>
        </div>
      </div>
    );
  }

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
                name="item_client"
                value={formData.item_client}
                onChange={handleCompanyChange}
                className="border-2 border-primary rounded w-full p-2"
              >
                <option value="">Select Company</option>
                {Object.keys(companyBranchData).map((companyName) => (
                  <option key={companyName} value={companyName}>
                    {companyName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Branch
              </label>
              <select
                name="item_client_branch"
                value={formData.item_client_branch}
                onChange={handleBranchChange}
                className="border-2 border-primary rounded w-full p-2"
                disabled={!company} 
              >
                <option value="">Select Branch</option>
                {companyBranchData[company]?.map((branchName) => (
                  <option key={branchName} value={branchName}>
                    {branchName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Brand
              </label>
              <select
                name="item_brand"
                value={formData.item_brand}
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
                name="item_type"
                value={formData.item_type}
                onChange={handleChange}
                className="border-2 border-primary rounded w-full p-2"
              >
                <option value="foam">Foam</option>
                <option value="liquid">Liquid</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Capacity
              </label>
              <select
                name="item_capacity"
                value={formData.item_capacity}
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
                name="item_color"
                value={formData.item_color}
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
                Item Class
              </label>
              <input
                type="text"
                name="item_class"
                value={formData.item_class}
                onChange={handleChange}
                className="border-2 border-primary rounded w-full p-2"
                required
              />
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

