import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import CustomAlert from "../components/CustomAlert";

function Deposit() {

  const navigate = useNavigate();

  const [amount, setAmount] = useState("");
  const [alert, setAlert] = useState(null);

  const handleDeposit = () => {

    if (Number(amount) < 5000) {

      setAlert({
        type:"error",
        message:"Minimum deposit is ₦5000"
      });

      return;
    }

    navigate("/deposit-proof",{
      state:{
        amount: Number(amount)
      }
    });

  };

  return (
    <div style={{padding:"20px"}}>

      <Sidebar />

      <div style={{padding:"40px"}}>

        <h2>Deposit</h2>

        <input
          type="number"
          placeholder="Enter amount (₦)"
          value={amount}
          onChange={(e)=>setAmount(e.target.value)}
          style={styles.input}
        />

        <button style={styles.button} onClick={handleDeposit}>
          Deposit ₦
        </button>

      </div>

      {alert && (
        <CustomAlert
          message={alert.message}
          type={alert.type}
          onClose={()=>setAlert(null)}
        />
      )}

    </div>
  );
}

const styles = {
  input:{
    width:"100%",
    padding:"10px",
    borderRadius:"8px",
    border:"1px solid #ccc"
  },

  button:{
    marginTop:"10px",
    padding:"12px",
    width:"100%",
    background:"#22c55e",
    border:"none",
    borderRadius:"10px",
    cursor:"pointer"
  }
};

export default Deposit;