'use strict';

import erc721 from '../compiled_contract/ERC721.js';
import metadata from '../compiled_contract/Metadata.js';
// import ethers from "./ethers.js";
// import {Web3} from './ethers.js';


export default class Web3Wrapper {

  tunesAddress = '0xfa932d5cBbDC8f6Ed6D96Cc6513153aFa9b7487C'
  metadataAddress = '0xD9692a84cC279a159305a4ef1A01eFab77B4Deb2'

  provider
  tunesContract
  metadataContract
  constructor() {
    this.provider = new ethers.providers.InfuraProvider('homestead', 'eefe88ec80f74d33a52967249a8d4db1')
    this.tunesContract = new ethers.Contract(this.tunesAddress, erc721, this.provider)
    this.metadataContract = new ethers.Contract(this.metadataAddress, metadata, this.provider)
  }

  async getOwnersTuneId() {
    return null;
  }

  async getTuneIDOwner(tuneId) {
    let tuneOwner = await this.tunesContract.ownerOf(tuneId);
    return tuneOwner;
  }

  async getTune(tuneId) {

    console.log(ethers);  

    let tuneOwner = await this.getTuneIDOwner(tuneId);

    let tuneOfficialMetadata = await this.tunesContract.tokenURI(tuneId)

    fetch(tuneOfficialMetadata).then(response => response.json()).then(json => {
      console.log(json)
    })

    let response = await fetch(tuneOfficialMetadata);
    let json = await response.json();

    return {
      "name": json.name,
      "owner": tuneOwner,
      "ownerUrl": "https://opensea.io/" + tuneOwner,
      "artist": "TODO",
      "album": "Tunes",
      "url": "./your-tears-breed-cold-flurries-song",
      "cover_art_url": json.image
    }
  }


}