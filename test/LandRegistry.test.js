// Import the necessary dependencies from Hardhat
import { ethers } from "hardhat";
import { Contract, ContractFactory } from "ethers";

// Define the describe block for your smart contract tests
describe("LandRegistry", function () {
  let landRegistry: Contract;

  // Deploy the smart contract before each test
  beforeEach(async function () {
    const LandRegistry: ContractFactory = await ethers.getContractFactory("LandRegistry");
    landRegistry = await LandRegistry.deploy();
    await landRegistry.deployed();
  });

  // Test case for the isContractOwner function
  it("should return true if the given address is the contract owner", async function () {
    const ownerAddress = await landRegistry.contractOwner();
    const isOwner = await landRegistry.isContractOwner(ownerAddress);
    expect(isOwner).to.equal(true);
  });

  // Test case for the changeContractOwner function
  it("should change the contract owner to the provided address", async function () {
    const [newOwner] = await ethers.getSigners();
    await landRegistry.changeContractOwner(newOwner.address);
    const isOwner = await landRegistry.isContractOwner(newOwner.address);
    expect(isOwner).to.equal(true);
  });

  // Add more test cases for other functions

});
