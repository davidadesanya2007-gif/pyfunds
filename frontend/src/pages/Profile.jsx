import Sidebar from "../components/Sidebar";

function Profile() {
  return (
    <div>

      <Sidebar />

      <div style={styles.container}>

        <h1>Profile Settings</h1>

        <div style={styles.card}>

          <label>Full Name</label>
          <input
            type="text"
            placeholder="Your name"
            style={styles.input}
          />

          <label>Email</label>
          <input
            type="email"
            placeholder="Your email"
            style={styles.input}
          />

          <label>Region</label>
          <select style={styles.input}>
            <option>Yoruba</option>
            <option>Igbo</option>
            <option>Hausa</option>
          </select>

          <label>New Password</label>
          <input
            type="password"
            placeholder="Change password"
            style={styles.input}
          />

          <button style={styles.button}>
            Save Changes
          </button>

        </div>

      </div>

    </div>
  );
}

const styles = {

  container: {
    padding: "40px"
  },

  card: {
    background: "#020617",
    padding: "30px",
    borderRadius: "10px",
    border: "1px solid #1e293b",
    maxWidth: "400px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginTop: "20px"
  },

  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #1e293b",
    background: "#0f172a",
    color: "white"
  },

  button: {
    marginTop: "10px",
    padding: "12px",
    background: "#38bdf8",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  }

};

export default Profile;