import "./styles.css";
import React, { useRef, useEffect, useState, useContext } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import "mapbox-gl/dist/mapbox-gl.css";
import { TextField, Button, Typography, Grid } from "@mui/material";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { TransactionContext } from "../StateMangement/Context";
import { ethers } from "ethers";
import { Box } from "@mui/system";
mapboxgl.accessToken =
  "pk.eyJ1IjoibW9oYWluYmFsdGkiLCJhIjoiY2xhNGE2ZWd0MHg4ZTNwbXpiN2Q3a2ZsYiJ9.2J8OizwcJnm4U0Idhsu5IA";
export default function LandDetails() {
  const { contract, currentAccount, pkr, matic } =
    useContext(TransactionContext);
  const [price, setPrice] = useState("");

  const storedData1 = localStorage?.getItem("landId");
  const parsedData1 = JSON.parse(storedData1);
  const filterlan = parsedData1?.data?.filter(
    (item) => item.id === parsedData1.id
  );
  console.log(filterlan);
  const c_zoom = filterlan[0].allLatitudeLongitude.split("/");
  console.log(c_zoom[0]);

  console.log(
    "filterlan[0].allLatitudeLongitude:",
    filterlan[0].allLatitudeLongitude
  );
  console.log("filterlan:", filterlan);

  const coordsArray = filterlan[0].allLatitudeLongitude
    ?.split(";")
    .map((pair) => {
      const [longitude, latitude] = pair.split(",");
      return [Number(longitude), Number(latitude)];
    });

  console.log(coordsArray);

  console.log("filterlan:", filterlan);
  console.log(
    "Seller Name:",
    filterlan[0]?.sellerName,
    "Seller Email:",
    filterlan[0]?.sellerEmail
  );

  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(coordsArray?.[0]?.[0] || 0);
  const [lat, setLat] = useState(coordsArray?.[0]?.[1] || 0);
  const [zoom, setZoom] = useState(c_zoom[1]);
  //const [draw, setDraw] = useState(null);

  const [saleDate, setSaleDate] = useState(null); //  new
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("landId"));
    const id = data?.id;
    const date = localStorage.getItem(`land_${id}_saleDate`);
    setSaleDate(date ? new Date(Date.parse(date)) : null);
  }, []); //new

  useEffect(() => {
    if (map.current) return; // initialize map only once
    console.log("lng:", lng, "lat:", lat); // Add this line to print out the lng and lat values
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      // style: "mapbox://styles/mapbox/streets-v11",
      style: "mapbox://styles/mapbox/satellite-streets-v11",

      center: [lng, lat],
      zoom: zoom,
      height: "calc(50vh - 130px)",
      width: "400px",
    });

// Streets: "mapbox://styles/mapbox/streets-v11"
// Outdoors: "mapbox://styles/mapbox/outdoors-v11"
// Light: "mapbox://styles/mapbox/light-v10"
// Dark: "mapbox://styles/mapbox/dark-v10"
// Satellite: "mapbox://styles/mapbox/satellite-v9"
// Satellite with Streets: "mapbox://styles/mapbox/satellite-streets-v11"
// Navigation Preview Day: "mapbox://styles/mapbox/navigation-preview-day-v4"
// Navigation Preview Night: "mapbox://styles/mapbox/navigation-preview-night-v4"
// Navigation Guidance Day: "mapbox://styles/mapbox/navigation-guidance-day-v4"
// Navigation Guidance Night: "mapbox://styles/mapbox/navigation-guidance-night-v4"
    // Initialize the Mapbox Draw plugin
    const draw = new MapboxDraw({
      displayControlsDefault: false,
    });

    map.current.addControl(draw);

    draw.add({
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [coordsArray],
      },
    });

    //setDraw(draw);
  }, [coordsArray, lat, lng, zoom]);

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on("move", () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const data = new FormData(event.currentTarget);
      if (data.get("price")) {
        console.log(data.get("price"));

        const priceMatic = data.get("price") / pkr / matic;

        // const landamount = Math.round(priceMatic);


        const integerPart = Math.floor(priceMatic* 10 ** 18).toString();
        // const integerPart = Math.floor(priceMatic * 10 ** 18).toString();
      
          const landamount = ethers.BigNumber.from(integerPart);
              console.log("amount", integerPart , landamount )

        const transaction = await contract.chnageLandPrice(
          filterlan[0].id,
          landamount,


          
          { gasLimit: 1000000 }
        );

        await transaction.wait();
        console.log("amount", integerPart , landamount )
        alert("Price is Chnaged");
      }
    } catch (error) {
      alert("Price is Locked due to Request Accepted or Payment Done!");
    }
  };

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const Lands = async () => {
      try {
        //const allLand = await contract.myReceivedLandRequests();
        const arr = [0];
        const users = await Promise.all(
          arr.map(async (id) => {
            const {
              sellerId,
              buyerId,
              landId,
              reqId,
              requestStatus,
              isPaymentDone,
            } = await contract.LandRequestMapping(filterlan[0]?.id);
            return {
              sellerId,
              buyerId,
              landId: parseInt(landId._hex),
              reqId: parseInt(reqId._hex),
              requestStatus,
              isPaymentDone,
            };
          })
        );

        const getStatus = async (landId) => {
          const status = await contract.requesteStatus(landId);
          return status;
        };

        const usersWithStatus = await Promise.all(
          users.map(async (user) => {
            const status = await getStatus(user.landId);
            return {
              ...user,
              status,
            };
          })
        );
        if (usersWithStatus) {
          setUsers(usersWithStatus);
        }
      } catch (error) {
        setUsers({ reqId: 0 });
      }
    };

    contract && Lands();
  }, [contract, filterlan]);

  console.log("user", users);

  console.log(
    users[0]?.requestStatus === 1 &&
      users[0]?.sellerId === filterlan[0]?.ownerAddress
  );

  return (
    <div>
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", height: "100vh" }}>
  <Typography
    style={{ textAlign: "center", fontWeight: "bold", color: "teal" }}
    fontSize={"2rem"}
  >
    {" "}
    MAP View{" "}
  </Typography>
  <div style={{ width: "60%", fontSize: "15pt", textAlign: "center" }} className="sidebar">
    Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
  </div>
  <div
  style={{
    width: "90%",
    textAlign: "center",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
    backgroundColor: "teal",
  }}
  ref={mapContainer}
  className="map-container"
/>


</div>


      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
        <Typography
    style={{ textAlign: "center", fontWeight: "bold", color: "#F9844A" }}
    fontSize={"2rem"}
  >
    {" "}
    Image{" "}
  </Typography>
          <div
            className="Land-container"
            style={{
              flexGrow: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src={`https://gateway.pinata.cloud/ipfs/${filterlan[0]?.landpic.substring(
                6
              )}`}
              alt="wewe"
              className="myLand"
              style={{
                width: "100%",
                height: "auto",
                marginBottom: "16px",
              }}
            />
          </div>
        </Grid>

        <Grid item xs={12} md={6}>
        <Typography
    style={{  fontWeight: "bold", color: "#0088FE" , margin:"0 0 px 0" }}
    fontSize={"2rem"}
  >
   Details
  </Typography>
          <Box display="flex" flexDirection="column">
            <Box display="flex" marginBottom="8px">
              <Typography>Sell Date:</Typography>
              {saleDate ? (
                <Typography>{new Date(saleDate).toLocaleString()}</Typography>
              ) : (
                <Typography>Land is not yet put for sale.</Typography>
              )}
            </Box>

            <Box display="flex" marginBottom="8px">
              <Typography>Owner Address:</Typography>
              <Typography>{filterlan[0]?.ownerAddress}</Typography>
            </Box>
            <Box display="flex" marginBottom="8px">
              <Typography>Land Id:</Typography>
              <Typography>GH- {filterlan[0]?.id}</Typography>
            </Box>

            <Box display="flex" marginBottom="8px">
              <Typography>Land Address:</Typography>
              <Typography>{filterlan[0]?.landAddress}</Typography>
            </Box>

            <Box display="flex" marginBottom="8px">
              <Typography>Land Price:</Typography>
              <Typography>{filterlan[0]?.landPrice} Matic</Typography>
            </Box>
            <Box display="flex" marginBottom="8px">
              <Typography>Area Detail:</Typography>
              <Typography>{filterlan[0]?.physicalSurveyNumber}</Typography>
            </Box>

            <Box display="flex" marginBottom="8px">
              <Typography>Area: </Typography>
              <Typography>{filterlan[0]?.area} Marla</Typography>
            </Box>

            {currentAccount === filterlan[0].ownerAddress.toLowerCase() && (
              <Box
                margin="0 0 0 0 "
                style={{ justifyContent: "center", alignItem: "center" }}
              >
                <Typography
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    color: "teal",
                    fontSize: "15pt",
                    margin: "0 0 15px 0",
                  }}
                >
                  Change Land Price:
                </Typography>
                <form noValidate onSubmit={handleSubmit}>
                  <TextField
                    autoComplete="Price"
                    name="price"
                    type="number"
                    required
                    maxLength = {5}
                    
                    style={{ width: "40%" }}
                    id="price"
                    label="Land Price"
                    autoFocus
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />

                  <Button
                    style={{ width: "30%", margin: "10px 0 0 20px" }}
                    type="submit"
                    fullWidth
                    variant="contained"
                    // disabled={users.some(
                    //   (user) =>
                    //     user.requestStatus === 1 &&
                    //     user.sellerId === filterlan[0].ownerAddress
                    // )}
                    sx={{ mt: 1, mb: 2 }}
                  >
                    Submit
                  </Button>
                </form>
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}

