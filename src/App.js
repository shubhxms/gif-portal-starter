import twitterLogo from './assets/twitter-logo.svg';
import './App.css';
// import { useState, useEffect } from 'react/cjs/react.production.min';
import {useState, useEffect} from 'react';
// Constants
const TWITTER_HANDLE = 'shubhxms';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {

  const [walletAdd, setWalletAdd] = useState(null);
  
  const isWalletConnected = async () => {
    try{
      const {solana} = window;
      if(solana){
        if(solana.isPhantom){
          console.log("Phantom wallet found");
          const response = await solana.connect({onlyIfTrusted:true});
          console.log('connected with public key: ', response.publicKey.toString());
        }else{
          alert("Solana obj not found!")
        }
      }
    }catch(e){
      console.log(e);
    }
  }

  const connectWallet = async () => {
    const {solana} = window;
    if(solana){
      const response = await solana.connect();
      console.log("Connected with public key: ", response.publicKey.toString());
      setWalletAdd(response.publicKey.toString());
    }
  };

  const renderWalletNotConnectedContainer = () => {
    return(
    <button
      className='cta=button connect-wallet-button'
      onClick={connectWallet}
      >
        Connect to wallet
      </button>)
  }

  useEffect(() => {
    const onLoad = async () => {
      await isWalletConnected();
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);


  return (
    <div className="App">
      <div className={walletAdd ? 'authed-container' : 'container'}>
        <div className="header-container">
          <p className="header">🎭 syte - π</p>
          <p className="sub-text">
            crowd-sourced quote-wall ✨
          </p>
          {!walletAdd && renderWalletNotConnectedContainer}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built by @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
