import twitterLogo from './assets/twitter-logo.svg';
import './App.css';
// import { useState, useEffect } from 'react/cjs/react.production.min';
import {useState, useEffect} from 'react';
// Constants
const TWITTER_HANDLE = 'shubhxms';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {

  const [walletAdd, setWalletAdd] = useState(null);
  const [inputVal, setInputVal] = useState('');
  const [imgList, setImgList] = useState([]);
  const TEST_QUOTES = [
    'https://www.nitch.com/content/posts/1653856600-720w.jpg',
    'https://www.nitch.com/content/posts/1654027204-720w.jpg',
    'https://www.nitch.com/content/posts/1642643038-720w.jpg',
    'https://www.nitch.com/content/posts/1638803040-720w.jpg',
    'https://giphy.com/clips/hamlet-jJjb9AUHOiP3nJJMdy'
  ];
  
  const isWalletConnected = async () => {
    try{
      const {solana} = window;
      if(solana){
        if(solana.isPhantom){
          console.log("Phantom wallet found");
          const response = await solana.connect({onlyIfTrusted:true});
          console.log('connected with public key: ', response.publicKey.toString());
          setWalletAdd(response.publicKey.toString());
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

  const sendImg = async () => {
    if (inputVal.length > 0){
      console.log("link: ", inputVal);
      setImgList([...imgList, inputVal]);
      setInputVal('');
    }else{
      console.log("empty input. try again!");
    }
  }

  const renderWalletNotConnectedContainer = () => (
    <button
      className='cta=button connect-wallet-button'
      onClick={connectWallet}
      >
        Connect to wallet
      </button>
  );

  const renderWalletConnectedContainer = () => (
    <div className='connected-container'>
      <form
        onSubmit={(evt) => {
          evt.preventDefault();
          sendImg();
        }}
      >
        <input type="text" placeholder='enter link to image' onChange={(e) => {setInputVal(e.target.value)}}/>
        <button type='submit' className='cta-button submit-gif-button'>Submit</button>
      </form>
      <div className='gif-grid'>
        {imgList.map(qt => (
          <div className='gif-item' key={qt}>
            <img src={qt} alt={qt}/>
          </div>
        ))}
      </div>
    </div>
  );

  useEffect(() => {
    const onLoad = async () => {
      await isWalletConnected();
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  useEffect(() => {
    if(walletAdd){
      console.log("fetching data");
    }
    // call solana program
    //set state
    setImgList(TEST_QUOTES);
  }, [walletAdd])


  return (
    <div className="App">
      <div className={walletAdd ? 'authed-container' : 'container'}>
        <div className="header-container">
          <p className="header">🎭 syte - π</p>
          <p className="sub-text">
            crowd-sourced quote-wall ✨
          </p>
          {
            !walletAdd && renderWalletNotConnectedContainer()
          }
          {
            walletAdd && renderWalletConnectedContainer()
          }
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
