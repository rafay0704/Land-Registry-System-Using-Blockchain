import { Link } from "react-router-dom";
import { useState } from "react";
import admin from "./images/admin2.png";
import inspector from "./images/inspector1.png";
import User from "./images/user1.png";

const LoginScreen = () => {
  const [/* path */, setPath] = useState({
    Inspector: true,
    Admin: true,
    User: true,
  });

  return (
   
       <section
                className="home-section"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                 
                }}
              >
                <Link
                  to={"Adminlogin"}
                  onClick={() =>
                    setPath({ Inspector: false, Admin: true, User: false })
                  }
                  style={{ textDecoration: "none" }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      margin: "20px",
                      padding: "20px",
                      backgroundColor: "#4caf50",
                      borderRadius: "20px",
                      boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                      transition: "transform 0.2s",
                      ":hover": { transform: "scale(1.1)" },
                    }}
                  >
                    <img
                      src={admin}
                      alt="admin"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                        borderRadius: "20%",
                      }}
                    />
                    <h3
                      style={{
                        margin: "15px 0",
                        color: "#fff",
                        textAlign: "center",
                      }}
                    >
                      Contract Owner
                    </h3>
                  </div>
                </Link>
                <Link
                  to={"Inspectorlogin"}
                  onClick={() =>
                    setPath({ Inspector: true, Admin: false, User: false })
                  }
                  style={{ textDecoration: "none" }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      margin: "20px",
                      padding: "20px",
                      backgroundColor: "#ff9800",
                      borderRadius: "20px",
                      boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                      transition: "transform 0.2s",
                      ":hover": { transform: "scale(1.1)" },
                    }}
                  >
                    <img
                      src={inspector}
                      alt="inspector"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                        borderRadius: "2%",
                      }}
                    />
                    <h3
                      style={{
                        margin: "15px 0",
                        color: "#fff",
                        textAlign: "center",
                      }}
                    >
                      Land Inspector
                    </h3>
                  </div>
                </Link>
                <Link
                  to={"Userlogin"}
                  onClick={() =>
                    setPath({ Inspector: false, Admin: false, User: true })
                  }
                  style={{ textDecoration: "none" }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      margin: "20px",
                      padding: "20px",
                      backgroundColor: "#f44336",
                      borderRadius: "20px",
                      boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                      transition: "transform 0.2s",
                      ":hover": { transform: "scale(1.1)" },
                    }}
                  >
                    <img
                      src={User}
                      alt="user"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                        borderRadius: "5%",
                      }}
                    />
                    <h3
                      style={{
                        margin: "15px 0",
                        color: "#fff",
                        textAlign: "center",
                      }}
                    >
                      Buyer/Seller
                    </h3>
                  </div>
                </Link>
              </section>
  
  );
};

export default LoginScreen;
