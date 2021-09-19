'use strict';

import SharedHelper from "./shared-helper.js";
import ErrorMonitor from "./error-monitor.js";
import Web3Wrapper from "./web3-wrapper.js";

export default class Navbar {
  async start() {
    try {
      this._listenForClicks();
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
      document.getElementById('searchTuneIdForm'),
    ].forEach(element => {
      element.addEventListener("submit", (event) => {
        return this._onTuneIdSearch(event);
      });
    });
  }

  _onTuneIdSearch(event) {
    event.preventDefault();

    try {
      const parsedTuneId = parseInt(
          document.getElementById('searchTuneIdInput').value.replace(/\D/g, '')
      );

      if (isNaN(parsedTuneId)) {
        SharedHelper.displayMessage(`❌🙅  ${document.getElementById('searchTuneIdInput').value} is not a number. Enter the token id for your tune, and try again.`)
        return false;
      }
      if (parsedTuneId < 1 || parsedTuneId > 5000) {
        SharedHelper.displayMessage(`❌🙅 ${document.getElementById('searchTuneIdInput').value} is not a tune id. Tune ids are the token ids between 1 and 5000.`)
        return false;
      }

      window.location.href = SharedHelper.getTunePageUrl(parsedTuneId);
    }
    catch (e) {
      ErrorMonitor.logError(e);
      ErrorMonitor.showErrorMessage(e, 'going to that tune', `be sure to use a valid tune id or try a different one`)
    }
  }

  async _goToOwnersPage() {
    try {
      const web3 = new Web3Wrapper();
      const ownerAddress = await web3.getOwnersAddress();

      if (!ownerAddress || ownerAddress.trim() === '') { throw new Error('owner address was null or empty') }
      window.location.href = SharedHelper.getOwnersTunesPageUrl(ownerAddress);
    }
    catch (e) {
      ErrorMonitor.logError(e);
      ErrorMonitor.showErrorMessage(e, 'loading your address', 'make sure you give access or try again later');
    }
  }
}