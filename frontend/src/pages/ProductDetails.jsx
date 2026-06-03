import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import CustomAlert from "../components/CustomAlert";
import moneySound from "../assets/money.mp4";
import {
  getActiveInvestments,
  addActiveInvestment,
  addTransaction,
  getUser,
  getAllUsers,
  updateUserEverywhere,
  getProducts,
  updateProduct,
  processReferralCommission
} from "../utils/storage";

function ProductDetails() {

  const { id } = useParams();
  const [alert, setAlert] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      const data = await getProducts();
      setProducts(data || []);
      setLoading(false);
    };

    loadProducts();
  }, []);

  // ✅ ALL PRODUCTS FROM STORAGE

  // ✅ FIND PRODUCT
  const product = products.find(p => String(p.id) === String(id)
);

  // ✅ PREVENT CRASH
  if (!product) {
    return <h2 style={{ color: "white" }}>Product not found</h2>;
  }

  const handleBuy = async () => {

    const user = await getUser();

    if (!user) return;

    const balance =
      Number(user.pyeBalance || 0);

    if (balance < product.price) {

      setAlert({
        type:"error",
        message:"Insufficient PYE balance"
      });

      return;
    }

    // CHECK STOCK
    if (Number(product.left) <= 0) {

      setAlert({
        type:"error",
        message:"Model out of stock"
      });

      return;
    }

    // DEDUCT BALANCE
    user.pyeBalance =
      balance - Number(product.price);

    await updateUserEverywhere(user);

    // CREATE ACTIVE INVESTMENT
    const newInvestment = {

      name: product.name,

      image: product.image,

      type:"limited",

      price:Number(product.price),

      dailyEarning:Number(product.dailyEarning),

      earnings:0,

      units:Number(product.units),

      unitsLeft:Number(product.units),

      daysLeft:Number(product.days),

      lastClaim:null

    };

    await addActiveInvestment(newInvestment);

    // PROCESS REFERRAL COMMISSIONS
    await processReferralCommission(
      user,
      product.price
    );

    // REDUCE STOCK
    const updatedLeft =
      Math.max(0, Number(product.left) - 1);

    await updateProduct({
      ...product,
      left: updatedLeft
    });

    // SAVE TRANSACTION
    await addTransaction({

      type:"PURCHASE",

      amount:product.price,

      currency:"PYE",

      name:product.name,

      date:new Date().toLocaleString()

    });

    new Audio(moneySound).play();

    setAlert({
      type:"success",
      message:"Model Purchased Successfully ✅"
    });

  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        <img src={product.image} style={styles.image} />

        <h2 style={styles.name}>{product.name}</h2>

        <div style={styles.infoRow}>
          <div style={styles.infoBox}>
            <p>DAILY EARNING</p>
            <h3>{product.dailyEarning} PYE</h3>
          </div>

          <div style={styles.infoBox}>
            <p>UNIT</p>
            <h3>{product.units} Units</h3>
          </div>
        </div>

        <div style={styles.section}>
          <h3>Product Attributes</h3>
          <p><b>Status:</b> Active</p>
          <p><b>Daily Earning:</b> {product.dailyEarning}   PYE</p>
          <p><b>Price:</b> {product.price} PYE</p>
        </div>

        {product.type === "referral" && (
          <p style={{ color: "gold" }}>
            Earn based on referrals. More invites = more daily earnings.
          </p>
        )}

        {product.type === "limited" && (
          <p style={{ color: "orange" }}>
            Comes with 3 units. Buy more units after usage.
          </p>
        )}

        <button style={styles.button} onClick={handleBuy}>
          Buy for {product.price} PYE
        </button>

        {alert && (
          <CustomAlert
            message={alert.message}
            type={alert.type}
            onClose={() => setAlert(null)}
          />
        )}

      </div>
    </div>
  );
}

const styles = {
  page:{ minHeight:"100vh", background:"#" },
  container:{ padding:"20px" },
  image:{ width:"100%", height:"200px", objectFit:"contain" },
  name:{ textAlign:"center", marginTop:"10px" },
  infoRow:{ display:"flex", gap:"10px", marginTop:"20px" },
  infoBox:{
    flex:1, background:"#95ad09", padding:"15px",
    borderRadius:"10px", textAlign:"center",
    color:"#333"
  },
  section:{
    background:"#695959", padding:"15px",
    borderRadius:"10px", marginTop:"20px", lineHeight:"1.6"
  },
  button:{
    marginTop:"20px", width:"100%", padding:"15px",
    background:"#c8a96a", border:"none",
    borderRadius:"25px", fontWeight:"bold",
    fontSize:"16px", cursor:"pointer"
  }
};

export default ProductDetails;