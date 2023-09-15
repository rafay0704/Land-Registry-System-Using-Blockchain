import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useState, useEffect } from "react";
import { TransactionContext } from "../StateMangement/Context";
import { useContext } from "react";
import { Table, TableHead, TableBody, TableRow, TableCell, Button } from "@mui/material";

export default function AllLandInspector() {
  const { contract } = useContext(TransactionContext);
  const [inspectors, setInspectors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);

  useEffect(() => {
    const viewInspector = async () => {
      const inspectorAddresses = await contract.ReturnAllLandIncpectorList();
      const inpsectors = await Promise.all(
        inspectorAddresses.map(async (address) => {
          const { name, city, age, designation } =
            await contract.InspectorMapping(address);
          return { address, name, city, age: parseInt(age._hex), designation };
        })
      );

      setInspectors(inpsectors);
    };

    contract && viewInspector();
  }, [contract]);

  const handleChange = (event, value) => {
    setCurrentPage(value);
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = inspectors.slice(indexOfFirstPost, indexOfLastPost);

  const remove = async (id) => {
    const transaction = await contract.removeLandInspector(id, {
      gasLimit: 10000000,
    });
    await transaction.wait();

    console.log("done");
  };

  return (
    <div>
        <h1 style={{ textAlign: "center", fontSize: "30px", fontWeight: "bold", color: "#333", margin: "15px 0" }}>
        All Land Inspectors
      </h1>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Inspector Address</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Age</TableCell>
            <TableCell>City</TableCell>
            <TableCell>Designation</TableCell>
            <TableCell>Remove</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentPosts.map((data, index) => (
            <TableRow key={index}>
              <TableCell>{index}</TableCell>
              <TableCell>{data.address}</TableCell>
              <TableCell>{data.name}</TableCell>
              <TableCell>{data.age}</TableCell>
              <TableCell>{data.designation}</TableCell>
              <TableCell>{data.city}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  onClick={() => remove(data.address)}
                  sx={{ bgcolor: "#f44336", color: "#ffffff" }}
                >
                  Remove
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Stack spacing={2} sx={{ my: 2 }}>
        <Pagination
          count={Math.ceil(inspectors.length / postsPerPage)}
          variant="outlined"
          shape="rounded"
          page={currentPage}
          onChange={handleChange}
        />
      </Stack>
    </div>
  );
}
