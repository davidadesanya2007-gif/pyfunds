import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import CustomAlert from "../components/CustomAlert";
import { 
  getUser,
  updateUserEverywhere,
  addTransaction,
  getBank,
  setBank
} from "../utils/storage";

function Withdraw() {

  const [amount, setAmount] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [alert, setAlert] = useState(null);

  const [savedBank, setSavedBankState] = useState(null);
  const [editing, setEditing] = useState(true);

  useEffect(() => {

    const loadBank = async () => {

      const bank = await getBank();

      if(bank){

        setSavedBankState(bank);

        setBankName(bank.bankname || "");
        setAccountNumber(bank.accountnumber || "");
        setAccountName(bank.accountname || "");

        setEditing(false);

      }

    };

    loadBank();

  }, []);

  // ✅ SAVE BANK
  const handleBindBank = async () => {

    if (!bankName || !accountNumber || !accountName) {
      setAlert({ type:"error", message:"Fill all bank details" });
      return;
    }

    await setBank({
      bankname: bankName,
      accountnumber: accountNumber,
      accountname: accountName
    });

    setSavedBankState({
      bankname: bankName,
      accountnumber: accountNumber,
      accountname: accountName
    });

    setEditing(false); // ✅ hide form

    setAlert({ type:"success", message:"Bank saved ✅" });
  };

  // ✅ WITHDRAW
  const handleWithdraw = async () => {

    const user =  await getUser();
    const balance = user?.balance || 0;

    // =================================
    // WITHDRAWAL TIME CHECK
    // =================================

    const now = new Date();

    const day = now.getDay();
    // Sunday=0 Monday=1 Tuesday=2 Wednesday=3 Thursday=4 Friday=5 Saturday=6

    const hour = now.getHours();

    // WEEKEND CLOSED
    if (day === 0 || day === 6) {

      setAlert({
        type: "error",
        message:
          "Withdrawal portal closed. It will open on Monday by 7:00 AM."
      });

      return;
    }

    // BEFORE 7AM
    if (hour < 7) {

      setAlert({
        type: "error",
        message:
          "Withdrawal portal not yet open. Come back by 7:00 AM."
      });

      return;
    }

    // AFTER 5PM (17:00)
    if (hour >= 17) {

      // FRIDAY AFTER 5PM
      if (day === 5) {

        setAlert({
          type: "error",
          message:
            "Withdrawal portal closed. It will reopen on Monday by 7:00 AM."
        });

      } else {

        setAlert({
          type: "error",
          message:
            "Withdrawal portal closed. Come back tomorrow by 7:00 AM."
        });

      }

      return;
    }

    if (!savedBank) {
      setAlert({ type:"error", message:"Bind your bank first" });
      return;
    }

    if (Number(amount) < 5000) {
      setAlert({ type:"error", message:"Minimum withdrawal is ₦5000" });
      return;
    }

    if (Number(amount) > Number(balance)) {
      setAlert({ type:"error", message:"Insufficient balance" });
      return;
    }

    // ✅ DEDUCT IMMEDIATELY
    user.balance = balance - Number(amount);

    console.log("WITHDRAW SENDING");

    // 🔥 SAVE EVERYWHERE
    await updateUserEverywhere(user);

    await addTransaction({

      user_id:user.id,

      type: "WITHDRAW",

      amount: Number(amount),

      status: "Pending",

      currency:"₦",

      name: user.email,

      bankName: savedBank.bankname,

      accountNumber: savedBank.accountnumber,

      accountName: savedBank.accountname,

      proof:null,

      created_at:new Date().toISOString(),

      date:new Date().toLocaleString()

    });

    setAlert({ 
      type:"success", message:"Withdrawal request sent ⏳",
      playMoneySound:true
     });

    setAmount("");
  };

  return (
    <div style={{ padding:"20px" }}>

      <Sidebar />

      <div style={{padding:"40px"}}>

        <h2>Withdraw</h2>

        {/* BANK SECTION */}

        <div style={styles.card}>

          <div style={{display:"flex", justifyContent:"space-between"}}>

            <h3>Bank Details</h3>

            {!editing && (
              <span 
                style={{cursor:"pointer"}} 
                onClick={() => setEditing(true)}
              >
                ✏️
              </span>
            )}

          </div>

          {editing ? (

            <>
              <input
                placeholder="Bank Name"
                value={bankName}
                onChange={(e)=>setBankName(e.target.value)}
                style={styles.input}
              />

              <input
                placeholder="Account Number"
                value={accountNumber}
                onChange={(e)=>setAccountNumber(e.target.value)}
                style={styles.input}
              />

              <input
                placeholder="Account Name"
                value={accountName}
                onChange={(e)=>setAccountName(e.target.value)}
                style={styles.input}
              />

              <button style={styles.button} onClick={handleBindBank}>
                Save Bank
              </button>
            </>

          ) : (

            savedBank && (
              <div style={{marginTop:"10px", color:"#555", fontSize:"30px", fontWeight:"bold"}}>
                <p>{savedBank.bankname}</p>
                <p>{savedBank.accountnumber}</p>
                <p>{savedBank.accountname}</p>
              </div>
            )

          )}

        </div>

        {/* WITHDRAW */}
        <div style={styles.card}>

          <h3>Withdraw Funds</h3>

          <input
            type="number"
            placeholder="Enter amount (₦)"
            value={amount}
            onChange={(e)=>setAmount(e.target.value)}
            style={styles.input}
          />

          <button style={styles.withdrawBtn} onClick={handleWithdraw}>
            Withdraw ₦
          </button>

        </div>

      </div>

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

  card:{
    background:"#fff",
    padding:"20px",
    borderRadius:"10px",
    marginTop:"20px"
  },

  input:{
    width:"100%",
    padding:"10px",
    marginTop:"10px",
    borderRadius:"8px",
    border:"1px solid #ccc"
  },

  button:{
    marginTop:"10px",
    width:"100%",
    padding:"10px",
    background:"#c8a96a",
    border:"none",
    borderRadius:"10px",
    cursor:"pointer"
  },

  withdrawBtn:{
    marginTop:"10px",
    width:"100%",
    padding:"12px",
    background:"#ef4444",
    border:"none",
    borderRadius:"10px",
    color:"#fff",
    cursor:"pointer"
  }

};

export default Withdraw;