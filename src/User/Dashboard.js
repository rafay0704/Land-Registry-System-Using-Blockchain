import React, { useState, useEffect, useContext } from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import VerifiedIcon from "@mui/icons-material/Verified";
import GppMaybeIcon from "@mui/icons-material/GppMaybe";

import { TransactionContext } from "../StateMangement/Context";

export default function Profile() {
  const { contract, currentAccount } = useContext(TransactionContext);
  const [profile, setProfile] = useState([]);

  useEffect(() => {
    const viewProfile = async () => {
      const user = await contract.UserMapping(currentAccount);
      const structuredData = {
        name: user.name,
        age: parseInt(user.age._hex),
        city: user.city,
        cinc: user.cinc,
        email: user.email,
        profilePic: user.profilePic,
        isUserVerified: user.isUserVerified,
        document: user.document,
        address: user.id,
      };

      setProfile(structuredData);
    };

    contract && viewProfile();
  }, [contract, currentAccount]);

  return (
    <Container
      maxWidth="md"
      sx={{
        mt: 2,
        mb: 4,
      }}
    >
      <Typography
         style = {{textAlign:"center"}}
      variant="h4" sx={{ mb: 3 }}>
        My Profile
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "120px",
              padding: 2,
              border: "1px solid #ccc",
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Profile Picture
            </Typography>
            <div
              style={{
                width: "150px",
                height: "150px",
                borderRadius: "50%",
                overflow: "hidden",
                backgroundColor: "#f1f1f1",
                boxShadow: "0 0 5px rgba(0, 0, 0, 0.3)",
              }}
            >
              <img
                src={
                  profile.profilePic &&
                  `https://gateway.pinata.cloud/ipfs/${profile.profilePic.substring(
                    6
                  )}`
                }
                alt="profile"
                style={{
                  objectFit: "cover",
                  width: "100%",
                  height: "100%",
                }}
              />
            </div>

            <Typography
              sx={{
                color: profile.isUserVerified ? "green" : "red",
                mt: 2,
                display: "flex",
                alignItems: "center",
              }}
            >
              {profile.isUserVerified ? (
                <>
                  <VerifiedIcon sx={{ height: 20, width: 20 }} />
                  <span style={{ marginLeft: 5, fontSize: 14 }}>Verified</span>
                </>
              ) : (
                <>
                  <GppMaybeIcon sx={{ height: 20, width: 20 }} />
                  <span style={{ marginLeft: 5, fontSize: 14 }}>
                    Not Verified
                  </span>
                </>
              )}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Personal Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle1">Wallet Address:</Typography>
                <Typography>{profile.address}</Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Name:</Typography>
                <Typography>{profile.name}</Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Age:</Typography>
                <Typography>{profile.age}</Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">CNIC:</Typography>
                <Typography>{profile.cinc}</Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">City:</Typography>
                <Typography>{profile.city}</Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Email:</Typography>
                <Typography>{profile.email}</Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Document:</Typography>
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={`https://gateway.pinata.cloud/ipfs/${profile?.document?.substring(
                    6
                  )}`}
                  style={{
                    color: "#1976d2",
                    textDecoration: "none",
                    fontWeight: "bold",
                  }}
                >
                  View Document
                </a>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
