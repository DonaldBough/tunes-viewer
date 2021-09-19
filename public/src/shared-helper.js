'use strict';

import Pages from "./pages.js";
import Web3Wrapper from "./web3-wrapper.js";
import ErrorMonitor from "./error-monitor.js";

export default class SharedHelper {
  static getTunePageUrl(tuneId) {
    return `${window.location.origin}/${Pages.TUNE.file}?id=${tuneId}`;
  }

  static getOwnersTunesPageUrl(ownerAddress) {
    return `${window.location.origin}/${Pages.TUNES.file}?owner=${ownerAddress}`;
  }

  static async loadTuneIds(tuneIds) {
    const web3 = new Web3Wrapper();
    const getTunePromises = tuneIds.reduce((accum, tuneId) => {
      accum.push(web3.getTune(tuneId));
      return accum;
    }, []);

    const tunes = await Promise.all(getTunePromises);
    return tunes;
  }

  static getAlbumElements() { return [...document.getElementById('albumContainer').querySelectorAll('span')] }

  static getEmptyAlbumHtml() {
    return `
      <span class="ml-4 ml-lg-0 ml-lg-0 mr-lg-5 mb-5 text-center" style="max-width: 220px">
        <a href="">
          <img src=img/tunes-logo.png width="220px" alt="">
        </a>
        <p class="mb-0 mt-2">loading...</p>
      </span>
    `;
  }

  static displayAlbums(albumElements, tunes = []) {
    albumElements.forEach((albumElement, index) => {
      try {
        const tune = tunes[index];

        if (tune.cover_art_url && tune.name && tune.id) {
          albumElement.querySelector('img').src = tune.cover_art_url;
          albumElement.querySelector('img').style.borderRadius = '1rem';
          albumElement.querySelector('a').href = SharedHelper.getTunePageUrl(tune.id);
          albumElement.querySelector('p').innerHTML = tune.name;
        }
      }
      catch (e) {
        ErrorMonitor.logError(e);
        if (albumElement && albumElement.querySelector('p') && albumElement.querySelector('p').innerHTML) {
          albumElement.querySelector('p').innerHTML = '⚠️ could not load tune'
        }
      }
    });
  }

  static displayMessage(message) {
    alert(message);
  }
}