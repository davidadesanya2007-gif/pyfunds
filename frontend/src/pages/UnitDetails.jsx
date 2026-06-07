import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import CustomAlert from "../components/CustomAlert";
import moneySound from "../assets/money.mp4";

import {
  addTransaction,
  getUser,
  updateUserEverywhere,
  getUnits
} from "../utils/storage";

function UnitDetails() {

  const { id } = useParams();
  const [alert, setAlert] = useState(null);

  const [unit, setUnit] = useState(null);

  useEffect(() => {

    const fetchUnit = async () => {

      const allUnits = await getUnits();

      const foundUnit = (allUnits || []).find(
        u => String(u.id) === String(id)
      );

      setUnit(foundUnit);

    };

    fetchUnit();

  }, [id]);

  const handleBuyUnit = async () => {

    const user = await getUser();
    const balance = user.pyebalance || 0;

    if (balance < unit.price) {
      setAlert({ type:"error", message:"Insufficient PYE balance" });
      return;
    }

    // deduct balance
    user.pyebalance = balance - unit.price;

    // add units to user
    user.units = Number(user.units || 0) + Number(unit.units || 0);

    // update user globally
    await updateUserEverywhere(user);

    // save transaction
    addTransaction({
      type:"BUY UNIT",
      amount: unit.price,
      name: unit.name,
      date: new Date().toLocaleString()
    });

    // sound
    new Audio(moneySound).play();

    setAlert({
      type:"success",
      message:`${unit.units} Unit purchased ✅, -${unit.price} PYE deducted`
    });
  };

  if (!unit) {
    return (
      <div style={{
        minHeight:"100vh",
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        color:"white"
      }}>
        Loading Unit...
      </div>
    );
  }

  return (
    <div style={styles.page}>

      <Sidebar />

      <div style={styles.container}>

        {/* IMAGE */}
        <img src={unit.image} style={styles.image} />

        {/* NAME */}
        <h2 style={styles.name}>{unit.name}</h2>

        {/* INFO BOX */}
        <div style={styles.infoRow}>

          <div style={styles.infoBox}>
            <p>UNITS</p>
            <h3>{unit.units}</h3>
          </div>

          <div style={styles.infoBox}>
            <p>PRICE</p>
            <h3>{unit.price} PYE</h3>
          </div>

        </div>

        {/* ATTRIBUTES */}
        <div style={styles.section}>

          <h3>Unit Details</h3>

          <p><b>Status:</b> Active</p>
          <p><b>Usage:</b> Boost daily earnings</p>
          <p><b>Conversion:</b> 1 Unit = +1 PYE daily earning</p>
          <p><b>Description:</b> {unit.description}</p>

        </div>

        {/* BUY BUTTON */}
        <button style={styles.button} onClick={handleBuyUnit}>
          Buy for {unit.price} PYE
        </button>

        {/* ALERT */}
        {alert && (
          <CustomAlert
            message={alert.message}
            type={alert.type}
            onClose={() => setAlert(null)}
          />
        )}

      </div>

    </div>
  );
}

const styles = {

  page:{
    minHeight:"100vh",
    background:"#f5f5f",
    color:"#ffffff",
  },

  container:{
    padding:"20px"
  },

  image:{
    width:"100%",
    height:"260px",
    objectFit:"contain",
    borderRadius:"20px",
    background:"#0f172a",
    padding:"20px",
    border:"1px solid rgba(14,165,233,0.2)"
  },

  name:{
    textAlign:"center",
    marginTop:"10px"
  },

  infoRow:{
    display:"flex",
    gap:"10px",
    marginTop:"20px"
  },

  infoBox:{
    flex:1,
    background:"linear-gradient(145deg,#071120,#0f172a)",
    padding:"20px",
    borderRadius:"16px",
    textAlign:"center",
    border:"1px solid rgba(14,165,233,0.2)",
    boxShadow:"0 0 20px rgba(14,165,233,0.1)"
  },

  section:{
    background:"#071120",
    padding:"20px",
    borderRadius:"18px",
    marginTop:"20px",
    lineHeight:"1.9",
    border:"1px solid rgba(14,165,233,0.2)",
    color:"#cbd5e1"
  },

  button:{
    marginTop:"20px",
    width:"100%",
    padding:"16px",
    background:"linear-gradient(90deg,#06b6d4,#2563eb)",
    border:"none",
    borderRadius:"16px",
    fontWeight:"bold",
    fontSize:"16px",
    cursor:"pointer",
    color:"white",
    boxShadow:"0 0 20px rgba(14,165,233,0.3)"
  },

};

export default UnitDetails;