import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { getProducts, getUnits } from "../utils/storage";

function Investment() {

  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("sneakers");

  const [products, setProducts] = useState([]);

  const [units, setUnits] = useState([]);

  useEffect(() => {

    const fetchData = async () => {

      const storedProducts =
        await getProducts();

      setProducts(storedProducts || []);

      const storedUnits =
        await getUnits();

      setUnits(storedUnits || []);

    };

    fetchData();

  }, []);

  const activeProducts =
    products.filter(
      item => Number(item.left) > 0
    );

  const displayProducts =
    activeTab === "sneakers"
      ? activeProducts
      : units;
  
  return (
    <div style={styles.page}>

      <Sidebar />

      <div style={styles.container}>

        <h1 style={{color:"white"}}>Energy Schemes</h1>

        {/* TABS */}
        <div style={styles.tabs}>

          <button
            style={activeTab === "sneakers" ? styles.activeTab : styles.tab}
            onClick={() => setActiveTab("sneakers")}
          >
            👟 AI MODELS
          </button>

          <button
            style={activeTab === "energy" ? styles.activeTab : styles.tab}
            onClick={() => setActiveTab("energy")}
          >
            ⚡ UNITS
          </button>

        </div>

        {/* PRODUCTS */}
        <div style={styles.grid}>

          {displayProducts.map((item) => (

            <div
              key={item.id} 
              style={styles.card}
              
            >

              <h3
                style={{
                  fontSize:"14px",
                  marginBottom:"5px"
                }}
              >
                {item.name}
              </h3>

              <img
                src={item.image}
                alt={item.name}
                style={styles.imageBox}
              />

              <div style={styles.infoRow}>
                <span>📈 {item.percent}</span>
                <span>⚡ {item.units} Units</span>
              </div>

              <p style={styles.text}>Valid: {item.days} Days</p>
              <p style={styles.text}>Available Stock: {item.left}</p>

              <button
                style={styles.button}
                onClick={(e) => {
                  e.stopPropagation();

                  if (activeTab === "energy") {
                    navigate(`/unit/${item.id}`);
                  } else {
                    navigate(`/product/${item.id}`);
                  }
                }}
              >
                {item.price} PYE
              </button>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}

const styles = {

  page:{
    minHeight:"100vh",
    color:"black",
    fontWeight:"bold",
  },

  container:{
    padding:"20px"
  },

  tabs:{
    display:"flex",
    gap:"10px",
    marginTop:"20px"
  },

  tab:{
    flex:1,
    padding:"10px",
    borderRadius:"20px",
    border:"none",
    background:"#eee",
    cursor:"pointer",
    fontWeight:"bold"
  },

  activeTab:{
    flex:1,
    padding:"10px",
    borderRadius:"20px",
    border:"none",
    background:"#c8a96a",
    cursor:"pointer",
    fontWeight:"bold"
  },

  grid:{
    display:"grid",
    gridTemplateColumns:"repeat(2,1fr)",
    gap:"12px",
    marginTop:"20px"
  },

  card:{
    background:"#fff",
    padding:"10px",
    borderRadius:"12px",
    boxShadow:"0 4px 8px rgba(0,0,0,0.05)",
    maxWidth:"180px",
    width:"100%"
  },

  imageBox:{
    width:"100%",
    height:"120px",
    objectFit:"cover",
    borderRadius:"10px",
    margin:"8px 0"
  },

  infoRow:{
    display:"flex",
    justifyContent:"space-between",
    fontWeight:"bold"
  },

  text:{
    fontSize:"12px",
    marginTop:"4px"
  },

  button:{
    marginTop:"8px",
    width:"100%",
    padding:"8px",
    background:"#c8a96a",
    border:"none",
    borderRadius:"8px",
    cursor:"pointer",
    fontWeight:"bold",
    fontSize:"12px"
  }

};

export default Investment;