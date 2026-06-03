import Sidebar from "../components/Sidebar";

function Support() {
  return (
    <div>

      <Sidebar />

      <div style={styles.container}>

        <h1>Customer Support</h1>

        <div style={styles.card}>

          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            style={styles.input}
          />

          <label>Issue Type</label>
          <select style={styles.input}>
            <option>Deposit Issue</option>
            <option>Withdrawal Issue</option>
            <option>Account Problem</option>
            <option>Other</option>
          </select>

          <label>Message</label>
          <textarea
            placeholder="Describe your problem..."
            style={styles.textarea}
          />

          <button style={styles.button}>
            Send Support Request
          </button>

        </div>

      </div>

    </div>
  );
}

const styles = {

  container:{
    padding:"40px"
  },

  card:{
    background:"#020617",
    padding:"30px",
    borderRadius:"10px",
    border:"1px solid #1e293b",
    maxWidth:"500px",
    display:"flex",
    flexDirection:"column",
    gap:"12px",
    marginTop:"20px"
  },

  input:{
    padding:"10px",
    borderRadius:"6px",
    border:"1px solid #1e293b",
    background:"#0f172a",
    color:"white"
  },

  textarea:{
    padding:"10px",
    borderRadius:"6px",
    border:"1px solid #1e293b",
    background:"#0f172a",
    color:"white",
    height:"120px"
  },

  button:{
    marginTop:"10px",
    padding:"12px",
    background:"#38bdf8",
    border:"none",
    borderRadius:"6px",
    cursor:"pointer"
  }

};

export default Support;