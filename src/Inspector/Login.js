import React, { useEffect, useState, useContext } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { TextField, InputLabel } from "@mui/material";
import { blue } from "@mui/material/colors";
import PersonIcon from "@mui/icons-material/Person";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

import { TransactionContext } from "../StateMangement/Context";
import { ethers } from "ethers";

export default function Login() {
  const { connectWallet, currentAccount, contract } =
    useContext(TransactionContext);
  const [registered, setRegistered] = useState(false);
  const [privateKey, setPrivateKey] = useState("");

  useEffect(() => {
    const viewInspector = async () => {
      const registeredUser = await contract.isLandInspector(currentAccount);
      setRegistered(registeredUser);
    };

    if (contract && currentAccount) {
      viewInspector();
    }
  }, [contract, currentAccount]);

  useEffect(() => {
    const handleAccountsChanged = (accounts) => {
      // Perform actions when account changes
      if (accounts.length > 0) {
        // Update the current account state or perform any other necessary actions
        connectWallet();
      }
    };

    // Add event listener for Metamask account changes
    window.ethereum.on("accountsChanged", handleAccountsChanged);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
    };
  }, [connectWallet]);

  const navigate = useNavigate();

  const login = () => {
    localStorage.setItem("Inspectorlogin", true);
    navigate("/Inspector-dashboard");
  };

  const handleSubmitP = (event) => {
    event.preventDefault();
    const account = ethers.Wallet.fromPrivateKey(privateKey);

    window.ethereum.sendAsync(
      {
        method: "eth_accounts_wallet_add",
        params: [account.signingKey.address],
      },
      function (err, added) {
        if (err) {
          console.error(err);
        } else {
          console.log(`Account added: ${added}`);
          login();
        }
      }
    );
  };
  const authenticateUser = async () => {
    try {
      const wallet = new ethers.Wallet(privateKey);
      const address = await wallet.getAddress();
      const isLandInspector = await contract.isLandInspector(address);

      if (isLandInspector) {
        localStorage.setItem("Inspectorlogin", true);
    navigate("/Inspector-dashboard");
      } else {
        alert(
          "You are not the Land Inspector. Only Land Inspectors can access this page."
        );
      }
    } catch (e) {
      console.error(e);
      alert("Invalid private key. Please try again.");
    }
  };
  const handleSubmit = () => {
    if (currentAccount && registered) {
      login();
    } else {
      alert( "You are not the Land Inspector. Only Land Inspectors can access this page.");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "#F6F6F6",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography
            component="h1"
            variant="h4"
            fontWeight="bold"
            sx={{ mb: 2 }}
          >
            Land Inspector Login
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmitP}
            sx={{ mt: 4, width: "100%" }}
          >
            <InputLabel htmlFor="private-key" sx={{ color: "#000" }}>
              Enter your private key
            </InputLabel>
            <TextField
              margin="normal"
              required
              fullWidth
              type="password"
              id="private-key"
              label="Private Key"
              name="private-key"
              autoComplete="off"
              autoFocus
              value={privateKey}
              onChange={(e) => setPrivateKey(e.target.value)}
              sx={{ mb: 2 }}
              InputLabelProps={{
                style: { color: "#000" },
              }}
            />

            <ColorButton
              fullWidth
              variant="contained"
              sx={{ mb: 2, height: "50px" }}
              onClick={authenticateUser}
            >
              <PersonIcon sx={{ mr: 1 }} />
              Login with Private Key
            </ColorButton>
          </Box>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 4, width: "100%" }}
          >
            <ColorButton
              fullWidth
              variant="contained"
              sx={{ mb: 2, height: "50px" }}
              onClick={() => {
                connectWallet();
                handleSubmit();
              }}
            >
              Connect with MetaMask
            </ColorButton>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

const theme = createTheme();
const ColorButton = styled(Button)(({ theme }) => ({
  color: "#fff",
  backgroundColor: blue[500],
  "&:hover": {
    backgroundColor: blue[700],
  },
}));
