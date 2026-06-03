import { supabase } from "../supabase";
import { useEffect, useState } from "react";
import CreateCampaignModal from "../components/CreateCampaignModal";

function AdminCampaigns() {

  const [campaigns, setCampaigns] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {

    fetchCampaigns();

  }, []);

  const fetchCampaigns = async () => {

    const { data, error } = await supabase
      .from("campaigns")
      .select("*")
      .order("id", { ascending:false });

    if(error){

      console.log(error);

      return;
    }

    setCampaigns(data);

  };

  return (

    <div style={styles.page}>

      <div style={styles.container}>

        {/* TOP HEADER */}
        <div style={styles.topBar}>

          <div>
            <h1 style={styles.mainTitle}>
              PYE ADMIN / CAMPAIGNS
            </h1>

            <p style={styles.subTitle}>
              Manage all platform campaigns
            </p>
          </div>

          <button
            style={styles.createBtn}
            onClick={() => setShowCreateModal(true)}
          >
            + Create Campaign
          </button>

        </div>

        {/* CAMPAIGN LIST */}
        <div style={styles.list}>

          {campaigns.map((campaign) => (

            <div
              key={campaign.id}
              style={styles.card}
            >

              {/* LEFT */}
              <div style={styles.left}>

                <div style={styles.imageBox}>
                  <img
                    src={campaign.image}
                    alt=""
                    style={styles.image}
                  />
                </div>

                <div>

                  <h2 style={styles.name}>
                    {campaign.title}
                  </h2>

                  <div style={styles.statsRow}>

                    <p style={styles.info}>
                      Target:
                      <span style={styles.yellow}>
                        {" "}
                        {campaign.target}
                      </span>
                    </p>

                    <p style={styles.info}>
                      Reward:
                      <span style={styles.gold}>
                        {" "}
                        {campaign.reward} PYE
                      </span>
                    </p>

                    <p style={styles.info}>
                      Duration:
                      <span style={styles.white}>
                        {" "}
                        {campaign.duration}
                      </span>
                    </p>

                  </div>

                </div>

              </div>

              {/* RIGHT */}
              <div style={styles.right}>

                <div
                  style={{
                    ...styles.statusBadge,

                    background:
                      campaign.status === "idle"
                        ? "rgba(34,197,94,0.15)"
                        : "rgba(250,204,21,0.15)",

                    border:
                      campaign.status === "idle"
                        ? "1px solid rgba(34,197,94,0.4)"
                        : "1px solid rgba(250,204,21,0.4)",

                    color:
                      campaign.status === "idle"
                        ? "#22c55e"
                        : "#facc15"
                  }}
                >
                  {campaign.status}
                </div>

                <button
                  style={styles.manageBtn}
                  onClick={async () => {

                    const confirmDelete =
                      window.confirm(
                        "Delete this campaign?"
                      );

                    if(!confirmDelete) return;

                    const { error } = await supabase
                      .from("campaigns")
                      .delete()
                      .eq("id", campaign.id);

                    if(error){

                      console.log(error);
                      return;

                    }

                    fetchCampaigns();

                  }}
                >
                  Delete Campaign
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

    {showCreateModal && (
      <CreateCampaignModal

        onClose={() => {
          setShowCreateModal(false);
          fetchCampaigns();
        }}

        onCreate={() => {
          fetchCampaigns();
        }}

      />
    )}
    </div>
  );
}

const styles = {

  page:{
    display:"flex",
    minHeight:"100vh",
    backgroun:"#020617",
    color:"white",
    overflow:"hidden"
  },

  container:{
    flex:1,
    padding:"25px",
    overflowY:"auto"
  },

  topBar:{
    display:"flex",
    justifyContent:"space-between",
    alignItems:"center",
    marginBottom:"25px",
    flexWrap:"wrap",
    gap:"15px",
    borderBottom:"1px solid rgba(14,165,233,0.25)",
    paddingBottom:"20px"
  },

  mainTitle:{
    margin:0,
    fontSize:"28px",
    fontWeight:"bold",
    color:"#fff",
    textShadow:"0 0 15px rgba(14,165,233,0.4)"
  },

  subTitle:{
    marginTop:"5px",
    color:"#74ff18"
  },

  createBtn:{
    padding:"14px 22px",
    border:"none",
    borderRadius:"12px",
    cursor:"pointer",
    fontWeight:"bold",
    color:"white",
    fontSize:"15px",
    background:"linear-gradient(90deg,#0ea5e9,#2563eb)",
    boxShadow:"0 0 25px rgba(14,165,233,0.35)"
  },

  list:{
    display:"flex",
    flexDirection:"column",
    gap:"20px"
  },

  card:{
    display:"flex",
    justifyContent:"space-between",
    alignItems:"center",
    gap:"20px",
    padding:"22px",
    borderRadius:"22px",
    background:
      "linear-gradient(145deg,#06101f,#081426)",
    border:"1px solid rgba(14,165,233,0.22)",
    boxShadow:"0 0 35px rgba(14,165,233,0.08)",
    flexWrap:"wrap"
  },

  left:{
    display:"flex",
    alignItems:"center",
    gap:"18px",
    flexWrap:"wrap"
  },

  imageBox:{
    width:"90px",
    height:"90px",
    borderRadius:"20px",
    background:"#091423",
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    border:"1px solid rgba(14,165,233,0.3)",
    overflow:"hidden",
    boxShadow:"0 0 25px rgba(14,165,233,0.15)"
  },

  image:{
    width:"100%",
    height:"100%",
    objectFit:"cover"
  },

  name:{
    margin:0,
    fontSize:"22px",
    color:"#fff"
  },

  statsRow:{
    display:"flex",
    gap:"25px",
    flexWrap:"wrap",
    marginTop:"12px"
  },

  info:{
    color:"#94a3b8",
    fontSize:"15px",
    margin:0
  },

  yellow:{
    color:"#facc15",
    fontWeight:"bold"
  },

  gold:{
    color:"#fde047",
    fontWeight:"bold"
  },

  white:{
    color:"#fff"
  },

  right:{
    display:"flex",
    alignItems:"center",
    gap:"15px",
    flexWrap:"wrap"
  },

  statusBadge:{
    padding:"10px 16px",
    borderRadius:"999px",
    fontWeight:"bold",
    fontSize:"14px"
  },

  manageBtn:{
    padding:"12px 18px",
    borderRadius:"12px",
    border:"none",
    cursor:"pointer",
    fontWeight:"bold",
    color:"#fff",
    background:
      "linear-gradient(90deg,#f59e0b,#f97316)",
    boxShadow:"0 0 18px rgba(249,115,22,0.25)"
  }

};

export default AdminCampaigns;