import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

function Sidebar() {

  const [open, setOpen] = useState(false);

  const location = useLocation();

  return (
    <div className="sidebar">

      {/* MENU BUTTON */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={styles.menuBtn}
        >
          ☰
        </button>
      )}

      {/* SIDEBAR */}
      {open && (
        <>

          {/* OVERLAY */}
          <div
            style={styles.overlay}
            onClick={() => setOpen(false)}
          />

          {/* SIDEBAR */}
          <div style={styles.sidebar}>

            {/* CLOSE BUTTON */}
            <button
              onClick={() => setOpen(false)}
              style={styles.closeBtn}
            >
              ✖
            </button>

            {/* LOGO */}
            <h2 style={styles.logo}>
              PYFUNDS
            </h2>

            {/* LINKS */}
            <div style={styles.links}>

              <Link
                to="/dashboard"
                onClick={() => setOpen(false)}
                style={{
                  ...styles.link,
                  background:
                    location.pathname === "/dashboard"
                    ? "rgba(56,189,248,0.18)"
                    : "rgba(255,255,255,0.03)"
                }}
              >
                Dashboard
              </Link>

              <Link
                to="/plans"
                onClick={() => setOpen(false)}
                style={{
                  ...styles.link,
                  background:
                    location.pathname === "/plans"
                    ? "rgba(56,189,248,0.18)"
                    : "rgba(255,255,255,0.03)"
                }}
              >
                Ai-Models
              </Link>

              <Link
                to="/tasks"
                onClick={() => setOpen(false)}
                style={{
                  ...styles.link,
                  background:
                    location.pathname === "/tasks"
                    ? "rgba(56,189,248,0.18)"
                    : "rgba(255,255,255,0.03)"
                }}
              >
                Tasks
              </Link>

              <Link
                to="/referral"
                onClick={() => setOpen(false)}
                style={{
                  ...styles.link,
                  background:
                    location.pathname === "/referral"
                    ? "rgba(56,189,248,0.18)"
                    : "rgba(255,255,255,0.03)"
                }}
              >
                Referral
              </Link>

              <Link
                to="/converter"
                onClick={() => setOpen(false)}
                style={{
                  ...styles.link,
                  background:
                    location.pathname === "/converter"
                    ? "rgba(56,189,248,0.18)"
                    : "rgba(255,255,255,0.03)"
                }}
              >
                Converter
              </Link>

              <Link
                to="/transactions"
                onClick={() => setOpen(false)}
                style={{
                  ...styles.link,
                  background:
                    location.pathname === "/transactions"
                    ? "rgba(56,189,248,0.18)"
                    : "rgba(255,255,255,0.03)"
                }}
              >
                Transactions
              </Link>

              <Link
                to="/support"
                onClick={() => setOpen(false)}
                style={{
                  ...styles.link,
                  background:
                    location.pathname === "/support"
                    ? "rgba(56,189,248,0.18)"
                    : "rgba(255,255,255,0.03)"
                }}
              >
                Support
              </Link>

            </div>

          </div>

        </>
      )}

    </div>
  );
}

const styles = {

  menuBtn:{
    position:"fixed",
    top:"15px",
    left:"15px",
    zIndex:1100,

    width:"52px",
    height:"52px",

    borderRadius:"16px",

    border:"1px solid rgba(56,189,248,0.25)",

    background:"rgba(2,6,23,0.92)",

    backdropFilter:"blur(10px)",

    color:"#38bdf8",

    fontSize:"24px",

    fontWeight:"bold",

    boxShadow:"0 0 20px rgba(0,0,0,0.35)",

    cursor:"pointer"
  },

  overlay:{
    position:"fixed",
    top:0,
    left:0,
    width:"100%",
    height:"100%",
    background:"rgba(0,0,0,0.55)",
    zIndex:999
  },

  sidebar:{
    position:"fixed",
    top:"0px",
    left:"5px",

    width:"280px",
    maxWidth:"85%",

    height:"100vh",

    background: "linear-gradient(180deg, #020617, #071120, #0f172a)",

    borderRight:"1px solid rgba(56,189,248,0.15)",

    padding:"25px 18px",

    overflowY:"auto",

    zIndex:1000,

    animation:"slideIn 0.25s ease",

    boxShadow:"0 0 40px rgba(0,0,0,0.45)"
  },

  closeBtn:{
    position:"absolute",
    top:"15px",
    right:"15px",

    width:"42px",
    height:"42px",

    borderRadius:"12px",

    background:"rgba(239,68,68,0.12)",

    border:"1px solid rgba(239,68,68,0.25)",

    color:"#ef4444",

    fontSize:"18px",

    fontWeight:"bold",

    cursor:"pointer"
  },

  logo:{
    fontSize:"28px",
    fontWeight:"bold",
    color:"#38bdf8",
    marginTop:"40px",
    marginBottom:"30px",
    letterSpacing:"1px"
  },

  links:{
    display:"flex",
    flexDirection:"column",
    gap:"10px"
  },

  link:{
    padding:"16px",

    borderRadius:"16px",

    color:"#fff",

    textDecoration:"none",

    fontWeight:"600",

    fontSize:"16px",

    transition:"0.25s",

    border:"1px solid rgba(255,255,255,0.03)"
  }

};

export default Sidebar;
