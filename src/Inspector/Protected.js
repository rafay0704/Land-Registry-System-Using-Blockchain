import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
const Protected = ({ Component }) => {
  const navigate = useNavigate();
  useEffect(() => {
    let login = localStorage.getItem("Inspectorlogin");
    if (!login) {
      navigate("login");
    }
  });
  return <Layout co={<Component />} />;
};

export default Protected;
