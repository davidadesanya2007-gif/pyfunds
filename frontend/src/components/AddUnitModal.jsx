import { useState, useRef } from "react";

function AddUnitModal({ onClose, onCreate }) {

  const fileInputRef = useRef();

  const [unit, setUnit] = useState({
    id: Date.now(),

    name:"",
    units:"",
    price:"",
    left:"",
    image:"",
    description:""
  });

  const handleChange = (field, value) => {
    setUnit(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {

      setUnit(prev => ({
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
            <h2 style={styles.title}>
              ADD NEW UNIT
            </h2>

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

              {unit.image ? (

                <img
                  src={unit.image}
                  alt=""
                  style={styles.image}
                />

              ) : (

                <div style={styles.placeholder}>
                  Upload Image
                </div>

              )}

            </div>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display:"none" }}
              onChange={handleImageUpload}
            />

            <button
              style={styles.uploadBtn}
              onClick={() => fileInputRef.current.click()}
            >
              Upload Unit Image
            </button>

          </div>

          {/* RIGHT */}

          <div style={styles.rightPanel}>

            <div style={styles.grid}>

              {/* BASIC INFO */}

              <div style={styles.card}>

                <h3 style={styles.cardTitle}>
                  BASIC INFORMATION
                </h3>

                <div style={styles.field}>
                  <label>Unit Name</label>

                  <input
                    style={styles.input}
                    value={unit.name}
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
                      value={unit.units}
                      onChange={(e)=>
                        handleChange("units", e.target.value)
                      }
                    />
                  </div>

                </div>

                <div style={styles.field}>
                  <label>Description</label>

                  <textarea
                    rows={5}
                    style={styles.textarea}
                    value={unit.description}
                    onChange={(e)=>
                      handleChange(
                        "description",
                        e.target.value
                      )
                    }
                  />
                </div>

              </div>

              {/* PRICE */}

              <div style={styles.goldCard}>

                <h3 style={styles.goldTitle}>
                  PRICING & EARNINGS
                </h3>

                <div style={styles.doubleGrid}>

                  <div style={styles.field}>
                    <label>Price</label>

                    <input
                      style={styles.goldInput}
                      value={unit.price}
                      onChange={(e)=>
                        handleChange("price", e.target.value)
                      }
                    />
                  </div>

                  <div style={styles.field}>
                    <label>Stock Left</label>

                    <input
                      style={styles.goldInput}
                      value={unit.left}
                      onChange={(e)=>
                        handleChange("left", e.target.value)
                      }
                    />
                  </div>

                </div>

                <div style={styles.profitBox}>
                  <p>Estimated Profit</p>

                  <h1>
                    +1 PYE BOOST
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
                style={styles.createBtn}
                onClick={() => {

                  onCreate(unit);

                  onClose();

                }}
              >
                + Create Unit
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
    color:"#38bdf8"
  },

  closeBtn:{
    width:"40px",
    height:"40px",
    borderRadius:"10px",
    border:"none",
    background:"#111827",
    color:"white",
    cursor:"pointer"
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
    border:"1px solid rgba(14,165,233,0.2)",
    minHeight:"300px",
    display:"flex",
    alignItems:"center",
    justifyContent:"center"
  },

  image:{
    width:"100%",
    maxHeight:"260px",
    objectFit:"contain"
  },

  placeholder:{
    color:"#64748b"
  },

  uploadBtn:{
    background:"linear-gradient(90deg,#06b6d4,#2563eb)",
    border:"none",
    padding:"14px",
    borderRadius:"12px",
    color:"white",
    fontWeight:"bold",
    cursor:"pointer"
  },

  rightPanel:{
    display:"flex",
    flexDirection:"column",
    gap:"20px"
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
    flexWrap:"wrap",
    gap:"15px"
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
    background:"linear-gradient(90deg,#06b6d4,#2563eb)",
    border:"none",
    padding:"14px 25px",
    borderRadius:"12px",
    color:"white",
    fontWeight:"bold",
    cursor:"pointer"
  }

};

export default AddUnitModal;