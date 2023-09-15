import { useState, useEffect, useContext } from "react";
import { TransactionContext } from "../StateMangement/Context";
import { Pagination, TextField, Box, Grid } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export default function TransferCount() {
  const { contract} = useContext(TransactionContext);
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [postsPerPage] = useState(10);

  useEffect(() => {
    const fetchLands = async () => {
      const landcount = await contract.requestCount();
      const count = parseInt(landcount._hex);
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
          } = await contract.LandRequestMapping(id);

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

      const getDocument = async (landId) => {
        const { document } = await contract.lands(landId);
        return document;
      };

      const usersWithStatus = await Promise.all(
        users.map(async (user) => {
          const status = await getStatus(user.landId);
          const document = await getDocument(user.landId);

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

    contract && fetchLands();
  }, [contract]);

  const handleChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredUsers = users.filter((user) =>
    user.landId.toString().includes(searchTerm.toLowerCase())
  );

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredUsers.slice(indexOfFirstPost, indexOfLastPost);

  const requestStatus = {
    0: "Pending",
    1: "Accepted",
    2: "Rejected",
    3: "Payment Done",
    4: "Completed",
  };

  const statusCounts = {
    Pending: 0,
    Accepted: 0,
    Rejected: 0,
    "Payment Done": 0,
    Completed: 0,
  };

  filteredUsers.forEach((user) => {
    const status = requestStatus[user.requestStatus];
    statusCounts[status]++;
  });

  const pieChartData = Object.keys(statusCounts).map((status) => ({
    name: status,
    value: statusCounts[status],
  }));

  const pieChartColors = ["#8884d8", "#82ca9d", "#ffc658", "#f2a0a0", "#a0caf2"];
  const truncateID = (id) => {
    const prefix = id.substring(0, 6);
    const suffix = id.substring(id.length - 4);
    return `${prefix}...${suffix}`;
  };
  return (
    <Box p={2}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Search by Land ID"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={handleSearch}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={users}>
              <XAxis dataKey="landId" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="requestStatus" fill="#8884d8" />
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
      <table>
        <thead>
          <tr className="table-heading">
            <th>#</th>
            <th>Land Id</th>
            <th>Seller Address</th>
            <th>Buyer Address</th>
            <th>Status</th>
          
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
      <Grid container justifyContent="center">
        <Grid item>
          <Pagination
            count={Math.ceil(filteredUsers.length / postsPerPage)}
            variant="outlined"
            shape="rounded"
            page={currentPage}
            onChange={handleChange}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
