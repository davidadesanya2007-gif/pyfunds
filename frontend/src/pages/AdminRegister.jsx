import { useState } from "react";

import {
  FaEye,
  FaEyeSlash
} from "react-icons/fa";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

function AdminRegister() {

  const navigate = useNavigate();

  const [fullname,setFullname] =
    useState("");

  const [email,setEmail] =
    useState("");

  const [phone,setPhone] =
    useState("");

  const [username,setUsername] =
    useState("");

  const [password,setPassword] =
    useState("");

  const [confirmPassword,     setConfirmPassword] =
    useState("");
    
  const [showPassword,setShowPassword] =
  useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword
  ] = useState(false);

  

  const [adminCode,setAdminCode] =
    useState("");

  const [loading,setLoading] =
    useState(false);

  const handleRegister = async () => {

    // 🔥 SECRET ADMIN CODE
    if(
      adminCode.length < 4
    ){

      alert(
        "Security code must be at least 4 characters"
      );

      return;

    }

    if(password !== confirmPassword){

      alert("Passwords do not match");

      return;

    }

    setLoading(true);

    // CREATE AUTH ACCOUNT
    const { data, error } =
      await supabase.auth.signUp({

        email,
        password

      });

    if(error){

      alert(error.message);

      setLoading(false);

      return;

    }

    // SAVE ADMIN
    const { error:adminError } =
      await supabase
        .from("admins")
        .insert([
        {
          id:data.user.id,

          fullname,

          username,

          email,

          phone,

          role:"superadmin",

          accesslevel:"full",

          securitycode: adminCode
        }
        ]);

    if(adminError){

      alert(adminError.message);

      setLoading(false);

      return;

    }

    alert("Admin account created");

    navigate("/admin-login");

  };

  return (

    <div style={styles.page}>

      <div style={styles.card}>

        <h1 style={styles.title}>
          Admin Registration
        </h1>

        <input
          placeholder="Full Name"
          style={styles.input}
          value={fullname}
          onChange={(e)=>
            setFullname(e.target.value)
          }
        />

        <input
          placeholder="Email"
          style={styles.input}
          value={email}
          onChange={(e)=>
            setEmail(e.target.value)
          }
        />

        <input
          placeholder="Phone"
          style={styles.input}
          value={phone}
          onChange={(e)=>
            setPhone(e.target.value)
          }
        />

        <input
          placeholder="Username"
          style={styles.input}
          value={username}
          onChange={(e)=>
            setUsername(e.target.value)
          }
        />

        <div style={styles.passwordBox}>

          <input
            type={
              showPassword
              ? "text"
              : "password"
            }

            placeholder="Password"

            style={styles.passwordInput}

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

        <div style={styles.passwordBox}>

          <input
            type={
              showConfirmPassword
              ? "text"
              : "password"
            }

            placeholder="Confirm Password"

            style={styles.passwordInput}

            value={confirmPassword}

            onChange={(e)=>
              setConfirmPassword(
                e.target.value
              )
            }
          />

          <div
            style={styles.eye}
            onClick={()=>
              setShowConfirmPassword(
                !showConfirmPassword
              )
            }
          >

            {
              showConfirmPassword
              ? <FaEyeSlash />
              : <FaEye />
            }

          </div>

        </div>

        <input
          placeholder="Create Security Code"
          style={styles.input}
          value={adminCode}
          onChange={(e)=>
            setAdminCode(e.target.value)
          }
        />

        <button
          style={styles.button}
          onClick={handleRegister}
        >

          {
            loading
            ? "Creating..."
            : "Create Admin"
          }

        </button>

      </div>

    </div>

  );

}

const styles = {

  page:{
    minHeight:"100vh",
    backgroun:"#020617",
    display:"flex",
    justifyContent:"center",
    alignItems:"center"
  },

  card:{
    width:"450px",
    background:"#0f172a",
    padding:"40px",
    borderRadius:"20px",
    display:"flex",
    flexDirection:"column",
    gap:"15px",
    border:"1px solid #1e293b"
  },

  title:{
    color:"white",
    marginBottom:"10px"
  },

  input:{
    padding:"14px",
    borderRadius:"10px",
    border:"1px solid #1e293b",
    background:"#020617",
    color:"white"
  },

  passwordBox:{
    display:"flex",
    alignItems:"center",
    background:"#020617",
    border:"1px solid #1e293b",
    borderRadius:"10px",
    overflow:"hidden"
  },

  passwordInput:{
    flex:1,
    padding:"14px",
    border:"none",
    background:"transparent",
    color:"white",
    outline:"none"
  },

  eye:{
    padding:"0 14px",
    color:"#38bdf8",
    cursor:"pointer",
    display:"flex",
    alignItems:"center"
  },

  button:{
    padding:"14px",
    border:"none",
    borderRadius:"10px",
    background:"#38bdf8",
    cursor:"pointer",
    fontWeight:"bold"
  }

};

export default AdminRegister;