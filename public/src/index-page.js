'use strict';

import ErrorMonitor from "./error-monitor.js";
import SharedHelper from "./shared-helper.js";
import NavBar from "./navbar.js";

export default class IndexPage {

  albumElements
  constructor() {
    this.albumElements = this.albumElements = SharedHelper.getAlbumElements();
  }

  async start() {
    try {
      new NavBar().start();

      let randomTuneIds = [];
      const numberOfTunes = 5000;

      for (let i = 0; i < this.albumElements.length; i++) {
        let randomTuneId = Math.floor(Math.random() * numberOfTunes);
        randomTuneId++ //add 1 to make range 1 - 5,000 instead of 0 - 4,999
        randomTuneIds.push(randomTuneId)
      }

      const tunes = await SharedHelper.loadTuneIds(randomTuneIds);
      SharedHelper.displayAlbums(this.albumElements, tunes);
    }
    catch (e) {
      ErrorMonitor.logError(e);
      ErrorMonitor.showErrorMessage(e, 'loading the albums')
    }
  }
}