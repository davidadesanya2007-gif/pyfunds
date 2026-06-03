function PageLoader() {

  return (

    <div
      style={{
        minHeight:"100vh",
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        background:"#020617"
      }}
    >

      <div
        style={{
          width:"60px",
          height:"60px",
          border:"5px solid #1e293b",
          borderTop:"5px solid #38bdf8",
          borderRadius:"50%",
          animation:"spin 1s linear infinite"
        }}
      />

      <style>
        {`
          @keyframes spin{
            0%{transform:rotate(0deg);}
            100%{transform:rotate(360deg);}
          }
        `}
      </style>

    </div>

  );

}

export default PageLoader;