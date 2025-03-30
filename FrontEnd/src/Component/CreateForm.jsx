import { useState } from "react";
import SweetAlert from "sweetalert2";
import "boxicons";
import './CreateForm.css'

function Confirm() {
  SweetAlert.fire({
    title: "Are you sure?",
    text: "You need to send report?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#FD6E28",
    cancelButtonColor: "#B3B4AD",
    confirmButtonText: "Send",
  }).then((result) => {
    if (result.isConfirmed) {
      SweetAlert.fire({
        title: "Your report has been send!",
        text: "Wait for confirm by Admin",
        icon: "success",
        confirmButtonColor: "#FD6E28",
      });
    }
  });
}

const ImageUploadPreview = ({ name }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    } else {
      alert("Please select a valid image file");
    }
  };

  const handleImageRemove = () => {
    setSelectedImage(null);
  };

  return (
    <div>
      {!selectedImage && (
        <label
          htmlFor={name}
          className="flex flex-col items-center justify-center w-40 h-40 border-2 border-dashed border-secondary rounded-lg cursor-pointer"
        >
          <div className="flex flex-col items-center justify-center">
            <box-icon
              name="image"
              type="regular"
              color="#473366"
              size="64px"
            ></box-icon>
          </div>
          <input
            id={name}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </label>
      )}
      {selectedImage && (
        <div
          className="flex flex-col items-center justify-center w-40 h-40 border-2 border-dashed border-primary rounded-lg cursor-pointer hover:brightness-90"
          onClick={handleImageRemove}
        >
          <img src={selectedImage} alt="Preview" />
        </div>
      )}
    </div>
  );
};

function CreateForm({ data, placeholderData }) {
  if (!placeholderData){
    placeholderData = {}
  }

  return (
    <div className="absolute p-8 border-2 w-1/2 h-fit border-secondary rounded-lg min-w-[380px] bg-white shadow-md">
      <div className="flex justify-center items-center mb-4 text-center gap-2">
        <box-icon name="send" type="solid" color="#FD6E28"></box-icon>
        <span className="text-3xl font-bold text-primary uppercase">
          Send Report
        </span>
      </div>
      <div className="p-2 border-2 border-secondary rounded-lg">
      <div className="flex col-or-row items-center justify-between">
      <div className="flex w-full flex-col gap-2">
        {data?.map((item) =>
          item !== "File" && item !== "Submit" ? (
            <label key={item} htmlFor={item} className="block">
              <span className="text-gray-700 font-bold">{item}</span>
              <input
                id={item}
                value={placeholderData[item] ? placeholderData[item] : null}
                name={item}
                type="text"
                className="mt-1 block w-full border-secondary border-2 rounded-lg shadow-sm focus:border-primary p-[4px]"
                />
            </label>
          ) : null
        )}
      </div>
      <div className="flex justify-center items-center p-4 h-full">
        {data?.map((item) =>
          item === "File" ? (
            <div className="flex justify-center items-center">
              <ImageUploadPreview key={item} name={item} />
            </div>
          ) : null
        )}
      </div>
      </div>
      {data?.map((item) =>
      ( item === "Submit" ? (
        <div key={item} className="w-full flex justify-center items-center p-2">
          <button
            key={item}
            onClick={() => Confirm()}
            type="submit"
            className="flex justify-center items-center bg-secondary text-white font-bold gap-2 py-2 px-4 rounded w-fit hover:brightness-110"
          >
            <box-icon name="send" color="white"></box-icon>
            Send
          </button>
        </div> ) : null
      ))}
        </div>
    </div>
  );
}

export default CreateForm;
