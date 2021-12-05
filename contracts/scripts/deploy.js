const beanstalkAddr =  ethers.constants.AddressZero;
const beanEthAddr = ethers.constants.AddressZero;
const wpodEthAddr = ethers.constants.AddressZero;

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const factory = await ethers.getContractFactory("WPOD");
  const contract = await factory.deploy(beanstalkAddr, beanEthAddr, wpodEthAddr);

  console.log("Contract address:", contract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
