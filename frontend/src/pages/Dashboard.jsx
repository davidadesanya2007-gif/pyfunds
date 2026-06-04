import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import { getUser } from "../utils/storage";
import { getActiveInvestments } from "../utils/storage";
import { useNavigate } from "react-router-dom";
import { getAdminSettings } from "../utils/storage";
import { supabase } from "../supabase";
function Dashboard() {
  // MOCK DATA - REPLACE WITH REAL API CALLS

  const [time, setTime] = useState("");
  const [greeting, setGreeting] = useState("");
  const [investments, setInvestments] = useState([]);

  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {

    const loadUser = async () => {
      const currentUser = await getUser();
      setUser(currentUser);
    };

    const loadInvestments = async () => {
      const data = await getActiveInvestments();
      setInvestments(data || []);
    };

    const updateTime = () => {
      const now = new Date();

      setTime(
        now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
        })
      );

      const hour = now.getHours();

      if (hour < 12) setGreeting("Good Morning");
      else if (hour < 18) setGreeting("Good Afternoon");
      else setGreeting("Good Evening");
    };

    loadUser();
    loadInvestments();
    updateTime();

    const interval = setInterval(() => {
      loadUser();
      loadInvestments();
      updateTime();
    }, 5000);

    const clock = setInterval(updateTime, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(clock);
    };

  }, []);

  const totalEarnings = investments.reduce((acc, item) => {
    return acc + (item.earnings || 0);
  }, 0);

  return (
    <div style={styles.page}>

      <Sidebar />

      {/* TOP BANNER */}
      <div style={styles.banner}>

        <div style={styles.topRow}>
          <span>👤 {user?.email || "email"}</span>
          <span style={styles.clock}>
            🕒 {time}
          </span>

          <button
            style={styles.logoutBtn}
            onClick={async () => {

              await supabase.auth.signOut();

              navigate("/login");

            }}
          >
            Logout
          </button>
        </div>

      </div>

      {/* TITLE */}
      <div style={styles.welcomeBox}>

        <h2 style={styles.title}>
          {greeting} {user?.name || "email"} 👋
        </h2>

        <p style={styles.subtitle}>
          Welcome back to PYFUNDS Premium Dashboard
        </p>

      </div>

      {/* CARDS */}
      <div style={styles.grid}>

        <div style={styles.card}>
          <h4 style={{
            fontSize:"14px",
            color:"#cbd5e1"
          }}>
            ₦ Balance
          </h4>
          <p style={styles.amount}>₦{Number(user?.balance || 0).toFixed(2)}</p>
        </div>

        <div style={styles.card}>
          <h4 style={{
            fontSize:"14px",
            color:"#cbd5e1"
          }}>
            PYE Balance
          </h4>
          <p style={styles.amount}>{Number(user?.pyeBalance || 0).toFixed(2)} PYE</p>
        </div>

        <div style={styles.card}>
          <h4 style={{
            fontSize:"14px",
            color:"#cbd5e1"
          }}>
            Active Investment
          </h4>
          <p style={styles.amount}>{investments.length}</p>
        </div>

        <div style={styles.card}>
          <h4 style={{
            fontSize:"14px",
            color:"#cbd5e1"
          }}>
            Total Earnings
          </h4>
          <p style={styles.amount}>{totalEarnings.toFixed(2)} PYE</p>
        </div>

        <div style={styles.card}>
          <h4 style={{
            fontSize:"14px",
            color:"#cbd5e1"
          }}>
            Available Units
          </h4>
          <p style={styles.amount}>
            {Number(user?.units || 0)}
          </p>
        </div>

      </div>

      {/* ACTION BUTTONS */}
      <div style={styles.actions}>

        <button style={styles.btn1} onClick={() => navigate("/active")}>
          Active Investments
        </button>

        <button style={styles.btn2} onClick={() => navigate("/deposit")}>
          Deposit
        </button>

        <button style={styles.btn3} onClick={() => navigate("/withdraw")}>
          Withdraw
        </button>

        <button style={styles.btn4} onClick={() => navigate("/converter")}>
          Convert
        </button>

      </div>

    </div>
  );
}

const styles = {

  page: {
    minHeight: "100vh",
    padding: "16px",
    color: "white",
    width: "100%",
    overflowX: "hidden"
  },

  banner: {
    width: "100%",
    minHeight: "220px",
    background:
      "url('/src/assets/images/icons/Product1.jpeg') center/cover",
    borderRadius: "22px",
    display: "flex",
    alignItems: "flex-end",
    padding: "18px",
    boxShadow: "0 0 25px rgba(0,0,0,0.4)",
    border: "1px solid rgba(255,255,255,0.08)"
  },

  topRow: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap",
    fontSize: "15px",
    fontWeight: "600"
  },

  clock: {
    background: "rgba(2,6,23,0.85)",
    padding: "10px 14px",
    borderRadius: "999px",
    border: "1px solid rgba(56,189,248,0.3)",
    color: "#38bdf8",
    fontWeight: "700",
    fontSize: "14px",
    backdropFilter: "blur(10px)"
  },

  logoutBtn: {
    background: "linear-gradient(90deg,#ef4444,#dc2626)",
    border: "none",
    padding: "12px 18px",
    borderRadius: "12px",
    cursor: "pointer",
    color: "white",
    fontWeight: "700",
    fontSize: "14px",
    minWidth: "100px",
    boxShadow: "0 0 15px rgba(239,68,68,0.35)"
  },

  welcomeBox: {
    marginTop: "25px",
    marginBottom: "18px"
  },

  title: {
    fontSize: "28px",
    fontWeight: "800",
    lineHeight: "1.3",
    color: "#ffffff"
  },

  subtitle: {
    fontWeight: "500",
    color: "#ffffff",
    marginTop: "8px",
    fontSize: "20px",
    lineHeight: "1.5"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2,1fr)",
    gap: "12px",
    marginTop: "25px",
    width: "100%"
  },

  card: {
    background:
      "linear-gradient(180deg,#020617,#0f172a)",
    padding: "16px",
    borderRadius: "18px",
    border: "1px solid rgba(56,189,248,0.25)",
    minHeight: "120px",

    display: "flex",
    flexDirection: "column",
    justifyContent: "center",

    boxShadow:
      "0 0 25px rgba(14,165,233,0.08)",

    overflow: "hidden",
    textAlign: "center"
  },

  amount: {
    fontSize: "clamp(16px,4vw,24px)",
    marginTop: "10px",
    color: "#22c55e",
    fontWeight: "800",

    wordBreak: "break-word",
    overflowWrap: "break-word",

    lineHeight: "1.2"
  },

  actions: {
    display: "grid",
    gridTemplateColumns: "repeat(2,1fr)",
    gap: "12px",
    marginTop: "25px",
    width: "100%"
  },

  btn1: {
    background:
      "linear-gradient(90deg,#e2e8f0,#cbd5e1)",
    padding: "14px",
    borderRadius: "18px",
    border: "none",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "14px",
    minHeight: "60px",
    width: "100%",
  },

  btn2: {
    background:
      "linear-gradient(90deg,#22c55e,#16a34a)",
    padding: "14px",
    borderRadius: "18px",
    border: "none",
    cursor: "pointer",
    color: "white",
    fontWeight: "700",
    fontSize: "14px",
    minHeight: "60px",
    width: "100%",
    boxShadow:
      "0 0 18px rgba(34,197,94,0.3)"
  },

  btn3: {
    background:
      "linear-gradient(90deg,#ef4444,#dc2626)",
    padding: "14px",
    borderRadius: "18px",
    border: "none",
    cursor: "pointer",
    color: "white",
    fontWeight: "700",
    fontSize: "14px",
    minHeight: "60px",
    width: "100%",
    boxShadow:
      "0 0 18px rgba(239,68,68,0.3)"
  },

  btn4: {
    background:
      "linear-gradient(90deg,#3b82f6,#2563eb)",
    padding: "14px",
    borderRadius: "18px",
    border: "none",
    cursor: "pointer",
    color: "white",
    fontWeight: "700",
    fontSize: "14px",
    width: "100%",
    minHeight: "60px",
    boxShadow:
      "0 0 18px rgba(59,130,246,0.3)"
  }

};

/*
const styles = {

  page: {
    minHeight: "100vh",
    padding: "20px",
    backgroun: "linear-gradient(to bottom, #020617, #0f172a)", // ✅ FIXED TYPO
    color: "white"
  },

  banner: {
    height: "200px",
    background: "url('/src/assets/images/icons/Product1.jpeg') center/cover",
    borderRadius: "10px",
    display: "flex",
    alignItems: "flex-end",
    padding: "10px"
  },

  topRow: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center"
  },

  logoutBtn: {
    background: "#06b6d4",
    border: "none",
    padding: "8px 15px",
    borderRadius: "8px",
    cursor: "pointer",
    color: "white"
  },

  title: {
    marginTop: "20px"
  },

  welcomeBox:{
    marginTop:"20px",
    marginBottom:"10px"
  },

  subtitle:{
    color:"#94a3b8",
    marginTop:"6px",
    fontSize:"14px"
  },

  clock:{
    background:"rgba(15,23,42,0.8)",
    padding:"8px 14px",
    borderRadius:"999px",
    border:"1px solid rgba(14,165,233,0.25)",
    color:"#38bdf8",
    fontWeight:"600",
    fontSize:"14px"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2,1fr)",
    gap: "15px",
    marginTop: "20px"
  },

  card: {
    background: "#020617",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid #0ea5e9"
  },

  amount: {
    fontSize: "20px",
    marginTop: "10px",
    color: "#22c55e"
  },

  actions: {
    display: "flex",
    gap: "10px",
    marginTop: "20px",
    flexWrap: "wrap"
  },

  btn1: {
    background: "#e5e7eb",
    padding: "10px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer"
  },

  btn2: {
    background: "#4ade80",
    padding: "10px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer"
  },

  btn3: {
    background: "#f87171",
    padding: "10px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer"
  },

  btn4: {
    background: "#60a5fa",
    padding: "10px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer"
  }

};
*/

export default Dashboard;