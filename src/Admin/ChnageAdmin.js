import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { TransactionContext } from "../StateMangement/Context";
import { useContext } from "react";

const theme = createTheme({
  palette: {
    primary: {
      main: "#0066CC",
    },
    secondary: {
      main: "#F44336",
    },
  },
});

export default function AddLandInspector() {
  const { contract } = useContext(TransactionContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    event.preventDefault();
    if (data.get("address")) {
      const transaction = await contract.changeContractOwner(
        data.get("address"),
        { gasLimit: 1000000 }
      );
      await transaction.wait();

      toast.success("Transaction successful!");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xl">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h4">
            Change Owner of Contract
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 4, minWidth: "40%" }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="given-address"
                  type="string"
                  name="address"
                  required
                  fullWidth
                  id="address"
                  label="Wallet Address"
                  autoFocus
                  sx={{ width: "100%" }}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 4, mb: 2 }}
            >
              Submit
            </Button>
            <div>
              <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={true}
                newestOnTop={true}
                closeOnClick={true}
                rtl={false}
                pauseOnFocusLoss={false}
                draggable={true}
                pauseOnHover={true}
              />
            </div>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
