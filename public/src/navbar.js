'use strict';

import SharedHelper from "./shared-helper.js";
import ErrorMonitor from "./error-monitor.js";
import Web3Wrapper from "./web3-wrapper.js";
import HardCodedSongTitles from "./hard-coded-song-titles.js";
import Autocomplete from "./autocomplete.js";

export default class Navbar {
  async start() {
    try {
      this._listenForClicks();

      Autocomplete.autocomplete(
          document.getElementById('searchTuneIdInput'),
          HardCodedSongTitles.getAllSongTitles(),
          this._onTuneIdSearch
      );
    }
    catch (e) {
      ErrorMonitor.logError(e);
    }
  }

  _listenForClicks() {
    document.getElementById('viewOwnersTunesButton').addEventListener('click', () => {
      this._goToOwnersPage();
    });

    [
      document.getElementById('searchTuneIdButton'),
      // document.getElementById('searchTuneIdForm'),
    ].forEach(element => {
      element.addEventListener("submit", (event) => {
        return this._onTuneIdSearch(event);
      });
    });
  }

  _onTuneIdSearch(event) {
    if (event && event.preventDefault) { event.preventDefault() }

    try {
      const searchedTitle = document.getElementById('searchTuneIdInput').value.replaceAll(`'`, ``).replaceAll(`"`, ``);
      console.log(`searched title: ${searchedTitle}`);
      const index = HardCodedSongTitles.getAllSongTitles().indexOf(searchedTitle);
      if (index === -1) {
        SharedHelper.displayMessage(`❌🙅 "${document.getElementById('searchTuneIdInput').value}" isn't a tunes song title. Make sure to click the suggestion, and try again.`)
        return false;
      }
      window.location.href = SharedHelper.getTunePageUrl(index + 1);
      return false;

      // const parsedTuneId = parseInt(
      //     document.getElementById('searchTuneIdInput').value.replace(/\D/g, '')
      // );
      //
      // if (isNaN(parsedTuneId)) {
      //   SharedHelper.displayMessage(`❌🙅  ${document.getElementById('searchTuneIdInput').value} is not a number. Enter the token id for your tune, and try again.`)
      //   return false;
      // }
      // if (parsedTuneId < 1 || parsedTuneId > 5000) {
      //   SharedHelper.displayMessage(`❌🙅 ${document.getElementById('searchTuneIdInput').value} is not a tune id. Tune ids are the token ids between 1 and 5000.`)
      //   return false;
      // }
      //
      // window.location.href = SharedHelper.getTunePageUrl(parsedTuneId);
      // return false;
    }
    catch (e) {
      ErrorMonitor.logError(e);
      ErrorMonitor.showErrorMessage(e, 'going to that tune', `be sure to use a valid tune song or try a different one`)
      return false;
    }
  }

  async _goToOwnersPage() {
    try {
      const web3 = new Web3Wrapper();
      if (SharedHelper.isMobileScreenSize() && !web3.isWeb3Browser()) {
        this._goToOwnersPageOnMobileWeb2Browser();
        return;
      }

      let ownerAddress = await web3.getOwnersAddress();

      if (!ownerAddress || ownerAddress.trim() === '') { ownerAddress = SharedHelper.getOwnerAddressManually() }
      if (!ownerAddress || ownerAddress.trim() === '') { return }

      window.location.href = SharedHelper.getOwnersTunesPageUrl(ownerAddress);
    }
    catch (e) {
      ErrorMonitor.showErrorMessage(e, 'loading your address', 'make sure you give access or try again later');
    }
  }

  _goToOwnersPageOnMobileWeb2Browser() {
    const ownerAddress = SharedHelper.getOwnerAddressManually();
    if (!ownerAddress || ownerAddress.trim() === '') { return }
    window.location.href = SharedHelper.getOwnersTunesPageUrl(ownerAddress);
  }
}