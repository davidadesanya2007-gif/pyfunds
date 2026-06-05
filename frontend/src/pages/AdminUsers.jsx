import { useEffect, useState } from "react";
import {
  getAllUsers,
  getTransactions,
  updateUserEverywhere
} from "../utils/storage";
import { supabase } from "../supabase";
import EditUserModal from "../components/EditUserModal";

function AdminUsers() {

  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {

    const loadData = async () => {

      //USERS
      const usersData =
       await getAllUsers();

      setUsers(usersData || []);

      //TRANSACTIONS
      const txData = await getTransactions();

      setTransactions(txData || []);

    };

    loadData();

  }, []);

  // ✅ SEARCH
  const filteredUsers = users.filter(u =>
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ TOTAL DEPOSITS (NOT BALANCE)
  const totalDeposits = transactions
    .filter(t => t.type === "DEPOSIT" && t.status === "Approved")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const activeUsers = users.filter(
    u => !u.blocked
  ).length;

  const refreshUsers = async () => {
    const data = await getAllUsers();
    setUsers(data);
  };

  return (
    <div style={styles.container}> {/* ✅ IMPORTANT */}

      {/* HEADER */}
      <div style={styles.header}>
        <h2 style={styles.title}> PYE ADMIN / USERS</h2>
      </div>

      {/* CARDS */}
      <div style={styles.cards}>

        <div style={styles.card}>
          <p>Total Users</p>
          <h2>{users.length}</h2>
        </div>

        <div style={styles.cardGold}>
          <p>Total Deposits</p>
          <h2>₦{totalDeposits}</h2>
        </div>

        <div style={styles.card}>
          <p>Active Users</p>
          <h2>{activeUsers}</h2>
        </div>

      </div>

      {/* SEARCH */}
      <input
        placeholder="Search users..."
        value={search}
        onChange={(e)=>setSearch(e.target.value)}
        style={styles.input}
      />

      {/* TABLE */}
      <div style={styles.tableWrapper}>

        <table style={styles.table}>

          <thead>
            <tr>
              <th style={styles.th}>User</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Balance</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>

          <tbody>

            {filteredUsers.map((u, i) => {

              const status = u.blocked
                ? "Banned"
                : "Active";

              return (
                <tr key={i}>

                  <td style={styles.td}>
                    <div style={styles.userBox}>
                      <div style={styles.avatar}></div>
                      {u.name || "User"}
                    </div>
                  </td>

                  <td style={styles.td}>{u.email}</td>

                  <td style={styles.td}>
                    {Number(u.pyebalance || 0)} PYE
                  </td>

                  <td style={styles.td}>
                    <span style={{
                      ...styles.badge,
                      background:
                        status === "Active"
                          ? "#22c55e"
                          : status === "Frozen"
                          ? "#3b82f6"
                          : "#ef4444"
                    }}>
                      {status}
                    </span>
                  </td>

                  <td style={styles.td}>
                    <button
                      style={styles.editBtn}
                      onClick={()=>setSelectedUser(u)}
                    >
                      Edit
                    </button>
                  </td>

                </tr>
              );
            })}

          </tbody>

        </table>

      </div>

      {/* EDIT MODAL */}
      {selectedUser && (
        <EditUserModal
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
        onSave={async(updatedUser, deleteEmail) => {

          // 🔥 DELETE USER
          if (deleteEmail) {

            await supabase
              .from("users")
              .delete()
              .eq("email", deleteEmail);

            // 🔥 ALSO DELETE MACHINES HERE (IMPORTANT)
            await supabase
              .from("active_investments")
              .delete()
              .eq("user_id",
                users.find(u => u.email === deleteEmail)?.id
              );

              await refreshUsers();

            const refreshedUsers = await getAllUsers();
            setUsers(refreshedUsers);

            setSelectedUser(null);
            return;
          }

          // UPDATE SUPABASE
          const success =
            await updateUserEverywhere(updatedUser);

          if(!success){

            alert("Failed to save user");

            return;
          }

          // UPDATE UI
          /*const updatedList = users.map(u =>
            u.email === updatedUser.email
              ? updatedUser
              : u
          );

          setUsers(updatedList);*/
          const refreshedUsers = await getAllUsers();
          setUsers(refreshedUsers);

          setSelectedUser(null);
        }}
      />
      )}
    </div>
  );
}

const styles = {

  header:{
    marginBottom:"15px"
  },

  title:{
    color:"#38bdf8",
    fontSize:"20px"
  },

  cards:{
    display:"grid",
    gridTemplateColumns:"repeat(auto-fit, minmax(120px,1fr))",
    gap:"10px",
    marginBottom:"15px"
  },

  card:{
    padding:"15px",
    borderRadius:"10px",
    background:"#020617",
    border:"1px solid #0ea5e9",
    textAlign:"center"
  },

  cardGold:{
    padding:"15px",
    borderRadius:"10px",
    background:"#020617",
    border:"1px solid gold",
    textAlign:"center"
  },

  input:{
    width:"100%",
    padding:"10px",
    marginBottom:"10px",
    borderRadius:"8px",
    border:"1px solid #1e293b",
    background:"#020617",
    color:"white"
  },

  tableWrapper:{
    width:"100%",
    overflowX:"auto",   // 👈 mobile scroll
    border:"1px solid #1e293b",
    borderRadius:"10px"
  },

  table:{
    width:"100%",
    minWidth:"500px",   // 👈 prevents squishing
    borderCollapse:"collapse",
    background:"#020617"
  },

  th:{
    padding:"10px",
    borderBottom:"1px solid #1e293b",
    textAlign:"left",
    color:"#38bdf8"
  },

  td:{
    padding:"10px",
    borderBottom:"1px solid #1e293b"
  },

  userBox:{
    display:"flex",
    alignItems:"center",
    gap:"8px"
  },

  avatar:{
    width:"28px",
    height:"28px",
    borderRadius:"50%",
    background:"#0ea5e9"
  },

  badge:{
    padding:"4px 8px",
    borderRadius:"6px",
    color:"white",
    fontSize:"12px"
  },

   editBtn:{
    background:"#c8a96a",
    border:"none",
    padding:"6px 10px",
    borderRadius:"6px",
    cursor:"pointer"
  }

};

export default AdminUsers;

