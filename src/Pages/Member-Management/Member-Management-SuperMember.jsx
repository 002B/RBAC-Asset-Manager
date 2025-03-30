import { useRef, useState } from "react";
import SweetAlert from "sweetalert2";
import "boxicons";
import "./Member-Management.css";
import { useAuth } from "../../Auth/AuthProvider";
import { getMembers } from "../../Auth/User";
import { getBranchList } from "../../Component/Count";

function Confirm() {
  SweetAlert.fire({
    title: "Are you sure?",
    text: "You need to add member?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#FD6E28",
    cancelButtonColor: "#B3B4AD",
    confirmButtonText: "Sure",
    reverseButtons: true,
  }).then((result) => {
    if (result.isConfirmed) {
      SweetAlert.fire({
        title: "Congratulations! ",
        text: "Member has been added!",
        icon: "success",
        confirmButtonColor: "#FD6E28",
      });
    }
  });
}

const MemberManagementSuperMember = () => {
  const { user } = useAuth();
  const filterBoxRef = useRef();
  const [currentPage, setCurrentPage] = useState(1);
  const [showUserCard, setShowUserCard] = useState(false);
  const [selectedUser, setSelectedUser] = useState({
    display_name: "",
    user: "",
    company: "",
    role: "",
    display_role: "",
    branch: [""],
  });

  function ConfirmUpdate(userName) {
    SweetAlert.fire({
      title: "Are you sure?",
      text: "You need to update " + userName + " ?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#FD6E28",
      cancelButtonColor: "#B3B4AD",
      confirmButtonText: "Yes",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        SweetAlert.fire({
          title: "Change Updated! ",
          text: "Member has been updated!",
          icon: "success",
          confirmButtonColor: "#FD6E28",
        });
      }
      return setShowUserCard(false);
    });
  }

  const testUsers = getMembers(user.company);

  const itemsPerPage = 8;

  const currentData = testUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(testUsers.length / itemsPerPage);

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

  testUsers.forEach((user, index) => {
    user.img = "https://picsum.photos/id/" + (1080-index) + "/256";
  });
  const filterList = {
    Branch: [...new Set(testUsers.map((user) => user.company))],
  };

  const toggleFilterBox = () => {
    filterBoxRef.current.classList.toggle("hidden");
  };

  const handleUserCard = (user) => {
    setShowUserCard(true);
    setSelectedUser(user);
  };

  const UserCardEdit = ({ user }) => {
    return (
      <div className="w-fit h-fit">
        <div
          className="rounded-lg user-card-edit flex flex-col justify-center items-center
        bg-white flex-1 drop-shadow-lg gap-2 p-4 w-[400px] h-fit border-2 border-secondary"
        >
          <div className="user-card-detail flex flex-col w-full h-full gap-2">
            <div className="user-card-header flex flex-col justify-center items-center">
              <h2 className="text-secondary">Update Member Details</h2>
              <div className="user-card-img flex justify-center items-center">
                <img
                  className="w-48 h-48 rounded-full p-1 border-primary border-2 transition-all duration-300 ease-in-out hover:border-8 hover:p-0"
                  src={user.img}
                  alt="user"
                />
              </div>
            </div>
            <div className="user-card-body  flex flex-col justify-center items-start gap-2">
              <label
                className="flex flex-col w-full"
                htmlFor="user-display-name"
              >
                <span className="text-sm">Full Name : </span>
                <input
                  className="p-1 border-2 outline-secondary rounded hover:border-primary focus:outline-primary"
                  type="text"
                  id="user-display-name"
                  name="user-display-name"
                  defaultValue={user.display_name}
                />
              </label>
              <label className="flex flex-col w-full" htmlFor="user-username">
                <span className="text-sm">Username : </span>
                <input
                  className="p-1 border-2 outline-secondary rounded hover:border-primary focus:outline-primary"
                  type="text"
                  id="user-username"
                  name="user-username"
                  defaultValue={user.user}
                />
              </label>
              <label
                className="flex flex-col w-full rounded"
              >
                <span className="text-sm">
                  Branch Assigned : <b>{user.branch.length}</b>
                </span>
                <div className=" border-secondary border-2 hover:border-primary flex w-full p-1 rounded flex-col ">
                  {getBranchList(user.company).map((branch, index) => (
                    <label className="flex gap-2" key={index} htmlFor="">
                      <input
                        type="checkbox"
                        name={user.user + user.branch}
                        id={user.branch + index}
                        defaultChecked={
                          user.branch.includes(branch) ? true : false
                        }
                      />
                      <span>{branch}</span>
                    </label>
                  ))}
                </div>
              </label>
            </div>
          </div>
          <div className="flex w-full gap-2">
            <button
              className="bg-red-600 flex w-full justify-center items-center text-white p-1 rounded-lg"
              onClick={() => setShowUserCard(false)}
            >
              <box-icon name="x" color="white"></box-icon>
              Cancel
            </button>
            <button
              className="bg-green-600 flex w-full justify-center items-center text-white p-1 rounded-lg"
              onClick={() => ConfirmUpdate(user.display_name)}
            >
              <box-icon name="check" color="white"></box-icon>
              Save
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {showUserCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur">
          <div
            className="absolute inset-0"
            onClick={() => setShowUserCard(false)}
          ></div>
          <UserCardEdit user={selectedUser} />
        </div>
      )}

      <div className="flex flex-col gap-2">
        <div className="member-management-bar bg-primary p-2 rounded-[8px] drop-shadow flex items-center justify-between sticky top-0 z-10">
          <div className="member-management-header flex gap-2 justify-center items-center">
            <box-icon
              name="group"
              type="solid"
              size="md"
              color="white"
            ></box-icon>
            <button type="submit"></button>
            <h2 className="text-white">Member Management</h2>
          </div>
          <div className="member-management-tool flex gap-2">
            <div className="member-add flex justify-center items-center rounded">
              <button
                className="flex justify-center items-center p-2 w-fit h-fit"
                onClick={() => Confirm()}
              >
                <box-icon
                  name="user-plus"
                  type="solid"
                  size="sm"
                  color="white"
                ></box-icon>
              </button>
            </div>
            <div className="member-search flex flex-col justify-center items-center gap-2">
              <div className="search-box flex gap-2">
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
                <input type="text" placeholder="Search" name="member-search" />
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
        <div className="user-card-container grid grid-cols-4 gap-2">
          {currentData.map((user, index) => (
            <div
              className="user-card flex flex-col items-center flex-1 bg-white drop-shadow-md"
              key={index}
            >
              <div className="user-card-detail flex flex-col w-full h-full">
                <div className="user-card-header flex flex-col justify-center items-center">
                  <div className="user-card-img flex justify-center items-center">
                    <img
                      className="w-32 h-32 rounded-full"
                      src={user.img}
                      alt="user-profile-img"
                    />
                  </div>
                </div>
                <div className="user-card-body flex flex-col justify-center items-center">
                  <h3 className="text-secondary text-nowrap">
                    {user.display_name}
                  </h3>
                  <h4>ID : {user.user}</h4>
                </div>
                <div className="user-card-footer flex flex-col w-full">
                  <ul className="font-bold text-secondary p-1">
                    Assigned Branch : {user.branch.length}
                  </ul>
                  <div className="user-branch-list">
                    {user.branch.map((branch, index) => (
                      <li className="pb-1" key={index}>
                        {branch}
                      </li>
                    ))}
                  </div>
                </div>
              </div>
              <button
                className="edit-button flex w-full justify-center items-center w-ful text-white p-1 rounded-lg"
                onClick={() => handleUserCard(user)}
              >
                <box-icon name="edit-alt" color="white"></box-icon>
                Edit User
              </button>
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
    </div>
  );
};

export default MemberManagementSuperMember;
