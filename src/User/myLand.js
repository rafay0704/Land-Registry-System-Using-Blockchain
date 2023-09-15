import * as React from "react";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { TransactionContext } from "../StateMangement/Context";
import { useContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import UnpublishedIcon from "@mui/icons-material/Unpublished";
import MapIcon from "@mui/icons-material/Map";
import WhereToVoteIcon from "@mui/icons-material/WhereToVote";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

export default function MyLand() {
  const { contract, currentAccount, pkr, matic } =
    useContext(TransactionContext);
  const [user, setUsers] = useState([]);

  console.log(contract);

  const cancelLandSale = async (id) => {
    await contract.cancelLandSale(id);
  };

  useEffect(() => {
    const Lands = async () => {
      const allLand = await contract.myAllLands(currentAccount);
      console.log(allLand);
      const users = await Promise.all(
        allLand.map(async (landId) => {
          const {
            ownerAddress,
            landAddress,
            physicalSurveyNumber,
            document,
            landpic,
            isLandVerified,
            id,
            isforSell,
            allLatitudeLongitude,
            area,
            landPrice,
          } = await contract.lands(landId);
          return {
            ownerAddress,
            landAddress,
            physicalSurveyNumber,
            document,
            landpic,
            area: parseInt(area._hex),
            isLandVerified,
            landPrice: parseInt(landPrice._hex) / 10 ** 18,
            id: parseInt(id._hex),
            isforSell,
            allLatitudeLongitude,
          };
        })
      );

      const filteredUsers = users.filter((item) => !item.isLandRejected); // only include lands that are not rejected
      setUsers(filteredUsers);
    };
    contract && Lands();
  }, [contract, currentAccount]);

  console.log("myland", user);
  
  const sellLand = async (id) => {
    await contract.makeItforSell(id);

    // set sale date in local storage
    const date = new Date().toISOString();
    localStorage.setItem(`land_${id}_saleDate`, date);
  };
  const truncateAddress = (address) => {
    const addressLength = 20; // Set the desired length of the address

    if (address.length <= addressLength) {
      return address;
    } else {
      const truncatedAddress = `${address.slice(0, addressLength - 3)}...`;
      return truncatedAddress;
    }
  };

  return (
    <Container style={{ margin: "5px 0 0 0" }} maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={2}>
        {user.map((item) => {
          const {
            //ownerAddress,
            landAddress,
            landPrice,
            //physicalSurveyNumber,
            document,
            area,
            landpic,
            isLandVerified,
            id,
            isforSell,
          } = item;

          return (
            <Grid item xs={12} md={6} lg={4} key={id}>
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "100%",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div className="Land-container" style={{ flexGrow: 1, justifyContent: "center", alignItems: "center" }}>
                  <img
                    src={`https://gateway.pinata.cloud/ipfs/${landpic.substring(6)}`}
                    alt="../images/land1.jpg"
                    className="myLand"
                    style={{
                      width: "100%",
                      height: "200px", // Set the desired height for the image
                      objectFit: "cover", // Maintain the aspect ratio and crop if necessary
                      marginBottom: "16px",
                    }}
                  />
                  </div>
                <div style= {{margin:"10px 0 0 0"}}>

                <Typography component="p" variant="h5" style={{ marginBottom: "8px"}}>
                    
                GH-{id}
                    <SquareFootIcon  style={{ marginLeft: "25px" ,color: "red"}} />  {`${area.toString().substring(0, 5)}`} Marla
                  </Typography>
                  <Typography component="p" variant="h5" style={{ marginBottom: "8px"}}>
                  <LocationOnIcon style={{ marginRight: "8px" , color : "green"}} />
                    {truncateAddress(landAddress)}
                  </Typography>
                  <Typography component="p" variant="h5" style={{ marginBottom: "8px"}}>
                  <AttachMoneyIcon style={{ marginRight: "8px", color: "plum" }} /> Rs: {Math.round(landPrice * matic * pkr)}/-
                
                  <a

                    style={{fontSize:"10pt", margin:"0 0 0 10px"}}
                  target="_blank"
                  rel="noreferrer"
                  href={`https://gateway.pinata.cloud/ipfs/${document.substring(6)}`}
                >
                  View Document
                </a>
                  </Typography>
                </div>
                   
                
                

                <Grid display={"flex"} justifyContent="space-between" alignItems={"center"} gap="4px">
                  {item.isforSell && (
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => {
                        cancelLandSale(item.id);
                      }}
                    >
                      Cancel 
                    </Button>
                  )}
                   {isLandVerified ? (
                        <Button
                          onClick={() => {
                            if (isforSell) {
                              // The land is already on sale
                              alert("The land is already on sale.");
                            } else {
                              // The land is verified and not on sale yet
                              sellLand(id);
                            }
                          }}
                          variant="contained"
                          color={isforSell ? "secondary" : "success"}
                          startIcon={isforSell ? <WhereToVoteIcon /> : <MapIcon />}
                        >
                          {isforSell ? "Put" : "Sell"}
                        </Button>
                      ) : (
                        <UnpublishedIcon /> // not verified icon
                      )}   

                  <Button variant="contained"
                  color= "warning">
                    <Link
                    style={{color:"white"}}
                      to={"/landDetails"}
                      onClick={() => {
                        const dataToStore = { data: user, id: id };

                        localStorage.setItem("landId", JSON.stringify(dataToStore));
                      }}
                    >
                       Details
                    </Link>
                  </Button>
                </Grid>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
}
