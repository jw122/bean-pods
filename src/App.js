import "./App.css";
import { useState } from "react";
import { ethers } from "ethers";
import WPOD from "./artifacts/contracts/WPOD.sol/WPOD.json";
const wPodAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

// Bean's contract address on mainnet
const BEAN_PROTOCOL_ADDRESS = "0x24a30cc4b8342b8a62de921cd4038f4645c281ec";
const beanProtocolAbi = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      { indexed: true, internalType: "uint256", name: "id", type: "uint256" },
      {
        indexed: false,
        internalType: "uint256",
        name: "pods",
        type: "uint256",
      },
    ],
    name: "PlotTransfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "pods",
        type: "uint256",
      },
    ],
    name: "PodApproval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "beans",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "pods",
        type: "uint256",
      },
    ],
    name: "Sow",
    type: "event",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "spender", type: "address" },
    ],
    name: "allowancePods",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "approvePods",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "uint256", name: "buyAmount", type: "uint256" },
    ],
    name: "buyAndSowBeans",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "amount", type: "uint256" },
      {
        components: [
          {
            internalType: "uint32[]",
            name: "beanWithdrawals",
            type: "uint32[]",
          },
          { internalType: "uint32[]", name: "lpWithdrawals", type: "uint32[]" },
          { internalType: "uint256[]", name: "plots", type: "uint256[]" },
          { internalType: "bool", name: "claimEth", type: "bool" },
          { internalType: "bool", name: "convertLP", type: "bool" },
          { internalType: "uint256", name: "minBeanAmount", type: "uint256" },
          { internalType: "uint256", name: "minEthAmount", type: "uint256" },
        ],
        internalType: "struct LibInternal.Claim",
        name: "claim",
        type: "tuple",
      },
    ],
    name: "claimAndSowBeans",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "uint256", name: "buyAmount", type: "uint256" },
      {
        components: [
          {
            internalType: "uint32[]",
            name: "beanWithdrawals",
            type: "uint32[]",
          },
          { internalType: "uint32[]", name: "lpWithdrawals", type: "uint32[]" },
          { internalType: "uint256[]", name: "plots", type: "uint256[]" },
          { internalType: "bool", name: "claimEth", type: "bool" },
          { internalType: "bool", name: "convertLP", type: "bool" },
          { internalType: "uint256", name: "minBeanAmount", type: "uint256" },
          { internalType: "uint256", name: "minEthAmount", type: "uint256" },
        ],
        internalType: "struct LibInternal.Claim",
        name: "claim",
        type: "tuple",
      },
    ],
    name: "claimBuyAndSowBeans",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "harvestableIndex",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "harvestedIndex",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "account", type: "address" },
      { internalType: "uint256", name: "plotId", type: "uint256" },
    ],
    name: "plot",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "podIndex",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
    name: "sowBeans",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "totalHarvestable",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalPods",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSoil",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalUnripenedPods",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "sender", type: "address" },
      { internalType: "address", name: "recipient", type: "address" },
      { internalType: "uint256", name: "id", type: "uint256" },
      { internalType: "uint256", name: "start", type: "uint256" },
      { internalType: "uint256", name: "end", type: "uint256" },
    ],
    name: "transferPlot",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const diamondAbi = [
  {
    inputs: [
      { internalType: "address", name: "_contractOwner", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  { stateMutability: "payable", type: "fallback" },
  { stateMutability: "payable", type: "receive" },
];

function App() {
  const [plotIds, setPlotIds] = useState([]);
  const [plotId, setPlotId] = useState();
  const [userAccount, setUserAccount] = useState();
  const [amount, setAmount] = useState();
  const [plotCount, setPlots] = useState();

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const BeanProtocolContract = new ethers.Contract(
    BEAN_PROTOCOL_ADDRESS,
    beanProtocolAbi,
    provider
  );

  const diamondContract = new ethers.Contract(
    "0xC1E088fC1323b20BCBee9bd1B9fC9546db5624C5",
    diamondAbi,
    provider
  );

  const getListOfSows = async (accountAddress, plotId, beans, pods) => {
    console.log("bean protocol contarct: ", BeanProtocolContract);
    console.log("diamond contarct: ", diamondContract);
    console.log(accountAddress);

    let filters = BeanProtocolContract.filters;
    console.log("filers", filters);
    let filter = filters.Sow("0x5ab883168ab03c97239cef348d5483fb2b57afd9");
    console.log("filter: ", filter);

    const totalPods = await BeanProtocolContract.totalPods();
    console.log("total pods: ", totalPods);

    const sowEvents = await diamondContract.queryFilter(filter, 0, "latest");
    console.log("SOW EVENTS", sowEvents);

    const plotIds = [];
    sowEvents.forEach(function (event) {
      console.log("current event: ", event);
      const txHash = event.transactionIndex;
      // const plotTxHash = txHash.substring(0, 10) + "...";
      plotIds.push(txHash);
    });
    console.log("current plot ids: ", plotIds);
    setPlots(sowEvents.length);
    setPlotIds(plotIds);
    // loop through the sow events and log their transaction hash
  };

  console.log("list of sow events: ", getListOfSows);

  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
      const [account] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
    }
  }

  async function wrapPlot() {
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      console.log(plotId);
      console.log(`wrapping plot ${plotId}`);
      const contract = new ethers.Contract(wPodAddress, WPOD.abi, signer);
      const transation = await contract.wrap(plotId, 0, 100);
      await transation.wait();
      console.log(`Plot successfully wrapped!`);
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>Welcome! {userAccount}</p>
        <p>You have {plotCount} plots.</p>
        {plotIds.map((pid) => (
          <div>
            <input
              onChange={(e) => setPlotId(e.target.value)}
              type="radio"
              id={`plot_${pid}`}
              name="plotId"
              value={pid}
            />
            <label for={plotId}>{pid}</label>
          </div>
        ))}
        <button onClick={getListOfSows}>Get my plots</button>
        <button onClick={wrapPlot}>Wrap Plot</button>
        <br />
        {/* <button onClick={getBalance}>Get Balance</button> */}
      </header>
    </div>
  );
}

export default App;
