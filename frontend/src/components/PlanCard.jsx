import { Link } from "react-router-dom";

function PlanCard({ name, image, speed, min, daily, duration }) {
  return (
    <div style={styles.card}>

      {/* Product Image */}
      <img src={image} alt={name} style={styles.image} />

      {/* Product Name */}
      <h2 style={styles.title}>{name}</h2>

      {/* Speed Badge */}
      <div style={styles.speedBadge}>
        ⚡ {speed}
      </div>

      {/* Investment Details */}
      <p>Minimum: {min}</p>
      <p>Daily Return: {daily}</p>
      <p>Duration: {duration}</p>

      <Link to="/register">
        <button style={styles.button}>Invest Now</button>
      </Link>

    </div>
  );
}

const styles = {

  card: {
    background: "#020617",
    border: "1px solid #1e293b",
    padding: "25px",
    borderRadius: "12px",
    width: "260px",
    textAlign: "center"
  },

  image: {
    width: "100%",
    height: "150px",
    objectFit: "cover",
    borderRadius: "8px",
    marginBottom: "15px"
  },

  title: {
    color: "#38bdf8",
    marginBottom: "10px"
  },

  speedBadge: {
    background: "#38bdf8",
    color: "#020617",
    padding: "5px 10px",
    borderRadius: "5px",
    display: "inline-block",
    marginBottom: "10px",
    fontWeight: "bold"
  },

  button: {
    marginTop: "20px",
    padding: "10px 20px",
    border: "none",
    background: "#38bdf8",
    borderRadius: "6px",
    cursor: "pointer"
  }

};

export default PlanCard;