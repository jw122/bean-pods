import "./App.css";
import { useState, useEffect } from "react";
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
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "beans",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "pods",
        "type": "uint256"
      }
    ],
    "name": "Sow",
    "type": "event"
  },
  { stateMutability: "payable", type: "fallback" },
  { stateMutability: "payable", type: "receive" },
];

function App() {
  const [plots, setPlots] = useState({});
  const [plotId, setPlotId] = useState();
  const [userAddress, setUserAddress] = useState();
  const [amount, setAmount] = useState();

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

  // const getListOfSows = async (accountAddress, plotId, beans, pods) => {
  const getListOfSows = async () => {
    if (!userAddress) {
      console.log('No address');
      return;
    }
    console.log("bean protocol contarct: ", BeanProtocolContract);
    console.log("diamond contract: ", diamondContract);
    console.log("address", userAddress);

    let filters = BeanProtocolContract.filters;
    console.log("filers", filters);
    // let filter = filters.Sow("0x5ab883168ab03c97239cef348d5483fb2b57afd9");
    let filter = filters.Sow(userAddress);
    console.log("filter: ", filter);

    const totalPods = await BeanProtocolContract.totalPods();
    console.log("total pods: ", totalPods);

    const sowEvents = await diamondContract.queryFilter(filter, 0, "latest");
    console.log("SOW EVENTS", sowEvents);

    const plots = {};
    sowEvents.forEach(function (event) {
      console.log("current event: ", event);
      const txHash = event.transactionIndex;
      plots[txHash] = {
        id: txHash,
        position: event.args[1].toNumber(),
        pods: event.args[3].toNumber(),
        event: event,
      }
    });
    setPlots(plots);
  };

  useEffect(() => {
    const f = async () => { await getListOfSows() };
    f();
  }, [userAddress])

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

  function _resetState() {
    setPlots({});
    setPlotId(null);
    setUserAddress(null);
    setAmount(null);
  }

  function _initialize(userAddress) {
    setUserAddress(userAddress);
  }

  async function  connectWallet() {
    const [selectedAddress] = await window.ethereum.enable();
    _initialize(selectedAddress);

    window.ethereum.on("accountsChanged", ([newAddress]) => {
      this._stopPollingData();
      // `accountsChanged` event can be triggered with an undefined newAddress.
      // This happens when the user removes the Dapp from the "Connected
      // list of sites allowed access to your addresses" (Metamask > Settings > Connections)
      // To avoid errors, we reset the dapp state 
      if (newAddress === undefined) {
        return this._resetState();
      }
      
      this._initialize(newAddress);
    });
    
    // We reset the dapp state if the network is changed
    window.ethereum.on("networkChanged", ([networkId]) => {
      _resetState();
    });
  }

  return (
    <div className="App">
      <header className="App-header">
      <h1 class="display-1 title">wPod {userAddress.slice(0,4)}...{userAddress.slice(38,42)}</h1>
        <h3>The AMM for Bean Pods</h3>
        <p>You have {Object.keys(plots).length} plot(s)</p>

        {Object.values(plots).map((info) => (
          <div>
            <input
              onChange={(e) => setPlotId(e.target.value)}
              type="radio"
              id={`plot_${info.id}`}
              name="plotId"
              value={info.id}
            />
            <label for={info.id}>{info.pods} pods at position {info.position}</label>
          </div>
        ))}
        <div className="plotInteraction">
      <button type="button" class="btn btn-dark" onClick={connectWallet}>
            Get my plots
          </button>

          <button type="button" class="btn btn-light" onClick={wrapPlot}>
            Wrap Pods
          </button>
        </div>
        <br />
        {/* <button onClick={getBalance}>Get Balance</button> */}
      </header>
    </div>
  );
}

export default App;
