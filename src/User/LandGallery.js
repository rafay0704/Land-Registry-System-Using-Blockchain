import React, { useContext, useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { TransactionContext } from "../StateMangement/Context";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import VerifiedIcon from "@mui/icons-material/Verified";
import TextField from "@mui/material/TextField";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

export default function MyLand() {
  const { contract, currentAccount, pkr, matic } =
    useContext(TransactionContext);
  const [lands, setLands] = useState([]);
  const [hasBuyRequestSent, setHasBuyRequestSent] = useState({});

  const [buyerMessages, setBuyerMessages] = useState({});

  useEffect(() => {
    const fetchLands = async () => {
      const landcount = await contract.landsCount();
      const count = parseInt(landcount._hex);
      const allLand = [];
      for (let i = 0; i < count; i++) {
        allLand[i] = i + 1; // set each element to i + 1
      }

      const land = await Promise.all(
        allLand.map(async (landId) => {
          const {
            ownerAddress,
            landAddress,
            physicalSurveyNumber,
            document,
            isLandVerified,
            id,
            isforSell,
            landPrice,
            landpic,
            allLatitudeLongitude,
            area,
          } = await contract.lands(landId);

          return {
            ownerAddress,
            landAddress,
            physicalSurveyNumber,
            document,
            landpic,
            isLandVerified,
            id: parseInt(id._hex),
            isforSell,
            landPrice: parseInt(landPrice._hex) / 10 ** 18 ,
            allLatitudeLongitude,
            area: parseInt(area._hex),
          };
        })
      );

      setLands(land);

      const buyRequestStatus = await Promise.all(
        allLand.map(async (landId) => {
          const hasSent = await contract.userLandRequestSent(
            currentAccount,
            landId
          );
          return { [landId]: hasSent };
        })
      );

      const buyRequestStatusObject = buyRequestStatus.reduce(
        (obj, status) => ({ ...obj, ...status }),
        {}
      );

      setHasBuyRequestSent(buyRequestStatusObject);
    };

    if (contract) {
      fetchLands();
    }
  }, [contract, currentAccount]);

  const BuyLand = async (id) => {
    const land = lands.find((item) => item.id === id);
    if (land.ownerAddress.toLowerCase() === currentAccount.toLowerCase()) {
      alert("You are the Owner of this Land");
      return;
    }
    if (!land.isforSell) {
      setHasBuyRequestSent({ ...hasBuyRequestSent, [id]: true });
      alert("This land is not for sale.");
      return;
    }
    const hasSent = await contract.userLandRequestSent(currentAccount, id);
    setHasBuyRequestSent({ ...hasBuyRequestSent, [id]: hasSent });
    if (hasSent) {
      alert("You have already sent a buy request for this land.");
      return;
    }
    await contract.requestforBuy(id, buyerMessages[id] || ""); // Use buyerMessages[id] if it exists, otherwise use an empty string
  };

  const handleBuyerMessageChange = (id, value) => {
    if (value.length <= 20) {
      setBuyerMessages({ ...buyerMessages, [id]: value });
    }
    // setBuyerMessage(value);
  };

  const truncateAddress = (address) => {
    const addressLength = 25;

    if (address.length <= addressLength) {
      return address;
    } else {
      const truncatedAddress = `${address.slice(0, addressLength - 3)}...`;
      return truncatedAddress;
    }
  };

  return (
    <Container
      style={{ margin: "5px 0 0 0" }}
      maxWidth="lg"
      sx={{ mt: 4, mb: 4 }}
    >
      <Grid container spacing={2}>
        {lands
             .filter((item) => item.isforSell) // Filter lands that are for sale
        .map((item) => {
          const { landAddress, landpic, area, isLandVerified, id, landPrice } =
            item;
          const remainingCharacters = 20 - (buyerMessages[id] || "").length;

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
                <div
                  className="Land-container"
                  style={{
                    flexGrow: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={`https://gateway.pinata.cloud/ipfs/${landpic.substring(
                      6
                    )}`}
                    alt="land pic"
                    className="myLand"
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                      marginBottom: "16px",
                    }}
                  />
                </div>
                <div className="Land-details" style={{ margin: "0 0 0 2px" }}>
                  <Typography
                    component="p"
                    variant="h5"
                    style={{
                      marginBottom: "8px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {isLandVerified ? (
                      <VerifiedIcon
                        style={{ color: "skyblue", marginRight: "18px" }}
                      />
                    ) : (
                      "Not Verified"
                    )}{" "}
                    GH-{id}
                    <SquareFootIcon
                      style={{ marginLeft: "20px", color: "red" }}
                    />{" "}
                    {`${area.toString().substring(0, 5)}`} Marla
                  </Typography>
                  <Typography
                    component="p"
                    variant="h6"
                    style={{
                      marginBottom: "8px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <LocationOnIcon
                      style={{ marginRight: "8px", color: "green" }}
                    />
                    {truncateAddress(landAddress)}
                  </Typography>
                  <Typography
                    component="p"
                    variant="h6"
                    style={{
                      marginBottom: "8px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <AttachMoneyIcon
                      style={{ marginRight: "8px", color: "plum" }}
                    />
                    {Math.round(landPrice * matic * pkr)} Rupees/-
                  </Typography>
                </div>
                <TextField
                  label="Make an Offer"
                  variant="outlined"
                  value={buyerMessages[id] || ""}
                  onChange={(e) => handleBuyerMessageChange(id, e.target.value)}
                  style={{ margin: "0 0 5px 10px", width: "95%" }}
                  disabled={hasBuyRequestSent[id]}
                />
                {remainingCharacters >= 0 && (
                  <Typography
                    style={{ margin: "0 0 5px 10px" }}
                    variant="caption"
                  >
                    {remainingCharacters} Character(s) Remaining
                  </Typography>
                )}

                <Grid
                  container
                  justifyContent="space-between"
                  alignItems="center"
                  gap="4px"
                  style={{ marginBottom: "8px" }}
                >
                  <Button
                    style={{ margin: "0 0 0 8px" }}
                    onClick={() => BuyLand(id)}
                    variant="contained"
                    color={
                      item.ownerAddress.toLowerCase() ===
                      currentAccount.toLowerCase()
                        ? "primary"
                        : "success"
                    }
                    disabled={
                      item.ownerAddress.toLowerCase() ===
                        currentAccount.toLowerCase() ||
                      (item.ownerAddress.toLowerCase() !==
                        currentAccount.toLowerCase() &&
                        hasBuyRequestSent[id])
                    }
                  >
                    {item.ownerAddress.toLowerCase() ===
                    currentAccount.toLowerCase()
                      ? "Your Land"
                      : hasBuyRequestSent[id]
                      ? "Requested"
                      : buyerMessages[id]
                      ? "Done Offer"
                      : "Buy Land"}
                  </Button>

                  <Button
                    style={{ margin: "0 8px 0 0" }}
                    variant="contained"
                    color="warning"
                  >
                    <Link
                      style={{ color: "white" }}
                      to={"/landDetails"}
                      onClick={() => {
                        const dataToStore = { data: lands, id: id };
                        localStorage.setItem(
                          "landId",
                          JSON.stringify(dataToStore)
                        );
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
