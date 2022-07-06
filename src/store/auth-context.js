import React, { useState,useEffect,useCallback } from "react";
let logoutTimer;

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
const retrieveStoredToken = () =>{
  const storedToken = localStorage.getItem('token');
  const storedExpirationDate = localStorage.getItem('expirationTime');
  const remainingTime = calculateRemainingTime(storedExpirationDate);
  if(remainingTime <= 3600){
    localStorage.removeItem('token');
    localStorage.removeItem('expirationTime')
    return null;
  }
  return {
    token:storedToken,
    duration:remainingTime
  };
};
export const AuthContextProvider = ({children}) => {
  const tokenData = retrieveStoredToken();
  let initialToken;
  if(tokenData){
    initialToken = tokenData.token;

  }
  const [token, setToken] = useState(initialToken);


  const userIsLoggedIn = !!token;
  
  const logoutHandler = useCallback(() => {
    setToken(null);
    localStorage.removeItem('token');
    if(logoutTimer){
      clearTimeout(logoutTimer)
    }
  },[]);
  
  const loginHandler = (token,experationTime) => {
    setToken(token);
    localStorage.setItem('token',token);
    localStorage.setItem('expirationTime',experationTime);

    const remainingTime = calculateRemainingTime(experationTime);
    logoutTimer = setTimeout(logoutHandler,remainingTime)

  };
  useEffect(()=>{
   if(tokenData){
    console.log(tokenData.duration);
    logoutTimer = setTimeout(logoutHandler,tokenData.duration)
   }
  },[tokenData,logoutHandler])
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