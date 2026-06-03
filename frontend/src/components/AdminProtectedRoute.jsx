import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../supabase";

function AdminProtectedRoute({ children }) {

  const [loading, setLoading] =
    useState(true);

  const [isAdmin, setIsAdmin] =
    useState(false);

  useEffect(() => {

    checkAdmin();

  }, []);

  const checkAdmin = async () => {

    // GET SESSION
    const {
      data:{ session }
    } = await supabase.auth.getSession();

    if(!session){

      setIsAdmin(false);

      setLoading(false);

      return;

    }

    // CHECK ADMIN TABLE
    const { data } =
      await supabase
        .from("admins")
        .select("*")
        .eq("id", session.user.id)
        .single();

    if(data){

      setIsAdmin(true);

    }else{

      setIsAdmin(false);

    }

    setLoading(false);

  };

  if(loading){

    return (
      <div
        style={{
          minHeight:"100vh",
          display:"flex",
          justifyContent:"center",
          alignItems:"center",
          background:"#020617",
          color:"white"
        }}
      >
        Loading...
      </div>
    );

  }

  if(!isAdmin){

    return <Navigate to="/admin-login" />;

  }

  return children;

}

export default AdminProtectedRoute;