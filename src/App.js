import './App.css';
import logo from './res/icon.png';
import { ethers } from "ethers";
import { useState } from "react";
import { nftPlaceContractAddress, nftPlaceAbi } from './constants/constants';
import { ToastContainer, toast } from 'react-toastify';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { formatBalance } from './utils/utils';
import HomePage from './Pages/HomePage';
import SellPage from './Pages/SellPage';
import NftPage from './Pages/NftPage';
import ConnectWalletBox from './components/ConnectWalletBox';

function App() {
  // General web3 vars
  const [isConnected, setIsConnected] = useState(false);
  const [signer, setSigner] = useState(undefined);
  const [accountAddress, setAccountAddress] = useState(undefined);
  // NFTPlace
  const [NFTPlace, setNFTPlace] = useState();
  const [userFunds, setUserFunds] = useState(0);

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try{
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        setSigner(signer);
        setIsConnected(true);
        const accountAddress = await signer.getAddress();
        setAccountAddress(accountAddress);

        const contract = await new ethers.Contract(nftPlaceContractAddress, nftPlaceAbi, signer);
        setNFTPlace(contract);

        let funds = await contract.balanceOf(accountAddress);
        setUserFunds(funds);
      }
      catch(e){
        toast.error("An error ocurred");
        console.log(e);
        return;
      }
      
      toast.success('Connected');
    } 
    else {
      console.log("Please Install Metamask!!!");
    }
  }

  const withdrawFunds = async () => {
    try {
      let tx = await NFTPlace.withdrawFunds();
      tx.wait();

      setUserFunds(0);
    }
    catch(e){
      toast.error("An error ocurred");
      console.log(e);
      return;
    }

    toast.success("Funds withdrew");
  }

  return (
    <div className="App min-h-screen m-auto">
      <BrowserRouter>
        <ToastContainer position="bottom-center" limit={1} />
        <header className="App-header custom-background">
          <div className="max-w-screen-lg flex flex-wrap items-center justify-between mx-auto py-2">
            <div className="header-logo-container inline-flex">
              <Link className="logo text-decoration-none" to='/'>
                <img src={logo} className="relative top-0 h-16" alt="Logo" />
              </Link>
              {
                isConnected ? 
                (
                  <div className="menu flex items-center ml-20">
                    <Link className="text-decoration-none custom-text-color2 border-b custom-border2 py-1 font-medium hover:border-b-4 transition-all" to='/sell'>
                      Sell NFT
                    </Link>
                  </div>
                ) : null
              }
            </div>
            <div className="header-menu-container inline-flex">
              {
                userFunds > 0 && (
                  <div className="flex inline-flex">
                    <div className="flex items-center custom-text-color2">
                      Funds: { formatBalance(userFunds) } ETH
                    </div>
                    <button className="flex custom-background2 custom-text-color mx-2 font-bold py-2 px-4 rounded" 
                      onClick={ () => withdrawFunds() }
                    >
                      Withdraw funds
                    </button>
                  </div>
                )
              }
              { 
                isConnected ? 
                (
                  <button className="flex text-white font-bold py-2 px-4 rounded custom-text-color custom-background2">
                    { accountAddress.slice(0, 6) + '...' + accountAddress.slice(-4) }
                  </button>
                )
                :
                (
                  <button className="flex text-white font-bold py-2 px-4 rounded custom-text-color custom-background2 uppercase" 
                    onClick={ () => connectWallet() }
                  >
                    Connect
                  </button>
                )
              }
            </div>
          </div>
        </header>
        <div className="site-container container max-w-screen-lg mx-auto">
          {
            isConnected ? (
              <Routes>
                <Route path="/" element={<HomePage NFTPlace={NFTPlace} />} />
                <Route path="/sell" element={<SellPage NFTPlace={NFTPlace} signer={signer} />} />
                <Route path="/nft/:collection/:tokenId" element={<NftPage NFTPlace={NFTPlace} />} />
              </Routes>
            ) : (<ConnectWalletBox />)
          }
        </div>
        <footer className="w-full py-4 custom-text-color text-center">All rights reserved</footer>
      </BrowserRouter>
    </div>
  );
}

export default App;
