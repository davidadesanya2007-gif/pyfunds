import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

function Layout() {
  return (
    <div style={styles.page}>
      <Navbar />

      {/* ✅ THIS IS WHAT RENDERS YOUR PAGES */}
      <div style={styles.content}>
        <Outlet />
      </div>

      <Footer />
    </div>
  );
}

const styles = {
  page:{
    minHeight:"100vh",
    color:"white"
  },

  content:{
    padding:"20px"
  }
};

export default Layout;