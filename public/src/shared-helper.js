'use strict';

import Pages from "./pages.js";
import Web3Wrapper from "./web3-wrapper.js";
import ErrorMonitor from "./error-monitor.js";

export default class SharedHelper {
  static getTunePageUrl(tuneId) {
    return `${window.location.origin}/${Pages.TUNE.file}?id=${tuneId}`;
  }

  static async viewOwnersTunes() {
    try {
      const web3 = new Web3Wrapper();

      const tuneIds = await web3.getOwnersTuneIds();
      if (tuneIds.length > 0) {
        //only show the first of an owners tunes for now
        window.location.href = SharedHelper.getTunePageUrl(tuneIds[0]);
      }
      else {
        alert('⚠️🤷 We could not find any tunes for this wallet.')
      }
    }
    catch (e) {
     ErrorMonitor.logError(e);
     ErrorMonitor.showErrorMessage(e, 'loading your tunes', 'try finding them manually on home page search bar')
    }
  }
}