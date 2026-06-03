import Sidebar from "../components/Sidebar";

function Leaderboard() {

  return (
    <div>

      <Sidebar />

      <div style={{ padding:"20px" }}>

        <h2>Regional Leaderboard</h2>

        {/* BARS */}
        <div style={{ display:"flex", gap:"20px", marginTop:"20px" }}>

          <div>
            <div style={{ height:"120px", width:"40px", background:"#c8a96a" }}></div>
            <p>Igbo</p>
            <p>₦700,000</p>
          </div>

          <div>
            <div style={{ height:"180px", width:"40px", background:"#000" }}></div>
            <p>Yoruba</p>
            <p>₦900,000</p>
          </div>

          <div>
            <div style={{ height:"100px", width:"40px", background:"#aaa" }}></div>
            <p>Hausa</p>
            <p>₦500,000</p>
          </div>

        </div>

        {/* PROMOTER */}
        <h2 style={{ marginTop:"30px" }}>Promoter Leaderboard</h2>

        <div style={{ background:"#fff", padding:"15px", borderRadius:"10px" }}>

          <p>Solomon — 213 team — ₦804,000</p>
          <p>Pyro — 196 team — ₦820,000</p>
          <p>Seven — 180 team — ₦600,000</p>
          <p>Elite — 100 team — ₦400,000</p>

        </div>

        {/* INVESTOR */}
        <h2 style={{ marginTop:"30px" }}>Investor Leaderboard</h2>

        <div style={{ background:"#fff", padding:"15px", borderRadius:"10px" }}>

          <p>Alex — ₦600,000</p>
          <p>Ben — ₦580,000</p>
          <p>Chris — ₦480,000</p>

        </div>

      </div>

    </div>
  );
}

export default Leaderboard;