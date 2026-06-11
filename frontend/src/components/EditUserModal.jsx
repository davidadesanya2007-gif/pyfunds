import { useState, useEffect } from "react";
import {
  updateUserEverywhere,
  getTransactions
} from "../utils/storage";

import { supabase } from "../supabase"; // 🔥 ADD THIS AT TOP

function EditUserModal({ user, onClose, onSave }) {

  const [balance, setBalance] = useState(user?.pyebalance || 0);
  const [addAmount, setAddAmount] = useState("");
  const [deductAmount, setDeductAmount] = useState("");

  const [status, setStatus] = useState(
    user?.blocked ? "Banned" : user?.active ? "Active" : "Frozen"
  );

  const [machines, setMachines] = useState([]);
  const [summary, setSummary] = useState({
    deposited: 0,
    withdrawn: 0
  });

  useEffect(() => {

    const loadData = async () => {

      // 🔥 GET USER MACHINES
      const { data: investments } =
        await supabase
          .from("active_investments")
          .select("*")
          .eq("user_id", user.id);

      console.log("FRESH FROM DB:", investments);

      setMachines(investments || []);

      // 🔥 GET TRANSACTIONS
      const tx = await getTransactions();

      const userTx =
        (tx || []).filter(
          t => String(t.user_id) === String(user.id)
        );

      const deposited =
        userTx
          .filter(t =>
            t.type === "DEPOSIT" &&
            t.status === "Approved"
          )
          .reduce((sum, t) =>
            sum + Number(t.amount), 0);

      const withdrawn =
        userTx
          .filter(t =>
            t.type === "WITHDRAW" &&
            t.status === "Approved"
          )
          .reduce((sum, t) =>
            sum + Number(t.amount), 0);

      setSummary({
        deposited,
        withdrawn
      });

    };

    loadData();

  }, [user]);

  const handleAdd = () => {
    const amount = Number(addAmount);
    if (!amount || amount <= 0) return;

    setBalance(prev => prev + amount);

    setAddAmount("");
  };

  const handleDeduct = () => {
    const amount = Number(deductAmount);
    if (!amount || amount <= 0) return;

    setBalance(prev => Math.max(0, prev - amount));

    setDeductAmount("");
  };

  const handleSave = () => {

    const updatedUser = {
      ...user,
      pyebalance: balance,
      blocked: status === "Banned",
      active: status === "Active"
    };

    // 🔥 THIS IS THE FIX
    (async () => {

      const success =
        await updateUserEverywhere(updatedUser);

      console.log("UPDATE RESULT:", success);

      if(!success){

        alert("Failed to update user");

        return;

      }

      onSave(updatedUser);

      onClose();

    })();
  };

  if (!user) return null;

  return (
    <div style={styles.overlay}>

      <div style={styles.modal}>

        {/* HEADER */}
        <div style={styles.header}>
          <h2>EDIT USER</h2>
          <span style={styles.close} onClick={onClose}>✖</span>
        </div>

        {/* USER INFO */}
        <div style={styles.top}>
          <div style={styles.avatar}></div>

          <div>
            <h3>{user.name}</h3>
            <p>{user.email}</p>
            <span style={styles.statusBadge}>{status}</span>
          </div>
        </div>

        {/* MAIN GRID */}
        <div style={styles.grid}>

          {/* BALANCE CONTROL */}
          <div style={styles.glassCard}>
            <h4>Balance Control</h4>

            <p style={{color:"#38bdf8"}}>
              Current Balance: {balance} PYE
            </p>

            <div style={styles.balanceGrid}>

              {/* ADD */}
              <div style={styles.addBox}>
                <p>Add Balance</p>
                <input
                  value={addAmount}
                  onChange={(e)=>setAddAmount(e.target.value)}
                  style={styles.input}
                />
                <button type="button" style={styles.greenBtn} onClick={handleAdd}>
                  Add Balance
                </button>
              </div>

              {/* DEDUCT */}
              <div style={styles.removeBox}>
                <p>Deduct Balance</p>
                <input
                  value={deductAmount}
                  onChange={(e)=>setDeductAmount(e.target.value)}
                  style={styles.input}
                />
                <button type="button" style={styles.redBtn} onClick={handleDeduct}>
                  Deduct Balance
                </button>
              </div>

            </div>
          </div>

          {/* STATUS */}
          <div style={styles.glassCard}>
            <h4>Account Status</h4>

            <select
              value={status}
              onChange={(e)=>setStatus(e.target.value)}
              style={styles.select}
            >
              <option>Active</option>
              <option>Frozen</option>
              <option>Banned</option>
            </select>

            <p style={styles.smallText}>
              Active = Full access  
              Frozen = Limited  
              Banned = Blocked
            </p>
          </div>

          {/* REFERRAL */}
          <div style={styles.glassCard}>
            <h4>Referral Stats</h4>
            <p>Total Invited: {(user.referrals || []).length}</p>
            <p>Earnings: {user.refEarnings || 0} PYE</p>
          </div>

          {/* ACTIVITY */}
          <div style={styles.glassCard}>
            <h4>Activity Summary</h4>

            <p>
              Deposited: {summary.deposited} PYE
            </p>

            <p>
              Withdrawn: {summary.withdrawn} PYE
            </p>
          </div>

          {/* MODELS */}
          <div style={styles.glassCard}>

            <h4>User Machines</h4>

            <div style={styles.machineContainer}>

              {machines.length === 0 ? (

                <p>No machines</p>

              ) : (

                machines.map((m, i) => (

                  <div key={i} style={styles.model}>

                    <div>
                      <p>{m.name}</p>

                      <small>
                        {m.earnings || 0} PYE Earned
                      </small>
                    </div>

                    <button
                      type="button"
                      style={{
                        background:"red",
                        border:"none",
                        padding:"5px",
                        cursor:"pointer",
                        color:"white"
                      }}
                      onClick={async () => {

                        const confirmDelete =
                          window.confirm(
                            "Remove this machine?"
                          );

                        if(!confirmDelete) return;

                        /*await supabase
                          .from("active_investments")
                          .delete()
                          .eq("id", m.id);*/
                        
                        const { error } = await supabase
                          .from("active_investments")
                          .delete()
                          .eq("id", m.id);

                        if(error){
                          console.log("DELETE ERROR:", error);
                          alert(error.message);
                          return;
                        }

                        console.log("DELETE SUCCESS");
                        

                        setMachines(prev =>
                          prev.filter(x => x.id !== m.id)
                        );

                      }}
                    >
                      Remove
                    </button>

                  </div>

                ))

              )}

            </div>

            <button
              type="button"
              style={{
                marginTop:"10px",
                background:"#22c55e",
                padding:"8px",
                border:"none",
                cursor:"pointer"
              }}

              onClick={async () => {

                const newMachine = {

                  user_id: user.id,

                  name: "Admin Added Machine",

                  image:
                    "https://via.placeholder.com/300",

                  type: "normal",

                  price: 0,

                  dailyearning: 10,

                  earnings: 0,

                  unitsleft: 0,

                  daysleft: 0

                };

                const { data, error } =
                  await supabase
                    .from("active_investments")
                    .insert([newMachine])
                    .select()
                    .single();

                if(error){

                  console.log(error);

                  return;

                }

                setMachines(prev => [
                  ...prev,
                  data
                ]);

              }}
            >
              + Add Machine
            </button>

          </div>

        </div>

        {/* FOOTER */}
        <div style={styles.footer}>
          <button type="button" style={styles.cancel} onClick={onClose}>Cancel</button>
          <button type="button" style={styles.save} onClick={handleSave}>Save Changes</button>
          <button
            type="button"
            style={styles.delete}
            onClick={() => {
              if (!window.confirm("Delete this user?")) return;
              onSave(null, user.email);
              onClose();
            }}
          >
            Delete User
          </button>
        </div>

      </div>
    </div>
  );
}

const styles = {

  overlay:{
    position:"fixed",
    inset:0,
    background:"rgba(0,0,0,0.75)",
    backdropFilter:"blur(8px)",
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    zIndex:9999
  },

  modal:{
    width:"95%",
    maxWidth:"900px",
    maxHeight:"90vh",
    overflowY:"auto",

    background:"linear-gradient(145deg,#020617,#020617)",
    border:"1px solid #0ea5e9",
    borderRadius:"14px",
    padding:"25px",
    boxShadow:"0 0 40px rgba(14,165,233,0.4)",
    animation:"pop 0.25s ease"
  },

  header:{
    display:"flex",
    justifyContent:"space-between",
    marginBottom:"20px"
  },

  close:{ cursor:"pointer" },

  top:{
    display:"flex",
    gap:"15px",
    marginBottom:"20px"
  },

  avatar:{
    width:"60px",
    height:"60px",
    borderRadius:"50%",
    background:"#0ea5e9"
  },

  statusBadge:{
    background:"#22c55e",
    padding:"4px 10px",
    borderRadius:"6px",
    marginTop:"5px",
    display:"inline-block"
  },

  grid:{
    display:"grid",
    gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",
    gap:"15px"
  },

  glassCard:{
    background:"rgba(15,23,42,0.6)",
    border:"1px solid #1e293b",
    padding:"15px",
    borderRadius:"10px",
    backdropFilter:"blur(10px)"
  },

  contentArea:{
    maxHeight:"55vh",
    overflowY:"auto",
    display:"grid",
    gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",
    gap:"15px",
    paddingRight:"5px"
  },

  machineContainer:{
    maxHeight:"250px",
    overflowY:"auto",
    marginTop:"10px",
    paddingRight:"5px"
  },

  balanceGrid:{
    display:"grid",
    gridTemplateColumns:"1fr 1fr",
    gap:"10px"
  },

  addBox:{ border:"1px solid #22c55e", padding:"10px", borderRadius:"8px" },
  removeBox:{ border:"1px solid #ef4444", padding:"10px", borderRadius:"8px" },

  input:{
    width:"100%",
    padding:"8px",
    margin:"5px 0",
    background:"#020617",
    border:"1px solid #1e293b",
    color:"white"
  },

  select:{
    width:"100%",
    padding:"10px",
    background:"#020617",
    border:"1px solid #1e293b",
    color:"white"
  },

  smallText:{
    fontSize:"12px",
    color:"#64748b",
    marginTop:"5px"
  },

  model:{
    display:"flex",
    justifyContent:"space-between",
    borderBottom:"1px solid #1e293b",
    padding:"5px 0"
  },

  footer:{
    display:"flex",
    justifyContent:"space-between",
    marginTop:"20px"
  },

  cancel:{ background:"#334155", padding:"10px", border:"none" },
  save:{ background:"#16a34a", padding:"10px", border:"none" },
  delete:{ background:"#dc2626", padding:"10px", border:"none" }

};

export default EditUserModal;