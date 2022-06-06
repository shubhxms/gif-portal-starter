import twitterLogo from './assets/twitter-logo.svg';
import './App.css';
import { useEffect } from 'react/cjs/react.production.min';

// Constants
const TWITTER_HANDLE = 'shubhxms';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {

  const isWalletConnected = async () => {
    try{
      const {solana} = window;
      if(solana){
        if(solana.isPhantom){
          console.log("Phantom wallet found");
        }else{
          alert("Solana obj not found!")
        }
      }
    }catch(e){
      console.log(e);
    }
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
      <div className="container">
        <div className="header-container">
          <p className="header">🎭 syte - π</p>
          <p className="sub-text">
            crowd-sourced quote-wall ✨
          </p>
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
