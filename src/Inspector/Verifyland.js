import React from "react";
import { makeStyles } from "@mui/styles";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useState, useEffect, useContext } from "react";
import { TransactionContext } from "../StateMangement/Context";
import { Link } from "react-router-dom";

const useStyles = makeStyles(() => ({
  verifyButton: {
    backgroundColor: "#4caf50", 
    color: "#fff", // White text
    
  },
  rejectButton: {
    backgroundColor: "#f44336", // Red color
    color: "#fff", // White text
   
  },
}));

export default function VerifyLand() {
  const classes = useStyles();
  const { contract } = useContext(TransactionContext);
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = users
    .filter((item) => !item.isLandRejected || item.isLandVerified)
    .slice(indexOfFirstPost, indexOfLastPost);

  useEffect(() => {
    const fetchLands = async () => {
      const allLand = await contract.ReturnAllLandList();
      const lands = await Promise.all(
        allLand.map(async (landId) => {
          const {
            ownerAddress,
            landAddress,
            physicalSurveyNumber,
            document,
            isLandVerified,
            id,
            landPrice,
            landpic,
          } = await contract.lands(landId);
          return {
            ownerAddress,
            landAddress,
            physicalSurveyNumber,
            document,
            isLandVerified,
            isLandRejected: false,
            landId: parseInt(id._hex),
            landPrice: parseInt(landPrice._hex) / 10 ** 18,
            landpic,
          };
        })
      );
      setUsers(lands);
      console.log("lands", lands)
    };

    contract && fetchLands();
  }, [contract]);

  const handleChange = (event, value) => {
    setCurrentPage(value);
  };

  const VerifyLand = async (id) => {
    const transaction = await contract.verifyLand(id, {
      gasLimit: 40000,
    });
    await transaction.wait();

    // Update the isLandVerified property in the users state object
    setUsers((prevUsers) =>
      prevUsers.map((user) => {
        if (user.landId === id) {
          return {
            ...user,
            isLandVerified: true,
          };
        }
        return user;
      })
    );

    alert("Land is verified");
  };

  const RejectLand = async (id) => {
    const transaction = await contract.rejectAndRemoveLand(id, {
      gasLimit: 900000, // increase the gas limit
    });
    await transaction.wait();

    // Update the isLandRejected property in the users state object
    setUsers((prevUsers) =>
      prevUsers.map((user) => {
        if (user.landId === id) {
          return {
            ...user,
            isLandRejected: true,
          };
        }
        return user;
      })
    );

    alert("Land is rejected");
  };

  return (
    <div className="table">
      <h1 style={{ textAlign: "center", fontSize: "30px", fontWeight: "bold", color: "#333", margin: "15px 0" }}>
        Verify Land
      </h1>
      <table>
        <thead>
          <tr className="table-heading">
            <th>#</th>
            <th>Location</th>
            <th>Price (Matic)</th>
            <th>Area Type</th>
            <th>Document</th>
            <th>Land Pic</th>
            <th>View Details</th>
            <th>Verify</th>
            <th>Rejected</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {currentPosts.map((data, index) => (
            <tr key={data.landId} className="table-data">
              <td>{index + 1}</td>
              <td>{data.landAddress}</td>
              <td>{String(data.landPrice).slice(0, 8)}</td>


              <td>{data.physicalSurveyNumber.slice(0,30)}</td>
              <td>
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={`https://gateway.pinata.cloud/ipfs/${data.document.substring(6)}`}
                >
                  View Doc
                </a>
              </td>
              <td>
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={`https://gateway.pinata.cloud/ipfs/${data.landpic.substring(6)}`}
                >
                  View Img.
                </a>
              </td>
              <td>
              <Link
                  
              
              to={`/landDetails?id=${data.landId}`}>
  GH-{data.landId}
</Link>

              </td>
              <td>
                <button
                  onClick={() => VerifyLand(data.landId)}
                  className={`btn verify-button ${data.isLandVerified ? "verified" : ""} ${classes.verifyButton}`}
                  disabled={data.isLandVerified || data.isLandRejected}
                >
                  {data.isLandVerified ? "Verified" : "Verify"}
                </button>
              </td>
              <td>
                <button
                  onClick={() => RejectLand(data.landId)}
                  className={`btn reject-button ${data.isLandRejected || data.isLandVerified ? "disabled" : ""} ${classes.rejectButton}`}
                  disabled={data.isLandRejected || data.isLandVerified}
                >
                  {data.isLandRejected ? "Rejected" : "Reject"}
                </button>
              </td>
              <td>
                <span
                  className={`status ${
                    data.isLandVerified
                      ? "verified"
                      : data.isLandRejected
                      ? "rejected"
                      : "pending"
                  }`}
                >
                  {data.isLandVerified
                    ? "Verified"
                    : data.isLandRejected
                    ? "Rejected"
                    : "Pending"}
                </span>
              </td>
             
            </tr>
          ))}
        </tbody>
      </table>
      <br></br>
      <br></br>
      <br></br>
      <Stack 
     
      
      spacing={2} className="Pagination">
        <Pagination
          count={Math.ceil(users.length / postsPerPage)}
          variant="outlined"
          shape="rounded"
          page={currentPage}
          onChange={handleChange}
        />
      </Stack>
    </div>
  );
}
