import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import { supabase } from "../supabase";

import {
  getAdminSettings,
  updateAdminSettings
} from "../utils/storage";

function AdminSettings() {

  const navigate = useNavigate();

  const [settings, setSettings] = useState(null);
  const [adminData, setAdminData] = useState(null);
  const [stats, setStats] = useState({
    users:0,
    deposits:0,
    withdrawals:0,
    investments:0
  });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const toggle = async (field) => {

    const updated = {
      ...settings,
      [field]: !settings[field]
    };

    setSettings(updated);

    await updateAdminSettings(updated);

  };

  useEffect(() => {

    const loadSettings = async () => {

      const data =
        await getAdminSettings();

      if(data){

        setSettings(data);

      }

    };

    loadSettings();

    const loadAdmin = async () => {

      const {
        data: { user }
      } = await supabase.auth.getUser();

      if(!user) return;

      const { data } = await supabase
        .from("admins")
        .select("*")
        .eq("email", user.email)
        .single();

      if(data){

        setAdminData(data);

      }

    };

    loadAdmin();

    const loadStats = async () => {

      const { count:users } =
        await supabase
          .from("users")
          .select("*",{ count:"exact", head:true });

      const { count:investments } =
        await supabase
          .from("active_investments")
          .select("*",{ count:"exact", head:true });

      const { data:deposits } =
        await supabase
          .from("transactions")
          .select("amount")
          .eq("type","deposit");

      const { data:withdrawals } =
        await supabase
          .from("transactions")
          .select("amount")
          .eq("type","withdraw");

      const totalDeposits =
        deposits?.reduce((a,b)=>
          a + Number(b.amount),0);

      const totalWithdrawals =
        withdrawals?.reduce((a,b)=>
          a + Number(b.amount),0);

      setStats({
        users: users || 0,
        investments: investments || 0,
        deposits: totalDeposits || 0,
        withdrawals: totalWithdrawals || 0
      });

    };

    loadStats();

  }, []);

  const handleLogout = async () => {

    await supabase.auth.signOut();

    navigate("/admin-login");

  };

  const handleSaveSettings =
  async () => {

    const success =
      await updateAdminSettings(
        settings
      );

    if(success){

      alert("Settings updated");
      console.log(settings);

    }else{

      alert("Failed to save settings");
      console.log(settings);

    }

  };

  const handlePasswordUpdate =
  async () => {

    if(!newPassword || !confirmPassword){

      alert("Fill all fields");

      return;

    }

    if(newPassword !== confirmPassword){

      alert("Passwords do not match");

      return;

    }

    const { error } =
      await supabase.auth.updateUser({

        password:newPassword

      });

    if(error){

      alert(error.message);

    }else{

      alert("Password updated");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

    }

  };

  if(!settings){

    return null;

  }

  return (
    <div style={styles.page}>

      <div style={styles.container}>

        {/* HEADER */}
        <div style={styles.header}>

          <div>
            <h1 style={styles.title}>
              SETTINGS
            </h1>

            <p style={styles.sub}>
              Manage platform, security and system preferences
            </p>
          </div>

          <button
            style={styles.logoutBtn}
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

        <div style={styles.analyticsGrid}>

          <div style={styles.analyticsCard}>
            <h3>Total Users</h3>
            <p>{stats.users}</p>
          </div>

          <div style={styles.analyticsCard}>
            <h3>Total Deposits</h3>
            <p>₦{stats.deposits}</p>
          </div>

          <div style={styles.analyticsCard}>
            <h3>Total Withdrawals</h3>
            <p>₦{stats.withdrawals}</p>
          </div>

          <div style={styles.analyticsCard}>
            <h3>Investments</h3>
            <p>{stats.investments}</p>
          </div>

        </div>

        {/* GRID */}
        <div style={styles.grid}>

          {/* PROFILE */}
          <div style={styles.cardLarge}>

            <h3 style={styles.cardTitle}>
              ADMIN PROFILE
            </h3>

            <div style={styles.profileRow}>

              <img
                src="https://i.pravatar.cc/150?img=12"
                alt=""
                style={styles.avatar}
              />

              <div style={{flex:1}}>

                <h2 style={{margin:0,color:"#fff"}}>
                  {adminData?.name || "Admin"}
                </h2>

                <p style={styles.email}>
                  {adminData?.email}
                </p>

                <span style={styles.badge}>
                  Super Admin
                </span>

              </div>

            </div>

            <div style={styles.formGrid}>

              <div style={styles.field}>
                <label>Full Name</label>

                <input
                  style={styles.input}
                  value={adminData?.name || ""}
                  readOnly
                />
              </div>

              <div style={styles.field}>
                <label>Email Address</label>

                <input
                  style={styles.input}
                  value={adminData?.email || ""}
                  readOnly
                />
              </div>

              <div style={styles.field}>
                <label>Role</label>

                <select style={styles.input}>
                  <option>Super Admin</option>
                </select>
              </div>

            </div>

            <button
              style={styles.saveBtn}
              onClick={handleSaveSettings}
            >
              Save Changes
            </button>

          </div>

          {/* PASSWORD */}
          <div style={styles.card}>

            <h3 style={styles.cardTitle}>
              CHANGE PASSWORD
            </h3>

            <div style={styles.field}>
              <label>Current Password</label>

              <input
                type="password"
                style={styles.input}
                value={currentPassword}
                onChange={(e)=>
                  setCurrentPassword(e.target.value)
                }
              />
            </div>

            <div style={styles.field}>
              <label>New Password</label>

              <input
                type="password"
                style={styles.input}
                value={newPassword}
                onChange={(e)=>
                  setNewPassword(e.target.value)
                }
              />
            </div>

            <div style={styles.field}>
              <label>Confirm Password</label>

              <input
                type="password"
                style={styles.input}
                value={confirmPassword}
                onChange={(e)=>
                  setConfirmPassword(e.target.value)
                }
              />
            </div>

            <button
              style={styles.saveBtn}
              onClick={handlePasswordUpdate}
            >
              Update Password
            </button>

          </div>

          {/* PLATFORM */}
          <div style={styles.card}>

            <h3 style={styles.cardTitle}>
              PLATFORM SETTINGS
            </h3>

            <div style={styles.field}>
              <label>Platform Currency</label>

              <select style={styles.input}>
                <option>PYE</option>
              </select>
            </div>

            <div style={styles.field}>
              <label>PYE to NAIRA Rate</label>

              <input
                style={styles.input}
                value={settings.pyeRate || 360}
                onChange={(e)=>
                  setSettings({
                    ...settings,
                    pyeRate:e.target.value
                  })
                }
              />
            </div>

            <div style={styles.field}>
              <label>Platform Fee (%)</label>

              <input
                style={styles.input}
                value={settings.platformFee}
                onChange={(e)=>
                  setSettings({
                    ...settings,
                    platformFee:e.target.value
                  })
                }
              />
            </div>

            <div style={styles.field}>
              <label>Withdrawal Fee (PYE)</label>

              <input
                style={styles.input}
                value={settings.withdrawalFee}
                onChange={(e)=>
                  setSettings({
                    ...settings,
                    withdrawalFee:e.target.value
                  })
                }
              />
            </div>

            <button
              style={styles.saveBtn}
              onClick={handleSaveSettings}
            >
              Save Changes
            </button>

          </div>

          {/* SECURITY */}
          <div style={styles.card}>

            <h3 style={styles.cardTitle}>
              SECURITY & ACCESS
            </h3>

            <div style={styles.toggleRow}>
              <span>Two-Factor Authentication</span>

              <div
                onClick={() => toggle("maintenance")}
                style={{
                  ...styles.toggle,
                  justifyContent:
                  settings.maintenance
                    ? "flex-end"
                    : "flex-start"
                }}
              >
                <div style={styles.toggleDot} />
              </div>
            </div>

            <div style={styles.toggleRow}>
              <span>Login Notifications</span>

              <div
                onClick={() => toggle("registration")}
                style={{
                  ...styles.toggle,
                  justifyContent:
                  settings.registration
                    ? "flex-end"
                    : "flex-start"
                }}
              >
                <div style={styles.toggleDot} />
              </div>
            </div>

            <div style={styles.field}>
              <label>Session Timeout</label>

              <select style={styles.input}>
                <option>30 min</option>
                <option>60 min</option>
              </select>
            </div>

            <button
              style={styles.saveBtn}
              onClick={handleSaveSettings}
            >
              Save Changes
            </button>

          </div>

          {/* SYSTEM */}
          <div style={styles.card}>

            <h3 style={styles.cardTitle}>
              SYSTEM PREFERENCES
            </h3>

            {[
              ["Maintenance Mode","maintenance"],
              ["Registration","registration"],
              ["Email Verification","emailVerification"],
              ["KYC Verification","kyc"],
              ["Auto Approve Tasks","autoApprove"]
            ].map(([label,key]) => (

              <div
                key={key}
                style={styles.toggleRow}
              >

                <span>{label}</span>

                <div
                  onClick={() => toggle(key)}
                  style={{
                    ...styles.toggle,
                    justifyContent:
                    settings[key]
                      ? "flex-end"
                      : "flex-start"
                  }}
                >
                  <div style={styles.toggleDot} />
                </div>

              </div>

            ))}

            <button
              style={styles.saveBtn}
              onClick={handleSaveSettings}
            >
              Save Changes
            </button>

          </div>

          {/* NOTIFICATIONS */}
          <div style={styles.card}>

            <h3 style={styles.cardTitle}>
              NOTIFICATION SETTINGS
            </h3>

            {[
              ["Admin Email Notifications","adminNotifications"],
              ["User Report Notifications","reportNotifications"],
              ["Transaction Alerts","transactionAlerts"]
            ].map(([label,key]) => (

              <div
                key={key}
                style={styles.toggleRow}
              >

                <span>{label}</span>

                <div
                  onClick={() => toggle(key)}
                  style={{
                    ...styles.toggle,
                    justifyContent:
                    settings[key]
                      ? "flex-end"
                      : "flex-start"
                  }}
                >
                  <div style={styles.toggleDot} />
                </div>

              </div>

            ))}

            <button
              style={styles.saveBtn}
              onClick={handleSaveSettings}
            >
              Save Changes
            </button>

          </div>

          {/* ACTIVITY */}
          <div style={styles.card}>

            <h3 style={styles.cardTitle}>
              ACTIVITY LOG SETTINGS
            </h3>

            {[
              ["Log User Activities","userLogs"],
              ["Log Admin Activities","adminLogs"],
              ["Log Financial Activities","financeLogs"]
            ].map(([label,key]) => (

              <div
                key={key}
                style={styles.toggleRow}
              >

                <span>{label}</span>

                <div
                  onClick={() => toggle(key)}
                  style={{
                    ...styles.toggle,
                    justifyContent:
                    settings[key]
                      ? "flex-end"
                      : "flex-start"
                  }}
                >
                  <div style={styles.toggleDot} />
                </div>

              </div>

            ))}

            <button
              style={styles.saveBtn}
              onClick={handleSaveSettings}
            >
              Save Changes
            </button>

          </div>

          {/* DANGER ZONE */}
          <div style={styles.dangerCard}>

            <h3 style={styles.dangerTitle}>
              DANGER ZONE
            </h3>

            <button style={styles.dangerBtn}>
              Clear Cache
            </button>

            <button style={styles.warningBtn}>
              Backup Database
            </button>

            <button style={styles.redBtn}>
              Reset System
            </button>

            <button style={styles.deleteBtn}>
              Delete All Data
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

const styles = {

  page:{
    minHeight:"100vh",
    backgroun:"#020617",
    color:"white"
  },

  container:{
    padding:"25px"
  },

  header:{
    marginBottom:"25px"
  },

  logoutBtn:{
    background:"#dc2626",
    border:"none",
    padding:"12px 18px",
    borderRadius:"12px",
    color:"white",
    fontWeight:"bold",
    cursor:"pointer"
  },

  title:{
    margin:0,
    fontSize:"32px",
    color:"#fff"
  },

  sub:{
    color:"#94a3b8",
    marginTop:"8px"
  },

  analyticsGrid:{
    display:"grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(220px,1fr))",
    gap:"20px",
    marginBottom:"25px"
  },

  analyticsCard:{
    background:"#071120",
    border:"1px solid rgba(14,165,233,0.15)",
    borderRadius:"20px",
    padding:"20px"
  },

  grid:{
    display:"grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(340px,1fr))",
    gap:"22px"
  },

  card:{
    background:"linear-gradient(180deg,#071120,#091827)",
    border:"1px solid rgba(14,165,233,0.15)",
    borderRadius:"24px",
    padding:"22px",
    boxShadow:"0 0 30px rgba(14,165,233,0.08)"
  },

  cardLarge:{
    gridColumn:"1 / -1",
    background:"linear-gradient(180deg,#071120,#091827)",
    border:"1px solid rgba(14,165,233,0.15)",
    borderRadius:"24px",
    padding:"22px",
    boxShadow:"0 0 30px rgba(14,165,233,0.08)"
  },

  cardTitle:{
    color:"#38bdf8",
    marginBottom:"20px",
    fontSize:"15px",
    letterSpacing:"1px"
  },

  profileRow:{
    display:"flex",
    gap:"18px",
    alignItems:"center",
    marginBottom:"25px",
    flexWrap:"wrap"
  },

  avatar:{
    width:"90px",
    height:"90px",
    borderRadius:"50%",
    border:"3px solid #0ea5e9"
  },

  email:{
    color:"#94a3b8",
    marginTop:"6px"
  },

  badge:{
    background:"rgba(34,197,94,0.15)",
    color:"#22c55e",
    padding:"6px 14px",
    borderRadius:"999px",
    fontSize:"13px"
  },

  formGrid:{
    display:"grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(250px,1fr))",
    gap:"18px"
  },

  field:{
    display:"flex",
    flexDirection:"column",
    gap:"8px",
    marginBottom:"16px"
  },

  input:{
    background:"#08101d",
    border:"1px solid rgba(14,165,233,0.15)",
    padding:"14px",
    borderRadius:"14px",
    color:"white",
    outline:"none"
  },

  saveBtn:{
    marginTop:"10px",
    width:"100%",
    padding:"14px",
    border:"none",
    borderRadius:"14px",
    background:"linear-gradient(90deg,#06b6d4,#2563eb)",
    color:"white",
    fontWeight:"bold",
    cursor:"pointer",
    boxShadow:"0 0 25px rgba(37,99,235,0.25)"
  },

  toggleRow:{
    display:"flex",
    justifyContent:"space-between",
    alignItems:"center",
    marginBottom:"18px",
    paddingBottom:"12px",
    borderBottom:"1px solid rgba(255,255,255,0.05)"
  },

  toggle:{
    width:"55px",
    height:"28px",
    background:"#0ea5e9",
    borderRadius:"999px",
    padding:"4px",
    display:"flex",
    cursor:"pointer"
  },

  toggleDot:{
    width:"20px",
    height:"20px",
    borderRadius:"50%",
    background:"#fff"
  },

  dangerCard:{
    background:"linear-gradient(180deg,#170909,#1f0b0b)",
    border:"1px solid rgba(239,68,68,0.25)",
    borderRadius:"24px",
    padding:"22px"
  },

  dangerTitle:{
    color:"#ef4444",
    marginBottom:"20px"
  },

  dangerBtn:{
    width:"100%",
    padding:"14px",
    marginBottom:"12px",
    border:"none",
    borderRadius:"12px",
    background:"#f59e0b",
    color:"white",
    fontWeight:"bold",
    cursor:"pointer"
  },

  warningBtn:{
    width:"100%",
    padding:"14px",
    marginBottom:"12px",
    border:"none",
    borderRadius:"12px",
    background:"#2563eb",
    color:"white",
    fontWeight:"bold",
    cursor:"pointer"
  },

  redBtn:{
    width:"100%",
    padding:"14px",
    marginBottom:"12px",
    border:"none",
    borderRadius:"12px",
    background:"#dc2626",
    color:"white",
    fontWeight:"bold",
    cursor:"pointer"
  },

  deleteBtn:{
    width:"100%",
    padding:"14px",
    border:"none",
    borderRadius:"12px",
    background:"#7f1d1d",
    color:"white",
    fontWeight:"bold",
    cursor:"pointer"
  }

};

export default AdminSettings;