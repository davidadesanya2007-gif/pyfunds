import { Link, useNavigate } from "react-router-dom";
import Stats from "../components/Stats";
import Sidebar from "../components/Sidebar";
import PlanCard from "../components/PlanCard";

function Home() {

  const navigate = useNavigate();

  {/*
  const products = [
    {
      id: 1,
      name: "Synapse Energy Core S1",
      percent: "4.5%",
      units: 15,
      days: 35,
      price: 22.23,
      left: 120,
      image: "/src/assets/images/icons/Product2.jpeg"
    },
    {
      id: 2,
      name: "Energy Unit",
      percent: "4.5%",
      units: 15,
      days: 1,
      price: 40,
      left: 50,
      image: "/src/assets/images/icons/Product1.jpeg"
    }
  ];
  */}


  return (
    <div>

      <Sidebar />

      <div></div>

    <div style={styles.container}>
      <h1 style={styles.title}>PYEFUNDS</h1>

      <p style={styles.subtitle}>
        A digital earning platform focused on helping users grow their finances through AI-powered energy models.
      </p>

      <div style={styles.buttons}>
        <Link to="/dashboard">
          <button style={styles.primaryBtn}>Start Investing</button>
        </Link>

        <Link to="/plans">
          <button style={styles.secondaryBtn}>View Plans</button>
        </Link>
      </div>
    <Stats/>
    <div style={styles.planSection}>

      <div style={styles.rateBox}>
        <h3>Exchange Rate</h3>
        <p>1 PYE = ₦360</p>
      </div>

      { /*    
      <h2>Popular Investments</h2>

        <div style={styles.grid}>

          {products.map((item) => (

            <div 
              key={item.id} 
              style={styles.card}
              onClick={() => navigate(`/product/${item.id}`)}
            >

              <h3>{item.name}</h3>

              <img src={item.image} style={styles.image} />

              <div style={styles.infoRow}>
                <span>📈 {item.percent}</span>
                <span>⚡ {item.units} Units</span>
              </div>

              <p style={styles.text}>Valid: {item.days} Days</p>
              <p style={styles.text}>Left: {item.left}</p>

              <button style={styles.button}>
                {item.price} PYE
              </button>

            </div>

          ))}

        </div>
      */ }
    </div>
    </div>
    </div>
  );
}

const styles = {

  container: {
    textAlign: "center",
    paddingTop: "80px",
  },

  title: {
    fontSize: "48px",
    color: "#000000",
    marginBottom: "20px",
  },

  subtitle: {
    fontSize: "30px",
    maxWidth: "600px",
    margin: "0 auto",
    marginBottom: "40px",
    color: "#ffffff",
    fontWeight:"bold"
  },

  buttons:{
    display:"flex",
    justifyContent:"center",
    gap:"20px",
    flexWrap:"wrap"
  },

  primaryBtn:{
    width:"180px",
    minWidth:"180px",
    padding:"14px 20px",
    fontSize:"16px",
    background:"#38bdf8",
    border:"none",
    borderRadius:"8px",
    cursor:"pointer"
  },

  secondaryBtn:{
    width:"180px",
    minWidth:"180px",
    padding:"14px 20px",
    fontSize:"16px",
    background:"#38bdf8",
    border:"2px solid #38bdf8",
    borderRadius:"8px",
    color:"#000000",
    cursor:"pointer"
  },

  rateBox:{
    background:"darkblue",
    padding:"15px",
    borderRadius:"10px",
    marginBottom:"20px",
    fontWeight:"bold",
    color:"#ebd1d1"
  },

  planSection: {
    marginTop: "100px",
    textAlign: "center"
  },

  planTitle: {
    fontSize: "32px",
    marginBottom: "40px"
  },

  image:{
    width:"100%",
    height:"300px",
    objectFit:"cover",
    borderRadius:"10px",
    margin:"10px 0"
  },

  planGrid: {
    display: "flex",
    justifyContent: "center",
    gap: "30px",
    flexWrap: "wrap"
  },

   infoRow:{
    display:"flex",
    justifyContent:"space-between",
    fontWeight:"bold"
  },

  text:{
    fontSize:"14px",
    marginTop:"5px"
  },

  button:{
    marginTop:"10px",
    marginBottom:"20px",
    width:"100%",
    padding:"10px",
    background:"#c8a96a",
    border:"none",
    borderRadius:"10px",
    fontWeight:"bold",
    cursor:"pointer"
  }

};

export default Home;