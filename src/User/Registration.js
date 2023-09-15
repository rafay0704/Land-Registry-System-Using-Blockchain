import React, { useContext, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { TransactionContext } from "../StateMangement/Context";
import axios from "axios";

const theme = createTheme({
  palette: {
    primary: {
      main: "#3f51b5",
    },
    secondary: {
      main: "#f50057",
    },
  },
});

export default function Registration() {
  const { currentAccount, contract } = useContext(TransactionContext);
  let navigate = useNavigate();
  console.warn("reg", currentAccount);

  const [nameValid, setNameValid] = useState(true);
  const [ageValid, setAgeValid] = useState(true);
  const [cnicValid, setCnicValid] = useState(true);
  const [cityValid, setCityValid] = useState(true);
  const [emailValid, setEmailValid] = useState(true);
  const [docValid, setDocValid] = useState(true);
  const [profilePicValid, setProfilePicValid] = useState(true);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
  
    // Validate input based on its name
    switch (name) {
      case "name":
        setNameValid(value.length > 0);
        break;
      case "age":
        setAgeValid(value.length <= 3 && !isNaN(value));
        break;
      case "cnic":
        setCnicValid(value.length === 14);
        break;
      case "city":
        setCityValid(value.length > 0);
        break;
      case "email":
        setEmailValid(/^\S+@\S+\.\S+$/.test(value));
        break;
      case "doc":
        const docFile = event.target.files[0];
        if (docFile) {
          const isImageOrPdf =
            docFile.type.startsWith("image/") || docFile.type === "application/pdf";
          const isSizeValid = docFile.size <= 2 * 1024 * 1024; // 2MB limit
          setDocValid(isImageOrPdf && isSizeValid);
        }
        break;
      case "profilePic":
        const profilePicFile = event.target.files[0];
        if (profilePicFile) {
          const isImage = profilePicFile.type.startsWith("image/");
          const isSizeValid = profilePicFile.size <= 2 * 1024 * 1024; // 2MB limit
          setProfilePicValid(isImage && isSizeValid);
        }
        break;
      default:
        break;
    }
  };
  

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log(data.get("doc"));

    if (
      nameValid &&
      ageValid &&
      cnicValid &&
      cityValid &&
      emailValid &&
      docValid &&
      profilePicValid
    ) {
      const formData = new FormData();
      formData.append("file", data.get("doc"));

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
      console.log("sejwle", resFile);

      const ImgHash = `ipfs://${resFile.data.IpfsHash}`;

      const formData1 = new FormData();
      formData1.append("file", data.get("profilePic"));

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
      console.log("sejwle", resFile1);

      const profilePic = `ipfs://${resFile1.data.IpfsHash}`;

      const transaction = await contract.registerUser(
        data.get("name"),
        data.get("age"),
        data.get("city"),
        data.get("cnic"),
        ImgHash,
        profilePic,
        data.get("email"),
        { gasLimit: 1000000 }
      );

      await transaction.wait();

      alert("Successfully Registered, Wait for Verification!");
      navigate("/user-dashboard");
    } else {
      alert("Please fill in all fields correctly.");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: theme.palette.secondary.main }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Buyer/Seller Registration
          </Typography>
          
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="given-name"
                  name="name"
                  required
                  fullWidth
                  id="name"
                  label="Name"
                  autoFocus
                  inputProps={{
                    maxLength: 20,
                  }}
                  error={!nameValid}
                  helperText={!nameValid && "Please enter a name."}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-age"
                  name="age"
                  type="number"
                  required
                  fullWidth
                  id="age"
                  label="Age"
                  autoFocus
                  error={!ageValid}
                  helperText={!ageValid && "Please enter a valid age."}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-Cnic"
                  name="cnic"
                  type="string"
                  required
                  fullWidth
                  id="cnic"
                  label="CNIC"
                  autoFocus
                  inputProps={{
                    maxLength: 14,
                  }}
                  error={!cnicValid}
                  helperText={!cnicValid && "Please enter a valid CNIC number."}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  autoComplete="city"
                  name="city"
                  required
                  fullWidth
                  type="string"
                  id="city"
                  label="City"
                  autoFocus
                  inputProps={{
                    maxLength: 15,
                  }}
                  error={!cityValid}
                  helperText={!cityValid && "Please enter a city."}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  error={!emailValid}
                  helperText={!emailValid && "Please enter a valid email address."}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-profilePic"
                  name="profilePic"
                  type="file"
                  required
                  fullWidth
                  id="profilePic"
                  autoFocus
                  inputProps={{
                    accept: "image/*",
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  label="Upload Profile Image"
                  onChange={handleInputChange}
                  error={!profilePicValid}
                  helperText={!profilePicValid && "Only Image can upload (max size 2MB)"}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-document"
                  name="doc"
                  type="file"
                  required
                  fullWidth
                  id="doc"
                  autoFocus
                  inputProps={{
                    accept: "image/*,application/pdf",
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  label="Upload ID Card"
                  onChange={handleInputChange}
                  error={!docValid}
                  helperText={!docValid && "Only Image / PDF can upload (max size 2MB)."}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                backgroundColor: theme.palette.primary.main,
                color: "#fff",
              }}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
