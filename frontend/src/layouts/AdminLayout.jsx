import { useState } from "react";
import { Outlet } from "react-router-dom";

function AdminLayout() {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={styles.page}>

      {/* ☰ MOBILE MENU */}
      <button style={styles.menuBtn} onClick={() => setSidebarOpen(true)}>
        ☰
      </button>

      {/* SIDEBAR */}
      <div style={{
        ...styles.sidebar,
        left: sidebarOpen ? "0" : "-250px"
      }}>

        <div style={styles.closeBtn} onClick={() => setSidebarOpen(false)}>✖</div>

        <h2 style={styles.logo}>⚡ PYE Admin</h2>

        <div style={styles.menu} onClick={()=>window.location.href="/admin"}>
          Dashboard
        </div>

        <div style={styles.menu} onClick={()=>window.location.href="/admin-users"}>
          Users
        </div>

        <div style={styles.menu} onClick={()=>window.location.href="/admin-models"}>
          AI Models
        </div>
        
        <div style={styles.menu} onClick={()=>window.location.href="/admin-campaigns"}>
          Campaigns
        </div>

        <div style={styles.menu} onClick={()=>window.location.href="/admin-transactions"}> Transactions</div>

        <div style={styles.menu} onClick={()=>window.location.href="/admin-settings"}>
        Settings</div>

      </div>

      {/* MAIN CONTENT */}
      <div style={styles.main}>
        <Outlet />
      </div>

    </div>
  );
}

const styles = {

  container:{
    maxWidth:"1200px",
    margin:"0 auto",
  },

  page:{
    padding:"0px",
    color:"white",
    backgroun:"#020617",
    minHeight:"100vh"
  },

  menuBtn:{
    position:"fixed",
    top:"15px",
    left:"15px",
    background:"#0ea5e9",
    border:"none",
    padding:"10px",
    borderRadius:"6px",
    cursor:"pointer",
    zIndex:1000
  },

  sidebar:{
    width:"230px",
    background:"#020617",
    borderRight:"1px solid #0ea5e9",
    padding:"20px",
    position:"fixed",
    top:0,
    bottom:0,
    left:0,
    transition:"0.3s",
    zIndex:999
  },

  closeBtn:{ textAlign:"right", cursor:"pointer" },

  logo:{ color:"#38bdf8", marginBottom:"30px" },

  menu:{
    padding:"12px",
    marginBottom:"10px",
    background:"#0f172a",
    borderRadius:"8px",
    cursor:"pointer"
  },

  main:{
    flex:1,
    padding:"20px",
    marginLeft:"20px" // ✅ THIS PUSHES CONTENT RIGHT
  }

};

/* 🔥 HOVER */
const hoverEffect = (e, enter) => {
  e.currentTarget.style.background = enter ? "#0ea5e9" : "#0f172a";
};

export default AdminLayout;