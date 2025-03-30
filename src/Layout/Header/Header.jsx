import React, { useEffect } from "react";
import "./Header.css";
import { useAuth } from "../../Auth/AuthProvider";
import { getBranchList } from "../../Component/Count";

const Header = () => {
  const { user, setUser } = useAuth();

  useEffect(() => {
    if (user.role === "member") {
      setUser({
        ...user,
        selectedBranch: user.branch[0],
      });
    }

    if (user.role === "super_member") {
      setUser({
        ...user,
        selectedBranch: "All Branches",
        selectedRole: "super_member",
      });
    }
  }, []);

  const branchList = getBranchList(user.company);

  const handleBranchChange = (event) => {
    const selectedBranch = event.target.value;
    if (user.role === "super_member") {
      if (selectedBranch === "All Branches") {
        setUser({
          ...user,
          selectedBranch: "All Branches",
          selectedRole: "super_member",
        });
      } else {
        setUser({
          ...user,
          selectedBranch: selectedBranch,
          selectedRole: "member",
        });
      }
    }
    else{
      setUser({
        ...user,
        selectedBranch: selectedBranch,
      });
    }
    
  };

  return (
    <div className="header flex justify-between items-center">
      <div className="header-text flex flex-col justify-center h-28">
        <p className="ml-2">
          Hi {user.user} from {user.company}
        </p>
        <span className="ml-2 text-4xl">
          Welcome to <span className="text-primary font-bold">Metthier</span>!
        </span>
      </div>
      {user.branch.length > 1 && (
        <div className="branch-selector-container flex justify-between items-center gap-2 drop-shadow-md w-[250px]">
          <box-icon name="buildings" type="regular" color="white"></box-icon>
          <div className="branch-selector w-full">
            {user.role === "member" && (
              <select
                name={"branch-selector"}
                id="branch-selector"
                className="border-2 border-secondary p-1 px-2 rounded w-full"
                onChange={handleBranchChange}
                value={user.selectedBranch}
              >
                {user.branch.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            )}
            {user.role === "super_member" && (
              <select
                name={"branch-selector"}
                id="branch-selector"
                className="border-2 border-secondary p-1 px-2 rounded w-full"
                onChange={handleBranchChange}
                value={user.selectedBranch}
              >
                <option value="All Branches">All Branches</option>
                {branchList.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
