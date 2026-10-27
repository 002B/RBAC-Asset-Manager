import { useRef, useState } from "react";
import { useAuth } from "../../Auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import SweetAlert from "sweetalert2";
import Logo from '../../assets/login-assets/SecondaryLogo/Sugar-rider-logo2-2.png'
import hide from '../../assets/login-assets/hide.png'
import showIcon from '../../assets/login-assets/show.png'
import userIcon from '../../assets/login-assets/user-solid-24.png'
import lock from '../../assets/login-assets/bxs-lock-alt.svg'

import './Login.css';

const DEMO_ACCOUNTS = [
  {
    role: "Admin",
    username: "admin",
    password: "password123",
    desc: "Full System Access",
  },
  {
    role: "Super Member",
    username: "supermember_cp",
    password: "password123",
    desc: "CP-ALL (All Branches)",
  },
  {
    role: "Member",
    username: "member_silom",
    password: "password123",
    desc: "CP-ALL (Silom Only)",
  },
  {
    role: "Worker",
    username: "worker_wichai",
    password: "password123",
    desc: "Field Technician",
  },
  {
    role: "Super Admin",
    username: "superadmin",
    password: "password123",
    desc: "Executive Administrator",
    colSpan: "col-span-2",
  },
];

function LoginPage() {
  const userRef = useRef();
  const passRef = useRef();
  const navigate = useNavigate();

  const { handleLogin } = useAuth();
  const [show, setShow] = useState(true);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      SweetAlert.showLoading();
      const status = await handleLogin(
        userRef.current.value,
        passRef.current.value
      );
      
      if (status === 200) {
        navigate("/dashboard");
      } else if (status === 401) {
        passRef.current.value = "";
        SweetAlert.fire({
          icon: "error",
          title: "Login Failed",
          text: "Username or Password is incorrect",
          confirmButtonColor: "#FD6E28",
        });
      } else if (status === 403) {
        SweetAlert.fire({
          icon: "error",
          title: "Account Inactive",
          text: "Your account is currently inactive",
          confirmButtonColor: "#FD6E28",
        });
      }
    } catch (error) {
      SweetAlert.close();
      console.error(error);
    }
  }

  const handleQuickLogin = async (username, password) => {
    if (userRef.current) userRef.current.value = username;
    if (passRef.current) passRef.current.value = password;
    try {
      SweetAlert.showLoading();
      const status = await handleLogin(username, password);
      
      if (status === 200) {
        navigate("/dashboard");
      } else if (status === 401) {
        SweetAlert.fire({
          icon: "error",
          title: "Login Failed",
          text: "Username or Password is incorrect",
          confirmButtonColor: "#FD6E28",
        });
      } else {
        SweetAlert.fire({
          icon: "error",
          title: "Login Failed",
          text: "Could not log into demo account.",
          confirmButtonColor: "#FD6E28",
        });
      }
    } catch (error) {
      SweetAlert.close();
      console.error(error);
    }
  };
  
  const toggleShow = (e) => {
    e.preventDefault(); 
    setShow((prevShow) => !prevShow);
  };

  return (
    <div className='login-background flex justify-center items-center min-h-screen bg-cover p-4'>
      <div className="flex flex-col w-full max-w-[420px] items-center gap-4 p-5 bg-white/[0.85] drop-shadow-lg rounded-[12px] backdrop-blur-md">
        <div className="p-2">
          <img
            className="w-[300px] h-[95px] object-contain mx-auto"
            src={Logo}
            alt="Logo"
          />
        </div>

        <div className="flex w-full">
          <form name="LoginForm" action="" className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>

            <div className="flex items-center border border-gray-300 rounded-[6px] h-12 w-full px-2 bg-white/60">
              <img
                className="w-[16px] h-[16px] opacity-40"
                src={userIcon}
                alt="User Icon"
              />
              <input
                className="h-11 w-full ml-1 px-1 mb-[1px] bg-transparent placeholder:text-[#000]/60 focus:outline-none text-sm"
                type="text"
                autoComplete="on"
                placeholder="Username"
                name="metthier-login-username"
                ref={userRef}
              />
            </div>

            <div className="flex items-center border border-gray-300 rounded-[6px] w-full h-12 px-2 bg-white/60">
              <img
                className="w-[16px] h-[16px] opacity-40"
                src={lock}
                alt="Lock Icon"
              />
              <input
                className="h-11 w-full ml-1 px-1 mb-[1px] bg-transparent placeholder:text-[#000]/60 focus:outline-none text-sm"
                type={show ? "password" : "text"}
                placeholder="Password"
                name="metthier-login-password"
                ref={passRef}
              />

              <button onClick={toggleShow} type="button">
                <img
                  className="scale-x-[-1] opacity-60"
                  src={
                    show
                      ? hide
                      : showIcon
                  }
                  alt="Toggle Password Visibility"
                />
              </button>
            </div>

            <div className="flex gap-2 justify-center items-center">
              <button
                className="flex flex-1 justify-center items-center bg-secondary min-w-[120px] rounded-[6px] h-[45px] hover:brightness-110 shadow-sm"
                type="submit"
              >
                <b className="text-[#fff]">Login</b>
              </button>
            </div>
          </form>
        </div>

        {/* Quick Login Section for Demo */}
        <div className="w-full mt-1 pt-3 border-t border-gray-300/80">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-600 flex items-center gap-1">
              ⚡ Quick Login <span className="text-[10px] font-normal text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300">Demo Only</span>
            </span>
            <span className="text-[10px] text-gray-500 font-medium">
              1-Click Skip
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.username}
                type="button"
                onClick={() => handleQuickLogin(acc.username, acc.password)}
                className={`flex flex-col items-start p-2 text-left bg-white/85 hover:bg-white border border-gray-200 hover:border-primary rounded-lg shadow-sm hover:shadow transition-all group ${acc.colSpan || ''}`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-semibold text-gray-800 group-hover:text-primary">
                    {acc.role}
                  </span>
                  <span className="text-[11px] text-gray-400 group-hover:text-primary transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </div>
                <span className="text-[10px] text-gray-500 truncate w-full">
                  {acc.desc}
                </span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default LoginPage;
