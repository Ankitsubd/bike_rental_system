import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // Return default values if context is undefined
    return {
      user: null,
      login: async () => {},
      logout: () => {},
      loading: false
    };
  }
  return context;
};

export default useAuth;