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
      <h2 style={{ color: "#38bdf8" }}>PYFUNDS</h2>

      <div style={styles.links}>

        {/* ✅ LOGIN PAGE → show REGISTER only */}
        {!user && isLoginPage && (
          <button onClick={() => navigate("/register")}>
            Register
          </button>
        )}

        {/* ✅ REGISTER PAGE → show LOGIN only */}
        {!user && isRegisterPage && (
          <button onClick={() => navigate("/login")}>
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
  nav: {
    display: "flex",
    justifyContent: "space-between",
    padding: "20px",
    background: "#020617",
  },
  links: {
    display: "flex",
    gap: "15px",
  },
};

export default Navbar;