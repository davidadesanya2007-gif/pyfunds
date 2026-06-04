import { useEffect } from "react";

function CustomAlert({
  message,
  type,
  onClose,
  playMoneySound = false
}) {

  useEffect(() => {

    if(playMoneySound){

      const audio =
        new Audio("/money.mp4");

      audio.play();

    }

  }, [playMoneySound]);

  return (
    <div style={styles.overlay}>

      <div style={styles.box}>

        <h3 style={{ color: type === "success" ? "green" : "red" }}>
          {type === "success" ? "Success" : "Error"}
        </h3>

        <p>{message}</p>

        <button style={styles.button} onClick={onClose}>
          OK
        </button>

      </div>

    </div>
  );
}

const styles = {
  overlay:{
    position:"fixed",
    top:0,
    left:0,
    width:"100%",
    height:"100%",
    background:"rgba(0,0,0,0.5)",
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    zIndex:1000,
    color:"green"
  },

  box:{
    background:"#fff",
    padding:"20px",
    borderRadius:"15px",
    width:"300px",
    textAlign:"center"
  },

  button:{
    marginTop:"15px",
    padding:"10px 20px",
    border:"none",
    background:"#c8a96a",
    borderRadius:"10px",
    cursor:"pointer"
  }
};

export default CustomAlert;