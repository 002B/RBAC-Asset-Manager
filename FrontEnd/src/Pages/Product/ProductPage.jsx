import { useEffect, useState } from "react";
import { getItemInfo } from "../../Component/file";
import CreateForm from "../../Component/CreateForm";
import Logo from "../../assets/Logo/Logo.png";
import placeholder from "../../assets/img/placeholder.png";

import "./ProductPage.css";
import "boxicons";

const ProductPage = ({ company, branch, id }) => {
  const [show, setShow] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  useEffect(() => {
    setSelectedData(getItemInfo(company, branch, id));
  }, []);

  if (!selectedData) {
    return (
      <div className="flex flex-col bg-light min-h-screen justify-center items-center">
        <div className="product-container bg-white p-4 flex flex-col justify-center items-center rounded-lg h-fit drop-shadow">
        <div className="product-logo flex justify-center ">
          <img className=" w-[256px]" src={Logo} alt="Logo" />
        </div>
        <div className="flex flex-col gap-2 justify-center items-center"><box-icon name="question-mark" color="#FD6E28" size="lg"></box-icon>
        <span className="text-2xl">Product Not Found</span></div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-page flex gap-2 bg-light justify-center items-center min-h-fit h-screen">
      <div className="product-container flex gap-4 bg-white p-4 flex-wrap justify-center items-center rounded-lg h-fit drop-shadow-md">
        <div className="product-left flex flex-col gap-4">
          <div className="product-logo flex justify-center ">
            <img className=" w-[256px]" src={Logo} alt="Logo" />
          </div>
          <div className="product-image flex justify-center items-center rounded-lg drop-shadow">
            <img src={placeholder} alt="Product" />
          </div>
        </div>
        <div className="product-right flex justify-center items-center flex-col gap-4">
          <div className="product-info">
            <div className="product-table-container">
              <table className="flex flex-col product-table gap-2">
                <thead>
                  <tr>
                    <th colSpan={2} className="text-center rounded-lg">
                      <h2>Fire Extinguisher Details</h2>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedData &&
                    Object.entries(selectedData).map(([key, value]) => {
                      switch (key) {
                        case "Com":
                          return (
                            <tr key={key}>
                              <td className="font-bold">Company</td>
                              <td>{value}</td>
                            </tr>
                          );
                        case "Bran":
                          return (
                            <tr key={key}>
                              <td className="font-bold">Branch</td>
                              <td>{value}</td>
                            </tr>
                          );
                        case "ID":
                          return (
                            <tr key={key}>
                              <td className="font-bold">Serial Number</td>
                              <td>{value}</td>
                            </tr>
                          );
                        case "brand":
                          return (
                            <tr key={key}>
                              <td className="font-bold">Brand</td>
                              <td>{value}</td>
                            </tr>
                          );
                        case "type":
                          return (
                            <tr key={key}>
                              <td className="font-bold">Type</td>
                              <td>{value}</td>
                            </tr>
                          );
                        case "capacity":
                          return (
                            <tr key={key}>
                              <td className="font-bold">Capacity</td>
                              <td>{value}</td>
                            </tr>
                          );
                        case "install_by":
                          return (
                            <tr key={key}>
                              <td className="font-bold">Install By</td>
                              <td>{value}</td>
                            </tr>
                          );
                        case "install_date":
                          return (
                            <tr key={key}>
                              <td className="font-bold">Install Date</td>
                              <td>{value}</td>
                            </tr>
                          );
                        case "exp_date":
                          return (
                            <tr key={key}>
                              <td className="font-bold">Expire Date</td>
                              <td>{value}</td>
                            </tr>
                          );
                        case "location":
                          return (
                            <tr key={key}>
                              <td className="font-bold">Location</td>
                              <td>{value}</td>
                            </tr>
                          );
                        case "color":
                          return (
                            <tr key={key}>
                              <td className="font-bold">Color</td>
                              <td>{value}</td>
                            </tr>
                          );
                        case "next_check":
                          return (
                            <tr key={key}>
                              <td className="font-bold">Next Check</td>
                              <td>{value}</td>
                            </tr>
                          );
                        case "last_check":
                          return (
                            <tr key={key}>
                              <td className="font-bold">Last Check</td>
                              <td>{value}</td>
                            </tr>
                          );
                        case "status":
                          return (
                            <tr key={key}>
                              <td className="font-bold">Status</td>
                              <td>{value}</td>
                            </tr>
                          );
                        case "log":
                          return (
                            <tr key={key} className="flex">
                              <td className="font-bold"> Logs</td>
                              <td>
                                {Object.entries(value).map(
                                  ([logKey, logValue]) => (
                                    <div key={logKey}>
                                      {logKey} : {logValue}
                                    </div>
                                  )
                                )}
                              </td>
                            </tr>
                          );
                        default:
                          return null;
                      }
                    })}
                </tbody>
              </table>
            </div>
          </div>
          <div className="product-report">
            <div className="report-button flex justify-center">
              <button
                className="rounded-lg px-4 py-2 bg-secondary flex justify-center items-center gap-4 filter hover:brightness-110"
                onClick={() => setShow(true)}
              >
                <box-icon name="send" size="md" color="white"></box-icon>
                <span className="text-white font-bold text-3xl">Report</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      {show && (
        <div className="w-full absolute h-full flex justify-center items-center">
          <CreateForm
            data={["Name ", "Serial Number", "Problem", "File", "Submit"]}
          />
          <div
            className="w-full h-full flex justify-center items-center"
            onClick={() => setShow(false)}
          ></div>
        </div>
      )}
    </div>
  );
};
export default ProductPage;
