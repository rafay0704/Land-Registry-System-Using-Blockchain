import { useState, useEffect, useContext } from "react";
import { TransactionContext } from "../StateMangement/Context";
import { Pagination, TextField, Box, Grid } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export default function UserCount() {
  const { contract } = useContext(TransactionContext);
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const viewAllUser = async () => {
      const userAddresses = await contract.ReturnAllUserList();
      const users = await Promise.all(
        userAddresses.map(async (address) => {
          const { name, city, age, isUserVerified, cinc, profilePic, document } = await contract.UserMapping(address);
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

      setUsers(users.map((user) => ({ ...user, status: user.isUserVerified ? "Verified" : "Pending" })));
    };
    contract && viewAllUser();
  }, [contract]);

  const handleChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.age.toString().includes(searchQuery) ||
      user.cinc.toString().includes(searchQuery)
  );

  const statusCounts = {
    Verified: 0,
    Pending: 0,
  };

  filteredUsers.forEach((user) => {
    statusCounts[user.status]++;
  });

  const pieChartData = Object.keys(statusCounts).map((status) => ({
    name: status,
    value: statusCounts[status],
  }));

  const pieChartColors = ["#8884d8", "#82ca9d"];

  return (
    <Box p={2}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            id="outlined-search"
            label="Search by name, city, age, or cinc"
            type="search"
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={handleSearch}
            fullWidth
          />
        </Grid>
        <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={users}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="age" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </Grid>
       
        <Grid item xs={12} sm={6}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                label={(entry) => entry.name}
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={index} fill={pieChartColors[index % pieChartColors.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Grid>
      </Grid>
       </Grid>
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
            <th>Status</th>
           
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((data, index) => (
            <tr key={data.id} className="table-data">
              <td>{index + 1}</td>
              <td>{data.address}</td>
              <td>{data.name}</td>
              <td>{data.cinc}</td>
              <td>{data.age}</td>
              <td>{data.city}</td>
              <td>
                <a target="_blank" rel="noreferrer" href={`https://gateway.pinata.cloud/ipfs/${data?.profilePic?.substring(6)}`}>
                  View Document
                </a>
              </td>
              <td>
                <a target="_blank" rel="noreferrer" href={`https://gateway.pinata.cloud/ipfs/${data?.document?.substring(6)}`}>
                  View Document
                </a>
              </td>
              <td>
                {data.status === "Verified" ? (
                  <FaCheckCircle className="status-icon verified" />
                ) : (
                  <FaTimesCircle className="status-icon pending" />
                )}
                <span className={`status ${data.status.toLowerCase()}`}>{data.status}</span>
              </td>
              
            </tr>
          ))}
        </tbody>
      </table>
      <Grid container justifyContent="center">
      <Pagination
        count={Math.ceil(filteredUsers.length / postsPerPage)}
        variant="outlined"
        shape="rounded"
        page={currentPage}
        onChange={handleChange}
      />
      </Grid>
    </Box>
  );
}
