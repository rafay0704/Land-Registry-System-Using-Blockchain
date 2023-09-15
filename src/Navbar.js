import React from "react";
import { Link } from "react-router-dom";
import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import logo from './images/logo3.png';

const Navbar = () => {
  return (
    <nav style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      boxShadow: "rgba(61, 45, 134, 0.35) 0px 5px 15px", // Modified box shadow color
      margin: 0,
      position: "sticky",
      top: 0,
      background: "linear-gradient(to right, #551A8B, #AB47BC, #7C4DFF, #00B0FF, #1DE9B6)",
      padding: "10px 20px",
      zIndex: 999,
    }}>
      <Box display="flex" alignItems="center">
        <Box className="logo" marginRight={2} sx={{ marginY: '-5px' }}>
          <img src={logo} alt="Logo" style={{ height: '80px', margin: 'auto' }}/>
        </Box>
        <Typography
          variant="h6"
          component="h1"
          sx={{
            fontWeight: "bold",
            color: "#f5f5f5",
            textShadow: "2px 2px #1e88e5",
            letterSpacing: "2px",
          }}
        >
          Land Registry System Using Blockchain 
        </Typography>
      </Box>

      <Box display="flex" listStyleType="none" padding={0}>
        {["about-us", "contact-us", "join-us", "transactions"].map(
          (link, index) => (
            <Box key={index} marginRight={2}>
              <Link
                to={link}
                smooth={true}
                duration={500}
                style={{ textDecoration: "none" }}
              >
                <Button
                  variant="contained"
                  color={
                    index === 0
                      ? "warning"
                      : index === 1
                      ? "secondary"
                      : index === 2
                      ? "primary"
                      : "success"
                  }
                  sx={{
                    width: "140px",
                    borderRadius: "20px",
                    boxShadow: "none",
                    fontWeight: "bold",
                    cursor: "pointer",
                    "&:hover, &:active, &:focus": {
                      backgroundColor:
                        index === 0
                          ? "#ffbb33"
                          : index === 1
                          ? "#ff1744"
                          : index === 2
                          ? "#3f51b5"
                          : "#4caf50",
                      boxShadow: "none",
                    },
                  }}
                >
                  {link.charAt(0).toUpperCase() +
                    link.slice(1).replace("-", " ")}
                </Button>
              </Link>
            </Box>
          )
        )}
      </Box>
    </nav>
  );
};

export default Navbar;
