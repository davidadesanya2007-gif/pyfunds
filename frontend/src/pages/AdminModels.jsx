import { useState, useEffect } from "react";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,

  getUnits,
  saveUnits,
  deleteUnit,
  updateUnit

} from "../utils/storage";
import { supabase } from "../supabase";
import AddModelModal from "../components/AddModelModal";
import AddUnitModal from "../components/AddUnitModal";
import EditUnitModal from "../components/EditUnitModal";

function AdminModels() {

  const [models, setModels] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [units, setUnits] = useState([]);
  const [showUnits, setShowUnits] = useState(false);
  const [showAddUnit, setShowAddUnit] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);

  useEffect(() => {

    const fetchData = async () => {

      // 🔥 PRODUCTS
      const products =
        await getProducts();

      setModels(products || []);

      // 🔥 UNITS FROM SUPABASE
      const { data, error } =
        await supabase
          .from("units")
          .select("*")
          .order("created_at", {
            ascending:false
          });

      if(error){

        console.log(error);

        return;

      }

      setUnits(data || []);

    };

    fetchData();

  }, []);

  const handleDelete = async (id) => {

    await deleteProduct(id);

    const updated =
      models.filter(m => m.id !== id);

    setModels(updated);

  };

  

  return (
    <div style={styles.page}>

      <div style={styles.container}>

        {/* HEADER */}
        <div style={styles.header}>
          <h2>PYE ADMIN / AI MODELS</h2>

          <button style={styles.addBtn} onClick={() => setShowAddModal(true)}>
            + Add AI Model
          </button>
        </div>

        {/* UNIT HEADER */}

        <div
          style={styles.unitHeader}
          onClick={() => setShowUnits(!showUnits)}
        >

          <h2 style={{ color:"#38bdf8" }}>
            ⚡ UNIT MODELS
          </h2>

          <button style={styles.addBtn}
            onClick={() => 
              setShowAddUnit(true)
            }
          >
            + Add Unit
          </button>

        </div>

        {/* UNIT LIST */}

        {showUnits && (

          <div style={styles.list}>

            {units.map((unit) => (

              <div key={unit.id} style={styles.card}>

                <div style={styles.left}>

                  <img
                    src={unit.image}
                    style={styles.image}
                  />

                  <div>

                    <h3 style={styles.name}>
                      {unit.name}
                    </h3>

                    <p style={styles.details}>

                      <span style={styles.price}>
                       {unit.price} PYE
                      </span>

                      <span style={styles.percent}>
                        {unit.percent}% Daily
                      </span>

                    </p>

                  </div>

                </div>

                <div style={styles.actions}>

                  <button
                    style={styles.deleteBtn}
                    onClick={async () => {

                      await deleteUnit(unit.id);

                      const updated =
                        units.filter(
                          u => u.id !== unit.id
                        );

                      setUnits(updated);

                    }}
                  >
                    Delete
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

        {/* MODEL LIST */}
        <div style={styles.list}>

          {models.length === 0 && (
            <p style={{color:"#aaa"}}>No AI Models yet</p>
          )}

          {models.map((model) => (

            <div key={model.id} style={styles.card}>

              {/* LEFT */}
              <div style={styles.left}>

                <img src={model.image} style={styles.image} />

                <div>
                  <h3 style={styles.name}>{model.name}</h3>

                  <p style={styles.details}>
                    <span style={styles.price}>
                      {model.price} PYE
                    </span>

                    <span style={styles.percent}>
                      {model.percent}% Daily
                    </span>
                  </p>
                </div>

              </div>

              {/* RIGHT */}
              <div style={styles.actions}>

                
                <button 
                  style={styles.deleteBtn}
                  onClick={() => handleDelete(model.id)}
                >
                  Delete
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

      {showAddModal && (
        <AddModelModal
          onClose={() => setShowAddModal(false)}

          onCreate={async (newModel) => {

            const dailyEarning =
              (
                Number(newModel.price || 0) *
                Number(newModel.percent || 0)
              ) / 100;

            const productToSave = {

              name:newModel.name,

              image:newModel.image,

              description:newModel.description,

              price:Number(newModel.price),

              percent:Number(newModel.percent),

              dailyEarning:
              (
                Number(newModel.price || 0) *
                Number(newModel.percent || 0)
              ) / 100,

              units:Number(newModel.units),

              days:Number(newModel.days),

              left:Number(newModel.left),

              type:"limited"

            };

            const savedProduct =
              await addProduct(productToSave);

            if(savedProduct){

              setModels(prev => [
                savedProduct,
                ...prev
              ]);

            }

            setShowAddModal(false);
          }}
        />
      )}

      {showAddUnit && (

        <AddUnitModal

          onClose={() => setShowAddUnit(false)}

          onCreate={async (unit) => {

            const { data, error } =
              await supabase
                .from("units")
                .insert([
                  {
                    name: unit.name,

                    units: Number(unit.units),

                    price: Number(unit.price),

                    left: Number(unit.left),

                    image: unit.image,

                    description: unit.description
                  }
                ])
                .select()
                .single();

            if(error){

              console.log(error);

              alert(error.message);

              return;

            }

            setUnits(prev => [
              data,
              ...prev
            ]);

          }}

        />

      )}

    </div>
  );
}

const styles = {

  page:{
    display:"flex",
    backgroun:"#020617",
    minHeight:"100vh",
    color:"white"
  },

  container:{
    flex:1,
    padding:"20px"
  },

  header:{
    display:"flex",
    justifyContent:"space-between",
    alignItems:"center",
    marginBottom:"20px",
    borderBottom:"1px solid #0ea5e9",
    paddingBottom:"10px"
  },

  unitHeader:{
    display:"flex",
    justifyContent:"space-between",
    alignItems:"center",
    marginTop:"30px",
    marginBottom:"15px",
    cursor:"pointer",
    background:"#071120",
    padding:"15px",
    borderRadius:"15px",
    border:"1px solid #0ea5e9"
  },

  addBtn:{
    background:"linear-gradient(90deg,#0ea5e9,#38bdf8)",
    border:"none",
    padding:"10px 15px",
    borderRadius:"8px",
    cursor:"pointer",
    color:"#fff",
    fontWeight:"bold",
    boxShadow:"0 0 10px #0ea5e9"
  },

  list:{
    display:"flex",
    flexDirection:"column",
    gap:"15px"
  },

  card:{
    display:"flex",
    justifyContent:"space-between",
    alignItems:"center",
    padding:"15px",
    borderRadius:"12px",
    background:"linear-gradient(145deg,#020617,#0f172a)",
    border:"1px solid #0ea5e9",
    boxShadow:"0 0 15px rgba(14,165,233,0.2)"
  },

  left:{
    display:"flex",
    alignItems:"center",
    gap:"15px"
  },

  image:{
    width:"60px",
    height:"60px",
    borderRadius:"10px",
    objectFit:"cover",
    border:"1px solid #0ea5e9"
  },

  name:{
    margin:0
  },

  details:{
    marginTop:"5px",
    display:"flex",
    gap:"15px"
  },

  price:{
    color:"#facc15",
    fontWeight:"bold"
  },

  percent:{
    color:"#22c55e"
  },

  actions:{
    display:"flex",
    gap:"10px"
  },

  editBtn:{
    background:"#facc15",
    border:"none",
    padding:"8px 12px",
    borderRadius:"6px",
    cursor:"pointer",
    fontWeight:"bold"
  },

  deleteBtn:{
    background:"#ef4444",
    border:"none",
    padding:"8px 12px",
    borderRadius:"6px",
    cursor:"pointer",
    color:"#fff",
    fontWeight:"bold"
  }

};

export default AdminModels;