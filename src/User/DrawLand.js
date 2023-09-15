// import "./styles.css";
import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import "mapbox-gl/dist/mapbox-gl.css";
import { Container, TextField, IconButton, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { TransactionContext } from "../StateMangement/Context";
import * as turf from "@turf/turf";
// import dotenv from "dotenv";
mapboxgl.accessToken =
  "pk.eyJ1IjoibW9oYWluYmFsdGkiLCJhIjoiY2xhNGE2ZWd0MHg4ZTNwbXpiN2Q3a2ZsYiJ9.2J8OizwcJnm4U0Idhsu5IA";

export default function App() {
  const { setCoordinates, setArea, setAddress, setFetchedDetails } =
    React.useContext(TransactionContext);

  const fetchAreaDetails = async (lng, lat) => {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?types=address&access_token=${mapboxgl.accessToken}`;

    try {
      const response = await fetch(url);

      if (response.ok) {
        const data = await response.json();

        if (data.features.length === 0) {
          throw new Error("No features found for the given coordinates");
        }

        const details = data.features[0].place_name || "";
        const road = data.features[0].address
          ? data.features[0].address + ", " + data.features[0].text
          : "";
        const city =
          data.features[0].context &&
          data.features[0].context.find((item) => item.id.includes("place"))
            ? data.features[0].context.find((item) => item.id.includes("place"))
                .text
            : "";
        const country =
          data.features[0].context &&
          data.features[0].context.find((item) => item.id.includes("country"))
            ? data.features[0].context.find((item) =>
                item.id.includes("country")
              ).text
            : "";
        const region =
          data.features[0].context &&
          data.features[0].context.find((item) => item.id.includes("region"))
            ? data.features[0].context.find((item) =>
                item.id.includes("region")
              ).text
            : "";
        const postalCode =
          data.features[0].context &&
          data.features[0].context.find((item) => item.id.includes("postcode"))
            ? data.features[0].context.find((item) =>
                item.id.includes("postcode")
              ).text
            : "";
        const maki = data.features[0].properties.maki || "";

        const combinedDetails = `${details}, ${road}, ${city}, ${country}, ${region}, ${postalCode}, ${maki}`;

        return combinedDetails;
      } 
    } catch (error) {
      console.error(error);
      return "Nothing fetched"; // Updated message
    }
  };

  useEffect(() => {
    if (!map.current) return;
    map.current.on("moveend", async () => {
      const center = map.current.getCenter();
      const details = await fetchAreaDetails(center.lng, center.lat);
      console.log(details);
    });
  });

  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(65);
  const [lat, setLat] = useState(30);
  const [zoom, setZoom] = useState(4);
  const [searchText, setSearchText] = useState("");
  const [polygon, setPolygon] = useState([]);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      // style: "mapbox://styles/mapbox/satellite-streets-v11",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
      height: "calc(50vh - 130px)",
      width: "50%",
    });
    map.current.on("moveend", async () => {
      const center = map.current.getCenter();
      const details = await fetchAreaDetails(center.lng, center.lat);
      console.log(details);
    });

    handleDraw();
  });

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on("move", () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });

  const handleSearch = () => {
    if (!searchText) return;
    fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        searchText
      )}.json?access_token=${mapboxgl.accessToken}`
    )
      .then((response) => response.json())
      .then((data) => {
        const [lng, lat] = data.features[0].center;
        map.current.setCenter([lng, lat]);
        map.current.setZoom(14);
      });
  };

  const handleDraw = () => {
    const draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true,
      },
    });

    map.current.addControl(draw);

    map.current.on("draw.create", async (e) => {
      // Get the area of the drawn polygon
      const area = turf.area(e.features[0]);
      const areaSqFt = area * 10.764; // Convert to square feet from squre meters

      // Convert square feet to marlas
      const areaMarla = areaSqFt / 225;

      // Set the area in marlas
      setArea(areaMarla.toFixed(2));

      // Get the address of the drawn polygon
      const [lng, lat] = e.features[0].geometry.coordinates[0][0];
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`
      );
      const data = await response.json();
      setAddress(data.features[0].place_name);

     

      // Get the area details
      const areaDetails = await fetchAreaDetails(lng, lat);
      setFetchedDetails(areaDetails); // Set fetched details in the context

      // Store the polygon coordinates in the context
      setPolygon(e.features[0].geometry.coordinates[0]);
    });

    map.current.on("draw.delete", () => {
      setPolygon([]);
    });
  };

  let coord = polygon.map((point) => point.join(",")).join(";");
  let coordinatesString = coord + "/" + zoom;
  return (
    <Container
      width={"300px"}
      sx={{
        mt: 2,
        mb: 4,
      }}
    >
      <div className="search-bar">
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <IconButton onClick={handleSearch}>
          <SearchIcon />
        </IconButton>
      </div>
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div
       style={{alignItems:"center", justifyContent:"center", margin:"20px 0 0 0"}}
      ref={mapContainer} className="map-container" />
      <Button 
          
      onClick={() => setCoordinates(coordinatesString)}>
        Click To Save Land Coordinates
      </Button>
    </Container>
  );
}
