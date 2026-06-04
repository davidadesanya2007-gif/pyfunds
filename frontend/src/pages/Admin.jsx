import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import {
  getAllUsers,
  getTransactions,
  getActiveInvestments,
  updateUserEverywhere,
  updateTransaction
} from "../utils/storage";

function Admin() {

  const [users, setUsers] = useState([]);
  const [transactions, setTx] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [sidebarOpen, setSidebarOpen] = 
  useState(false);

    useEffect(() => {

      const fetchData = async () => {

        const usersData =
          await getAllUsers();

        const txData =
          await getTransactions();

        const investmentData =
          await getActiveInvestments() || [];

        setUsers(usersData || []);
        setTx(txData || []);
        setInvestments(investmentData || []);

      };

      fetchData();

    }, []);

  // ✅ TOTAL DEPOSITS
  const totalDeposits = transactions
    .filter(t => t.type === "DEPOSIT" && t.status === "Approved")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  // ✅ UPDATE STATUS
  const updateStatus = async (index, status) => {

    const filtered = transactions.filter(
      t =>
        t.type?.trim()?.toUpperCase() === "DEPOSIT" ||
        t.type?.trim()?.toUpperCase() === "WITHDRAW"
    );

    const tx = filtered[index];

    if (!tx) return;

    // prevent double approval
    if (tx.status === status) return;

    // update transaction status first
    const success = await updateTransaction(
      tx.id,
      status
    );

    if (!success) {

      alert("Failed to update transaction");

      return;
    }

    // get latest users
    const allUsers = await getAllUsers();

    const user = allUsers.find(
      u => String(u.id) === String(tx.user_id)
    );

    if (user) {

      const txType =
        tx.type?.trim()?.toUpperCase();

      // ✅ APPROVE DEPOSIT
      if (
        txType === "DEPOSIT" &&
        status === "Approved"
      ) {

        user.balance =
          Number(user.balance || 0)
          + Number(tx.amount || 0);

        await updateUserEverywhere(user);

      }

      // ✅ REJECT WITHDRAW
      if (
        txType === "WITHDRAW" &&
        status === "Rejected"
      ) {

        user.balance =
          Number(user.balance || 0)
          + Number(tx.amount || 0);

        await updateUserEverywhere(user);

      }

    }

    // update UI instantly
    setTx(prev =>
      prev.map(t =>
        t.id === tx.id
          ? { ...t, status }
          : t
      )
    );

    const updatedTx = await getTransactions();
    setTx(updatedTx || []);

  };

  const getStatusColor = (status) => {
    if (status === "Approved") return "#22c55e";
    if (status === "Pending") return "#facc15";
    if (status === "Rejected") return "#ef4444";
    return "#38bdf8";
  };

  return (
    <div style={styles.page}>

      {/* ☰ MENU BUTTON */}
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

        {["Dashboard","Users","AI Models","Campaigns", "Settings"].map((item, i)=>(
          <div
            key={i}
            style={styles.menu}
            onMouseEnter={(e)=>hoverEffect(e,true)}
            onMouseLeave={(e)=>hoverEffect(e,false)}
            onClick={() => {

              if(item === "Dashboard"){
                window.location.href="/admin";
              }

              if(item === "Users"){
                window.location.href="/admin-users";
              }

              if(item === "AI Models"){
                window.location.href="/admin-models";
              }

              if(item === "Campaigns"){
                window.location.href="/admin-campaigns";
              }

              if(item === "Settings"){
                window.location.href="/admin-settings";
              }

              setSidebarOpen(false);

            }}
          >
            {item}
          </div>
        ))}
      </div>

      {/* MAIN */}
      <div style={styles.main}>

        <h1 style={styles.title}>PYE ADMIN DASHBOARD</h1>

        {/* CARDS */}
        <div style={styles.cards}>
          <div style={styles.cardGlow}>
            <p>Total Users</p>
            <h2>{users.length}</h2>
          </div>

          <div style={styles.cardGold}>
            <p>Total Deposits</p>
            <h2>₦{totalDeposits}</h2>
          </div>

          <div style={styles.cardGlow}>
            <p>Active AI Models</p>
            <h2>{investments.length}</h2>
          </div>
        </div>

        {/* TABLE */}
        <div style={styles.box}>

          <h3>Deposit / Withdraw Requests</h3>

          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>User</th>
                  <th style={styles.th}>Type</th>
                  <th style={styles.th}>Amount</th>
                  <th style={styles.th}>Narration</th>
                  <th style={styles.th}>Bank Details</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Proof</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>

              <tbody>
                {transactions
                  .filter(
                    t =>
                      t.type?.trim()?.toUpperCase() === "DEPOSIT" ||
                      t.type?.trim()?.toUpperCase() === "WITHDRAW"
                  )
                  .map((t, i) => (

                  <tr key={i}>
                    <td style={styles.td}>{t.name}</td>
                    <td style={styles.td}>{t.type}</td>
                    <td style={styles.td}>₦{t.amount}</td>

                    <td style={styles.td}>
                      <span
                        style={{
                          background:"#0f172a",
                          padding:"6px 10px",
                          borderRadius:"6px",
                          color:"#38bdf8",
                          fontWeight:"bold",
                          letterSpacing:"1px"
                        }}
                      >
                        {t.narration || "-"}
                      </span>
                    </td>

                    <td style={styles.td}></td>

                    <td style={styles.td}>

                      {t.type === "WITHDRAW" ? (

                        <div style={{fontSize:"13px"}}>

                          <p>{t.bankName}</p>

                          <p>{t.accountNumber}</p>

                          <p>{t.accountName}</p>

                        </div>

                      ) : (

                        <span style={{color:"#64748b"}}>
                          —
                        </span>

                      )}

                    </td>

                    <td style={styles.td}>
                      <span style={{
                        ...styles.badge,
                        background: getStatusColor(t.status || "Pending")
                      }}>
                        {t.status || "Pending"}
                      </span>
                    </td>

                    <td style={styles.td}>

                      {t.proof ? (

                        <a
                          href={t.proof}
                          target="_blank"
                          rel="noreferrer"
                          style={styles.viewBtn}
                        >
                          View
                        </a>

                      ) : (

                        <span>No Proof</span>

                      )}

                    </td>

                    <td style={styles.td}>
                      {(t.status === "Pending" || !t.status) ? (
                        <div style={{ display:"flex", gap:"5px" }}>
                          <button
                            style={styles.approve}
                            onClick={()=>updateStatus(i,"Approved")}
                          >✔</button>

                          <button
                            style={styles.reject}
                            onClick={()=>updateStatus(i,"Rejected")}
                          >✖</button>
                        </div>
                      ) : (
                        <span style={{color:"#64748b"}}>Done</span>
                      )}
                    </td>
                  </tr>

                ))}
              </tbody>
            </table>
          </div>

        </div>

      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {

  page:{
    display:"flex",
    minHeight:"100vh",
    backgroun:"#020617",
    color:"white"
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
    padding:"14px",
    marginBottom:"12px",
    background:"#0f172a",
    borderRadius:"10px",
    cursor:"pointer",
    border:"1px solid #1e293b"
  },

  main:{ flex:1, padding:"20px", marginLeft:"0" },

  title:{ color:"#38bdf8", marginBottom:"20px" },

  cards:{
    display:"grid",
    gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",
    gap:"15px"
  },

  cardGlow:{
    padding:"20px",
    borderRadius:"12px",
    background:"#020617",
    border:"1px solid #0ea5e9"
  },

  cardGold:{
    padding:"20px",
    borderRadius:"12px",
    background:"#020617",
    border:"1px solid gold"
  },

  box:{
    marginTop:"20px",
    padding:"20px",
    borderRadius:"12px",
    background:"#020617",
    border:"1px solid #1e293b"
  },

  badge:{
    padding:"5px 10px",
    borderRadius:"6px",
    color:"black",
    fontWeight:"bold"
  },

  approve:{ background:"#22c55e", border:"none", padding:"5px", cursor:"pointer" },

  reject:{ background:"#ef4444", border:"none", padding:"5px", cursor:"pointer" },

  tableWrapper:{
    width:"100%",
    maxHeight:"350px",   // controls visible height
    overflowY:"auto",    // ✅ vertical scroll
    overflowX:"auto",    // ✅ horizontal scroll
    borderRadius:"10px",
    border:"1px solid #1e293b"
  },

  table:{ width:"100%", borderCollapse:"collapse", minWidth:"600px" },

  th:{
    padding:"12px",
    borderBottom:"1px solid #1e293b",
    textAlign:"left",
    color:"#38bdf8",
    position:"sticky",
    top:0,
    background:"#020617",
    zIndex:2
  },

  viewBtn:{
    background:"#38bdf8",
    padding:"8px 12px",
    borderRadius:"8px",
    color:"#fff",
    textDecoration:"none",
    fontWeight:"bold"
  },

  td:{ padding:"12px", borderBottom:"1px solid #1e293b" }

};

/* 🔥 HOVER */
const hoverEffect = (e, enter) => {
  e.currentTarget.style.background = enter ? "#0ea5e9" : "#0f172a";
};

export default Admin;