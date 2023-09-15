import { Button } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { TransactionContext } from "../StateMangement/Context";

export default function RecivedRequest() {
  const { contract, currentAccount } = useContext(TransactionContext);
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = users.slice(indexOfFirstPost, indexOfLastPost);

  useEffect(() => {
    const fetchRequests = async () => {
      const landCount = await contract.requestCount();
      const count = parseInt(landCount._hex);
      const allLand = Array.from({ length: count }, (_, i) => i + 1);
      const users = await Promise.all(
        allLand.map(async (id) => {
          const {
            sellerId,
            buyerId,
            landId,
            reqId,
            requestStatus,
            isPaymentDone,
            document,
          } = await contract.LandRequestMapping(id);
          return {
            sellerId,
            buyerId,
            landId: parseInt(landId._hex),
            reqId: parseInt(reqId._hex),
            requestStatus,
            isPaymentDone,
            document,
          };
        })
      );
      const getStatus = async (landId) => {
        const status = await contract.requesteStatus(landId);
        return status;
      };
      const documnt = async (landId) => {
        const doc = await contract.lands(landId);
        return doc;
      };
      const usersWithStatus = await Promise.all(
        users.map(async (user) => {
          const status = await getStatus(user.landId);
          const { document } = await documnt(user.landId);

          return {
            ...user,
            status,
            document,
          };
        })
      );
      const filteredLands = usersWithStatus.filter(
        (land) => land.requestStatus === 3 || land.requestStatus === 4
      );
      setUsers(filteredLands);
    };
    contract && fetchRequests();
  }, [contract]);

  const handleChange = (event, value) => {
    setCurrentPage(value);
  };

  const requestStatus = {
    0: "Pending",
    1: "Accepted",
    2: "Rejected",
    3: "Payment Done",
    4: "Completed",
  };

  const truncateID = (id) => {
    const prefix = id.substring(0, 6);
    const suffix = id.substring(id.length - 4);
    return `${prefix}...${suffix}`;
  };

  return (
    <div className="table">
      <h1
        style={{
          textAlign: "center",
          fontSize: "30px",
          fontWeight: "bold",
          color: "#333",
          margin: "15px 0",
        }}
      >
        Transfer Ownership
      </h1>

      <table>
        <thead>
          <tr className="table-heading">
            <th>#</th>
            <th>Land Id</th>
            <th>Seller Address</th>
            <th>Buyer Address</th>
            <th>Status</th>
            <th>Transfer</th>
            <th>Transferred Document</th>
          </tr>
        </thead>
        <tbody>
          {currentPosts.map((data, index) => (
            <tr key={index} className="table-data">
              <td>{index + 1}</td>
              <td>GH-{data.landId}</td>
              <td>{truncateID(data.sellerId)}</td>
              <td>{truncateID(data.buyerId)}</td>
              <td>{requestStatus[data.requestStatus]}</td>
              <td>
                <Button
                  variant="contained"
                  fontSize={"10px"}
                  disabled={data.requestStatus === 4}
                  sx={{
                    backgroundColor: "#ff5722", // Custom button background color
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#f44336", // Custom hover background color
                    },
                  }}
                  onClick={() => {
                    const dataToStore = {
                      sellerId: data.sellerId,
                      buyerId: data.buyerId,
                      landId: data.landId,
                      currentAccount,
                      reqId: data.reqId,
                    };
                    localStorage.setItem(
                      "TransferInfo",
                      JSON.stringify(dataToStore)
                    );
                  }}
                >
                  <Link to={"/Transfer"} sx={{ color: "white" }}>
                    {data.requestStatus === 4 ? "Modified" : "Transfer"}
                  </Link>
                </Button>
              </td>
              <td>
                {data.requestStatus === 4 ? (
                  <a
                    href={`https://gateway.pinata.cloud/ipfs/${data.document.substring(
                      6
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {data.landId}
                  </a>
                ) : (
                  "Not Transferred"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <br></br>
      <br></br>
      <Stack spacing={2} className="Pagination">
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
