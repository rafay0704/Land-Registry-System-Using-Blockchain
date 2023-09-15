import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import contractABI from "../contract/landregistry.json";
import axios from "axios";

export const TransactionContext = React.createContext();

const { ethereum } = window;
const contractAddress = "0x3c71807786AA507f84D96C4F4a708FC0251cE1dC";
//  const contractAddress = "0x7b7d2f5C4E2321004945E21af2cbaE649970dCB7";
// const contractAddress = "0xCD38C782E273aAA23caa9b3EBEBf0386e6eA5D3A";
// const contractAddress = "0xF6914cB3E419863e5C747597A298FA1EAdac4203";
//const contractAddress = "0xCE60a9C7276671F651f2E7D4BA2410ed994055F2";

const createEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionsContract = new ethers.Contract(
    contractAddress,
    contractABI.abi,
    signer
  );

  return transactionsContract;
};

export const TransactionsProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [contract, setContract] = useState();
  const [provider, setProvider] = useState();
  const [inspectorCount, setInspectorCount] = useState(0);

  const [accountBalance, setAccountBalance] = useState(0); //new

  const [pkr, setPkr] = useState(null);
  const [matic, setMatic] = useState(null);

  const checkIfWalletIsConnect = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      const accounts = await ethereum.request({ method: "eth_accounts" });
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const transactionsContract = new ethers.Contract(
        contractAddress,
        contractABI.abi,
        signer
      );
      setContract(transactionsContract);
      setProvider(provider);
      console.log("hello 2", provider);
      console.log("hello", transactionsContract);

      if (accounts.length) {
        setCurrentAccount(accounts[0]);
        const balance = await provider.getBalance(accounts[0]); //new
        setAccountBalance(ethers.utils.formatEther(balance)); //new
      } else {
        console.log("No accounts found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllTransactions = async () => {
    try {
      if (ethereum) {
        const transactionsContract = createEthereumContract();

        const availableTransactions =
          await transactionsContract.ReturnAllLandIncpectorList();
        setInspectorCount(availableTransactions.length);
      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnect();
    getAllTransactions();
    fetchData();
  }, []);

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      setCurrentAccount(accounts[0]);
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const transactionsContract = new ethers.Contract(
        contractAddress,
        contractABI.abi,
        signer
      );
      setContract(transactionsContract);

      // window.location.reload();
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };
  // console.log(checkIfWalletIsConnect())

  async function fetchData() {
    try {
      const { data } = await axios.get(
        "https://fyp-matic-api.netlify.app/api/matic"
      );
      setPkr(data.PkrUsd);
      setMatic(data.MaticUsd);
    } catch (error) {
      console.error(error);
      setPkr(null);
      setMatic(null);
    }
  }

  useEffect(() => {
    checkIfWalletIsConnect();
    getAllTransactions();
    fetchData();
  }, []);

  const [model, setModel] = useState(false);
  const [modelMap, setModelMap] = useState(false);
  const [area, setArea] = useState("");
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState("");
  const [landId, setlandId] = useState([]);
  const [fetchedDetails, setFetchedDetails] = useState("");

  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
        checkIfWalletIsConnect,
        currentAccount,
        accountBalance, 
        area,
        setArea,
        address,
        setAddress,
        fetchedDetails,
        setFetchedDetails,
        pkr,
        matic,
        contract,
        provider,
        model,
        setModel,
        inspectorCount,
        modelMap,
        setModelMap,
        coordinates,
        landId,
        setlandId,
        setCoordinates,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
