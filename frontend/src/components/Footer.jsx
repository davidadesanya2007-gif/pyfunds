function Footer() 
  { return ( 
    <footer style={styles.footer}> 
        <p>
          © 2026 PYEFUNDS. All rights   reserved.
        </p> 
    </footer>
  );
}

const styles = {
  footer: {
    textAlign: "center",
    padding: "20px",
    background: "#020617",
    color: "white",
    marginTop: "auto"   // ✅ important fix
  },
};

export default Footer;