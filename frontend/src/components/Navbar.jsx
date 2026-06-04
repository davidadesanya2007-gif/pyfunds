import { useNavigate, useLocation } from "react-router-dom";
import { getUser } from "../utils/storage";
import { supabase } from "../supabase";
import { useState, useEffect } from "react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);

  useEffect(() => {

    const fetchUser = async () => {

      const userData = 
        await getUser();

      setUser(userData);

    };

    fetchUser();
    
  }, [location]);

  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";
  const isAdminPage = location.pathname === "/admin";

  const handleLogout = async () => {

    await supabase.auth.signOut();

    setUser(null);

    navigate("/login");

  };

  return (
    <div style={styles.nav}>
      <h2
        style={{
          color:"#38bdf8",
          margin:0,
          fontSize:"18px",
          marginLeft:"60px"
        }}
      >
        PYEFUNDS
      </h2>

      <div style={styles.links}>

        {/* ✅ LOGIN PAGE → show REGISTER only */}
        {!user && isLoginPage && (
          <button
            style={styles.smallBtn}
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        )}

        {/* ✅ REGISTER PAGE → show LOGIN only */}
        {!user && isRegisterPage && (
          <button
            style={styles.smallBtn}
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        )}

        {/* ✅ ALL OTHER PAGES (except admin) */}
        {!isLoginPage && !isRegisterPage && !isAdminPage && user && (
          <>
            <button onClick={() => navigate("/")}>Home</button>
            <button onClick={() => navigate("/plans")}>Plans</button>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}

      </div>
    </div>
  );
}

const styles = {
  nav:{
    display:"flex",
    justifyContent:"space-between",
    alignItems:"center",
    padding:"10px 12px",
    background:"#020617",
    position:"relative",
    width:"100%"
  },

  links:{
    display:"flex",
    gap:"5px",
    marginLeft:"auto",
    marginRight:"5px"
  },

  smallBtn:{
    width:"70px",
    minWidth:"70px",
    height:"34px",
    padding:"0",
    fontSize:"12px",
    borderRadius:"6px",
    background:"#38bdf8",
    color:"#fff",
    fontWeight:"600"
  }
};

export default Navbar;