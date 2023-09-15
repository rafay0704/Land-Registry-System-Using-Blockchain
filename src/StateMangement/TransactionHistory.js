import React, { useState, useEffect, useMemo } from "react";

import axios from "axios";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { Interface } from "ethers/lib/utils";
import { ResponsivePie } from "@nivo/pie";

import contractABI from "../contract/landregistry.json";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Grid } from "@mui/material";

import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Link,
  Typography,
  Box,
  TextField,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocalGasStationOutlinedIcon from "@mui/icons-material/LocalGasStationOutlined";
import GridViewIcon from "@mui/icons-material/GridView";
const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [displayedTransactions, setDisplayedTransactions] = useState(5);

  const contractAddress = "0x3c71807786AA507f84D96C4F4a708FC0251cE1dC";
  // const contractAddress = "0x35f5d2F8aeC01C0026312F3C0dF882E477D86EEB"; // have alot of transactions
  const url = `https://mumbai.polygonscan.com/address/${contractAddress}`;

  // const contractInterface = new Interface(contractABI.abi);
  const contractInterface = useMemo(() => new Interface(contractABI.abi), []);

  useEffect(() => {
    const fetchData = async () => {
      const apiKey = "FIU86NTNKVJWR1J2XIU9RF3DC748NZRP5Z";
      const url = `https://api-testnet.polygonscan.com/api?module=account&action=txlist&address=${contractAddress}&startblock=0&endblock=99999999&sort=asc&apikey=${apiKey}`;
      const response = await axios.get(url);
      setTransactions(response.data.result);
    };

    fetchData();
  }, [contractAddress]);

  function formatRelativeTime(timestamp) {
    const now = new Date();
    const past = new Date(timestamp * 1000); // Convert the timestamp to milliseconds
    const diffInSeconds = Math.abs(now - past) / 1000;

    const days = Math.floor(diffInSeconds / 86400);
    const hours = Math.floor((diffInSeconds % 86400) / 3600);
    const minutes = Math.floor((diffInSeconds % 3600) / 60);

    let relativeTime = "";

    if (days > 0) {
      relativeTime += `${days} ${days > 1 ? "days" : "day"} `;
    }

    if (hours > 0) {
      relativeTime += `${hours} ${hours > 1 ? "hrs" : "hr"} `;
    }

    if (minutes > 0) {
      relativeTime += `${minutes} ${minutes > 1 ? "mins" : "min"} `;
    }

    relativeTime += "ago";

    return relativeTime;
  }

  const formatNumber = (number) => {
    return Number(number).toLocaleString();
  };

  // Sort transactions by timestamp (most recent first)
  const sortedTransactions = transactions.sort(
    (a, b) => b.timeStamp - a.timeStamp
  );

  // Add an index property to each transaction
  const indexedTransactions = sortedTransactions.map((tx, index) => ({
    ...tx,
    index: index + 1,
  }));

  const [searchValue, setSearchValue] = useState("");
  const [filteredTransactions, setFilteredTransactions] =
    useState(indexedTransactions);

  useEffect(() => {
    setFilteredTransactions(
      indexedTransactions.filter((tx) => {
        let methodName = "Contract Creation";
        if (tx.input !== "0x60606040") {
          try {
            const decodedData = contractInterface.parseTransaction({
              data: tx.input,
            });
            methodName = decodedData ? decodedData.name : "Unknown";
          } catch (error) {
            // console.error("Error decoding transaction data:", error);
          }
        }
        return (
          searchValue === "" ||
          tx.hash.includes(searchValue) ||
          tx.blockNumber.includes(searchValue) ||
          tx.from.includes(searchValue) ||
          tx.to.includes(searchValue) ||
          (tx.isError === "0" && "success".includes(searchValue)) ||
          (tx.isError !== "0" && "failed".includes(searchValue)) ||
          methodName.toLowerCase().includes(searchValue.toLowerCase()) // Method name search
        );
      })
    );
  }, [searchValue, indexedTransactions, contractInterface]);

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
    setDisplayedTransactions(5); // reset the displayedT
  };

  const getGasFeesData = () => {
    // Sort transactions by gas fees in descending order
    const sortedTransactions = filteredTransactions
      .slice()
      .sort((a, b) => b.gasUsed * b.gasPrice - a.gasUsed * a.gasPrice);

    // Return an array of objects containing the transaction index, gas fees, and gas price
    return sortedTransactions.map((tx) => ({
      index: tx.index,
      gasFees: (tx.gasUsed * tx.gasPrice) / 10 ** 18,
      gasPrice: tx.gasPrice / 10 ** 9,
    }));
  };
  const getTransactionStatusData = () => {
    const successfulTransactions = filteredTransactions.filter(
      (tx) => tx.isError === "0"
    ).length;
    const failedTransactions = filteredTransactions.filter(
      (tx) => tx.isError !== "0"
    ).length;

    return [
      {
        id: "Success",
        label: "Success",
        value: successfulTransactions,
        color: "#8BC34A",
      }, // light green color
      {
        id: "Failed",
        label: "Failed",
        value: failedTransactions,
        color: "#F44336",
      }, // light red color
    ];
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 1200, margin: "0 auto" }}>
      <Typography
        variant="h4"
        sx={{ mb: -35, fontWeight: "bold", color: "#3f51b5" }}
      >
       Transactions Analytics !
      </Typography>

      <Grid container justifyContent="center" alignItems="center" spacing={30}>

      
        <Grid item xs={12} md={6}>
          {/* Bar Chart */}
          <Box sx={{ height: 300, textAlign: "center" }}>
            <BarChart
              width={800}
              height={300}
              data={getGasFeesData()}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              barCategoryGap={20}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="index" stroke="#999" />
              <YAxis
                yAxisId="left"
                orientation="left"
                stroke="#999"
                label={{
                  value: "Gas Fees (MATIC)",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#999"
                label={{
                  value: "Gas Price (Gwei)",
                  angle: -90,
                  position: "insideRight",
                }}
              />
              <Tooltip
                formatter={(value, name) =>
                  name === "gasFees" ? `${value} MATIC` : `${value} Gwei`
                }
                labelFormatter={(value) => `Transaction #${value}`}
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "none",
                  borderRadius: "5px",
                }}
              />
              <Legend
                verticalAlign="top"
                wrapperStyle={{ paddingTop: "10px" }}
              />
              <Bar
                dataKey="gasFees"
                fill="#3f51b5"
                yAxisId="left"
                barSize={20}
              />
              <Bar
                dataKey="gasPrice"
                fill="#ff9800"
                yAxisId="right"
                barSize={20}
              />
            </BarChart>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          {/* ResponsivePie Chart */}
          <Box sx={{ height: 400, textAlign: "center" }}>
            <ResponsivePie
              data={getTransactionStatusData()}
              margin={{ top: 40, right: 40, bottom: 80, left: 20 }}
              innerRadius={0.5}
              padAngle={0.7}
              cornerRadius={3}
              activeOuterRadiusOffset={8}
              borderWidth={1}
              borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
              arcLinkLabelsSkipAngle={10}
              arcLinkLabelsTextColor="#333333"
              arcLinkLabelsThickness={2}
              arcLinkLabelsColor={{ from: "color" }}
              arcLabelsSkipAngle={10}
              arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
              arcLabelsTextStyle={{ fontSize: "40px", fontWeight: "bold" }} // increase the font size here
              colors={{ datum: "data.color" }}
              arcLabel={(d) =>
                ` ${((d.value / filteredTransactions.length) * 100).toFixed(
                  2
                )}%`
              }
              animate={true}
              motionConfig="wobbly"
            />
          </Box>
        </Grid>
      
      </Grid>

      <br></br>
      <Typography
        variant="h4"
        sx={{ mb: 2, fontWeight: "bold", color: "#3f51b5" }}
      >
        Contract Transactions!
      </Typography>
      <Typography variant="body1" sx={{ mb: 2, fontSize: "1.1rem" }}>
        Contract Address:{" "}
        <Link
          href={url}
          rel="noreferrer"
          target="_blank"
          underline="hover"
          sx={{ color: "#3f51b5" }}
        >
          {contractAddress}
        </Link>
      </Typography>
      <Box sx={{ my: 2 }}>
        <div style={{ display: "flex" }}>
          <TextField
            label="Search"
            variant="outlined"
            value={searchValue}
            onChange={handleSearchChange}
            fullWidth
            placeholder="Search by Tx Hash, Block, Status, From, To address, or Method Name"
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ mr: 1 }}
          />
          <Button
            onClick={() => setSearchValue("")} // This will clear the input field when the button is clicked
            variant="contained"
            style={{ marginLeft: "10px" }}
          >
            <CancelIcon />
          </Button>
        </div>
      </Box>
      <TableContainer
        component={Paper}
        sx={{
          overflowX: "auto",
          px: 3,
          py: 1,
          boxShadow:
            "rgba(0, 0, 0, 0.1) 0px 4px 6px, rgba(0, 0, 0, 0.1) 0px 1px 3px",
        }}
      >
        <Table size="small">
          <TableHead sx={{ bgcolor: "#3f51b5" }}>
            <TableRow>
              <TableCell
                sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}
              >
                Index
              </TableCell>

              <TableCell
                sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}
              >
                Txn Hash
              </TableCell>
              <TableCell
                sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}
              >
                Method
              </TableCell>

              <TableCell
                sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}
              >
                Block{" "}
                <GridViewIcon
                  sx={{ fontSize: "1.1rem", verticalAlign: "middle" }}
                />
              </TableCell>
              <TableCell
                sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}
              >
                Time Stamp{" "}
                <AccessTimeIcon
                  sx={{ fontSize: "1.1rem", verticalAlign: "middle" }}
                />
              </TableCell>
              <TableCell
                sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}
              >
                From
              </TableCell>
              <TableCell
                sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}
              >
                To
              </TableCell>
              <TableCell
                sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}
              >
                Gas{" "}
                <LocalGasStationOutlinedIcon
                  sx={{ fontSize: "1.1rem", verticalAlign: "middle" }}
                />
              </TableCell>

              <TableCell
                sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}
              >
                Status
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredTransactions
              .slice(0, displayedTransactions) // Add this line to limit the displayed transactions
              .map((tx) => {
                // Decode the input data to get the method name
                let methodName = "Contract Creation";
                if (tx.input !== "0x60606040") {
                  try {
                    const decodedData = contractInterface.parseTransaction({
                      data: tx.input,
                    });
                    methodName = decodedData ? decodedData.name : "Unknown";
                  } catch (error) {
                    // console.error("Error decoding transaction data:", error);
                  }
                }

                return (
                  <TableRow
                    key={tx.hash}
                    sx={{ "&:hover": { bgcolor: "#f5f5f5" } }}
                  >
                    <TableCell align="center">{tx.index}</TableCell>

                    <TableCell align="center">
                      <Link
                        href={`https://mumbai.polygonscan.com/tx/${tx.hash}`}
                        rel="noreferrer"
                        target="_blank"
                        sx={{
                          color: "#3f51b5",
                          textDecoration: "none",
                          fontWeight: "bold",
                          "&:hover": { textDecoration: "underline" },
                        }}
                      >
                        {tx.hash.slice(0, 10)}...
                      </Link>
                    </TableCell>
                    <TableCell align="center">{methodName}</TableCell>

                    <TableCell align="center">
                      {formatNumber(tx.blockNumber)}
                    </TableCell>

                    <TableCell align="center">
                      {formatRelativeTime(tx.timeStamp)}
                    </TableCell>

                    <TableCell align="center" sx={{ fontWeight: "medium" }}>
                      {tx.from.slice(0, 10)}...
                    </TableCell>

                    <TableCell align="center" sx={{ fontWeight: "medium" }}>
                      {tx.to.slice(0, 10)}...
                    </TableCell>

                    <TableCell align="center">
                      {/* {formatNumber((tx.gasUsed * tx.gasPrice) / 10 ** 18)}{" "}
                      MATIC ({formatNumber(tx.gasPrice / 10 ** 9)} Gwei) */}
                      ({formatNumber(tx.gasPrice / 10 ** 9)} Gwei)
                    </TableCell>

                    <TableCell align="center">
                      {tx.isError === "0" ? (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            color: "green",
                          }}
                        >
                          <CheckCircleIcon fontSize="small" />
                          <Box component="span" sx={{ ml: 0.5 }}>
                            Success
                          </Box>
                        </Box>
                      ) : (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            color: "red",
                          }}
                        >
                          <CancelIcon fontSize="small" />
                          <Box component="span" sx={{ ml: 0.5 }}>
                            Failed
                          </Box>
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <br></br>
      {displayedTransactions < indexedTransactions.length && (
        <Button
          variant="contained"
          sx={{
            mt: 2,
            display: "block",
            margin: "auto",
            backgroundColor: "#3f51b5",
            color: "white",
            "&:hover": {
              backgroundColor: "#1e3b8c",
            },
          }}
          onClick={() =>
            setDisplayedTransactions((prevDisplayed) =>
              Math.min(prevDisplayed + 5, indexedTransactions.length)
            )
          }
        >
          View More
        </Button>
      )}
      <br></br>
    </Box>
  );
};

export default TransactionHistory;
