import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import CustomAlert from "../components/CustomAlert";
import moneySound from "../assets/money.mp4";
import { managers }
from "../data/managers";
import { getUser }
from "../utils/storage";

function Tasks() {

  const [campaigns, setCampaigns] = useState([]);
  const [alert, setAlert] = useState(null);
  const [currentUser, setCurrentUser] =
  useState(null);

  useEffect(() => {

    const loadUser = async () => {

      const user =
        await getUser();

      if(!user) return;

      setCurrentUser(user);

    };

    loadUser();

  }, []);

  return (
    <div style={styles.page}>

      <Sidebar />

      <div style={styles.container}>

        <h1 style={styles.title}>
          ACTIVE CAMPAIGNS
        </h1>

        {currentUser && (

          <>

            <p
              style={{
                color:"#94a3b8",
                marginBottom:"25px"
              }}
            >

              Your Phase:
              {" "}
              <span style={{
                color:"#38bdf8",
                fontWeight:"bold"
              }}>
                {currentUser.phase}
              </span>

            </p>

            {managers[currentUser.phase]
            ?.map((manager,index)=>(

              <div
                key={index}
                style={styles.card}
              >

                <div style={styles.top}>

                  <div style={{
                    width:"70px",
                    height:"70px",
                    borderRadius:"50%",
                    background:"#0f172a",
                    display:"flex",
                    alignItems:"center",
                    justifyContent:"center",
                    fontSize:"30px"
                  }}>
                    👨‍💼
                  </div>

                  <div>

                    <h2 style={styles.name}>
                      {manager.name}
                    </h2>

                    <p style={styles.desc}>
                      Contact this manager
                      to receive tasks
                    </p>

                  </div>

                </div>

                <a
                  href={manager.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    textDecoration:"none"
                  }}
                >

                  <button style={styles.applyBtn}>
                    CHAT ON WHATSAPP
                  </button>

                </a>

              </div>

            ))}

          </>

        )}

        {campaigns.length === 0 && (
          <p style={{color:"#94a3b8"}}>
            No Campaigns Available
          </p>
        )}

      </div>

      {alert && (
        <CustomAlert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}

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
    padding:"20px"
  },

  title:{
    color:"#38bdf8",
    marginBottom:"20px"
  },

  card:{
    background:"#071120",
    border:"1px solid rgba(14,165,233,0.2)",
    borderRadius:"20px",
    padding:"20px",
    marginBottom:"20px",
    boxShadow:"0 0 20px rgba(14,165,233,0.15)"
  },

  top:{
    display:"flex",
    gap:"20px",
    alignItems:"center"
  },

  image:{
    width:"90px",
    height:"90px",
    borderRadius:"15px",
    objectFit:"cover",
    border:"1px solid #0ea5e9"
  },

  name:{
    margin:0
  },

  desc:{
    color:"#94a3b8",
    marginTop:"8px"
  },

  stats:{
    display:"flex",
    justifyContent:"space-between",
    marginTop:"20px",
    flexWrap:"wrap",
    gap:"15px"
  },

  label:{
    color:"#94a3b8",
    fontSize:"14px"
  },

  green:{
    color:"#22c55e"
  },

  blue:{
    color:"#38bdf8"
  },

  gold:{
    color:"#facc15"
  },

  progressBox:{
    width:"100%",
    height:"14px",
    background:"#0f172a",
    borderRadius:"999px",
    overflow:"hidden",
    marginTop:"20px"
  },

  progressFill:{
    height:"100%",
    background:"linear-gradient(90deg,#06b6d4,#2563eb)"
  },

  applyBtn:{
    marginTop:"20px",
    width:"100%",
    padding:"14px",
    border:"none",
    borderRadius:"12px",
    background:"linear-gradient(90deg,#06b6d4,#2563eb)",
    color:"white",
    fontWeight:"bold",
    cursor:"pointer"
  },

  progressBtn:{
    marginTop:"20px",
    width:"100%",
    padding:"14px",
    border:"none",
    borderRadius:"12px",
    background:"#0ea5e9",
    color:"white",
    fontWeight:"bold"
  },

  claimBtn:{
    marginTop:"20px",
    width:"100%",
    padding:"14px",
    border:"none",
    borderRadius:"12px",
    background:"linear-gradient(90deg,#22c55e,#16a34a)",
    color:"white",
    fontWeight:"bold",
    cursor:"pointer"
  }

};

export default Tasks;