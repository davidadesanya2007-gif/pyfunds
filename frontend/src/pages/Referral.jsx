import Sidebar from "../components/Sidebar";
import { getUser, setUser } from "../utils/storage";
import { supabase } from "../supabase";
import { useEffect, useState } from "react";

import CustomAlert from "../components/CustomAlert";
import {
  FaCopy,
  FaUsers,
  FaWallet,
  FaBolt,
  FaCoins,
  FaSearch
} from "react-icons/fa";

function Referral() {

  const [search, setSearch] = useState("");
  const [user, setUserState] = useState({});
  const [alert, setAlert] = useState(null);

  useEffect(() => {

    const fetchUser = async () => {

      // LOCAL USER
      const localUser =
        await getUser();

      if(!localUser?.id) return;

      // GET FRESH USER FROM DATABASE
      const { data, error } =
        await supabase
          .from("users")
          .select("*")
          .eq("id", localUser.id)
          .single();

      if(error){

        console.log(error);

        return;

      }

      // UPDATE LOCAL STORAGE
      await setUser(data);

      // UPDATE UI
      setUserState(data);

    };

    fetchUser();

  }, []);

  const referrals = user.referrals || [];

  // referral link
  const referralLink = `${window.location.origin}/register?ref=${user.referral_code}`;

  // copy link
  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setAlert({
      type: "success",
      message: "Referral link copied ✅"
    });
  };

  // total referrals
  const totalReferrals = referrals.length;

  // earnings (ONLY purchased users)
  const referralCommission =
  Number(user.totalReferralCommission || 0);

  const activeReferrals =
    referrals.filter(
      r => r.hasPurchased
    ).length;

  return (

    <div style={styles.page}>

      <Sidebar />

      <div style={styles.container}>

        {/* HEADER */}
        <div style={styles.header}>

          <div>
            <h1 style={styles.title}>
              Referral Dashboard
            </h1>

            <h1 style={styles.subtitle}>
              Invite friends, earn rewards
            </h1>

            <p style={styles.sub}>
              Earn referral commissions by inviting others to join PYEFUNDS using your unique referral link. 
            </p>
            <p style={styles.strong}><strong>SHARE YOUR LINK</strong></p>
          </div>

        </div>

        {/* REFERRAL LINK */}
        <div style={styles.linkCard}>

          <h3 style={{color:"white"}}>
            Your Referral Link
          </h3>

          <div style={styles.linkBox}>

            <input
              value={referralLink}
              readOnly
              style={styles.input}
            />

            <button
              style={styles.copyBtn}
              onClick={copyLink}
            >
              <FaCopy />
              Copy
            </button>

          </div>

        </div>

        {/* STATS */}
        <div style={styles.statsGrid}>

          <div style={styles.statCard}>
            <FaCoins size={28} color="#a855f7" />

            <p style={styles.statTitle}>
              Total Referral Commission
            </p>

            <h2 style={styles.statAmount}>
              {referralCommission.toFixed(2)} PYE
            </h2>
          </div>

          <div style={styles.statCard}>
            <FaUsers size={28} color="#38bdf8" />

            <p style={styles.statTitle}>
              Total Referrals
            </p>

            <h2 style={styles.statAmount}>
              {totalReferrals}
            </h2>
          </div>

          <div style={styles.statCard}>
            <FaUsers size={28} color="#22c55e" />

            <p style={styles.statTitle}>
              Active Referrals
            </p>

            <h2 style={styles.statAmount}>
              {activeReferrals}
            </h2>
          </div>

        </div>

        {/* REFERRAL LEVELS */}
        <div style={styles.bigCard}>

          <h2 style={{color:"white"}}>
            Referral Levels
          </h2>

          <div style={styles.levelGrid}>

            <div style={styles.levelCard}>
              <h3 style={{color:"#38bdf8"}}>
                Level A
              </h3>

              <p style={styles.levelPercent}>
                10%
              </p>

              <span style={styles.levelText}>
                Earn 10% commission from direct referrals
              </span>
            </div>

            <div style={styles.levelCard}>
              <h3 style={{color:"#22c55e"}}>
                Level B
              </h3>

              <p style={styles.levelPercent}>
                5%
              </p>

              <span style={styles.levelText}>
                Earn 5% commission from second-level referrals
              </span>
            </div>

            <div style={styles.levelCard}>
              <h3 style={{color:"#f59e0b"}}>
                Level C
              </h3>

              <p style={styles.levelPercent}>
                3%
              </p>

              <span style={styles.levelText}>
                Earn 3% commission from third-level referrals
              </span>
            </div>

          </div>

        </div>

        {/* DOWNLINES */}
        <div style={styles.bigCard}>

          <h2 style={{color:"white"}}>
            Referral Downlines
          </h2>

          {/* SEARCH */}
          <div style={styles.searchBox}>

            <FaSearch color="#64748b" />

            <input
              placeholder="Search referrals by email..."
              style={styles.searchInput}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>

          {/* TABLE */}
          <div style={styles.tableWrapper}>
            <table style={styles.table}>

              <thead>

                <tr>
                  <th>#</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Commission</th>
                </tr>

              </thead>

              <tbody>

                {referrals.length === 0 ? (

                  <tr>
                    <td colSpan="4">
                      No referrals yet
                    </td>
                  </tr>

                ) : (

                  referrals
                    .filter((ref) =>
                      (ref.email || "")
                        .toLowerCase()
                        .includes(search.toLowerCase())
                    )
                    .map((ref, index) => (

                    <tr
                      key={index}
                      style={{
                        background:"#020617"
                      }}
                    >

                      <td style={{padding:"15px"}}>
                        {index + 1}
                      </td>

                      <td style={{padding:"15px"}}>
                        {ref.email || "No email"}
                      </td>

                      <td>

                        <span
                          style={{
                            padding:"6px 10px",
                            borderRadius:"8px",
                            background:
                              ref.hasPurchased
                                ? "#052e16"
                                : "#3f0d0d",

                            color:
                              ref.hasPurchased
                                ? "#22c55e"
                                : "#ef4444"
                          }}
                        >
                          {ref.hasPurchased
                            ? "Active"
                            : "Inactive"}
                        </span>

                      </td>

                      <td style={{padding:"15px"}}>
                        {Number(ref.commission || 0).toFixed(2)} PYE
                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>

  );
}

const styles = {

  container: {
    padding: "0px"
  },

  title: {
    marginBottom: "30px",
    color: "white"
  },

  subtitle:{
    color:"#d4e633",
    fontSize:"30px",
    fontWeight:"700"
  },

  strong:{
    color:"#38bdf8",
    fontSize:"18px",
    marginTop:"10px"
  },

  card: {
    backgroun: "#020617",
    padding: "25px",
    borderRadius: "10px",
    border: "1px solid #1e293b",
    marginBottom: "20px"
  },

  linkBox: {
    display: "flex",
    gap: "10px",
    marginTop: "15px"
  },

  input:{
    flex:1,
    padding:"12px",
    borderRadius:"8px",
    border:"1px solid #ddd",
    background:"#fff",
    color:"#000"
  },

  copyBtn:{
    width:"40%",
    height:"42px",
    background:"#38bdf8",
    border:"none",
    borderRadius:"8px",
    cursor:"pointer",
    fontSize:"13px",
    fontWeight:"bold"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px"
  },

  amount: {
    fontSize: "22px",
    color: "#38bdf8",
    marginTop: "10px",
    fontWeight: "bold"
  },

  page:{
    minHeight:"100vh",
  },

  header:{
    marginBottom:"30px"
  },

  tableWrapper: {
    width: "100%",
    overflowX: "auto",
    overflowY: "hidden",
    borderRadius: "12px",
  },

  sub:{
    color:"#000000",
    fontSize:"30px",
    fontWeight:"500",
    marginTop:"5px"
  },

  linkCard:{
    width:"100%",
    background:"#fff",
    padding:"18px",
    borderRadius:"12px",
    marginBottom:"20px",
    boxShadow:"0 4px 10px rgba(0,0,0,0.08)"
  },

  statsGrid:{
    display:"grid",
    gridTemplateColumns:"repeat(2,1fr)",
    gap:"15px",
    marginBottom:"25px"
  },

  statCard:{
    background:"linear-gradient(145deg,#071120,#0f172a)",
    border:"1px solid rgba(14,165,233,0.15)",
    borderRadius:"20px",
    padding:"25px",
    boxShadow:"0 0 25px rgba(14,165,233,0.06)"
  },

  statTitle:{
    color:"#94a3b8",
    marginTop:"15px"
  },

  statAmount:{
    color:"white",
    marginTop:"10px",
    fontSize:"28px"
  },

  bigCard:{
    backgroun:"linear-gradient(145deg,#071120,#0f172a)",
    border:"1px solid rgba(14,165,233,0.15)",
    borderRadius:"20px",
    padding:"25px"
  },

  searchBox:{
    display:"flex",
    alignItems:"center",
    gap:"10px",
    background:"#020617",
    border:"1px solid #1e293b",
    padding:"12px",
    borderRadius:"12px",
    marginTop:"20px",
    marginBottom:"20px"
  },

  searchInput:{
    flex:1,
    background:"transparent",
    border:"none",
    outline:"none",
    color:"white"
  },

  table:{
    width:"100%",
    minWidth:"600px",
    background:"linear-gradient(145deg,#071120,#0f172a)",
    borderCollapse:"separate",
    borderSpacing:"0px 10px",
    color:"white"
  },

  levelGrid:{
    display:"grid",
    gridTemplateColumns:"repeat(2,1fr)",
    gap:"15px",
    marginTop:"20px"
  },

  levelCard:{
    background:"#020617",
    border:"1px solid rgba(14,165,233,0.15)",
    borderRadius:"18px",
    padding:"25px"
  },

  levelPercent:{
    fontSize:"36px",
    color:"white",
    marginTop:"15px",
    marginBottom:"10px",
    fontWeight:"bold"
  },

  levelText:{
    color:"#94a3b8",
    lineHeight:"1.7"
  },

};

export default Referral;