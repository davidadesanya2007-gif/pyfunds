import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { addTransaction, getUser } from "../utils/storage";
import CustomAlert from "../components/CustomAlert";

function DepositProof() {

  const location = useLocation();
  const navigate = useNavigate();

  const amount = location.state?.amount || "";

  const [proof, setProof] = useState(null);
  const [alert, setAlert] = useState(null);

  // RANDOM NARRATION CODE
  const [narration] = useState(
    Math.random().toString(36).substring(2,8).toUpperCase()
  );

  const handleSubmit = async () => {

    if(!proof){

      setAlert({
        type:"error",
        message:"Upload payment proof ❌"
      });

      return;
    }

    const user = await getUser();

    // CONVERT IMAGE TO BASE64
    const reader = new FileReader();

    reader.readAsDataURL(proof);

    reader.onload = async () => {

      const image = reader.result;

      console.log("DEPOSIT SENDING");

      const result = await addTransaction({

        user_id:user.id,

        name:user.email,

        type:"DEPOSIT",

        amount:Number(amount),

        currency:"₦",

        status:"Pending",

        narration,

        proof:image,

        created_at:new Date().toISOString(),

        date:new Date().toLocaleString()

      });

      console.log("TRANSACTION RESULT:", result);

      setAlert({
        type:"success",
        message:"Deposit submitted successfully ⏳"
      });

      setTimeout(()=>{

        navigate("/dashboard");

      },1500);

    };

  };

  return (
    <div style={styles.page}>

      <Sidebar />

      <div style={styles.box}>

        <h2 style={styles.title}>
          Complete Deposit
        </h2>

        <div style={styles.card}>

          <p><b>Bank Name:</b> OPAY</p>

          <p><b>Account Name:</b> PYFUNDS LIMITED</p>

          <p><b>Account Number:</b> 9038473829</p>

        </div>

        <div style={styles.narrationBox}>

          <h3>Transfer Narration Code</h3>

          <div style={styles.code}>
            {narration}
          </div>

          <p style={styles.info}>
            Put this code inside transfer narration
          </p>

        </div>

        <div style={styles.uploadBox}>

          <input
            type="file"
            accept="image/*"
            onChange={(e)=>
              setProof(e.target.files[0])
            }
          />

        </div>

        <button
          style={styles.button}
          onClick={handleSubmit}
        >
          I've Made The Transfer
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

  page:{
    padding:"20px",
    minHeight:"100vh",
    color:"white"
  },

  box:{
    maxWidth:"500px",
    margin:"auto",
    background:"#020617",
    padding:"25px",
    borderRadius:"20px",
    border:"1px solid #1e293b"
  },

  title:{
    marginBottom:"20px",
    color:"#38bdf8"
  },

  card:{
    background:"#0f172a",
    padding:"20px",
    borderRadius:"14px",
    lineHeight:"2"
  },

  narrationBox:{
    marginTop:"20px",
    textAlign:"center"
  },

  code:{
    marginTop:"10px",
    background:"#38bdf8",
    color:"#000",
    padding:"15px",
    borderRadius:"12px",
    fontSize:"28px",
    fontWeight:"bold",
    letterSpacing:"4px"
  },

  info:{
    marginTop:"10px",
    color:"#94a3b8"
  },

  uploadBox:{
    marginTop:"25px"
  },

  button:{
    marginTop:"25px",
    width:"100%",
    padding:"15px",
    border:"none",
    borderRadius:"14px",
    background:"#22c55e",
    fontWeight:"bold",
    cursor:"pointer"
  }

};

export default DepositProof;