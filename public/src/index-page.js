'use strict';

import ErrorMonitor from "./error-monitor.js";
import Web3Wrapper from "./web3-wrapper.js";
import SharedHelper from "./shared-helper.js";

export default class IndexPage {
  async start() {
    try {
      let randomTuneIds = [];
      const numberOfTunes = 5000;

      for (let i = 0; i < 12; i++) {
        let randomTuneId = Math.floor(Math.random() * numberOfTunes);
        randomTuneId++ //add 1 to make range 1 - 5,000 instead of 0 - 4,999
        randomTuneIds.push(randomTuneId)
      }

      const web3 = new Web3Wrapper();
      const getTunePromises = randomTuneIds.reduce((accum, tuneId) => {
        accum.push(web3.getTune(tuneId));
        return accum;
      }, []);

      const tunes = await Promise.all(getTunePromises);

      this._displayAlbums(tunes);
    }
    catch (e) {
      ErrorMonitor.logError(e);
    }
  }

  _displayAlbums(tunes = []) {
    const albumsHtml = tunes.reduce((accum, tune) => {
      accum += `
        <span class="mr-5 mb-5 text-center" style="max-width: 200px">
          <a href="${SharedHelper.getTunePageUrl(tune.id)}">
            <img src="${tune.cover_art_url}" width="200px" style="border-radius: 1rem;" alt="">
          </a>
          <p class="mb-0 mt-2">${tune.name}</p>   
        </span>
      `

      return accum;
    }, '');

    document.getElementById('albumContainer').innerHTML = albumsHtml;
  }
}