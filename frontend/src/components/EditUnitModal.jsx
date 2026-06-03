import { useState, useRef } from "react";

function EditUnitModal({ unit, onClose, onSave }) {

  const [editedUnit, setEditedUnit] = useState({
    ...unit
  });

  const fileInputRef = useRef();

  const handleChange = (field, value) => {
    setEditedUnit(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setEditedUnit(prev => ({
        ...prev,
        image: reader.result
      }));
    };

    reader.readAsDataURL(file);
  };

  return (
    <div style={styles.overlay}>

      <div style={styles.modal}>

        {/* HEADER */}
        <div style={styles.header}>

          <div>
            <h2 style={styles.title}>EDIT UNIT</h2>
            <p style={styles.sub}>
              Premium Energy Unit Management
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
                src={editedUnit.image}
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
              Change Unit Image
            </button>

            <div style={styles.statsCard}>
              <p>Total Sold</p>
              <h2>{editedUnit.sold || 0}</h2>
            </div>

            <div style={styles.statsCard}>
              <p>Available Stock</p>
              <h2>{editedUnit.left || 0}</h2>
            </div>

            <div style={styles.statsCard}>
              <p>Unit Price</p>
              <h2>{editedUnit.price} PYE</h2>
            </div>

          </div>

          {/* RIGHT */}
          <div style={styles.rightPanel}>

            <div style={styles.topCard}>

              <img
                src={editedUnit.image}
                alt=""
                style={styles.topImage}
              />

              <div>

                <div style={styles.row}>
                  <h2>{editedUnit.name}</h2>

                  <span style={styles.activeBadge}>
                    Active
                  </span>
                </div>

                <p style={{color:"#94a3b8"}}>
                  ID: {editedUnit.id}
                </p>

              </div>

            </div>

            <div style={styles.grid}>

              {/* UNIT INFO */}
              <div style={styles.card}>

                <h3 style={styles.cardTitle}>
                  UNIT INFORMATION
                </h3>

                <div style={styles.field}>
                  <label>Unit Name</label>

                  <input
                    value={editedUnit.name}
                    onChange={(e)=>
                      handleChange("name", e.target.value)
                    }
                    style={styles.input}
                  />
                </div>

                <div style={styles.doubleGrid}>

                  <div style={styles.field}>
                    <label>Units</label>

                    <input
                      value={editedUnit.units}
                      onChange={(e)=>
                        handleChange("units", e.target.value)
                      }
                      style={styles.input}
                    />
                  </div>

                  <div style={styles.field}>
                    <label>Duration</label>

                    <input
                      value={editedUnit.days}
                      onChange={(e)=>
                        handleChange("days", e.target.value)
                      }
                      style={styles.input}
                    />
                  </div>

                </div>

                <div style={styles.field}>
                  <label>Description</label>

                  <textarea
                    rows={4}
                    value={editedUnit.description || ""}
                    onChange={(e)=>
                      handleChange("description", e.target.value)
                    }
                    style={styles.textarea}
                  />
                </div>

              </div>

              {/* PRICING */}
              <div style={styles.goldCard}>

                <h3 style={styles.goldTitle}>
                  UNIT PRICING
                </h3>

                <div style={styles.doubleGrid}>

                  <div style={styles.field}>
                    <label>Price</label>

                    <input
                      value={editedUnit.price}
                      onChange={(e)=>
                        handleChange("price", e.target.value)
                      }
                      style={styles.goldInput}
                    />
                  </div>

                  <div style={styles.field}>
                    <label>Daily %</label>

                    <input
                      value={editedUnit.percent}
                      onChange={(e)=>
                        handleChange("percent", e.target.value)
                      }
                      style={styles.goldInput}
                    />
                  </div>

                  <div style={styles.field}>
                    <label>Stock</label>

                    <input
                      value={editedUnit.left}
                      onChange={(e)=>
                        handleChange("left", e.target.value)
                      }
                      style={styles.goldInput}
                    />
                  </div>

                </div>

                <div style={styles.profitBox}>
                  <p>Projected Earnings</p>
                  <h1>
                    {(
                      Number(editedUnit.price || 0) *
                      Number(editedUnit.percent || 0)
                    ).toFixed(2)} PYE
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
                onClick={() => {
                  onSave(editedUnit);
                  onClose();
                }}
              >
                Update Unit
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
    background:"rgba(0,0,0,0.85)",
    backdropFilter:"blur(10px)",
    zIndex:9999,
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    padding:"20px",
    overflowY:"auto"
  },

  modal:{
    width:"100%",
    maxWidth:"1400px",
    maxHeight:"95vh",
    overflowY:"auto",
    background:"#050816",
    border:"1px solid #0ea5e9",
    borderRadius:"25px",
    boxShadow:"0 0 50px rgba(14,165,233,0.3)"
  },

  header:{
    padding:"25px",
    borderBottom:"1px solid rgba(14,165,233,0.2)",
    display:"flex",
    justifyContent:"space-between",
    alignItems:"center",
    background:"#071427"
  },

  title:{
    color:"white",
    margin:0
  },

  sub:{
    color:"#38bdf8",
    marginTop:"5px"
  },

  closeBtn:{
    width:"40px",
    height:"40px",
    borderRadius:"10px",
    border:"none",
    background:"#111827",
    color:"white",
    cursor:"pointer",
    fontSize:"18px"
  },

  body:{
    display:"grid",
    gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))",
    gap:"20px",
    padding:"20px"
  },

  leftPanel:{
    display:"flex",
    flexDirection:"column",
    gap:"15px"
  },

  imageBox:{
    background:"#071120",
    padding:"20px",
    borderRadius:"20px",
    border:"1px solid rgba(14,165,233,0.2)"
  },

  image:{
    width:"100%",
    height:"250px",
    objectFit:"contain"
  },

  changeBtn:{
    background:"linear-gradient(90deg,#06b6d4,#2563eb)",
    border:"none",
    padding:"12px",
    borderRadius:"12px",
    color:"white",
    fontWeight:"bold",
    cursor:"pointer"
  },

  statsCard:{
    background:"#071120",
    padding:"20px",
    borderRadius:"16px",
    border:"1px solid rgba(14,165,233,0.2)",
    color:"white"
  },

  rightPanel:{
    display:"flex",
    flexDirection:"column",
    gap:"20px"
  },

  topCard:{
    display:"flex",
    gap:"20px",
    background:"#071120",
    padding:"20px",
    borderRadius:"20px",
    border:"1px solid rgba(14,165,233,0.2)",
    flexWrap:"wrap"
  },

  topImage:{
    width:"120px",
    height:"120px",
    objectFit:"contain",
    borderRadius:"15px",
    background:"#0f172a"
  },

  row:{
    display:"flex",
    gap:"10px",
    alignItems:"center",
    color:"white",
    flexWrap:"wrap"
  },

  activeBadge:{
    background:"rgba(34,197,94,0.2)",
    color:"#22c55e",
    padding:"5px 12px",
    borderRadius:"999px"
  },

  grid:{
    display:"grid",
    gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",
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
    gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",
    gap:"15px"
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

  saveBtn:{
    background:"linear-gradient(90deg,#06b6d4,#2563eb)",
    border:"none",
    padding:"14px 25px",
    borderRadius:"12px",
    color:"white",
    fontWeight:"bold",
    cursor:"pointer"
  }

};

export default EditUnitModal;