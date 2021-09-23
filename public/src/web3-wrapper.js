'use strict';

import erc721 from '../compiled_contract/ERC721.js';
import metadata from '../compiled_contract/Metadata.js';
import ErrorMonitor from "./error-monitor.js";


export default class Web3Wrapper {

  tunesAddress = '0xfa932d5cBbDC8f6Ed6D96Cc6513153aFa9b7487C'
  metadataAddress = '0xD9692a84cC279a159305a4ef1A01eFab77B4Deb2'

  tuneSongsAddress = '0x60d08DBDEd0bf56d21977b597793e69D1C5456e0';

  didLoadMoralis = false;
  moralisAppId = 'BgeS6qPwLUyr8ZyIyw6PR57SMmulsfgBUDG0dsc7';
  moralisServerUrl = 'https://5rujlfcn8amp.grandmoralis.com:2053/server';

  provider
  tunesContract
  metadataContract
  tunesSongsContract
  constructor() {
    this.provider = new ethers.providers.InfuraProvider('homestead', 'eefe88ec80f74d33a52967249a8d4db1')
    this.tunesContract = new ethers.Contract(this.tunesAddress, erc721, this.provider)
    this.metadataContract = new ethers.Contract(this.metadataAddress, metadata, this.provider)
    this.tunesSongsContract = new ethers.Contract(this.tuneSongsAddress, erc721, this.provider);
  }

  isWeb3Browser() {
    return window.ethereum;
  }

  async getOwnersAddress() {
    try {
      this.provider = new ethers.providers.Web3Provider(window.ethereum, "any")
      await this.provider.send("eth_requestAccounts", [])
      const signer = this.provider.getSigner()
      console.log(signer)
      const userAccount = await signer.getAddress()
      console.log("Account:", userAccount);
      return userAccount
    }
    catch (e) {
      const USER_DENIED = 4001;
      if (e.code !== USER_DENIED) { ErrorMonitor.logError(e) }
      return null
    }
  }

  async getOwnersTuneIds(ownerAddress) {
    try {
      if (!this.didLoadMoralis) {
        Moralis.initialize(this.moralisAppId);
        Moralis.serverURL = this.moralisServerUrl;
      }
      const options = { chain: 'eth', address: ownerAddress, token_address: this.tunesAddress };
      const moralisResponse = await Moralis.Web3API.account.getNFTsForContract(options);
      const tunesNFTs = moralisResponse.result;

      if (!tunesNFTs || !Array.isArray(tunesNFTs)) { return [] }

      return tunesNFTs.reduce((accum, tune) => {
        if (tune && tune.token_id) { accum.push(tune.token_id) }
        return accum;
      }, []);
    }
    catch (e) {
      ErrorMonitor.logError(e);
      return null;
    }
  }

  async getTune(tuneId) {
    const tuneOwner = await this._getTuneIDOwner(tuneId);
    const tuneOfficialMetaData = await this._getTuneOfficialMetaData(tuneId);
    const tunesSong = await this._getTunesSong(tuneId);
    const artunistCoverArtUrl = 'https://ipfs.io/ipfs/Qmcu552EPV98N9vi96sGN72XJCeBF4n7jC5XtA1h3HF5kC/' + tuneId + '-composite.png';

    return {
      "name": tuneOfficialMetaData.name,
      "owner": tuneOwner,
      "ownerUrl": "https://opensea.io/" + tuneOwner,
      "artist": "TODO",
      "album": tunesSong.name,
      "url": tunesSong.animation_url,
      // Placeholder for now till metadata contract is made available
      "cover_art_url": artunistCoverArtUrl,
      "id": tuneId,
    }
  }

  async _getTuneIDOwner(tuneId) {
    try {
      return await this.tunesContract.ownerOf(tuneId);
    }
    catch (e) {
      ErrorMonitor.logError(e);
      return '⚠️ problem loading owner'
    }
  }

  async _getTuneOfficialMetaData(tuneId) {
    const errorDefaults = {
      name: 'problem loading name',
    }

    try {
      let tuneOfficialMetadataUrl = await this.tunesContract.tokenURI(tuneId)
      // ignore the error that fetch throws from leaving the page before it finishes
      let response = await fetch('https://ipfs.io/ipfs/' + tuneOfficialMetadataUrl.slice(7));
      return await response.json() || errorDefaults;
    }
    catch (e) {
      ErrorMonitor.logError(e);
      return errorDefaults;
    }
  }

  async _getTunesSong(tuneId) {
    const errorDefaults = {
      animation_url: 'problem-loading-song.mp3',
      name: '⚠️ problem loading song name',
    }
    const tunesSongNotAvailForThisTuneDefaults = {
      animation_url: '',
      name: '',
    }

    let tunesSongBase64;
    try {
      tunesSongBase64 = await this.tunesSongsContract.tokenURI(tuneId);
    }
    catch (e) {
      return tunesSongNotAvailForThisTuneDefaults;
    }
    //tunes song exists/was available
    try {
      const tunesSong = JSON.parse(atob(tunesSongBase64.substring(29)));
      tunesSong.animation_url = 'https://ipfs.io/ipfs/' + tunesSong.animation_url.slice(7);
      return tunesSong
    }
    catch (e) {
      ErrorMonitor.logError(e);
      return errorDefaults;
    }
  }
}