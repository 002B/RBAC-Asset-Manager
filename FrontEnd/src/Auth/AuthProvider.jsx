import { getUser, login } from "./User.jsx";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext({
  user: null,
  setUser: () => {},
  authToken: null,
  handleLogin: async () => {},
  handleLogout: () => {},
});

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      const [status, response] = await getUser();
      if (status === 200) {
        setUser(response.user);
        setAuthToken(response.authToken);
      }
    };
    checkUser();
  }, []);

  async function handleLogin(username, password) {
    const [status, response] = await login(username, password);
    if (status === 200) {
      setUser(response.user);
      setAuthToken(response.authToken);
      return status;

    } 
    if (status === 401) {
      setAuthToken(null);
      setUser(null);
      return status;
    }
  }
  async function handleLogout() {
    setAuthToken(null);
    setUser(null);
    return null;
  }

  return (
    <AuthContext.Provider
      value={{ user, setUser, authToken, handleLogin, handleLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used inside of a AuthProvider");
  }

  return context;
}
