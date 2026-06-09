import Sidebar from "../components/Sidebar";

function Support() {
  return (
    <div>

      <Sidebar />

      <div style={styles.container}>
          
        <div style={styles.card}>

          <h2>WhatsApp Support Groups</h2>

          <p>Join our support groups for assistance</p>

          {/* PHASE 1 */}
          <div style={styles.groupCard}>
            <h3>PYEFUNDS OFFICIAL COMMUNITY</h3>
            <button
              style={styles.button}
              onClick={() =>
                window.open("https://chat.whatsapp.com/YOUR_PHASE_1_LINK", "_blank")
              }
            >
              Join Group
            </button>
          </div>

          {/* PHASE 2 */}
          {/* <div style={styles.groupCard}>
            <h3>PYEFUNDS - PHASE 2</h3>
            <button
              style={styles.button}
              onClick={() =>
                window.open("https://chat.whatsapp.com/YOUR_PHASE_2_LINK", "_blank")
              }
            >
              Join Group
            </button>
          </div>*/}

          {/* PHASE 3 */}
          {/* <div style={styles.groupCard}>
            <h3>PYEFUNDS - PHASE 3</h3>
            <button
              style={styles.button}
              onClick={() =>
                window.open("https://chat.whatsapp.com/YOUR_PHASE_3_LINK", "_blank")
              }
            >
              Join Group
            </button>
          </div>*/}

        </div>

      </div>

    </div>
  );
}

const styles = {

  container:{
    padding:"40px"
  },

  card:{
    background:"#020617",
    padding:"30px",
    borderRadius:"10px",
    border:"1px solid #1e293b",
    maxWidth:"500px",
    display:"flex",
    flexDirection:"column",
    gap:"12px",
    marginTop:"20px"
  },

  input:{
    padding:"10px",
    borderRadius:"6px",
    border:"1px solid #1e293b",
    background:"#0f172a",
    color:"white"
  },

  textarea:{
    padding:"10px",
    borderRadius:"6px",
    border:"1px solid #1e293b",
    background:"#0f172a",
    color:"white",
    height:"120px"
  },

  groupCard: {
    background: "#0f172a",
    padding: "15px",
    borderRadius: "10px",
    border: "1px solid #1e293b",
    marginTop: "15px",
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },

  button: {
    padding: "12px",
    background: "#22c55e",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    color: "white",
    fontWeight: "bold"
  }

};

export default Support;