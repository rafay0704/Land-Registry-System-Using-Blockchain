import * as React from "react";
import Grid from "@mui/material/Grid";
import { useState } from "react";
import { Button, Paper, Typography } from "@mui/material";
import Profiledetail from "./profiledetail";
import { useEffect } from "react";
import stopCapture from "./pdfDocument";
import { TransactionContext } from "../StateMangement/Context";
import axios from "axios";

const Transfer = () => {
  const storedData1 = localStorage?.getItem("TransferInfo");
  const parsedData1 = JSON.parse(storedData1);
  console.log(parsedData1.sellerId);
  const insp = parsedData1.currentAccount;

  const { contract } = React.useContext(TransactionContext);
  const [users, setUsers] = useState([]);
  const [witness, setWitness] = useState({ name: "", address: "" });
  const [land, setLand] = useState([]);
  const [imgbSeller, setByteSeller] = useState([]);
  const [imgbBuyer, setByteBuyer] = useState([]);
  const [imgbWitness, setByteWitness] = useState([]);

  const [camera1, setCamera1] = useState(null);
  const [camera2, setCamera2] = useState(null);
  const [camera3, setCamera3] = useState(null);
  const [doc, setDoc] = useState("");
  const [loading, setLoading] = useState(true);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setWitness({ ...witness, [name]: value });
  };

  useEffect(() => {
    const viewAllUser = async () => {
      const users = await Promise.all(
        [parsedData1.sellerId, parsedData1.buyerId].map(async (address) => {
          const { name, city, age, isUserVerified, cinc, document, email } =
            await contract.UserMapping(address);
          return {
            address,
            name,
            city,
            age: parseInt(age._hex),
            isUserVerified,
            cinc,
            document,
            email,
          };
        })
      );

      setUsers(users);
    };
    const landInfo = async () => {
      const land = await Promise.all(
        [1].map(async (landId) => {
          const {
            ownerAddress,
            landAddress,
            physicalSurveyNumber,
            document,
            id,
            landPrice,
            propertyPID,
            area,
            landpic,
          } = await contract.lands(parsedData1?.landId);
          return {
            ownerAddress,
            landAddress,
            physicalSurveyNumber,
            document,
            propertyPID: parseInt(propertyPID._hex),
            id: parseInt(id._hex),
            landPrice: parseInt(landPrice._hex) / 10 ** 18,
            area: parseInt(area._hex),
            landpic,
          };
        })
      );

      setLand(land);
    };

    contract && viewAllUser() && landInfo();
  }, [
    contract,
    parsedData1.buyerId,
    parsedData1?.landId,
    parsedData1.sellerId,
  ]);
  console.log(users, land);

  useEffect(() => {
    const getCameraStreams = async () => {
      try {
        const stream1 = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        setCamera1(stream1);

        const stream2 = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        setCamera2(stream2);

        const stream3 = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        setCamera3(stream3);
      } catch (err) {
        console.error(err);
      }
    };

    getCameraStreams();
  }, []);

  const pf = async (pdfBytes) => {
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const formData = new FormData();
    formData.append("file", new Blob([pdfBytes], { type: "application/pdf" }));

    const urlb = URL.createObjectURL(blob);
    console.log("url", urlb);
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
    const ImgHash = `ipfs://${resFile.data.IpfsHash}`;
    setDoc(ImgHash);
    console.log("has", ImgHash);
    return ImgHash;
  };

  const handleTransfer = async (id, url) => {
    console.log("url id", url, id);
    const pp = await stopCapture(
      imgbSeller,
      imgbBuyer,
      imgbWitness,
      witness,
      users,
      insp,
      land
    );
    const url1 = await pf(pp);
    console.log("url1", url1);
    try {
      console.log("transferred doc", id, url1);

      await contract.transferOwnership(id, url1, {
        gasLimit: 200000,
      });

      setLoading(false);
    } catch (error) {
      console.error("Error during transfer:", error);
      setLoading(true);
    }
  };

  return (
    <Grid
      container
      spacing={3}
      direction="row"
      justifyContent="center"
      alignItems="center"
    >
      
      <Grid item xs={6}>
        <Profiledetail
          setByte={setByteSeller}
          stream={camera1}
          profile={users[0]}
          title={"Seller Profile"}
        />
      </Grid>
      <Grid item xs={6}>
        <Profiledetail
          setByte={setByteBuyer}
          stream={camera2}
          profile={users[1]}
          title={"Buyer Profile"}
        />
      </Grid>
      <Grid item xs={6}>
        <Profiledetail
          setByte={setByteWitness}
          stream={camera3}
          handleInputChange={handleInputChange}
          witness={witness}
          title={"Witness"}
        />
      </Grid>
      <Grid item xs={6}>
        <Grid
          container
          spacing={3}
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <Grid item xs={12}>
            <Typography variant="h6" color="primary">
              Land Information
            </Typography>
          </Grid>
          {land.map((item) => (
            <Grid item xs={4} key={item.id}>
              <Paper>
                <Typography>Owner: {item.ownerAddress}</Typography>
                <Typography>Address: {item.landAddress}</Typography>
                <Typography>Area: {item.area}</Typography>
                <Typography>Price: {item.landPrice} Matic</Typography>
                <Typography>Property ID: {item.propertyPID}</Typography>
                <Typography>
                  Area Detail: {item.physicalSurveyNumber}
                </Typography>
                <Typography style={{ fontWeight: "bold", fontSize: "12pt" }}>
                  <a
                    style={{ margin: "20px 20px 20px 50px" }}
                    href={`https://gateway.pinata.cloud/ipfs/${item.document?.substring(
                      6
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View Land Document
                  </a>
                  <a
                    href={`https://gateway.pinata.cloud/ipfs/${item.landpic?.substring(
                      6
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View Land Image
                  </a>
                </Typography>
                <Typography></Typography>
              </Paper>
            </Grid>
          ))}
          {!loading && (
            <Grid item xs={12}>
              <Button variant="contained" color="#00C49F">
                <a
                  href={`https://gateway.pinata.cloud/ipfs/${doc?.substring(
                    6
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  View Transferred Document
                </a>
              </Button>
            </Grid>
          )}
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              disabled={!loading}
              onClick={() => handleTransfer(parsedData1?.reqId, doc)}
            >
              Transfer
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Transfer;
