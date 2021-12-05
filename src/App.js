import "./App.css";
import { useState } from "react";
import { ethers } from "ethers";
import WPOD from "./artifacts/contracts/WPOD.sol/WPOD.json";

const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function App() {
  const [plotId, setPlotId] = useState();

  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  async function wrapPlot() {
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(tokenAddress, WPOD.abi, signer);
      console.log(plotId);
      console.log(`wrapping plot ${plotId}`);
      const transation = await contract.wrap(plotId, 0, 100);
      await transation.wait();
      console.log(`Plot successfully wrapped!`);
    }
  }

  const plotIds = [100, 101, 110];
  return (
    <div className="App">
      <header className="App-header">
        You own plots: 
        { plotIds.map(pid => (
          <div>
            <input
              onChange={(e) => setPlotId(e.target.value)}
              type="radio" id={`plot_${pid}`} name="plotId" value={pid} />
            <label for={plotId}>{pid}</label>
          </div>
        ))}
        <button onClick={wrapPlot}>Wrap Plot</button>
      </header>
    </div>
  );
}

export default App;
