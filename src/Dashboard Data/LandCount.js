import { useState, useEffect, useContext } from "react";
import { TransactionContext } from "../StateMangement/Context";
import { Link } from "react-router-dom";
import { Pagination, TextField, Grid, Box } from "@mui/material";
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

export default function LandCount() {
  const { contract } = useContext(TransactionContext);
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchLands = async () => {
      const allLand = await contract.ReturnAllLandList();
      const lands = await Promise.all(
        allLand.map(async (landId) => {
          const landData = await contract.lands(landId);
          const {
            ownerAddress,
            landAddress,
            physicalSurveyNumber,
            document,
            isLandVerified,
            isLandRejected,
            id,
            landPrice,
            landpic,
          } = landData;

          return {
            ownerAddress,
            landAddress,
            physicalSurveyNumber,
            document,
            isLandVerified,
            isLandRejected,
            landId: parseInt(id._hex),
            landPrice: parseInt(landPrice._hex) / 10 ** 18,
            landpic,
          };
        })
      );

      setUsers(lands);
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
    user.landAddress.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentPosts = filteredUsers.slice((currentPage - 1) * 10, currentPage * 10);

  const statusCounts = {
    Verified: 0,
    Rejected: 0,
    Pending: 0,
  };

  users.forEach((user) => {
    if (user.isLandVerified) {
      statusCounts.Verified++;
    } else if (user.isLandRejected) {
      statusCounts.Rejected++;
    } else {
      statusCounts.Pending++;
    }
  });

  const pieChartData = Object.keys(statusCounts).map((status) => ({
    name: status,
    value: statusCounts[status],
  }));

  const pieChartColors = ["#8884d8", "#82ca9d", "#ffc658"];

  return (
    <Box p={2}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Search by Location"
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
              <XAxis dataKey="landAddress" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="landPrice" fill="#8884d8" />
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
            <th>Location</th>
            <th>Price</th>
            <th>Survey No</th>
            <th>Document</th>
            <th>Land Pic</th>
            <th>View Details</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {currentPosts.map((data, index) => (
            <tr key={data.landId} className="table-data">
              <td>{(currentPage - 1) * 10 + index + 1}</td>
              <td>{data.landAddress}</td>
              <td>{data.landPrice}</td>
              <td>{data.physicalSurveyNumber}</td>
              <td>
                <a
                  target="_blank"
                  alt="document"
                  rel="noreferrer"
                  href={`https://gateway.pinata.cloud/ipfs/${data.document.substring(6)}`}
                >
                  View Document
                </a>
              </td>
              <td>
                <a
                  target="_blank"
                  alt="Land pic"
                  rel="noreferrer"
                  href={`https://gateway.pinata.cloud/ipfs/${data.landpic.substring(6)}`}
                >
                  View Land Pic
                </a>
              </td>
              <td>
                <Link to={`/landDetails?id=${data.landId}`}>GH-{data.landId}</Link>
              </td>
              <td>
                <span
                  className={
                    data.isLandVerified
                      ? "status-verified"
                      : data.isLandRejected
                      ? "status-rejected"
                      : "status-pending"
                  }
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
      <Grid container justifyContent="center">
        <Grid item>
          <Pagination
            count={Math.ceil(filteredUsers.length / 10)}
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
