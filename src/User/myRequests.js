import { Button } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useState, useEffect, useContext } from "react";
import { TransactionContext } from "../StateMangement/Context";
import Payment from "./paymentModel";

export default function MyRequest() {
  const { contract, model, setModel } = useContext(TransactionContext);
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = users.slice(indexOfFirstPost, indexOfLastPost);

  useEffect(() => {
    const Lands = async () => {
      const allLand = await contract.mySentLandRequests();
      console.log(allLand);
      const users = await Promise.all(
        allLand.map(async (id) => {
          const {
            sellerId,
            buyerId,
            landId,
            reqId,
            buyerMessage, // Include the buyer's message
            requestStatus,
            isPaymentDone,
          } = await contract.LandRequestMapping(id);
          return {
            sellerId,
            buyerId,
            landId: parseInt(landId._hex),
            reqId: parseInt(reqId._hex),
            buyerMessage, // Include the buyer's message
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
          const landprice = await contract.landPrice(user.landId);

          return {
            ...user,
            landprice: parseInt(landprice._hex) / 10 ** 18,
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
  const truncate = (address, length) => {
    const start = address.substring(0, length);
    const end = address.substring(address.length - length);
    return `${start}...${end}`;
  };
  return (
    <div className="table">
      <table>
        <thead>
          <tr className="table-heading">
            <th>#</th>
            <th>Land Id</th>
            <th>Seller Address</th>
            <th>Message</th>
            <th>Status</th>
            <th>Make Payments </th>
          </tr>
        </thead>
        {currentPosts.map((data, index) => {
          return (
            <>
              <tbody>
                <tr key={data.id} className="table-data">
                  <td>{index}</td>
                  <td>GH-{data.landId}</td>
                  <td>{truncate(data.sellerId, 8)}</td>
                  <td>{data.buyerMessage} </td>

                  <td>{requeststatus[data.requestStatus]}</td>
                  <td>
                    <Button
                      variant="contained"
                      color="success"
                      fontSize={"10px"}
                      disabled={data.requestStatus !== 1}
                      onClick={() => {
                        setModel(true);
                        const dataToStore = {
                          landId: data.landId,
                          sellerId: data.sellerId,
                          price: data.landprice,
                          reqId: data.reqId,
                          buyerId: data.buyerId,
                        };

                        localStorage.setItem(
                          "land",
                          JSON.stringify(dataToStore)
                        );
                      }}
                    >
                      Pay Amount
                    </Button>
                  </td>
                </tr>
                {model && <Payment />}
              </tbody>
              
            </>
          );
        })}
      </table>
      <br></br>
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
        <br></br>
      </Stack>
    </div>
  );
}
