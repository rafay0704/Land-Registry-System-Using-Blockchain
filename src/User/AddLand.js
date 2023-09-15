import React, { useState } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "react-toastify/dist/ReactToastify.css";
import { TransactionContext } from "../StateMangement/Context";
import axios from "axios";
import { ethers } from "ethers";
import DrawLand from "./DrawLand";
import { useEffect } from "react";
const theme = createTheme();

export default function AddLand() {
  const {
    contract,
    currentAccount,
    modelMap,
    setModelMap,
    coordinates,
    pkr,
    matic,
    area,
    address,
    fetchedDetails,
    setFetchedDetails,
  } = React.useContext(TransactionContext);

  const [profile, setProfile] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  
  const validateForm = (data) => {
    const newValidationErrors = {};
    if (!data.get("pid") || data.get("pid").length === 0 || data.get("pid").length > 5) {
      newValidationErrors.pid = "Property ID is required and should not exceed 5 characters.";
    }
  
    if (!data.get("price") || Number(data.get("price")) <= 0) {
      newValidationErrors.price = "Land price is required and must be greater than 0";
    }
  
    if (!data.get("svno") || data.get("svno") === "Nothing fetched") {
      newValidationErrors.svno = "Please manually enter area details (i.e postal , land type, etc).";
    }
  
    if (Number(data.get("area")) === 0) {
      newValidationErrors.area = "Area of land should be greater than 0.";
    } else {
      delete newValidationErrors.area;
    }
  
    if (!data.get("address")) {
      newValidationErrors.address = "Please Add Land";
    }
  
    if (data.get("landpic")) {
      const landpicFile = data.get("landpic");
      if (landpicFile.size === 0) {
        newValidationErrors.landpic = "Land Picture is required";
      } else if (landpicFile.size > 2 * 1024 * 1024) {
        newValidationErrors.landpic = "Land Picture size should not exceed 2MB";
      } else if (!landpicFile.type.includes("image")) {
        newValidationErrors.landpic = "Only image files are allowed for Land Picture";
      }
    }
  
    if (data.get("document")) {
      const documentFile = data.get("document");
      if (documentFile.size === 0) {
        newValidationErrors.document = "Land Document is required";
      } else if (documentFile.size > 2 * 1024 * 1024) {
        newValidationErrors.document = "Land Document size should not exceed 2MB";
      } else if (!documentFile.type.includes("image") && !documentFile.type.includes("pdf")) {
        newValidationErrors.document = "Only image and PDF files are allowed for Land Document";
      }
    }
  
    setValidationErrors(newValidationErrors);
    return Object.keys(newValidationErrors).length === 0;
  };
  

  useEffect(() => {
    const viewProfile = async () => {
      const user = await contract.UserMapping(currentAccount);
      const structuredData = {
        isUserVerified: user.isUserVerified,
        sellerName: user.name, // Set sellerName here
        sellerEmail: user.email, // Set sellerEmail here
      };
      setProfile(structuredData);
    };
    contract && viewProfile();
  }, [contract, currentAccount]);
  console.log(profile);
  useEffect(() => {
    const svnoField = document.getElementById("svno");
    if (svnoField) {
      svnoField.value = fetchedDetails;
    }
  }, [fetchedDetails]);

  console.log(matic);
  const handleSubmit = async (event) => {
    console.log("handleSubmit called"); // Add this line
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log(data.get("pid"));
    if (!validateForm(data)) {
      alert("Please fill in all the required fields."); // Show an error toast
      return;
    }

    if (
      data.get("pid") &&
      data.get("svno") &&
      data.get("area") &&
      data.get("price") &&
      data.get("address") &&
      data.get("area") &&
      coordinates &&
      data.get("document") &&
      data.get("landpic")
    ) {
      console.log(coordinates);

      const priceMatic = data.get("price") / pkr / matic;
     
      const integerPart = Math.floor(priceMatic * 10 ** 18).toString();
      
      const landamount = ethers.BigNumber.from(integerPart);

      console.log("price" , priceMatic , landamount , integerPart )
      // const landPriceInWei = ethers.utils.parseUnits(priceMatic.toString(), "wei");

      // const landamount = Math.round(priceMatic);
      const formData = new FormData();
      formData.append("file", data.get("document"));
      const formData1 = new FormData();
      formData1.append("file", data.get("landpic"));
      console.log(formData1);

      const resFile = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data: formData,
        headers: {
          pinata_api_key: `f9d21f34a273685f089d`,
          pinata_secret_api_key: `8ee776d5033f79cb1ed56ded8b82d467f81971c3da3bbf9642499e685cb394c7`,
          "Content-Type": "multipart/form-data",
        },
      });

      const resFile1 = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data: formData1,
        headers: {
          pinata_api_key: `f9d21f34a273685f089d`,
          pinata_secret_api_key: `8ee776d5033f79cb1ed56ded8b82d467f81971c3da3bbf9642499e685cb394c7`,
          "Content-Type": "multipart/form-data",
        },
      });
      const ImgHash = `ipfs://${resFile.data.IpfsHash}`;
      const ImgHash1 = `ipfs://${resFile1.data.IpfsHash}`;

      const transaction = await contract.addLand(
        data.get("area"),
        data.get("address"),
        landamount,
        coordinates,
        data.get("pid"),
        data.get("svno"),
        ImgHash,
        ImgHash1,

        { gasLimit: 1000000 }
      );
      await transaction.wait();
      // Clear all the fields after successful submission
    event.target.reset();
    setFetchedDetails("");
    setValidationErrors({});
    }
  };
 
  
  
  const handleInputChange = (event) => {
    const data = new FormData(event.currentTarget.form);
    validateForm(data);
  };
  

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xm" className="landregistration">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          display="flex"
          back
        >
          <Typography   style={{margin:"0 0 10px 0"}} component="h1" variant="h5">
        Register 📍 Your Land 🗺️
          </Typography>
        

          <form noValidate onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
            <Grid container spacing={2} justifyContent="center" alignItems="center">
            <Grid item xs={6} md={3}>
          <TextField
            autoComplete="Price"
            name="price"
            type="number"
            required
            fullWidth
            id="price"
            label="Land Price"
            autoFocus
            inputProps={{
              maxLength: 5,
            }}
            error={validationErrors.price}
            helperText={validationErrors.price}
            onChange={handleInputChange} // New
          />
        </Grid>

        <Grid item xs={6} md={3}>
        <TextField
                  autoComplete="Pid"
                  name="pid"
                  required
                  fullWidth
                  type="number"
                  id="pid"
                  label="Property ID"
                  autoFocus
                  error={validationErrors.pid}
                  helperText={validationErrors.pid}
                  onChange={handleInputChange} // New
                  inputProps={{
                    maxLength: 5,
                  }}
                />
              </Grid>
              <Grid item xs={6} md={3}>
                <TextField
                  autoComplete="off"
                  name="area"
                  fullWidth
                  id="area"
                  label="Area of Land in Marla"
                  type="string"
                  value={Math.round(area)}
                  readOnly
                  error={validationErrors.area}
            helperText={validationErrors.area}
            onChange={handleInputChange} // New
                />
              </Grid>

              <Grid item xs={6} md={3}>
              <TextField
  name="svno"
  required
  fullWidth
  type="string"
  id="svno"
  label="Area Details"
  autoFocus
  value={fetchedDetails}
  onChange={(event) => {
    setFetchedDetails(event.target.value);
    handleInputChange(event); // Call handleInputChange as well
  }}
  error={validationErrors.svno}
  helperText={validationErrors.svno}
/>

        </Grid>

              <Grid item xs={6} md={3}>
                <TextField
                  autoComplete="given-landpic"
                  name="landpic"
                  type="file"
                  required
                  fullWidth
                  id="landpic"
                  autoFocus
                  inputProps={{
                    accept: "image/*",
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  label="Upload Land Image"
                  error={Boolean(validationErrors.landpic)} // Updated
helperText={validationErrors.landpic} // Updated

                  onChange={handleInputChange} // New
                />
              </Grid>

              <Grid item xs={6} md={3}>
                <TextField
                  autoComplete="given-document"
                  name="document"
                  type="file"
                  required
                  fullWidth
                  id="document"
                  autoFocus
                  inputProps={{
                    accept: "image/*,application/pdf",
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  label="Upload Land Document"
                  error={Boolean(validationErrors.document)} // Updated
                  helperText={validationErrors.document} // 
                  onChange={handleInputChange} // New
                />
              </Grid>

             
              <Grid item xs={12} md={6}>

                <TextField
                  autoComplete="off"
                  name="address"
                  type="string"
                  fullWidth
                  id="address"
                  label="Address of Land"
                  value={address}
                  readOnly
                  error={validationErrors.address}
            helperText={validationErrors.address}
            onChange={handleInputChange} // New
                />
              </Grid>

              <Grid item xs={6} md={3}>
                <>
                  <Button
                    type="link"
                    fullWidth
                    variant=""
                    sx={{ mt: 1, mb: 2 }}
                    onClick={() => setModelMap(true)}
                  >
                    Add location
                  </Button>
                </>
              </Grid>

              {modelMap && <DrawLand />}

              <Grid 
                      
              
              item xs={6} md={3}>
                {profile.isUserVerified ? (
                  <Button
                  
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 1, mb: 2 }}
                    onSubmit={(event) => handleSubmit(event)} // Change this line
                  >
                    Add Land
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 1, mb: 2 }}
                    disabled
                  >
                    You'r not Verified
                  </Button>
                )}
              </Grid>
            </Grid>
          </form>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
