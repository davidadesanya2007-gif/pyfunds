import { supabase } from "../supabase";
import { useState, useRef, useEffect } from "react";
import { getProducts } from "../utils/storage";

function CreateCampaignModal({ onClose, onCreate }) {

  const fileInputRef = useRef();

  const [models, setModels] = useState([]);

  const [campaign, setCampaign] = useState({

    title: "",

    description: "",

    target: 10,

    reward: 5,

    modelType: "",

    duration: 7,

    status: "idle",

    image:
      "/src/assets/images/icons/Product1.jpeg"

  });

  const handleChange = (field, value) => {
    setCampaign(prev => ({
      ...prev,
      [field]: value
    }));
  };

  useEffect(() => {

    const loadModels = async () => {

      const data = await getProducts();

      setModels(data || []);

    };

    loadModels();

  }, []);

  const handleImageUpload = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {

      setCampaign(prev => ({
        ...prev,
        image: reader.result
      }));

    };

    reader.readAsDataURL(file);
  };

  const totalBudget =
    Number(campaign.target) * Number(campaign.reward);

  return (
    <div style={styles.overlay}>

      <div style={styles.modal}>

        {/* HEADER */}
        <div style={styles.header}>

          <div>
            <h2 style={styles.title}>
              CREATE CAMPAIGN
            </h2>

            <p style={styles.sub}>
              Premium Task Campaign Manager
            </p>
          </div>

          <button
            style={styles.closeBtn}
            onClick={onClose}
          >
            ✕
          </button>

        </div>

        {/* BODY */}
        <div style={styles.body}>

          {/* LEFT */}
          <div style={styles.leftPanel}>

            <div style={styles.imageBox}>
              <img
                src={campaign.image}
                alt=""
                style={styles.image}
              />
            </div>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display:"none" }}
              onChange={handleImageUpload}
            />

            <button
              style={styles.changeBtn}
              onClick={() => fileInputRef.current.click()}
            >
              Upload Campaign Image
            </button>

            <div style={styles.statsCard}>
              <p>Campaign Reward</p>
              <h2>{campaign.reward} PYE</h2>
            </div>

            <div style={styles.statsCard}>
              <p>Target Users</p>
              <h2>{campaign.target}</h2>
            </div>

            <div style={styles.statsCard}>
              <p>Status</p>
              <h2>{campaign.status}</h2>
            </div>

          </div>

          {/* RIGHT */}
          <div style={styles.rightPanel}>

            {/* TOP */}
            <div style={styles.topCard}>

              <img
                src={campaign.image}
                alt=""
                style={styles.topImage}
              />

              <div>

                <div style={styles.row}>
                  <h2 style={{color:"white"}}>
                    {campaign.title || "New Task Campaign"}
                  </h2>

                  <span style={styles.activeBadge}>
                    {campaign.status}
                  </span>
                </div>

                <p style={{color:"#94a3b8"}}>
                  ID: {campaign.id}
                </p>

              </div>

            </div>

            {/* GRID */}
            <div style={styles.grid}>

              {/* LEFT CARD */}
              <div style={styles.card}>

                <h3 style={styles.cardTitle}>
                  CAMPAIGN INFORMATION
                </h3>

                <div style={styles.field}>
                  <label>Campaign Title</label>

                  <input
                    value={campaign.title}
                    onChange={(e)=>
                      handleChange("title", e.target.value)
                    }
                    style={styles.input}
                  />
                </div>

                <div style={styles.doubleGrid}>

                  <div style={styles.field}>
                    <label>Invite Target</label>

                    <input
                      value={campaign.target}
                      onChange={(e)=>
                        handleChange("target", e.target.value)
                      }
                      style={styles.input}
                    />
                  </div>

                  <div style={styles.field}>
                    <label>Reward (PYE)</label>

                    <input
                      value={campaign.reward}
                      onChange={(e)=>
                        handleChange("reward", e.target.value)
                      }
                      style={styles.input}
                    />
                  </div>

                </div>

                <div style={styles.field}>
                  <label>Task Description</label>

                  <textarea
                    rows={5}
                    value={campaign.description}
                    onChange={(e)=>
                      handleChange("description", e.target.value)
                    }
                    style={styles.textarea}
                  />
                </div>

              </div>

              {/* RIGHT CARD */}
              <div style={styles.goldCard}>

                <h3 style={styles.goldTitle}>
                  CAMPAIGN SETTINGS
                </h3>

                <div style={styles.field}>

                  <label>Model Type</label>

                  <select
                    value={campaign.modelType}

                    onChange={(e)=>
                      handleChange(
                        "modelType",
                        e.target.value
                      )
                    }

                    style={styles.goldInput}
                  >

                    <option value="">
                      Select AI Model
                    </option>

                    {models.map((model,index)=>(

                      <option
                        key={index}
                        value={model.name}
                      >
                        {model.name}
                      </option>

                    ))}

                  </select>

                </div>

                <div style={styles.doubleGrid}>

                  <div style={styles.field}>
                    <label>Duration</label>

                    <input
                      type="number"

                      value={campaign.duration}

                      onChange={(e)=>
                        handleChange(
                          "duration",
                          e.target.value
                        )
                      }

                      style={styles.goldInput}
                    />
                  </div>

                  <div style={styles.field}>
                    <label>Status</label>

                    <select
                      value={campaign.status}
                      onChange={(e)=>
                        handleChange("status", e.target.value)
                      }
                      style={styles.goldInput}
                    >
                      <option>idle</option>
                      <option>Disabled</option>
                    </select>
                  </div>

                </div>

                <div style={styles.profitBox}>
                  <p>Total Reward Budget</p>

                  <h1>
                    {totalBudget || 0} PYE
                  </h1>
                </div>

              </div>

            </div>

            {/* FOOTER */}
            <div style={styles.footer}>

              <button
                style={styles.cancelBtn}
                onClick={onClose}
              >
                Cancel
              </button>

              <button
                style={styles.saveBtn}

                onClick={async () => {

                  const { error } = await supabase
                    .from("campaigns")
                    .insert([
                      {

                        title: campaign.title,

                        description:
                          campaign.description,

                        reward:
                          Number(campaign.reward),

                        target:
                          Number(campaign.target),

                        model_type:
                          campaign.modelType,

                        duration:
                          Number(campaign.duration),

                        progress: 0,

                        status:
                          campaign.status,

                        image:
                          campaign.image,

                        participants: 0,

                        completed: 0,

                        rewardsGiven: 0,

                        created_at:
                          new Date().toISOString()

                      }
                    ]);

                  if (error) {

                    console.log(error);

                    onCreate({
                      type:"error",
                      message:error.message
                    });

                    return;
                  }

                  onCreate({
                    type:"success",
                    message:"Campaign Created Successfully 🚀"
                  });

                  onClose();

                }}
              >
                Create Campaign
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

const styles = {

  overlay:{
    position:"fixed",
    inset:0,
    background:"rgba(1,6,20,0.92)",
    backdropFilter:"blur(14px)",
    zIndex:99999,
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    padding:"20px",
    overflowY:"auto"
  },

  modal:{
    width:"100%",
    maxWidth:"1450px",
    maxHeight:"96vh",
    overflowY:"auto",
    background:"linear-gradient(180deg,#050816,#071427)",
    border:"1px solid rgba(0,195,255,0.35)",
    borderRadius:"28px",
    boxShadow:`
      0 0 60px rgba(0,195,255,0.15),
      inset 0 0 30px rgba(0,195,255,0.05)
    `,
    position:"relative"
  },

  header:{
    padding:"22px 28px",
    borderBottom:"1px solid rgba(0,195,255,0.15)",
    display:"flex",
    justifyContent:"space-between",
    alignItems:"center",
    background:"rgba(5,10,25,0.95)",
    position:"sticky",
    top:0,
    zIndex:10,
    backdropFilter:"blur(12px)"
  },

  title:{
    color:"#fff",
    margin:0,
    fontSize:"24px",
    fontWeight:"700",
    letterSpacing:"1px"
  },

  sub:{
    color:"#38bdf8",
    marginTop:"6px",
    fontSize:"13px",
    letterSpacing:"1px"
  },

  closeBtn:{
    width:"42px",
    height:"42px",
    borderRadius:"12px",
    border:"1px solid rgba(255,255,255,0.1)",
    background:"#081120",
    color:"#fff",
    cursor:"pointer",
    fontSize:"18px",
    transition:"0.3s",
    boxShadow:"0 0 20px rgba(0,195,255,0.15)"
  },

  body:{
    display:"grid",gridTemplateColumns:
    window.innerWidth < 900
      ? "1fr"
      : "320px 1fr",
    gap:"22px",
    padding:"24px"
  },

  leftPanel:{
    display:"flex",
    flexDirection:"column",
    gap:"18px"
  },

  imageBox:{
    background:"linear-gradient(180deg,#071120,#091a31)",
    padding:"20px",
    borderRadius:"22px",
    border:"1px solid rgba(0,195,255,0.18)",
    minHeight:"280px",
    display:"flex",
    alignItems:"center",
    justifyContent:"center",
    boxShadow:"inset 0 0 20px rgba(0,195,255,0.05)"
  },

  image:{
    width:"100%",
    height:"240px",
    objectFit:"contain"
  },

  changeBtn:{
    background:"linear-gradient(90deg,#009dff,#2563eb)",
    border:"none",
    padding:"14px",
    borderRadius:"14px",
    color:"white",
    fontWeight:"600",
    cursor:"pointer",
    boxShadow:"0 0 25px rgba(37,99,235,0.35)"
  },

  statsCard:{
    background:"linear-gradient(180deg,#071120,#091827)",
    padding:"18px",
    borderRadius:"18px",
    border:"1px solid rgba(0,195,255,0.15)",
    color:"white",
    boxShadow:"inset 0 0 12px rgba(0,195,255,0.05)"
  },

  rightPanel:{
    display:"flex",
    flexDirection:"column",
    gap:"22px"
  },

  topCard:{
    display:"flex",
    gap:"18px",
    background:"linear-gradient(180deg,#071120,#091827)",
    padding:"22px",
    borderRadius:"22px",
    border:"1px solid rgba(0,195,255,0.15)",
    flexWrap:"wrap",
    alignItems:"center"
  },

  topImage:{
    width:"120px",
    height:"120px",
    objectFit:"contain",
    borderRadius:"18px",
    background:"#0b1730",
    border:"1px solid rgba(0,195,255,0.15)"
  },

  row:{
    display:"flex",
    gap:"12px",
    alignItems:"center",
    flexWrap:"wrap"
  },

  activeBadge:{
    background:"rgba(34,197,94,0.15)",
    color:"#22c55e",
    padding:"6px 14px",
    borderRadius:"999px",
    fontSize:"13px",
    border:"1px solid rgba(34,197,94,0.2)"
  },

  grid:{
    display:"grid",gridTemplateColumns:
    window.innerWidth < 900
      ? "1fr"
      : "1fr 1fr",
    gap:"22px"
  },

  card:{
    background:"linear-gradient(180deg,#071120,#091827)",
    padding:"22px",
    borderRadius:"22px",
    border:"1px solid rgba(0,195,255,0.15)",
    boxShadow:"inset 0 0 20px rgba(0,195,255,0.04)"
  },

  goldCard:{
    background:"linear-gradient(180deg,#071120,#091827)",
    padding:"22px",
    borderRadius:"22px",
    border:"1px solid rgba(250,204,21,0.2)",
    boxShadow:"inset 0 0 20px rgba(250,204,21,0.03)"
  },

  cardTitle:{
    color:"#38bdf8",
    marginBottom:"22px",
    fontSize:"15px",
    letterSpacing:"1px"
  },

  goldTitle:{
    color:"#facc15",
    marginBottom:"22px",
    fontSize:"15px",
    letterSpacing:"1px"
  },

  field:{
    display:"flex",
    flexDirection:"column",
    gap:"8px",
    marginBottom:"16px",
    color:"#cbd5e1",
    fontSize:"13px"
  },

  input:{
    background:"#08101d",
    border:"1px solid rgba(0,195,255,0.15)",
    padding:"14px",
    borderRadius:"14px",
    color:"white",
    outline:"none",
    fontSize:"14px"
  },

  goldInput:{
    background:"#08101d",
    border:"1px solid rgba(250,204,21,0.18)",
    padding:"14px",
    borderRadius:"14px",
    color:"white",
    outline:"none",
    fontSize:"14px"
  },

  textarea:{
    background:"#08101d",
    border:"1px solid rgba(0,195,255,0.15)",
    padding:"14px",
    borderRadius:"14px",
    color:"white",
    resize:"none",
    outline:"none",
    minHeight:"130px"
  },

  doubleGrid:{
    display:"grid",
    gridTemplateColumns:"1fr 1fr",
    gap:"16px"
  },

  profitBox:{
    marginTop:"24px",
    background:"linear-gradient(90deg,rgba(34,197,94,0.12),rgba(0,195,255,0.12))",
    border:"1px solid rgba(34,197,94,0.2)",
    padding:"22px",
    borderRadius:"18px",
    color:"white",
    boxShadow:"0 0 20px rgba(34,197,94,0.08)"
  },

  footer:{
    display:"flex",
    justifyContent:"space-between",
    gap:"15px",
    flexWrap:"wrap",
    paddingTop:"8px"
  },

  cancelBtn:{
    flex:1,
    background:"#121c2d",
    border:"1px solid rgba(255,255,255,0.08)",
    padding:"15px",
    borderRadius:"14px",
    color:"white",
    cursor:"pointer",
    fontWeight:"600"
  },

  saveBtn:{
    flex:1,
    background:"linear-gradient(90deg,#00b7ff,#2563eb)",
    border:"none",
    padding:"15px",
    borderRadius:"14px",
    color:"white",
    fontWeight:"700",
    cursor:"pointer",
    boxShadow:"0 0 30px rgba(0,183,255,0.3)"
  }

};

export default CreateCampaignModal;