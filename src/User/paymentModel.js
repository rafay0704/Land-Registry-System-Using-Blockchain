import { Button, Modal, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { ethers } from "ethers";
import { useContext } from "react";
import { TransactionContext } from "../StateMangement/Context";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Payment = () => {
  const { contract, model, setModel } = useContext(TransactionContext);

  const MakeAPayment = async (id, receiverAddress, value) => {
    console.log("value before", value);
    try {
      const amount = ethers.utils.parseEther(value.toString());
      const tx = await contract.makePayment(receiverAddress, id, {
        value: amount,
        gasLimit: 1000000,
      });
      console.log("value after", value);
      toast.info("Waiting for transaction confirmation...");
  
      await tx.wait();
  
      console.log("Transaction complete");
      setModel(false);
      toast.success("Payment has been done");
    } catch (error) {
      console.error(error);
      toast.error("Payment failed");
    }
  };
  

  const storedData1 = localStorage?.getItem("land");
  const landdata = JSON.parse(storedData1);
  console.log("detail", landdata);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "#fff",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
    borderRadius: "10px",
    p: 4,
  };

  const buttonStyle = {
    color: "#fff",
    fontWeight: "bold",
    textTransform: "none",
    borderRadius: "5px",
    padding: "10px 30px",
    fontSize: "16px",
  };

  return (
    <>
      <ToastContainer />
      <Modal
        open={model}
        onClose={!model}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            fontSize={24}
            fontWeight="bold"
            color="#555"
            mb={2}
            textAlign="center"
          >
            Confirm Payment
          </Typography>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            mb={2}
          >
            <Typography
              variant="body1"
              component="span"
              fontWeight="bold"
              color="#555"
              mr={2}
            >
              {landdata.buyerId}
            </Typography>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            mb={2}
          >
            <ArrowDownwardIcon color="success" fontSize="large" />
          </Box>

          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            mb={2}
          >
            <Typography
              variant="body1"
              component="span"
              fontWeight="bold"
              color="#555"
              ml={2}
            >
              {landdata.sellerId}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" justifyContent mb={2}>
            <Typography
              id="modal-modal-description"
              variant="body1"
              fontWeight="bold"
              color="#555"
              mb={2}
            >
              Land Price: {landdata.price} /- MATICS Only
            </Typography>
          </Box>

          <Box display="flex" justifyContent="space-between">
            <Button
              variant="contained"
              color="error"
              sx={buttonStyle}
              onClick={() => setModel(false)}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="success"
              sx={buttonStyle}
              onClick={() =>
                MakeAPayment(landdata.reqId, landdata.sellerId, landdata.price)
              }
            >
              Confirm
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default Payment;
