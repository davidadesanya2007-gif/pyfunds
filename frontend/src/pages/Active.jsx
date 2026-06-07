import { useState, useEffect } from "react";
import { supabase } from "../supabase";
/*
import {
  getActiveInvestments,
  updateActiveInvestment,
  getUser,
  updateUserEverywhere,
  addTransaction,
  deleteActiveInvestment
} from "../utils/storage";
 */
import {
  getActiveInvestments,
  getUser
} from "../utils/storage";

import CustomAlert from "../components/CustomAlert";
import moneySound from "../assets/money.mp4";

function ActiveInvestments() {
  
  const [investments, setInvestments] = useState([]);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);

  /*
 useEffect(() => {

    const fetchData = async () => {

      const all =
        await getActiveInvestments();

      const formatted = (all || []).map(inv => ({
        ...inv,

        // ✅ FIX SUPABASE COLUMN NAMES
        dailyEarning:
          inv.dailyEarning || inv.dailyearning,

        unitsLeft:
          inv.unitsLeft || inv.unitsleft,

        daysLeft:
          inv.daysLeft || inv.daysleft,

        lastClaim:
          inv.lastClaim || inv.lastclaim
      }));

      setInvestments(formatted);

    };

    fetchData();

  }, []);
  */

  useEffect(() => {

    const fetchData = async () => {

      setLoading(true);

      const all = await getActiveInvestments();

      const formatted = (all || []).map(inv => ({
        ...inv,

        // ✅ FIX SUPABASE COLUMN NAMES
        dailyEarning:
          inv.dailyEarning || inv.dailyearning,

        unitsLeft:
          inv.unitsLeft || inv.unitsleft,

        daysLeft:
          inv.daysLeft || inv.daysleft,

        lastClaim:
          inv.lastClaim || inv.lastclaim
      }));

      setInvestments(formatted);
      setLoading(false);
    };

    fetchData();

  }, []);

  const handleClaim = async (id) => {

    const user = await getUser();

    const { data, error } = await supabase.rpc("claim_earning", {
      p_investment_id: id,
      p_user_id: user.id
    });

    console.log("RPC RESPONSE:", { data, error });

    // ❌ ONLY CHECK ERROR (IMPORTANT FIX)
    if (error) {
      setAlert({
        type: "error",
        message: error.message
      });
      return;
    }

    // backend returned custom error
    if (data?.error) {
      setAlert({
        type: "error",
        message: data.error
      });
      return;
    }

    setAlert({
      type: "success",
      message: `Earned ${data.earning} PYE ✅`
    });

    const refreshed = await getActiveInvestments();
    setInvestments(refreshed);
  };

  return (
    <div style={{ padding: "0px" }}>

      <h2>Ai-Models</h2>

      {loading ? (
        <div style={styles.loadingWrapper}>
          <div style={styles.spinner}></div>
          <p style={{ marginTop: "10px", color: "#fff" }}>Loading Ai-Models...</p>
        </div>
      ) : investments.length === 0 ? (
        <p>No Ai-Models yet</p>
      ) : null}

      {/* GRID START */}
      <div style={styles.grid}>

        {investments.map((item) => {

          const today = new Date().toDateString();

          const lastClaimDate = item.lastClaim
            ? new Date(item.lastClaim).toDateString()
            : null;

          const isClaimed = lastClaimDate === today;

          return (
            <div key={item.id} style={styles.card}>

              <img src={item.image} style={styles.image} />

              <h3 style={styles.cardTitle}>
                {item.name}
              </h3>

              <div style={styles.infoRow}>
                <span>DAILY:</span>
                <span>{item.dailyEarning} PYE</span>
              </div>

              <div style={styles.infoRow}>
                <span>CAPITAL:</span>
                <span>{item.price} PYE</span>
              </div>

              <div style={styles.infoRow}>
                <span>CLAIMED:</span>
                <span>{item.earnings || 0} PYE</span>
              </div>

              {item.type === "limited" && (
                <>
                  <div style={styles.infoRow}>
                    <span>REM:</span>
                    <span>{item.daysLeft}</span>
                  </div>

                  <div style={styles.infoRow}>
                    <span>UNIT:</span>
                    <span>{item.unitsLeft}</span>
                  </div>
                </>
              )}

              <button
                style={{
                  ...styles.button,
                  background: isClaimed ? "green" : "#c8a96a",
                  cursor: isClaimed ? "not-allowed" : "pointer"
                }}
                onClick={() => !isClaimed && handleClaim(item.id)}
                disabled={isClaimed}
              >
                {isClaimed ? "Claimed" : "Claim Earnings"}
              </button>

            </div>
          );
        })}

      </div>

      {/* GRID END */}

      {alert && (
        <CustomAlert
          type={alert.type}
          message={alert.message}
          playMoneySound={alert.playMoneySound}
          onClose={() => setAlert(null)}
        />
      )}

    </div>
  );
}

const styles = {

  grid:{
    display:"grid",
    gridTemplateColumns:"repeat(2, minmax(0, 1fr))",
    gap:"10px",
    marginTop:"15px",
    alignItems:"stretch" //makes all cards the same height
  },

  loadingWrapper: {
    minHeight: "60vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },

  spinner: {
    width: "60px",
    height: "60px",
    border: "6px solid #1e293b",
    borderTop: "6px solid #38bdf8",
    borderRadius: "50%",
    animation: "spin 1s linear infinite"
  },

  /*infoRow:{
    display:"flex",
    justifyContent:"space-between",
    fontSize:"12px",
    padding:"4px 0",
    alignItems:"center"
  },*/

  infoRow:{
    display:"flex",
    justifyContent:"space-between",
    fontSize:"12px",
    padding:"4px 0",
    alignItems:"center",
    whiteSpace:"nowrap", // stop text from breaking into multiple lines
    color:"#222"
  },

  card:{
    background:"#ffffff",
    padding:"0px",
    borderRadius:"12px",
    boxShadow:"0 4px 8px rgba(0,0,0,0.05)",
    fontSize:"12px",
    display:"flex",
    flexDirection:"column",
    height:"100%",
    color:"#222"
  },

  cardTitle: {
    fontSize: "13px",
    margin: "0 0 8px 0",
    minHeight: "32px", // ~ 2 lines on mobile
    WebkitLineClamp: 2, // limit to 2 lines
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    wordBreak: "break-word", // break long words WNeural
    lineHeight: "16px",
    color: "#222"
  },

  

  image:{
    width:"100%",
    height:"110px",
    objectFit:"cover",
    borderRadius:"8px",
    marginBottom:"8px"
  },

  button: {
    marginTop: "auto", // push button to bottom
    width: "100%",
    padding: "10px",
    background: "#c8a96a",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer"
  }
};

export default ActiveInvestments;