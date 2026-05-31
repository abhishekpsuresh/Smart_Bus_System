import {
  useState
} from "react";

import {
  AuthContext
} from "./AuthContext";

export const AuthProvider =
({ children }) => {

  const [user, setUser] =
    useState(
      JSON.parse(
        localStorage.getItem("user")
      ) || null
    );

  const [token, setToken] =
    useState(
      localStorage.getItem("token")
      || null
    );

  // LOGIN

  const login = (
    userData,
    jwtToken
  ) => {

    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );

    localStorage.setItem(
      "token",
      jwtToken
    );

    setUser(userData);

    setToken(jwtToken);

  };

  // LOGOUT

  const logout = () => {

    localStorage.removeItem(
      "user"
    );

    localStorage.removeItem(
      "token"
    );

    setUser(null);

    setToken(null);

  };

  return (

    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout
      }}
    >

      {children}

    </AuthContext.Provider>

  );

};