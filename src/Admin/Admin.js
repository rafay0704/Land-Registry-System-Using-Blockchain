import React, { useEffect, useState, useContext } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { purple } from "@mui/material/colors";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { TextField } from "@mui/material";
import { ethers } from "ethers";
import InputLabel from "@mui/material/InputLabel";
import { TransactionContext } from "../StateMangement/Context";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import PersonIcon from "@mui/icons-material/Person";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

export default function Login() {
  const { connectWallet, currentAccount, contract } =
    useContext(TransactionContext);
  const [registered, setRegistered] = useState(false);
  const [privateKey, setPrivateKey] = useState("");

  useEffect(() => {
    const viewInspector = async () => {
      const registeredUser = await contract.isContractOwner(currentAccount);
      setRegistered(registeredUser);
    };

    if (contract && currentAccount) {
      viewInspector();
    }
  }, [contract, currentAccount]);

  const navigate = useNavigate();

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

  const login = () => {
    localStorage.setItem("Adminlogin", true);
    navigate("/dashboard");
  };

  const handleSubmitP = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const privateKey = data.get("key");
    setPrivateKey(privateKey);

    const account = ethers.Wallet.fromPrivateKey(privateKey);

    window.ethereum
      .request({
        method: "eth_accountsWalletAdd",
        params: [account.signingKey.address],
      })
      .then((result) => {
        console.log(`Account added: ${result}`);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const authenticateUser = async () => {
    try {
      const wallet = new ethers.Wallet(privateKey);
      const address = await wallet.getAddress();
      const isContractOwner = await contract.isContractOwner(address);

      if (isContractOwner) {
        localStorage.setItem("Adminlogin", true);
        navigate("/dashboard");
      } else {
        alert(
          "You are not the Contract Owner. Only Contract Owners can access this page."
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
      alert("You are not the Contract Owner. Only Contract Owners can access this page");
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
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOpenIcon />
          </Avatar>
          <Typography
            component="h1"
            variant="h4"
            fontWeight="bold"
            sx={{ mb: 2 }}
          >
            Contract Owner Login
          </Typography>
          <Box
            component="form"
            noValidate
            sx={{ mt: 4, width: "100%" }}
            onSubmit={handleSubmitP}
          >
            <InputLabel htmlFor="key">Enter your private key</InputLabel>
            <TextField
              margin="normal"
              required
              fullWidth
              id="key"
              label="Private Key"
              name="key"
              autoComplete="off"
              autoFocus
              type="password"
              value={privateKey}
              onChange={(e) => setPrivateKey(e.target.value)}
              sx={{ mb: 2 }}
              InputProps={{
                style: { color: "#000" },
              }}
              InputLabelProps={{
                style: { color: "#000" },
              }}
            />

            <Button
              fullWidth
              variant="contained"
              sx={{ mb: 2, height: "50px" }}
              onClick={authenticateUser}
            >
              <PersonIcon sx={{ mr: 1 }} />
              Login as Contract Owner
            </Button>
          </Box>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmitP}
            sx={{ mt: 4, width: "100%" }}
          >
            <ColorButton
              fullWidth
              variant="contained"
              sx={{ mb: 2, height: "50px" }}
              onClick={handleSubmit}
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
  color: theme.palette.getContrastText(purple[500]),
  backgroundColor: purple[500],
  "&:hover": { backgroundColor: purple[700] },
}));
