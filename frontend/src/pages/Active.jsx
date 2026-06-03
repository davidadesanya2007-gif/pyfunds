import { useState, useEffect } from "react";
import {
  getActiveInvestments,
  updateActiveInvestment,
  getUser,
  updateUserEverywhere,
  addTransaction,
  deleteActiveInvestment
} from "../utils/storage";

import CustomAlert from "../components/CustomAlert";
import moneySound from "../assets/money.mp4";

function ActiveInvestments() {
  
  const [investments, setInvestments] = useState([]);
  const [alert, setAlert] = useState(null);

 useEffect(() => {

    const fetchData = async () => {

      const all =
        await getActiveInvestments();

      const formatted = (all || []).map(inv => ({
        ...inv,

        // ✅ FIX SUPABASE COLUMN NAMES
        dailyEarning:
          inv.dailyEarning || inv.dailyearning,

        unitsLeft:
          inv.unitsLeft || inv.unitsleft,

        daysLeft:
          inv.daysLeft || inv.daysleft,

        lastClaim:
          inv.lastClaim || inv.lastclaim
      }));

      setInvestments(formatted);

    };

    fetchData();

  }, []);

  const handleClaim = async (id) => {

    let claimed = false;

    const updated = await Promise.all(
      investments.map(async (inv) => {

      if (inv.id !== id) return inv;

      const now = new Date();

      const today =
        now.toDateString();

      const lastClaimDate =
        inv.lastClaim
          ? new Date(inv.lastClaim).toDateString()
          : null;

      // ✅ BLOCK MULTIPLE CLAIMS SAME DAY
      if (lastClaimDate === today) {

        setAlert({
          type: "error",
          message:
            "You already claimed today's reward, come back tomorrow 9:00 AM!"
        });

        return inv;
      }

      let earning = 0;

      // 🔥 NEW REFERRAL MACHINE (STACKING SYSTEM)
      if (inv.type === "referral") {

        const user = await getUser();
        const activeUnits =
          (user.referralEarnings || [])
            .filter(e => e.expiry > Date.now())
            .reduce((sum, e) => sum + e.amount, 0);

        if (activeUnits <= 0) {
          setAlert({
            type: "error",
            message: "No active referral units"
          });
          return inv;
        }

        earning = activeUnits;
      }

      // 🔥 LIMITED MACHINE
      else if (inv.type === "limited") { 

        if (Number(inv.daysLeft) <= 0) {

          return null;

        }

        // ✅ MACHINE'S OWN DAILY EARNING
        earning =
          Number(inv.dailyEarning || 0);

        // ✅ USER BONUS UNITS
        const user = await getUser();

        if (Number(user.units || 0) > 0) {

          earning += 1;

          // REMOVE 1 UNIT
          user.units =
            Number(user.units) - 1;

          await updateUserEverywhere(user);

        }

      }

      // 🔥 NORMAL PRODUCTS
      else {

        // ✅ CHECK MACHINE UNITS
        if (Number(inv.unitsLeft || 0) <= 0) {

          setAlert({
            type:"error",
            message:"No unit available, go purchase another AI model ❌"
          });

          return inv;
        }

        earning =
          Number(inv.dailyEarning) || 0;

        // ✅ GET USER
        const user = await getUser();

        // ✅ USE BONUS UNIT
        if (Number(user.units || 0) > 0) {

          earning += 1;

          // REMOVE 1 USER BONUS UNIT
          user.units =
            Number(user.units) - 1;

          await updateUserEverywhere(user);

        }

      }

      /*if (earning <= 0) {
        setAlert({
          type: "error",
          message: "Invalid earning value"
        });
        return inv;
      }

      const user = await getUser();
      const currentBalance = user?.pyeBalance || 0;

      const newBalance = currentBalance + earning;

      // 🔥 UPDATE USER BALANCE
      user.pyeBalance = newBalance;
      await updateUserEverywhere(user);*/

      const user = await getUser();

      const currentBalance =
        Number(user?.pyeBalance || 0);

      const newBalance =
        currentBalance + Number(earning);

      // 🔥 UPDATE USER BALANCE
      user.pyeBalance = newBalance;

      await updateUserEverywhere(user);

      await addTransaction({
        type: "EARNING",
        amount: earning,
        currency:"PYE",
        name: inv.name,
        date: new Date().toLocaleString()
      });

      new Audio(moneySound).play();

      claimed = true;

      return {

        ...inv,

        earnings:
          Number(inv.earnings || 0)
          + Number(earning),

        lastClaim:
          new Date().toISOString(),

        // ✅ REDUCE MACHINE UNIT
        unitsLeft:
          Number(inv.unitsLeft || 0) - 1,

        // ✅ ONLY LIMITED MACHINES USE DAYS
        daysLeft:
          inv.type === "limited"
            ? Number(inv.daysLeft || 0) - 1
            : inv.daysLeft

      };
    })
    );

    // 🔥 REMOVE EXPIRED
    const cleaned = updated.filter((inv) => {

      if (!inv) return false;

      // LIMITED MACHINE EXPIRED
      if (
        inv.type === "limited" &&
        Number(inv.daysLeft) <= 0
      ) {
        return false;
      }

      // NORMAL MACHINE FINISHED
      if (
        inv.type !== "limited" &&
        Number(inv.unitsLeft) <= 0
      ) {
        return false;
      }

      return true;

    });

    // 🔥 REMOVE EXPIRED
    /*
    const cleaned = updated.filter((inv) => {
      if (!inv) return false;
      if (inv.type === "limited" && inv.daysLeft <= 0) return false;
      return true;
    });
    */

    setInvestments(cleaned);
    for (const inv of updated) {

      // ❌ REMOVE EXPIRED FROM DATABASE TOO
      if (inv && inv.type === "limited" && inv.daysLeft <= 0) {
        await deleteActiveInvestment(inv.id);
        continue;
      }

      if (inv) {
        await updateActiveInvestment(inv);
      }
    }

    // await setActiveInvestments(updatedAll);

    if (claimed) {
      setAlert({
        type: "success",
        message: "Earnings claimed ✅"
      });
    }
  };

  return (
    <div style={{ padding: "20px" }}>

      <h2>Active Investments</h2>

      {investments.length === 0 && <p>No active investment yet</p>}

      {investments.map((item) => (

        <div key={item.id} style={styles.card}>

          <img src={item.image} style={styles.image} />

          <h3>{item.name}</h3>

          <p>
            Daily Earnings:
            {item.dailyEarning} PYE
          </p>

          <p>Invested: {item.price} PYE</p>
          <p>Earnings: {item.earnings || 0} PYE</p>

          {item.type === "limited" && (
            <>
              <p>
                Days Left: {item.daysLeft}
              </p>

              <p>
                Units Left: {item.unitsLeft}
              </p>
            </>
          )}

          <button
            style={styles.button}
            onClick={() => handleClaim(item.id)}
          >
            Claim Daily Earnings
          </button>

        </div>

      ))}

      {alert && (
        <CustomAlert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}

    </div>
  );
}

const styles = {
  card: {
    background: "#fff",
    color:"#333",
    padding: "15px",
    borderRadius: "10px",
    marginTop: "15px"
  },

  image: {
    width: "100%",
    height: "350px",
    objectFit: "cover",
    borderRadius: "10px"
  },

  button: {
    marginTop: "10px",
    width: "100%",
    padding: "10px",
    background: "#c8a96a",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer"
  }
};

export default ActiveInvestments;