'use strict';

import ErrorMonitor from "./error-monitor.js";
import Web3Wrapper from "./web3-wrapper.js";
import SharedHelper from "./shared-helper.js";

export default class IndexPage {

  albumElements
  constructor() {
    this.albumElements = [...document.getElementById('albumContainer').querySelectorAll('span')];
  }

  async start() {
    try {
      this._listenForClicks();

      let randomTuneIds = [];
      const numberOfTunes = 5000;

      for (let i = 0; i < this.albumElements.length; i++) {
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
      ErrorMonitor.showErrorMessage(e, 'loading the albums')
    }
  }

  _displayAlbums(tunes = []) {
    this.albumElements.forEach((albumElement, index) => {
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

  _listenForClicks() {
    document.getElementById('viewOwnersTunesButton').addEventListener('click', () => {
      SharedHelper.viewOwnersTunes();
    });

    [
      document.getElementById('searchTuneIdButton'),
      document.getElementById('searchTuneIdForm'),
    ].forEach(element => {
      element.addEventListener("submit", function(event) {
        event.preventDefault();

        try {
          const parsedTuneId = parseInt(
              document.getElementById('searchTuneIdInput').value.replace(/\D/g,'')
          );

          if (isNaN(parsedTuneId)) {
            alert(`❌🙅  ${document.getElementById('searchTuneIdInput').value} is not a number. Enter the token id for your tune, and try again.`)
            return false;
          }
          if (parsedTuneId < 1 || parsedTuneId > 5000) {
            alert(`❌🙅 ${document.getElementById('searchTuneIdInput').value} is not a tune id. Tune ids are the token ids between 1 and 5000.`)
            return false;
          }

          window.location.href = SharedHelper.getTunePageUrl(parsedTuneId);
        }
        catch (e) {
          ErrorMonitor.logError(e);
          ErrorMonitor.showErrorMessage(e, 'going to that tune', `be sure to use a valid tune id or try a different one`)
        }
      });
    });
  }
}