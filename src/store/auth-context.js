import React, { useState } from "react";
const AuthContext = React.createContext({
  token: "",
  isLoggedIn: "",
  login: (token) => {},
  logout: () => {},
});
const calculateRemainingTime = (experationTime) =>{
  const currentTime = new Date().getTime();
  const adjExperationTime = new Date(experationTime).getTime();
  const remainingTime = adjExperationTime - currentTime
  return remainingTime
}

export const AuthContextProvider = ({children}) => {
  const initialToken = localStorage.getItem('token')
  const [token, setToken] = useState(initialToken);
  const userIsLoggedIn = !!token;
  
  const logoutHandler = () => {
    setToken(null);
    localStorage.removeItem('token');
  };
  const loginHandler = (token,experationTime) => {
    setToken(token);
    localStorage.setItem('token',token);
    const remainingTime = calculateRemainingTime(experationTime);
    setTimeout(logoutHandler,remainingTime)
  };
  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };
  console.log(token);
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthContext;