import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { getTransactions, getUser } from "../utils/storage";

function Transactions() {

  const [data, setData] = useState([]);

  useEffect(() => {

    const loadTransactions = async () => {

      // ✅ CURRENT USER
      const currentUser =
        await getUser();

      if(!currentUser?.id){

        return;

      }

      // ✅ ALL TRANSACTIONS
      const transactions =
        await getTransactions();

      // ✅ FILTER USER TRANSACTIONS
      const userTransactions =
        (transactions || []).filter(
          t =>
            String(t.user_id) ===
            String(currentUser.id)
        );

      // ✅ SORT NEWEST FIRST
      userTransactions.sort(
        (a,b)=>
          new Date(b.created_at)
          -
          new Date(a.created_at)
      );

      setData(userTransactions);

    };

    // ✅ YOU FORGOT THIS
    loadTransactions();

  }, []);

  return (
    <div>

      <Sidebar />

      <div
        style={{
          padding:"20px",
          width:"100%",
          maxWidth:"1000px",
          margin:"0 auto"
        }}
      >

        <h2>Transaction History</h2>

        {data.length === 0 ? (
          <p>No transactions yet</p>
        ) : (
          data.map((item, index) => (

            <div key={index} style={styles.card}>

              <div style={styles.row}>
                <span style={styles.type}>
                  {item.type}
                </span>
                <span style={styles.amount}>
                  {item.currency || "₦"}{item.amount}
                </span>
              </div>

              <p style={styles.name}>{item.name}</p>

              <p style={styles.date}>{item.date}</p>

              {(
                item.type?.toUpperCase().includes("DEPOSIT") ||
                item.type?.toUpperCase().includes("WITHDRAW")
              ) && (

                <p style={{
                  marginTop:"8px",
                  color:
                    item.status === "Approved"
                    ? "#22c55e"
                    : item.status === "Rejected"
                    ? "#ef4444"
                    : "#facc15",

                  fontWeight:"bold"
                }}>
                  {item.status}
                </p>

              )}

            </div>

          ))
        )}

      </div>

    </div>
  );
}

const styles = {

  card:{
    width:"100%",
    background:"#fff",
    padding:"20px",
    borderRadius:"14px",
    marginTop:"15px",
    boxShadow:"0 4px 12px rgba(0,0,0,0.08)"
  },

  row:{
    display:"flex",
    justifyContent:"space-between",
    alignItems:"center",
    fontWeight:"bold",
    gap:"10px"
  },

  type:{
    color:"#3b82f6"
  },

  amount:{
    color:"#22c55e"
  },

  name:{
    marginTop:"5px",
    fontSize:"14px"
  },

  date:{
    marginTop:"5px",
    fontSize:"12px",
    color:"#777"
  }

};

export default Transactions;