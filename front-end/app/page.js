"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";

//Components
import Navigation from "./Components/Navigation";
import Search from "./Components/Search";
import Dom from "./Components/Dom";

// ABIs
import Domain from "./abis/Domain.json";
import config from "./config.json";

export default function Home() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [domains, setDomains] = useState([]);
  const [domainContract, setDomainContract] = useState(null);

  const loadBlockchainData = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    setProvider(provider);

    const network = await provider.getNetwork();
    console.log(network);

    const domainContract = new ethers.Contract(
      config[network.chainId].Domain.address,
      Domain,
      provider
    );
    setDomainContract(domainContract);

    const maxSupply = await domainContract.maxSupply();
    const domains = [];
    for (let i = 0; i <= maxSupply; i++) {
      const domainArr = await domainContract.getDomain(i);
      domains.push(domainArr);
    }

    setDomains(domains);

    // Listen for the "accountsChanged" event
    window.ethereum.on("accountsChanged", async () => {
      // Request the Ethereum accounts from the user
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      // Get the first account address

      const account = ethers.getAddress(accounts[0]);

      // Set the account state variable with the obtained address
      setAccount(account);
    });
  };

  useEffect(() => {
    loadBlockchainData();
  }, []);

  return (
    <div>
      <Navigation account={account} setAccount={setAccount} />

      <Search />

      <div className="cards__section">
        <h2 className="cards__title">Why you need a domain name.</h2>
        <p className="cards__description">
          Own your custom username, use it across services, and be able to store
          an avatar and other profile data.
        </p>

        <hr />

        <div className="cards">
          {domains.map((domain, index) => (
            <Dom
              domain={domain}
              domainContract={domainContract}
              provider={provider}
              id={index + 1}
              key={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
