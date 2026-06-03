import { useState } from "react";

import {
  FaEye,
  FaEyeSlash,
  FaUserShield,
  FaLock,
  FaEnvelope,
  FaShieldAlt
} from "react-icons/fa";

import {
  MdSecurity
} from "react-icons/md";

import {
  useNavigate
} from "react-router-dom";

import { supabase } from "../supabase";

function AdminLogin() {

  const navigate =
    useNavigate();

  const [email,setEmail] =
    useState("");

  const [password,setPassword] =
    useState("");

  const [securityCode,setSecurityCode] =
    useState("");

  const [showPassword,setShowPassword] =
    useState(false);

  const [loading,setLoading] =
    useState(false);

  const handleLogin = async () => {

    if(
      !email ||
      !password ||
      !securityCode
    ){

      alert(
        "Fill all fields"
      );

      return;

    }

    setLoading(true);

    // LOGIN AUTH
    const { error } =
      await supabase.auth.signInWithPassword({

        email,
        password

      });

    if(error){

      alert(error.message);

      setLoading(false);

      return;

    }

    // CHECK ADMIN
    const {
      data:admin,
      error:adminError
    } = await supabase
      .from("admins")
      .select("*")
      .eq("id",
        (
          await supabase.auth.getUser()
        ).data.user.id
      )
      .single();

    if(
      adminError ||
      !admin
    ){

      alert(
        "Unauthorized admin access"
      );

      await supabase.auth.signOut();

      setLoading(false);

      return;

    }

    // SECURITY CODE CHECK
    if(
      admin.securitycode
      !==
      securityCode
    ){

      alert(
        "Invalid security code"
      );

      setLoading(false);

      return;

    }

    alert(
      "Admin login successful"
    );

    setLoading(false);

    navigate("/admin");

  };

  return (

    <div style={styles.page}>

      {/* LEFT PANEL */}
      <div style={styles.leftPanel}>

        <div>

          <h1 style={styles.logo}>
            PYE <span style={{
              color:"#facc15"
            }}>
              Admin
            </span>
          </h1>

          <h2 style={styles.welcome}>
            Welcome Back,
            <span style={{
              color:"#facc15"
            }}>
              {" "}Admin!
            </span>
          </h2>

          <p style={styles.subText}>
            Sign in to access your
            PYE platform and manage
            everything in one place.
          </p>

        </div>

        {/* IMAGE */}
        <img
          src="/pye-cube.png"
          alt="PYE"
          style={styles.image}
        />

        {/* FEATURES */}
        <div style={styles.featureGrid}>

          <div style={styles.featureCard}>
            <FaShieldAlt
              size={28}
              color="#38bdf8"
            />

            <div>
              <h4 style={styles.featureTitle}>
                Secure Access
              </h4>

              <p style={styles.featureText}>
                Enterprise-grade security
              </p>
            </div>
          </div>

          <div style={styles.featureCard}>
            <MdSecurity
              size={28}
              color="#facc15"
            />

            <div>
              <h4 style={styles.featureTitle}>
                Full Control
              </h4>

              <p style={styles.featureText}>
                Manage everything
              </p>
            </div>
          </div>

          <div style={styles.featureCard}>
            <FaUserShield
              size={28}
              color="#8b5cf6"
            />

            <div>
              <h4 style={styles.featureTitle}>
                Analytics
              </h4>

              <p style={styles.featureText}>
                Real-time insights
              </p>
            </div>
          </div>

          <div style={styles.featureCard}>
            <FaLock
              size={28}
              color="#22c55e"
            />

            <div>
              <h4 style={styles.featureTitle}>
                Data Protection
              </h4>

              <p style={styles.featureText}>
                Advanced admin protection
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* RIGHT PANEL */}
      <div style={styles.rightPanel}>

        <div style={styles.formCard}>

          <div style={styles.iconBox}>
            <FaUserShield
              color="#38bdf8"
              size={38}
            />
          </div>

          <h1 style={styles.loginTitle}>
            Admin
            <span style={{
              color:"#38bdf8"
            }}>
              {" "}Login
            </span>
          </h1>

          <p style={styles.loginSub}>
            Enter your credentials
            to access admin dashboard
          </p>

          {/* EMAIL */}
          <div style={styles.inputBox}>

            <FaEnvelope
              color="#64748b"
            />

            <input
              type="email"
              placeholder="Enter email"

              style={styles.input}

              value={email}

              onChange={(e)=>
                setEmail(e.target.value)
              }
            />

          </div>

          {/* PASSWORD */}
          <div style={styles.inputBox}>

            <FaLock
              color="#64748b"
            />

            <input
              type={
                showPassword
                ? "text"
                : "password"
              }

              placeholder="Enter password"

              style={styles.input}

              value={password}

              onChange={(e)=>
                setPassword(e.target.value)
              }
            />

            <div
              style={styles.eye}
              onClick={()=>
                setShowPassword(
                  !showPassword
                )
              }
            >

              {
                showPassword
                ? <FaEyeSlash />
                : <FaEye />
              }

            </div>

          </div>

          {/* SECURITY CODE */}
          <div style={styles.inputBox}>

            <MdSecurity
              color="#64748b"
            />

            <input
              type="text"

              placeholder="Security code"

              style={styles.input}

              value={securityCode}

              onChange={(e)=>
                setSecurityCode(
                  e.target.value
                )
              }
            />

          </div>

          {/* LOGIN BUTTON */}
          <button
            style={styles.button}
            onClick={handleLogin}
          >

            {
              loading
              ? "Logging in..."
              : "Login To Dashboard"
            }

          </button>

        </div>

      </div>

    </div>

  );

}

const styles = {

  page:{
    minHeight:"100vh",
    backgroun:"#020617",
    display:"flex",
    padding:"30px",
    gap:"30px",
    flexWrap:"wrap"
  },

  leftPanel:{
    flex:"1",
    minWidth:"350px",
    background:
      "linear-gradient(145deg,#020617,#071120)",

    borderRadius:"30px",

    padding:"40px",

    border:"1px solid rgba(56,189,248,0.15)",

    display:"flex",

    flexDirection:"column",

    justifyContent:"space-between",

    boxShadow:
      "0 0 40px rgba(56,189,248,0.08)"
  },

  rightPanel:{
    flex:"1",
    minWidth:"350px",
    display:"flex",
    justifyContent:"center",
    alignItems:"center"
  },

  formCard:{
    width:"100%",
    maxWidth:"500px",

    background:
      "linear-gradient(145deg,#071120,#0f172a)",

    borderRadius:"30px",

    padding:"40px",

    border:"1px solid rgba(56,189,248,0.15)",

    boxShadow:
      "0 0 40px rgba(56,189,248,0.08)"
  },

  logo:{
    color:"white",
    fontSize:"40px"
  },

  welcome:{
    color:"white",
    marginTop:"40px",
    fontSize:"42px",
    lineHeight:"1.3"
  },

  subText:{
    color:"#94a3b8",
    marginTop:"20px",
    lineHeight:"1.8",
    fontSize:"17px"
  },

  image:{
    width:"100%",
    marginTop:"20px",
    marginBottom:"20px"
  },

  featureGrid:{
    display:"grid",
    gridTemplateColumns:"1fr 1fr",
    gap:"15px"
  },

  featureCard:{
    background:"#020617",
    border:"1px solid #1e293b",
    borderRadius:"20px",
    padding:"20px",
    display:"flex",
    gap:"15px",
    alignItems:"center"
  },

  featureTitle:{
    color:"white",
    marginBottom:"5px"
  },

  featureText:{
    color:"#64748b",
    fontSize:"14px"
  },

  iconBox:{
    width:"90px",
    height:"90px",
    borderRadius:"50%",
    background:"#020617",
    border:"1px solid #1e293b",
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    margin:"0 auto 20px auto"
  },

  loginTitle:{
    color:"white",
    textAlign:"center",
    fontSize:"42px"
  },

  loginSub:{
    color:"#64748b",
    textAlign:"center",
    marginTop:"10px",
    marginBottom:"40px"
  },

  inputBox:{
    display:"flex",
    alignItems:"center",
    gap:"15px",

    background:"#020617",

    border:"1px solid #1e293b",

    borderRadius:"14px",

    padding:"16px",

    marginBottom:"20px"
  },

  input:{
    flex:1,
    background:"transparent",
    border:"none",
    outline:"none",
    color:"white",
    fontSize:"15px"
  },

  eye:{
    color:"#64748b",
    cursor:"pointer"
  },

  button:{
    width:"100%",
    padding:"18px",
    border:"none",
    borderRadius:"14px",

    background:
      "linear-gradient(90deg,#2563eb,#38bdf8)",

    color:"white",

    fontSize:"16px",

    fontWeight:"bold",

    cursor:"pointer",

    marginTop:"10px"
  }

};

export default AdminLogin;