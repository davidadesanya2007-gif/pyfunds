import { useState } from "react";
import { getUser, updateUserEverywhere, addTransaction } from "../utils/storage";
import CustomAlert from "../components/CustomAlert";
import Sidebar from "../components/Sidebar";

function Converter() { 

  const [naira, setNaira] = useState("");
  const [pye, setPye] = useState("");
  const [alert, setAlert] = useState(null);

  const rate = 360;

  const convertToPye = () => {
    const result = Number(naira) / rate;
    setPye(result ? result.toFixed(2) : "");
  };

  const convertToNaira = () => {
    const result = Number(pye) * rate;
    setNaira(result ? result.toFixed(2) : "");
  };

  const handleConvert = async () => {

    const user = await getUser();

    if (!user) {
      setAlert({ type:"error", message:"User not found" });
      return;
    }

    const nairaValue = Number(naira);
    const pyeValue = Number(pye);

    // ₦ → PYE
    if (nairaValue > 0) {

      if (nairaValue > (user.balance || 0)) {
        setAlert({ type:"error", message:"Insufficient ₦ balance" });
        return;
      }

      const pyeAmount = nairaValue / rate;

      user.balance -= nairaValue;
      user.pyeBalance = (user.pyeBalance || 0) + pyeAmount;

      // 🔥 SAVE EVERYWHERE
      await updateUserEverywhere(user);

      addTransaction({
        type:"CONVERT",
        amount:pyeAmount,
        name:`₦${nairaValue} → PYE`,
        date:new Date().toLocaleString()
      });

      setAlert({
        type:"success",
        message:`Converted to ${pyeAmount.toFixed(2)} PYE`
      });

      setNaira("");
      setPye("");
      return;
    }

    // PYE → ₦
    if (pyeValue > 0) {

      if (pyeValue > (user.pyeBalance || 0)) {
        setAlert({ type:"error", message:"Insufficient PYE" });
        return;
      }

      const nairaAmount = pyeValue * rate;

      user.pyeBalance -= pyeValue;
      user.balance = (user.balance || 0) + nairaAmount;

      // 🔥 SAVE EVERYWHERE
      await updateUserEverywhere(user);

      addTransaction({
        type:"CONVERT",
        amount:nairaAmount,
        name:`PYE → ₦${nairaAmount}`,
        date:new Date().toLocaleString()
      });

      setAlert({
        type:"success",
        message:`Converted to ₦${nairaAmount.toFixed(2)}`
      });

      setNaira("");
      setPye("");
      return;
    }

    setAlert({
      type:"error",
      message:"Enter amount to convert"
    });
  };  

  return (
    
    <div style={{ padding:"20px" }}>

      <Sidebar />

      <div style={{padding:"40px"}}></div>

      <div style={styles.container}>

        <h2>Converter</h2>

        <p>Rate: 1 PYE = ₦{rate}</p>

        <input
          type="number"
          placeholder="Naira"
          value={naira}
          onChange={(e) => setNaira(e.target.value)}
          style={styles.input}
        />

        <button onClick={convertToPye}>Convert →</button>

        <input
          type="number"
          placeholder="PYE"
          value={pye}
          onChange={(e) => setPye(e.target.value)}
          style={styles.input}
        />

        <button onClick={convertToNaira}>← Convert</button>

        <button style={styles.button} onClick={handleConvert}>
          Confirm Conversion
        </button>

        {alert && (
          <CustomAlert
            message={alert.message}
            type={alert.type}
            onClose={() => setAlert(null)}
          />
        )}

      </div> {/* ✅ FIXED: CLOSED DIV */}

    </div>
  );
}

const styles = {
  container:{
    maxWidth:"500px",
    margin:"auto"
  },

  input:{
    width:"100%",
    padding:"10px",
    marginTop:"10px",
    borderRadius:"8px",
    border:"1px solid #ccc"
  },

  button:{
    marginTop:"15px",
    width:"100%",
    padding:"10px",
    background:"#c8a96a",
    border:"none",
    borderRadius:"10px",
    cursor:"pointer"
  }
};

export default Converter;