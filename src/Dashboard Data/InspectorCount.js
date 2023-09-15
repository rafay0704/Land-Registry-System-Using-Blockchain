import { useState, useEffect, useContext } from "react";
import { TransactionContext } from "../StateMangement/Context";
import { Pagination, Table, TableHead, TableBody, TableRow, TableCell, TextField, Box, Grid } from "@mui/material";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip} from "recharts";

export default function InspectorCount() {
  const { contract } = useContext(TransactionContext);
  const [inspectors, setInspectors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const viewInspector = async () => {
      const inspectorAddresses = await contract.ReturnAllLandIncpectorList();
      const inspectors = await Promise.all(
        inspectorAddresses.map(async (address) => {
          const { name, city, age, designation } = await contract.InspectorMapping(address);
          return { address, name, city, age: parseInt(age._hex), designation };
        })
      );

      setInspectors(inspectors);
    };

    contract && viewInspector();
  }, [contract]);

  const handleChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredInspectors = inspectors.filter(
    (inspector) =>
      inspector.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inspector.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inspector.age.toString().includes(searchQuery) ||
      inspector.designation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredInspectors.slice(indexOfFirstPost, indexOfLastPost);

  // Data for the bar chart
  const barChartData = filteredInspectors.map((inspector) => ({
    name: inspector.name,
    age: inspector.age,
    city: inspector.designation,
  }));

 

  return (
    <Box p={2}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            id="outlined-search"
            label="Search by name, city, age, or designation"
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
            <BarChart data={barChartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="age" fill="#8884d8" />
              <Bar dataKey="city" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </Grid>
      </Grid>
      </Grid>
      
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Inspector Address</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Age</TableCell>
            <TableCell>Designation</TableCell>
            <TableCell>City</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentPosts.map((data, index) => (
            <TableRow key={index}>
              <TableCell>{indexOfFirstPost + index + 1}</TableCell>
              <TableCell>{data.address}</TableCell>
              <TableCell>{data.name}</TableCell>
              <TableCell>{data.age}</TableCell>
              <TableCell>{data.city}</TableCell>
              <TableCell>{data.designation}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Grid container justifyContent="center">
      <Pagination
        count={Math.ceil(filteredInspectors.length / postsPerPage)}
        variant="outlined"
        shape="rounded"
        page={currentPage}
        onChange={handleChange}
      />
      </Grid>
    </Box>
  );
}
