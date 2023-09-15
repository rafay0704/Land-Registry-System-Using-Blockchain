import * as React from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { Typography } from "@mui/material";
import { TransactionContext } from "../StateMangement/Context";
import { useEffect } from "react";
import {
  FaBuilding,
  FaUsers,
  FaDollarSign,
  FaIdCard,
  FaRegMoneyBillAlt,
} from "react-icons/fa";
import { GiTwoCoins } from "react-icons/gi";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function Dashboard() {
  const {
    contract,
    accountBalance,
   
    inspectorCount,
    pkr,
    matic,
  } = React.useContext(TransactionContext);

  const [user, setUser] = React.useState(0);
  const [land, setLand] = React.useState(0);
  const [transfer, setTransfer] = React.useState(0);
  const [totalRequest, setTotalRequest] = React.useState(0);
  const [totalVerifiedUsers, setTotalVerifiedUsers] = React.useState(0);
  const [totalUnverifiedUsers, setTotalUnverifiedUsers] = React.useState(0);
  const [totalRegisteredLands, setTotalRegisteredLands] = React.useState(0);
  const [totalUnverifiedLands, setTotalUnverifiedLands] = React.useState(0);
  const [totalPaymentDoneLands, setTotalPaymentDoneLands] = React.useState(0);

  useEffect(() => {
    const viewAllUser = async () => {
      const user = await contract.userCount();
      const lands = await contract.landsCount();
      const transfer = await contract.documentId();
      const totalRequest = await contract.getTotalRequests();
      const totalVerifiedUsers = await contract.getTotalVerifiedUsers();
      const totalUnverifiedUsers = await contract.getTotalUnverifiedUsers();
      const totalRegisteredLands = await contract.getTotalRegisteredLands();
      const totalUnverifiedLands = await contract.getTotalUnverifiedLands();
      const totalPaymentDoneLands = await contract.getTotalPaymentDoneLands();

      setUser(parseInt(user._hex));
      setLand(parseInt(lands._hex));
      setTransfer(parseInt(transfer._hex));
      setTotalRequest(parseInt(totalRequest._hex));
      setTotalVerifiedUsers(parseInt(totalVerifiedUsers._hex));
      setTotalUnverifiedUsers(parseInt(totalUnverifiedUsers._hex));
      setTotalRegisteredLands(parseInt(totalRegisteredLands._hex));
      setTotalUnverifiedLands(parseInt(totalUnverifiedLands._hex));
      setTotalPaymentDoneLands(parseInt(totalPaymentDoneLands._hex));
    };
    contract && viewAllUser();
  }, [contract]);

  const gridSpacing = 3;
  const data = [
    {
      name: "Users",
      Total: user,
    },
    {
      name: "Lands",
      Total: land,
    },
    {
      name: "Transfer",
      Total: transfer,
    },
    {
      name: "Inspectors",
      Total: inspectorCount,
    },
    {
      name: "Balance",
      Total: accountBalance,
    },
    {
      name:"Requests",
      Total: totalRequest,
    },
    {
      name:"V-Users",
      Total: totalVerifiedUsers,
    },

    {
      name:"Un-Users",
      Total: totalUnverifiedUsers,
    },
    {
      name:"Un-Lands",
      Total: totalUnverifiedLands,
    },
    {
      name:"Payments",
      Total: totalPaymentDoneLands,
    },

  ];

  const data2 = [
    { name: "Users", value: user },
    { name: "Lands", value: land },
    { name: "Transfers", value: transfer },
    { name: "Requests", value: totalRequest },
    { name: "Inspectors", value: inspectorCount },
    { name: "Payments", value: totalPaymentDoneLands },
  ];

  const gridItems = [
    {
      route: "/land-count",
      icon: <FaBuilding size={28} style={{ marginRight: "8px", color: "#8884d8" }} />,
      title: "Land Registered",
      value: totalRegisteredLands,
    },
    {
      route: "/transfer-count",
      icon: <GiTwoCoins size={28} style={{ marginRight: "8px", color: "#F3722C" }} />,
      title: "Total Transfers",
      value: transfer,
    },
    {
      route: "/user-count",
      icon: <FaUsers size={28} style={{ marginRight: "8px", color: "#F94144" }} />,
      title: "Total Users",
      value: user,
    },
    {
      route: "/inspector-count",
      icon: <FaUsers size={28} style={{ marginRight: "8px", color: "#FFBB28" }} />,
      title: "Inspector Count",
      value: inspectorCount,
    },
    {
      route: "/current-account",
      icon: <FaIdCard size={28} style={{ marginRight: "8px", color: "#FF8042" }} />,
      title: "Total Requests",
      value: totalRequest,
    },
    {
      route: "/current-account",
      icon: <FaIdCard size={28} style={{ marginRight: "8px", color: "#FF8042" }} />,
      title: "Verified Users",
      value: totalVerifiedUsers,
    },
    {
      route: "/current-account",
      icon: <FaIdCard size={28} style={{ marginRight: "8px", color: "#FF8042" }} />,
      title: "Unverified Users",
      value: totalUnverifiedUsers,
    }, 
    {
      route: "/current-account",
      icon: <FaIdCard size={28} style={{ marginRight: "8px", color: "#FF8042" }} />,
      title: "Unverified Lands",
      value:totalUnverifiedLands,
    },
    {
      route: "/current-account",
      icon: <FaIdCard size={28} style={{ marginRight: "8px", color: "#FF8042" }} />,
      title: "Payment Done",
      value:totalPaymentDoneLands,
    },
    {
      route: "/account-balance",
      icon: <FaDollarSign size={28} style={{ marginRight: "8px", color: "#00C49F" }} />,
      title: "Account Balance",
      value: accountBalance?.toString().slice(0, 14),
    },
    {
      route: "/pkr",
      icon: <FaRegMoneyBillAlt size={28} style={{ marginRight: "8px", color: "#0088FE" }} />,
      title: "PKR",
      value: pkr?.toString().slice(0, 14),
    },
    {
      route: "/matic",
      icon: <GiTwoCoins size={28} style={{ marginRight: "8px", color: "#8884d8" }} />,
      title: "Matic",
      value: matic?.toString().slice(0, 14),
    },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#F94144", "#F3722C", "#F8961E", "#F9844A"];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={gridSpacing}>
        {gridItems.map((item, index) => (
          <Grid key={index} item lg={3} md={3} sm={6} xs={12}>
            <Link to={item.route} style={{ textDecoration: "none" }}>
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  minHeight: "80px",
                  backgroundColor: COLORS[index % COLORS.length],
                  height: "100%",
                  transition: "transform .2s",
                  "&:hover": {
                    transform: "scale(1.02)",
                    backgroundColor: COLORS[(index + 1) % COLORS.length],
                  },
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  {item.icon}
                  <Typography
                    variant="h6"
                    gutterBottom
                    component="div"
                    style={{
                      color: "#fff",
                      textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)",
                    }}
                  >
                    {item.title}
                  </Typography>
                </div>
                <Typography
                  variant="h5"
                  gutterBottom
                  component="div"
                  style={{
                    color: "#000",
                    textShadow: "1px 1px 2px rgba(255, 255, 255, 0.5)",
                  }}
                >
                  {item.value}
                </Typography>
              </Paper>
            </Link>
          </Grid>
        ))}

       
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              minHeight: "100px",
              backgroundColor: "#F8F9FA",
            }}
          >
            <Typography
              component="h2"
              variant="h6"
              color="textSecondary"
              sx={{ display: "flex", alignItems: "center" }}
            >
              System Analysis
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                width={500}
                height={300}
                data={data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="Total"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Pie Chart */}
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              minHeight: "100px",
              backgroundColor: "#F8F9FA",
            }}
          >
            <Typography
              component="h2"
              variant="h6"
              color="textSecondary"
              sx={{ display: "flex", alignItems: "center" }}
            >
              System Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart width={400} height={400}>
                <Pie
                  data={data2}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${Math.min(Math.round(percent * 100), 100)}%`
                  }
                >
                  {data2.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              minHeight: "100px",
              backgroundColor: "#F8F9FA",
            }}
          >
            <Typography
              component="h2"
              variant="h6"
              color="textSecondary"
              sx={{ display: "flex", alignItems: "center" }}
            >
             Overal Activities of Contract
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                width={500}
                height={300}
                data={data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Total" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
