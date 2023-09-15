import React, { useContext } from "react";
import { ToastContainer } from "react-toastify";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { TransactionContext } from "../StateMangement/Context";

const theme = createTheme();

export default function AddLandInspector() {
  const { contract } = useContext(TransactionContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    if (
      data.get("desg") &&
      data.get("address") &&
      data.get("city") &&
      data.get("name") &&
      data.get("age") &&
      data.get("cnic")
    ) {
      const transaction = await contract.addLandInspector(
        data.get("address"),
        data.get("name"),
        data.get("cnic"),
        data.get("age"),
        data.get("city"),
        data.get("desg"),
        { gasLimit: 1000000 }
      );
      await transaction.wait();

      alert("Transaction is done");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container component="main" maxWidth="xs">
        <Box sx={{ marginTop: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Typography variant="h4" component="h1" sx={{ textAlign: "center", fontWeight: "bold", color: "#333", marginBottom: 2 }}>
            Add Land Inspectors
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
              
              <TextField
                  autoComplete="given-name"
                  name="name"
                  required
                  fullWidth
                  id="name"
                  label="Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                
                <TextField
                  autoComplete="off"
                  name="age"
                  type="number"
                  required
                  fullWidth
                  id="age"
                  label="Age"
                  autoFocus
                />
              </Grid>
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
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  autoComplete="given-Cnic"
                  name="cnic"
                  type="number"
                  required
                  fullWidth
                  id="cnic"
                  label="CNIC"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  autoComplete="given-city"
                  name="city"
                  required
                  fullWidth
                  type="string"
                  id="city"
                  label="City"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="desg"
                  label="Designation"
                  name="desg"
                  autoComplete="Designation"
                />
              </Grid>
            </Grid>
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Submit
            </Button>
            <ToastContainer />
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
