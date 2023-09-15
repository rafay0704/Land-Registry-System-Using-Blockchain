import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useState, useEffect, useContext } from "react";
import { TransactionContext } from "../StateMangement/Context";
import { TextField } from "@mui/material";

export default function VerifyUser() {
  const { contract } = useContext(TransactionContext);
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.age.toString().includes(searchQuery) ||
      user.cinc.toString().includes(searchQuery)
  );

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredUsers.slice(indexOfFirstPost, indexOfLastPost);

  useEffect(() => {
    const viewAllUser = async () => {
      const userAddresses = await contract.ReturnAllUserList();
      const users = await Promise.all(
        userAddresses.map(async (address) => {
          const {
            name,
            city,
            age,
            isUserVerified,
            cinc,
            profilePic,
            document,
          } = await contract.UserMapping(address);
          return {
            address,
            name,
            city,
            age: parseInt(age._hex),
            isUserVerified,
            cinc,
            profilePic,
            document,
          };
        })
      );

      setUsers(
        users.map((user) => ({
          ...user,
          status: user.isUserVerified ? "Verified" : "Pending",
        }))
      );
    };
    contract && viewAllUser();
  }, [contract]);

  const handleChange = (event, value) => {
    setCurrentPage(value);
  };

  const verify = async (address) => {
    console.log(address);
    const transaction = await contract.verifyUser(address, {
      gasLimit: 1000000,
    });
    await transaction.wait();
    console.log("Transaction is done");
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.address === address
          ? { ...user, isUserVerified: true, status: "Verified" }
          : user
      )
    );
  };

  const reject = async (address) => {
    console.log(address);
    const transaction = await contract.rejectUser(address, {
      gasLimit: 1000000,
    });
    await transaction.wait();
    console.log("Transaction is done");
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.address === address ? { ...user, status: "Rejected" } : user
      )
    );
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const truncateAddress = (address) => {
    const prefix = address.substring(0, 6);
    const suffix = address.substring(address.length - 4);
    return `${prefix}...${suffix}`;
  };

  return (
    <div className="table">
      <h1 style={{ textAlign: "center", fontSize: "30px", fontWeight: "bold", color: "#333", margin: "10px 0" }}>
  Verify User
</h1>
      <br />
      <TextField
        id="outlined-search"
        label="Search by name, city, age, or cinc"
        type="search"
        variant="outlined"
        size="small"
        value={searchQuery}
        onChange={handleSearch}
      />

      <table>
        <thead>
          <tr className="table-heading">
            <th>#</th>
            <th>Owner address</th>
            <th>Name</th>
            <th>Cnic</th>
            <th>Age</th>
            <th>City</th>
            <th>Profile Pic</th>
            <th>Documents</th>
            <th>Verify</th>
            <th>Reject</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {currentPosts.map((data, index) => {
            return (
              <tr key={data.id} className="table-data">
                <td>{index}</td>
                <td>{truncateAddress(data.address)}</td>
                <td>{data.name}</td>
                <td>{data.cinc}</td>
                <td>{data.age}</td>
                <td>{data.city}</td>
                <td>
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={`https://gateway.pinata.cloud/ipfs/${data?.profilePic?.substring(
                      6
                    )}`}
                  >
                    View Picture
                  </a>
                </td>
                <td>
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={`https://gateway.pinata.cloud/ipfs/${data?.document?.substring(
                      6
                    )}`}
                  >
                    View Document
                  </a>
                </td>
                <td>
                  <button
                    onClick={() => verify(data.address)}
                    className={"btn verify-button"}
                    disabled={data.status !== "Pending"}
                  >
                    {data.status === "Verified" ? "Verified" : "Verify"}
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => reject(data.address)}
                    className={"btn verify-button"}
                    disabled={data.status !== "Pending"}
                  >
                    {data.status === "Rejected" ? "Rejected" : "Reject"}
                  </button>
                </td>
                <td>
                  <span
                    className={
                      data.status === "Verified"
                        ? "status-verified"
                        : data.status === "Rejected"
                        ? "status-rejected"
                        : "status-pending"
                    }
                  >
                    {data.status}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Stack spacing={2} className="Pagination">
        <Pagination
          count={Math.ceil(filteredUsers.length / postsPerPage)}
          variant="outlined"
          shape="rounded"
          page={currentPage}
          onChange={handleChange}
        />
      </Stack>
    </div>
  );
}
