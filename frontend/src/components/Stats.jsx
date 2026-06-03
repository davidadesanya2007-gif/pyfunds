function Stats() {
  return (
    <div style={styles.container}>

      <div style={styles.statBox}>
        <h2>15K+</h2>
        <p>Total Investors</p>
      </div>

      <div style={styles.statBox}>
        <h2>$2M+</h2>
        <p>Total Invested</p>
      </div>

      <div style={styles.statBox}>
        <h2>$1.4M+</h2>
        <p>Total Withdrawn</p>
      </div>

      <div style={styles.statBox}>
        <h2>24/7</h2>
        <p>Platform Uptime</p>
      </div>

    </div>
  );
}

const styles = {

  container: {
    display: "flex",
    justifyContent: "center",
    gap: "40px",
    marginTop: "80px",
    flexWrap: "wrap"
  },

  statBox: {
    background: "#020617",
    padding: "30px",
    borderRadius: "10px",
    textAlign: "center",
    width: "200px",
    border: "1px solid #1e293b",
    color:"#e0d5d5"
  }

};

export default Stats;