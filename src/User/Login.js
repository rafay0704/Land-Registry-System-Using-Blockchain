import React, { useEffect, useState, useContext } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { TextField, InputLabel } from "@mui/material";
import { teal } from "@mui/material/colors";
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
  const { connectWallet, currentAccount, contract, provider } =
    useContext(TransactionContext);
  const [registered, setRegistered] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false); // Add state for button disabled

  useEffect(() => {
    const viewInspector = async () => {
      const resgisterduser = await contract.isUserRegistered(currentAccount);
      setRegistered(resgisterduser);
    };
    contract && viewInspector();
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
    localStorage.setItem("Userlogin", true);
    navigate("/user-dashboard");
  };

  const handleSubmitP = (event) => {
    event.preventDefault();

    // Add the private key to MetaMask's accounts
    const data = new FormData(event.currentTarget);
    const privateKey = data.get("key");
    if (privateKey) {
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
          }
        }
      );
    }
  };

  const handleSubmit = async () => {
    if (currentAccount && !registered) {
      navigate("/registration");
    } else if (currentAccount && registered && !isLoggingIn) {
      setIsLoggingIn(true); // Disable login button
      login();
      try {
        const signer = provider.getSigner();
        const account = await signer.getAddress();

        // Check if the current account matches the private key entered by the user
        const data = new FormData(document.getElementById("private-key-form"));
        const privateKey = data.get("private-key");
        const wallet = new ethers.Wallet(privateKey);
        if (account === wallet.address) {
          localStorage.setItem("Userlogin", true);
          navigate("/user-dashboard");
        } else {
          alert(
            "Private key does not match current account. Please try again."
          );
        }
      } catch (error) {
        console.error(error);
      }
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
            Buyer/Seller Login
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 4, width: 500, maxWidth: "100%" }}
            id="private-key-form"
          >
            <InputLabel htmlFor="private-key">
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
            />
            <ColorButton
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mb: 2, height: "50px" }}
              disabled={isLoggingIn} // Pass disabled prop to button
            >
              Login With Private Key
            </ColorButton>
          </Box>

          <Box
            component="form"
            noValidate
            onSubmit={handleSubmitP}
            sx={{ mt: 4, width: 500, maxWidth: "100%" }}
          >
            <ColorButton
              fullWidth
              variant="contained"
              sx={{ mb: 2, height: "50px" }}
              onClick={() => {
                connectWallet();
                handleSubmit();
              }}
              disabled={isLoggingIn} // Pass disabled prop to button
            >
              Connect MetaMask Wallet
            </ColorButton>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

const theme = createTheme();
const ColorButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(teal[500]),
  backgroundColor: teal[500],
  "&:hover": {
    backgroundColor: teal[700],
  },
}));
