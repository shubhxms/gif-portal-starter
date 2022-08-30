import twitterLogo from './assets/twitter-logo.svg';
import './App.css';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { Program, Provider, web3} from '@project-serum/anchor';
import {useState, useEffect} from 'react';
import idl from './idl.json';
import kp from './keypair.json';
const { SystemProgram, Keypair } = web3;


// import { useState, useEffect } from 'react/cjs/react.production.min';

// Constants
// let baseAccount = Keypair.generate();
const arr = Object.values(kp._keypair.secretKey);
const secret = new Uint8Array(arr);
const baseAccount = Keypair.fromSecretKey(secret);
const programId = new PublicKey(idl.metadata.address);
const network = clusterApiUrl('devnet');
const opts = {
  preflightCommitment: "processed"
}
console.log("baseaccounts", baseAccount);
const TWITTER_HANDLE = 'shubhxms';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {

  const [walletAdd, setWalletAdd] = useState(null);
  const [inputVal, setInputVal] = useState('');
  const [imgList, setImgList] = useState(null);
  const TEST_QUOTES = [
    'https://www.nitch.com/content/posts/1653856600-720w.jpg',
    'https://www.nitch.com/content/posts/1654027204-720w.jpg',
    'https://www.nitch.com/content/posts/1642643038-720w.jpg',
    'https://www.nitch.cocomm/content/posts/1638803040-720w.jpg',
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

  const getProvider = () => {
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = new Provider(
      connection, window.solana, opts.preflightCommitment
    );
    return provider;
  }

  const sendImg = async () => {
    if (inputVal.length === 0){
      console.log("no input given");
      return;
    }
      console.log("link: ", inputVal);
      let link = inputVal;
      setInputVal('');
      setImgList([...imgList, link]);
      try{
        const provider = getProvider();
        const program = new Program(idl, programId, provider);
        await program.rpc.addQt(link, {
          accounts: {
            baseAccount: baseAccount.publicKey,
            user: provider.wallet.publicKey,
          },
        });
        console.log("qt succesfully sent to program", link);
        
        await getImgList();
      }catch (e) {
        console.log("error sending qt", e);
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

  const renderWalletConnectedContainer = () => {
    if (imgList === null){
      return(
        <div className="connected-container">
          <button className='cta-button submit-gif-button' onClick={createImgAccount}>
            One Time Initalization for Syte Account
          </button>
        </div>
      )
    }else{
      return(
    <div className='connected-container'>
      <form
        onSubmit={(evt) => {
          evt.preventDefault();
          sendImg();
        }}
      >
        <input type="text" placeholder='enter link to image' autoFocus onChange={(e) => {setInputVal(e.target.value)}}/>
        <button type='submit' className='cta-button submit-gif-button'>Submit</button>
      </form>
      <div className='gif-grid'>
        {imgList.map((qt, ind) => (
          <div className='gif-item' key={ind}>
            <img src={qt.qt} alt={qt}/>
            <p>vibed with {qt.userAddress.toString()}</p>
          </div>
        ))}
      </div>
    </div>
    )}
  };

  const createImgAccount = async () => {
    try{
      const provider = getProvider();
      const program = new Program(idl, programId, provider);
      console.log("ping");
      await program.rpc.startStuffOff({
        accounts:{
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId
        },
        signers: [baseAccount]
      })
      console.log("created a new baseaccount with address: ", baseAccount.publicKey.toString())
      await getImgList()
    }catch(e){
      console.log(e);
      console.log(SystemProgram);
  }
  }

  const getImgList = async() => {
    try{
      const provider = getProvider();
      const program = new Program(idl, programId, provider);

      const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
      console.log("got into", account);
      setImgList(account.qtList)
    }catch(e){
      console.log("error in getImgList", e);
      setImgList(null)
    }
  }
  
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
      getImgList()
    }
    // call solana program
    //set state
    // setImgList(TEST_QUOTES);
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
