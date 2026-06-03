import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import PageLoader from "./PageLoader";

function ProtectedRoute({ children }) {

  const [loading, setLoading] =
    useState(true);

  const [allowed, setAllowed] =
    useState(false);

  useEffect(() => {

    checkUser();

  }, []);

  const checkUser = async () => {

    const {
      data:{ session }
    } = await supabase.auth.getSession();

    if(!session){

      setAllowed(false);
      setLoading(false);

      return;

    }

    const { data: settings, error } =
      await supabase
        .from("admin_settings")
        .select("maintenance")
        .single();

    if(error){
      console.log(error);
    }

    if(settings?.maintenance){

      alert(
        "Platform under maintenance"
      );

      await supabase.auth.signOut();

      setAllowed(false);

    }else{

      setAllowed(true);

    }

    setLoading(false);

  };

  if(loading){

    return <PageLoader />;

  }

  if(!allowed){

    return <Navigate to="/login" />;

  }

  return children;

}

export default ProtectedRoute;




/*
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../supabase";

function ProtectedRoute({ children }) {

  const [loading, setLoading] =
    useState(true);

  const [authenticated, setAuthenticated] =
    useState(false);

  useEffect(() => {

    checkUser();

  }, []);

  const checkUser = async () => {

    const {
      data:{ session }
    } = await supabase.auth.getSession();

    if(session){

      setAuthenticated(true);

    }else{

      setAuthenticated(false);

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

  if(!authenticated){

    return <Navigate to="/login" />;

  }

  return children;

}

export default ProtectedRoute;
*/

