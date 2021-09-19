'use strict';

import erc721 from '../compiled_contract/ERC721.js';
import metadata from '../compiled_contract/Metadata.js';
import ErrorMonitor from "./error-monitor.js";


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

  async getOwnersAddress() {
    //TODO connect to wallet and return their address. Return null or empty string if we can't get it
    return '0x9019738cdc9b33a3db6b924e14f93b1d58c5c49e';
  }

  async getOwnersTuneIds(ownerAddress) {
    //TODO connect to wallet and return tune ids belonging to owner.
    //TODO return null for error, empty array display 'no tunes found' message
    return [4588, 3173, 3053, 2195, 1783];
  }

  async getTuneIDOwner(tuneId) {
    let tuneOwner = await this.tunesContract.ownerOf(tuneId);
    return tuneOwner;
  }

  async getTune(tuneId) {
    let tuneOwner = await this.getTuneIDOwner(tuneId);

    let tuneOfficialMetadata = await this.tunesContract.tokenURI(tuneId)

    let tuneDataUri = 'https://ipfs.io/ipfs/' + tuneOfficialMetadata.slice(7);

    let response;
    try {
      // ignore the error that fetch throws from leaving the page before it finishes
      response = await fetch(tuneDataUri);
    }
    catch (e) {
      ErrorMonitor.logError(e);
      return;
    }

    let json = await response.json();
    // console.log(json)

    let imageCoverArt = 'https://ipfs.io/ipfs/Qmcu552EPV98N9vi96sGN72XJCeBF4n7jC5XtA1h3HF5kC/' + tuneId + '-composite.png';
    console.log(imageCoverArt)


    return {
      "name": json.name,
      "owner": tuneOwner,
      "ownerUrl": "https://opensea.io/" + tuneOwner,
      "artist": "TODO",
      "album": "Tunes",
      "url": "ipfs.io/songs-coming-soon.mp3",
      // Placeholder for now till metadata contract is made available
      "cover_art_url": imageCoverArt,
      "id": tuneId,
    }
  }


}