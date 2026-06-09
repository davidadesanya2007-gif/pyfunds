function Stats() {
  return (
    <div style={styles.container}>

      <div style={styles.statBox}>
        <h2>5k</h2>
        <p>Total User's</p>
      </div>

      <div style={styles.statBox}>
        <h2>11</h2>
        <p>Total Ai Models</p>
      </div>

      <div style={styles.statBox}>
        <h2>4%</h2>
        <p>Minimum Investment Return</p>
      </div>

      <div style={styles.statBox}>
        <h2>24/7</h2>
        <p>Platform Uptime</p>
      </div>

    </div>
  );
}

const styles = {

  container:{
    display:"grid",
    gridTemplateColumns:"repeat(2,1fr)",
    gap:"15px",
    marginTop:"80px",
    width:"100%"
  },

  statBox:{
    background:"#020617",
    padding:"20px",
    borderRadius:"12px",
    textAlign:"center",
    width:"100%",
    border:"1px solid #1e293b",
    color:"#e0d5d5"
  }

};

export default Stats;