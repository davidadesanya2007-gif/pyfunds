import { useState } from "react";
import { supabase } from "../supabase";
import { addTransaction } from "../utils/storage";
import emailjs from "@emailjs/browser";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useSearchParams, useNavigate } from "react-router-dom";
import CustomAlert from "../components/CustomAlert";

const EMAILJS_SERVICE_ID =
  import.meta.env.VITE_EMAILJS_SERVICE_ID;

const EMAILJS_TEMPLATE_ID =
  import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

const EMAILJS_PUBLIC_KEY =
  import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

function Register() {

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // FORM STATES
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [region, setRegion] = useState("");

  const [alert, setAlert] = useState(null);
  const [graphCode, setGraphCode] = useState("");
  const [generatedGraph, setGeneratedGraph] = useState("");
  const [emailReady, setEmailReady] = useState(false);
  const [sentOtp, setSentOtp] = useState("");
  const [phase, setPhase] = useState("phase1");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [showTerms, setShowTerms] = useState(false);

  // ✅ GET REFERRAL ID FROM URL
  const ref = searchParams.get("ref");

 const handleSendEmail = async () => {

  console.log(
    "SERVICE:",
    EMAILJS_SERVICE_ID
  );

  console.log(
    "TEMPLATE:",
    EMAILJS_TEMPLATE_ID
  );

  console.log(
    "PUBLIC:",
    EMAILJS_PUBLIC_KEY
  );

  if (!email) {

    setAlert({
      type:"error",
      message:"Enter email first ❌"
    });

    return;

  }

  const otp =
    Math.floor(100000 + Math.random() * 900000)
    .toString();

  setSentOtp(otp);

  /*
  // SAVE OTP TO DATABASE
  await supabase
    .from("email_otps")
    .insert([
      {
        email,
        otp
      }
    ]);
  */

  try {

    await emailjs.send(

      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,

      {
        to_email: email,
        otp_code: otp
      },

      EMAILJS_PUBLIC_KEY

    );

    setEmailReady(true);

    setAlert({
      type:"success",
      message:"Verification code sent ✅"
    });

  } catch(err){

    setAlert({
      type:"error",
      message:"Failed to send email ❌"
    });

  }

};

  const generateGraphCode = () => {

    const chars =
      "ABCDEFGHJKLMNPQRSTUVWXYZ123456789";

    let result = "";

    for(let i = 0; i < 6; i++){

      result += chars.charAt(
        Math.floor(Math.random() * chars.length)
      );

    }

    setGeneratedGraph(result);

    setAlert({
      type:"success",
      message:`Graph Code: ${result}`
    });

  };

  const generateUserId = () => {

    let result = "";

    for(let i = 0; i < 8; i++){

      result += Math.floor(Math.random() * 10);

    }

    return result;

  };

  const generateReferralCode = () => {

    const chars =
      "ABCDEFGHJKLMNPQRSTUVWXYZ123456789";

    let result = "";

    for(let i = 0; i < 6; i++){

      result += chars.charAt(
        Math.floor(Math.random() * chars.length)
      );

    }

    return result;

  };

  const handleRegister = async () => {

    if (!acceptedTerms) {

      setAlert({
        type:"error",
        message:"You must accept Terms & Conditions ❌"
      });

      return;

    }

    if (!name || !email || !password || !confirmPassword) 
    {

      setAlert({
        type:"error",
        message:"Please fill all fields ❌"
      });

      return;
    }

    if (!emailReady) {

      setAlert({
        type:"error",
        message:
          "Click SEND first ❌"
      });

      return;

    }

    if (code !== sentOtp) {

      setAlert({
        type:"error",
        message:"Invalid email verification code ❌"
      });

      return;

    }

    if (password !== confirmPassword) {

      setAlert({
        type:"error",
        message:"Passwords do not match ❌"
      });

      return;
    }

    if (
      graphCode.trim().toUpperCase()
      !==
      generatedGraph.trim().toUpperCase()
    ) {

      setAlert({
        type:"error",
        message:"Invalid graph code ❌"
      });

      return;

    }

    // CHECK IF USER EXISTS
    const { data: existingUser } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (existingUser) {

      setAlert({
        type:"error",
        message:"User already exists ❌"
      });

      return;
    }

    const referralCode =
      generateReferralCode();

    // CREATE USER
    const { data, error } =
      await supabase.auth.signUp({

        email: email.trim(),
        password,

        options: {

          data: {
            name,
            region
          }

        }

      });

    if(error){

      setAlert({
        type:"error",
        message:
          error.message.includes("already registered")
          ? "Email already registered ❌"
          : error.message
      });

      return;

    }

    if(!data.user){

      setAlert({
        type:"error",
        message:"Auth account not created ❌"
      });

      return;

    }

    let referredByUser = null;

    if(ref){

      const {
        data: referralUser,
        error: referralError
      } = await supabase
        .from("users")
        .select("*")
        .eq("referral_code", ref)
        .maybeSingle();

      console.log(
        "REFERRAL USER:",
        referralUser
      );

      console.log(
        "REFERRAL ERROR:",
        referralError
      );

      if(referralUser){

        referredByUser = referralUser;

      }

    }

    // SAVE USER TO USERS TABLE
    const { error: userError } =
      await supabase
        .from("users")
        .insert([
          {
            id: data.user.id,

            name,
            email,
            region,
            phase,

            pyeBalance: 0,
            balance: 2000,

            referralCommission: 0,
            totalReferralCommission: 0,

            levelAReferrals: [],
            levelBReferrals: [],
            levelCReferrals: [],

            referral_code: generateReferralCode(),

            referred_by:
              referredByUser?.id || null,
          }
        ]);

    if(userError){

      console.log(userError);

      setAlert({
        type:"error",
        message:userError.message
      });

      return;

    }

    // ✅ UPDATE UPLINE REFERRAL SYSTEM
    if(referredByUser){

      const newReferral = {

        id: data.user.id,

        name,

        email,

        joinedAt:
          new Date().toISOString()

      };

      // EXISTING ARRAYS
      const levelA =
        referredByUser.levelAReferrals || [];

      const referrals =
        referredByUser.referrals || [];

      // UPDATE UPLINE
      const { error:updateError } =
        await supabase
          .from("users")
          .update({

            // REFERRALS
            referrals: [
              ...referrals,
              newReferral
            ],

            levelAReferrals: [
              ...levelA,
              newReferral
            ],

            // COMMISSION
            referralCommission:
              Number(
                referredByUser.referralCommission || 0
              ) + 0.5,

            totalReferralCommission:
              Number(
                referredByUser.totalReferralCommission || 0
              ) + 0.5,

            // ✅ ADD BONUS TO BALANCE
            pyeBalance:
              Number(
                referredByUser.pyeBalance || 0
              ) + 0.5

          })
          .eq("id", referredByUser.id);

      if(updateError){

        console.log(
          "UPLINE UPDATE ERROR:",
          updateError
        );

      } else {

        console.log(
          "REFERRAL SYSTEM UPDATED SUCCESSFULLY"
        );

      }

      // ✅ REFERRAL BONUS TRANSACTION
      await addTransaction({

        user_id: referredByUser.id,

        type: "REFERRAL BONUS",

        amount: 0.5,

        currency:"PYE",

        status: "Approved",

        description:
          `Referral bonus from ${name}`,

        created_at:
          new Date().toISOString()

      });

      // ===================
      // LEVEL B BONUS
      // ===================

      if(referredByUser.referred_by){

        const { data: levelB } =
          await supabase
            .from("users")
            .select("*")
            .eq("id", referredByUser.referred_by)
            .single();

        if(levelB){

          levelB.pyeBalance =
            Number(levelB.pyeBalance || 0)
            + 0.25;

          levelB.totalReferralCommission =
            Number(levelB.totalReferralCommission || 0)
            + 0.25;

          levelB.referralCommission =
            Number(levelB.referralCommission || 0)
            + 0.25;

          await supabase
            .from("users")
            .update({

              pyeBalance:
                levelB.pyeBalance,

              totalReferralCommission:
                levelB.totalReferralCommission,

              referralCommission:
                levelB.referralCommission

            })
            .eq("id", levelB.id);

          await addTransaction({

            user_id: levelB.id,

            type: "LEVEL B BONUS",

            amount: 0.25,

            currency:"PYE",

            status:"Approved"

          });

        }

      }

      // ===================
      // LEVEL C BONUS
      // ===================

      if(referredByUser.referred_by){

        const { data: levelB } =
          await supabase
            .from("users")
            .select("*")
            .eq("id", referredByUser.referred_by)
            .single();

        if(levelB?.referred_by){

          const { data: levelC } =
            await supabase
              .from("users")
              .select("*")
              .eq("id", levelB.referred_by)
              .single();

          if(levelC){

            levelC.pyeBalance =
              Number(levelC.pyeBalance || 0)
              + 0.15;

            levelC.totalReferralCommission =
              Number(levelC.totalReferralCommission || 0)
              + 0.15;

            levelC.referralCommission =
              Number(levelC.referralCommission || 0)
              + 0.15;

            await supabase
              .from("users")
              .update({

                pyeBalance:
                  levelC.pyeBalance,

                totalReferralCommission:
                  levelC.totalReferralCommission,

                referralCommission:
                  levelC.referralCommission

              })
              .eq("id", levelC.id);

            await addTransaction({

              user_id: levelC.id,

              type: "LEVEL C BONUS",

              amount: 0.15,

              currency:"PYE",

              status:"Approved"

            });

          }

        }

      }

    }

    setAlert({
      type:"success",
      message:
        " ✅ ACCOUNT REGISTERED SUCCESSFULLY"
    });

    setTimeout(() => {

      navigate("/dashboard");

    },1500);

  };

  return (
    <div style={styles.container}>

      <div style={styles.formBox}>

        <h2 style={styles.title}>
          Create PYEFUNDS Account
        </h2>

        <input
          type="text"
          placeholder="Full Name"
          style={styles.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div style={styles.row}>
          <input
            type="email"
            placeholder="Email Address"
            style={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button 
            style={styles.sendBtn} 
            onClick={handleSendEmail}
          >
            Send
          </button>
        </div>

        <input
          type="text"
          placeholder="Email Verification Code"
          style={{
            ...styles.input,
            ...styles.responsiveInput
          }}
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        <div style={styles.passwordBox}>

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            style={styles.passwordInput}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div
            style={styles.eye}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </div>

        </div>

        <div style={styles.passwordBox}>

          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            style={styles.passwordInput}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <div
            style={styles.eye}
            onClick={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </div>

        </div>

        <div style={styles.row}>
          <input
            type="text"
            placeholder="Graph Code"
            style={{
              ...styles.input,
              ...styles.responsiveInput
            }}
            value={graphCode}
            onChange={(e)=>setGraphCode(e.target.value)}
          />

          <button
            style={styles.graphBtn}
            onClick={generateGraphCode}
          >

            {generatedGraph || "Generate"}

          </button>
        </div>

        <div style={styles.inputGroup}>

          <label>Select Phase</label>

          <select
            value={phase}
            onChange={(e)=>
              setPhase(e.target.value)
            }
            style={styles.input}
          >

            <option value="phase1">
              Phase 1
            </option>

            <option value="phase2">
              Phase 2
            </option>

            <option value="phase3">
              Phase 3
            </option>

          </select>

        </div>

        <div style={styles.termsRow}>

          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={() =>
              setAcceptedTerms(!acceptedTerms)
            }
          />

          <p style={styles.termsText}>

            I agree to the

            <span
              style={styles.link}
              onClick={() => setShowTerms(true)}
            >
              {" "}Terms & Conditions
            </span>

          </p>

        </div>

        <button style={styles.button} onClick={handleRegister}>
          Register
        </button>

      </div>

      {showTerms && (

        <div style={styles.modalOverlay}>

          <div style={styles.modal}>

            <div style={styles.modalHeader}>

              <h3 style={{margin:0}}>
                Terms & Conditions
              </h3>

              <button
                style={styles.closeBtn}
                onClick={() => setShowTerms(false)}
              >
                ✕
              </button>

            </div>

            <div style={styles.modalContent}>

              <p>
                By creating a PYFUNDS account,
                you agree to follow all platform
                rules and policies.
              </p>

              <p>
                Users must not create fake accounts,
                manipulate referrals, abuse bonuses,
                hack the system or perform fraud.
              </p>

              <p>
                PYFUNDS reserves the right to
                suspend or terminate accounts
                involved in suspicious activities.
              </p>

              <p>
                Investments and digital assets
                involve risks and market changes.
              </p>

              <p>
                By using PYFUNDS you agree that
                platform rules may change over time.
              </p>

            </div>

          </div>

        </div>

      )}

      {/* ✅ STYLED ALERT */}
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

  container:{
    minHeight:"100vh",

    display:"flex",
    justifyContent:"center",
    alignItems:"center",

    padding:"20px"
  },

  formBox:{
    background:"rgba(2,6,23,0.92)",
    backdropFilter:"blur(10px)",
    padding:"28px",
    borderRadius:"24px",

    width:"100%",
    maxWidth:"420px",

    display:"flex",
    flexDirection:"column",
    gap:"16px",

    border:"1px solid rgba(56,189,248,0.15)",

    boxShadow:"0 0 40px rgba(0,0,0,0.45)"
  },

  input:{
    width:"100%",

    padding:"15px",

    borderRadius:"14px",

    border:"1px solid rgba(56,189,248,0.15)",

    background:"#0f172a",

    color:"white",

    fontSize:"15px",

    outline:"none"
  },

  button:{
    marginTop:"10px",

    padding:"15px",

    background:"linear-gradient(90deg,#06b6d4,#2563eb)",

    border:"none",

    borderRadius:"14px",

    cursor:"pointer",

    color:"white",

    fontWeight:"bold",

    fontSize:"15px",

    width:"100%"
  },

  row:{
    display:"flex",
    gap:"10px",
    width:"100%",
    alignItems:"center"
  },

  responsiveInput:{
    flex:1,
    minWidth:0
  },

  sendBtn:{
    minWidth:"90px",

    padding:"14px",

    background:"#22c55e",

    border:"none",

    borderRadius:"14px",

    color:"white",

    fontWeight:"bold",

    cursor:"pointer"
  },

  graphBtn:{
    minWidth:"110px",

    padding:"14px",

    background:"#38bdf8",

    border:"none",

    borderRadius:"14px",

    color:"white",

    fontWeight:"bold",

    cursor:"pointer"
  },

  passwordBox:{
    display:"flex",
    alignItems:"center",
    background:"#0f172a",
    border:"1px solid #1e293b",
    borderRadius:"14px",
    overflow:"hidden"
  },

  passwordInput:{
    flex:1,
    padding:"12px",
    border:"none",
    background:"transparent",
    color:"white",
    outline:"none"
  },

  eye:{
    padding:"0 14px",
    color:"#38bdf8",
    cursor:"pointer",
    fontSize:"18px",
    display:"flex",
    alignItems:"center"
  },

  termsRow:{
    display:"flex",
    alignItems:"flex-start",
    gap:"10px",
    marginTop:"5px"
  },

  termsText:{
    color:"#cbd5e1",
    fontSize:"14px",
    lineHeight:"1.5"
  },

  link:{
    color:"#38bdf8",
    cursor:"pointer",
    fontWeight:"bold"
  },

  modalOverlay:{
    position:"fixed",
    top:0,
    left:0,
    width:"100%",
    height:"100%",
    background:"rgba(0,0,0,0.65)",
    display:"flex",
    justifyContent:"center",
    alignItems:"flex-end",
    zIndex:999
  },

  modal:{
    width:"100%",
    maxWidth:"500px",
    background:"#020617",
    borderTopLeftRadius:"20px",
    borderTopRightRadius:"28px",
    padding:"25px",
    animation:"slideUp 0.3s ease",
    border:"1px solid rgba(56,189,248,0.1)",

    boxShadow:"0 -10px 40px rgba(0,0,0,0.5)"
  },

  modalHeader:{
    display:"flex",
    justifyContent:"space-between",
    alignItems:"center",
    marginBottom:"20px"
  },

  closeBtn:{
    background:"transparent",
    border:"none",
    color:"white",
    fontSize:"22px",
    cursor:"pointer"
  },

  modalContent:{
    maxHeight:"400px",
    overflowY:"auto",
    color:"#cbd5e1",
    lineHeight:"1.7"
  },

  title:{
    color:"white",
    textAlign:"center",
    fontSize:"28px",
    marginBottom:"10px"
  },

};

export default Register;

// service_c59qrtl

// template_ftqk1ll

// PUBLIC KEY => KqEPG6Xz8t1dHetlF