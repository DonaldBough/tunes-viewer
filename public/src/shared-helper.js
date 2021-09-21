'use strict';

import Pages from "./pages.js";
import Web3Wrapper from "./web3-wrapper.js";
import ErrorMonitor from "./error-monitor.js";
import CacheWrapper from "./cache-wrapper.js";

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

  static getOwnerAddressManually() {
    let ownerAddress;
    const cachedOwnerAddress = CacheWrapper.getString(CacheWrapper.OWNER_ADDRESS_CACHE_KEY);

    if (cachedOwnerAddress && cachedOwnerAddress !== '') {
      if (confirm(`We couldn't connect to your wallet, but have the address you pasted last time. Would you like to use that?`)) {
        ownerAddress = cachedOwnerAddress;
      }
    }

    if (!ownerAddress || ownerAddress.trim() === '') {
      ownerAddress = prompt(`We couldn't get your address from your wallet. If you didn't cancel, manually paste in your address here`);
      if (ownerAddress && ownerAddress !== '') {
        CacheWrapper.setString(CacheWrapper.OWNER_ADDRESS_CACHE_KEY, ownerAddress);
      }
    }
    return ownerAddress;
  }

  static isMobileScreenSize() {
    // https://stackoverflow.com/a/8876069
    const width = Math.max(
        document.documentElement.clientWidth,
        window.innerWidth || 0
    );
    return width <= 768;
  }

  static copyTextToClipboard(text, handleErrors = true) {
    try {
      const textArea = document.createElement("input");

      // Avoid scrolling to bottom
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.position = "fixed";

      document.body.appendChild(textArea);
      textArea.value = text;
      textArea.focus();
      textArea.select();
      textArea.setSelectionRange(0, 99999); /* For mobile devices */
      //Copy the text inside the text field
      document.execCommand("copy");

      textArea.remove();

      alert(`✅ URL copied to your clipboard`);
    }
    catch (e) {
      ErrorMonitor.logError(e);
      if (handleErrors) {
        prompt(`⚠️🤷 Couldn't copy to your clipboard. Just copy from here instead:`, text);
      }
      else {
        throw e;
      }
    }
  }
}