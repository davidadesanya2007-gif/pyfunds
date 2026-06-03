import { useState, useRef } from "react";

function AddModelModal({ onClose, onCreate }) {

  const fileInputRef = useRef();

  const [model, setModel] = useState({
    id: "p" + Date.now(),
    name: "",
    price: "",
    percent: "",
    units: "",
    days: "",
    left: "",
    description: "",
    image: "",
    revenue: 0,
    sold: 0,
    activeUsers: 0,
    voltage: "",
    efficiency: "",
    stability: "",
    energyFlow: "",
    powerType: "",
    coolingSystem: "",
    status: "In Stock",
    featured: false,
    visible: true
  });

  const handleChange = (field, value) => {
    setModel(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setModel(prev => ({
        ...prev,
        image: reader.result
      }));
    };

    reader.readAsDataURL(file);
  };

  const estimatedProfit =
    (
      Number(model.price || 0) *
      (Number(model.percent || 0) / 100)
    ).toFixed(2);

  return (
    <div style={styles.overlay}>

      <div style={styles.modal}>

        {/* HEADER */}
        <div style={styles.header}>

          <h2 style={styles.title}>
            + ADD NEW AI MODEL
          </h2>

          <button
            style={styles.closeBtn}
            onClick={onClose}
          >
            ✕
          </button>

        </div>

        {/* BODY */}
        <div style={styles.body}>

          {/* BASIC INFO */}
          <div style={styles.card}>

            <h3 style={styles.cardTitle}>
              BASIC INFORMATION
            </h3>

            <div style={styles.field}>
              <label>Model Name</label>

              <input
                style={styles.input}
                value={model.name}
                onChange={(e)=>
                  handleChange("name", e.target.value)
                }
              />
            </div>

            <div style={styles.doubleGrid}>

              <div style={styles.field}>
                <label>Units</label>

                <input
                  style={styles.input}
                  value={model.units}
                  onChange={(e)=>
                    handleChange("units", e.target.value)
                  }
                />
              </div>

              <div style={styles.field}>
                <label>Stock</label>

                <input
                  style={styles.input}
                  value={model.left}
                  onChange={(e)=>
                    handleChange("left", e.target.value)
                  }
                />
              </div>

            </div>

            <div style={styles.field}>
              <label>Description</label>

              <textarea
                rows={5}
                style={styles.textarea}
                value={model.description}
                onChange={(e)=>
                  handleChange("description", e.target.value)
                }
              />
            </div>

          </div>

          {/* IMAGE */}
          <div style={styles.card}>

            <h3 style={styles.cardTitle}>
              MODEL IMAGE
            </h3>

            <div style={styles.imageBox}>

              {model.image ? (
                <img
                  src={model.image}
                  alt=""
                  style={styles.image}
                />
              ) : (
                <p style={{color:"#64748b"}}>
                  Upload Image
                </p>
              )}

            </div>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{display:"none"}}
              onChange={handleImageUpload}
            />

            <button
              style={styles.uploadBtn}
              onClick={() => fileInputRef.current.click()}
            >
              Upload Image
            </button>

          </div>

          {/* PRICING */}
          <div style={styles.goldCard}>

            <h3 style={styles.goldTitle}>
              PRICING & EARNINGS
            </h3>

            <div style={styles.doubleGrid}>

              <div style={styles.field}>
                <label>Price</label>

                <input
                  style={styles.goldInput}
                  value={model.price}
                  onChange={(e)=>
                    handleChange("price", e.target.value)
                  }
                />
              </div>

              <div style={styles.field}>
                <label>Daily %</label>

                <input
                  style={styles.goldInput}
                  value={model.percent}
                  onChange={(e)=>
                    handleChange("percent", e.target.value)
                  }
                />
              </div>

              <div style={styles.field}>
                <label>Duration</label>

                <input
                  style={styles.goldInput}
                  value={model.days}
                  onChange={(e)=>
                    handleChange("days", e.target.value)
                  }
                />
              </div>

            </div>

            <div style={styles.profitBox}>
              <p>Estimated Profit</p>
              <h1>{estimatedProfit} PYE</h1>
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
            style={styles.createBtn}
            onClick={() => onCreate(model)}
          >
            + Create AI Model
          </button>

        </div>

      </div>

    </div>
  );
}

const styles = {
  overlay:{
    position:"fixed",
    inset:0,
    background:"rgba(0,0,0,0.85)",
    backdropFilter:"blur(10px)",
    zIndex:9999,
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    padding:"20px"
  },

  modal:{
    width:"100%",
    maxWidth:"1300px",
    maxHeight:"95vh",
    overflowY:"auto",
    background:"#050816",
    border:"1px solid #0ea5e9",
    borderRadius:"25px",
    padding:"25px",
    boxShadow:"0 0 50px rgba(14,165,233,0.3)"
  },

  header:{
    display:"flex",
    justifyContent:"space-between",
    alignItems:"center",
    marginBottom:"20px"
  },

  title:{
    color:"white"
  },

  closeBtn:{
    width:"40px",
    height:"40px",
    border:"none",
    borderRadius:"10px",
    background:"#111827",
    color:"white",
    cursor:"pointer"
  },

  body:{
    display:"grid",
    gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))",
    gap:"20px"
  },

  card:{
    background:"#071120",
    padding:"20px",
    borderRadius:"20px",
    border:"1px solid rgba(14,165,233,0.2)"
  },

  goldCard:{
    background:"#071120",
    padding:"20px",
    borderRadius:"20px",
    border:"1px solid rgba(250,204,21,0.3)"
  },

  cardTitle:{
    color:"#38bdf8",
    marginBottom:"20px"
  },

  goldTitle:{
    color:"#facc15",
    marginBottom:"20px"
  },

  field:{
    display:"flex",
    flexDirection:"column",
    gap:"8px",
    marginBottom:"15px",
    color:"#cbd5e1"
  },

  input:{
    background:"#08101d",
    border:"1px solid rgba(14,165,233,0.2)",
    padding:"12px",
    borderRadius:"12px",
    color:"white"
  },

  goldInput:{
    background:"#08101d",
    border:"1px solid rgba(250,204,21,0.2)",
    padding:"12px",
    borderRadius:"12px",
    color:"white"
  },

  textarea:{
    background:"#08101d",
    border:"1px solid rgba(14,165,233,0.2)",
    padding:"12px",
    borderRadius:"12px",
    color:"white",
    resize:"none"
  },

  doubleGrid:{
    display:"grid",
    gridTemplateColumns:"1fr 1fr",
    gap:"15px"
  },

  imageBox:{
    height:"250px",
    borderRadius:"20px",
    background:"#08101d",
    border:"1px dashed #0ea5e9",
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    overflow:"hidden"
  },

  image:{
    width:"100%",
    height:"100%",
    objectFit:"contain"
  },

  uploadBtn:{
    width:"100%",
    marginTop:"15px",
    background:"linear-gradient(90deg,#06b6d4,#2563eb)",
    border:"none",
    padding:"12px",
    borderRadius:"12px",
    color:"white",
    fontWeight:"bold",
    cursor:"pointer"
  },

  profitBox:{
    marginTop:"20px",
    background:"linear-gradient(90deg,rgba(34,197,94,0.1),rgba(14,165,233,0.1))",
    border:"1px solid rgba(34,197,94,0.2)",
    padding:"20px",
    borderRadius:"16px",
    color:"white"
  },

  footer:{
    display:"flex",
    justifyContent:"space-between",
    marginTop:"25px",
    gap:"15px",
    flexWrap:"wrap"
  },

  cancelBtn:{
    background:"#1e293b",
    border:"none",
    padding:"14px 25px",
    borderRadius:"12px",
    color:"white",
    cursor:"pointer"
  },

  createBtn:{
    background:"linear-gradient(90deg,#16a34a,#22c55e)",
    border:"none",
    padding:"14px 25px",
    borderRadius:"12px",
    color:"white",
    fontWeight:"bold",
    cursor:"pointer"
  }
};

export default AddModelModal;