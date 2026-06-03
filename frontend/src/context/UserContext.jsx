import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import { supabase } from "../supabase";

const UserContext = createContext();

export function UserProvider({ children }) {

  const [currentUser, setCurrentUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    getUser();

  }, []);

  const getUser = async () => {

    // GET AUTH USER
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {

      setLoading(false);
      return;

    }

    // GET FULL USER DATA
    const { data, error } =
      await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

    if (!error) {

      setCurrentUser(data);

    }

    setLoading(false);

  };

  return (

    <UserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        loading,
        refreshUser:getUser
      }}
    >

      {children}

    </UserContext.Provider>

  );

}

export function useUser() {

  return useContext(UserContext);

}