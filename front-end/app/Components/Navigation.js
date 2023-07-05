import { ethers } from "ethers";
import logo from "../assets/logo.svg";
import Link from "next/link";
import Image from "next/image";

const Navigation = ({ account, setAccount }) => {
  const connectHandler = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    const account = ethers.getAddress(accounts[0]);
    setAccount(account);
  };

  return (
    <nav>
      <div className="nav__brand">
        <Image src={logo} alt="Logo" />

        <h1>Domain Store</h1>
        <ul className="nav__links">
          <li>
            <Link href="/">
              <span>Domain Names</span>
            </Link>
          </li>
          <li>
            <Link href="/">
              <span>Websites & Hosting</span>
            </Link>
          </li>
          <li>
            <Link href="/">
              <span>Commerce</span>
            </Link>
          </li>
          <li>
            <Link href="/">
              <span>Email & Marketing</span>
            </Link>
          </li>
        </ul>
      </div>

      {account ? (
        <button type="button" className="nav__connect">
          {account.slice(0, 6) + "..." + account.slice(38, 42)}
        </button>
      ) : (
        <button type="button" className="nav__connect" onClick={connectHandler}>
          Connect
        </button>
      )}
    </nav>
  );
};

export default Navigation;
