import { Button } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useState, useEffect, useContext } from "react";
import { TransactionContext } from "../StateMangement/Context";

export default function RecivedRequest() {
  const { contract } = useContext(TransactionContext);
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = users.slice(indexOfFirstPost, indexOfLastPost);

  useEffect(() => {
    const Lands = async () => {
      const allLand = await contract.myReceivedLandRequests();
      const myrequest = await contract.LandRequestMapping(2);
      console.log("all", myrequest);

      const users = await Promise.all(
        allLand.map(async (id) => {
          const {
            sellerId,
            buyerId,
            landId,
            reqId,
            buyerMessage,
            requestStatus,
            isPaymentDone,
          } = await contract.LandRequestMapping(id);
          
          return {
            sellerId,
            buyerId,
            landId: parseInt(landId._hex),
            reqId: parseInt(reqId._hex),
            buyerMessage,
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

      setUsers(usersWithStatus);
    };

    contract && Lands();
  }, [contract]);

  console.log("user", users);

  const handleChange = (event, value) => {
    setCurrentPage(value);
  };

  const requeststatus = {
    0: "Pending",
    1: "Accepted",
    2: "Rejected",
    3: "Payment Done",
    4: "Transferred",
  };

  const Accepted = async (id) => {
    console.log(id);
    await contract.acceptRequest(id, {
      gasLimit: 100000,
    });
  };

  const Cancel = async (id) => {
    console.log(id);
    await contract.rejectRequest(id, {
      gasLimit: 100000,
    });
  };

 

  const truncate = (address, length) => {
    const start = address.substring(0, length);
    const end = address.substring(address.length - length);
    return `${start}...${end}`;
  };

  return (
    <div className="table">
      <table>
        <thead>
          <tr 
          
          className="table-heading">
            <th>#</th>
            <th>Land Id</th>
            <th>Buyer Address</th>
            <th>Buyer Message</th>
            <th>Status</th>
            <th>Payment Done</th>
                <th>Accept</th>
            <th>Cancel</th>
          </tr>
        </thead>
        <tbody>
          {currentPosts.map((data, index) => (
            <tr key={index} className="table-data">
              <td>{index}</td>
              <td>GH-{data.landId}</td>
              <td>{truncate(data.buyerId, 6)}</td>
              <td>{data.buyerMessage}</td>
              <td>{requeststatus[data.requestStatus]}</td>
              <td>{data.isPaymentDone ? "Paid" : "Not Paid"}</td>
             
              <td>
                <Button
                  variant="outlined"
                  color="success"
                  fontSize={"10px"}
                  disabled={data.requestStatus !== 0}
                  onClick={() => Accepted(data.reqId)}
                >
                  Accept
                </Button>
              </td>
              <td>
                <Button
                  variant="outlined"
                  color="warning"
                  fontSize={"10px"}
                  disabled={
                    data.requestStatus === 2 || data.isPaymentDone
                  }
                  onClick={() => Cancel(data.reqId)}
                >
                  Cancel
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <br />
      <br />
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
