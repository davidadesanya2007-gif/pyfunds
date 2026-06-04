import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import { FiEye, FiEyeOff } from "react-icons/fi";
import CustomAlert from "../components/CustomAlert";
import { getAdminSettings } from "../utils/storage";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [code, setCode] = useState("");
  const [generatedGraph, setGeneratedGraph] = useState("");

  const [alert, setAlert] = useState(null);

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

  const handleLogin = async (e) => {

    const settings = await getAdminSettings();

    console.log(
      "MAINTENANCE STATUS:",
      settings
    );

    if(settings?.maintenance){

      setAlert({
        type:"error",
        message:"Platform is under maintenance"
      });

      return;
    }

    if(e){
      e.preventDefault();
    }

    if (!email || !password) {

      setAlert({
        type: "error",
        message: "Please fill all fields ❌"
      });

      return;
    }

    if(
      code.trim().toUpperCase()
      !==
      generatedGraph.trim().toUpperCase()
    ){

      setAlert({
        type:"error",
        message:"Invalid graph code ❌"
      });

      return;

    }

    // LOGIN WITH SUPABASE AUTH
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password
      });

    if(authError){

      console.log("LOGIN ERROR:", authError);

      setAlert({
        type:"error",
        message: authError.message
      });

      return;

    }

    // GET USER FROM USERS TABLE
    const { data:userData, error:userError } =
      await supabase
        .from("users")
        .select("*")
        .eq("id", authData.user.id)
        .single();

    if(userError || !userData){

      setAlert({
        type:"error",
        message:"User not found ❌"
      });

      return;

    }

    // SAVE LOGIN

    setAlert({
      type:"success",
      message:"Login successful ✅"
    });

    setTimeout(() => {

      navigate("/dashboard");

    },1500);

  };

  return (
    <div style={styles.container}>

      <div style={styles.formBox}>

        <h2>Login to PYEFUNDS</h2>

        <input
          type="email"
          placeholder="Email Address"
          style={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
            onClick={() =>
              setShowPassword(!showPassword)
            }
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </div>

        </div>

        {/* ✅ GRAPH ROW FIXED */}
        <div style={styles.row}>
          <input
            type="text"
            placeholder="Graph Code"
            style={styles.input}
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />

          <button
            style={styles.graphBtn}
            onClick={generateGraphCode}
          >

            {generatedGraph || "Generate"}

          </button>
        </div>

        <button
          type="button"
          style={styles.button}
          onClick={handleLogin}
        >
          Login
        </button>

      </div>

      {/* ✅ ALERT */}
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

  container: {
    display: "flex",
    justifyContent: "center",
    marginTop: "80px"
  },

  formBox: {
    background: "#020617",
    padding: "40px",
    borderRadius: "10px",
    width: "350px",
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },

  input: {
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #1e293b",
    background: "#0f172a",
    color: "white",
    flex: 1
  },

  passwordBox:{
    position:"relative",
    width:"100%"
  },

  passwordInput:{
    width:"100%",
    padding:"12px",
    paddingRight:"45px",
    borderRadius:"6px",
    border:"1px solid #1e293b",
    background:"#0f172a",
    color:"white",
    outline:"none"
  },

  eye:{
    position:"absolute",
    right:"14px",
    top:"50%",
    transform:"translateY(-50%)",
    color:"#94a3b8",
    cursor:"pointer",
    fontSize:"20px"
  },

  button: {
    marginTop: "10px",
    padding: "12px",
    background: "#38bdf8",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  },

  row:{
    display:"flex",
    gap:"10px",
    alignItems:"center"
  },

  graphBtn:{
    padding:"12px",
    background:"#22c55e",
    border:"none",
    borderRadius:"6px",
    cursor:"pointer",
    whiteSpace:"nowrap"
  }

};

export default Login;