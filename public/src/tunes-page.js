'use default';

import SharedHelper from "./shared-helper.js";
import Web3Wrapper from "./web3-wrapper.js";
import ErrorMonitor from "./error-monitor.js";
import Navbar from "./navbar.js";

export default class TunesPage {

  albumElements
  constructor() {
    this.albumElements = SharedHelper.getAlbumElements();
  }

  async start() {
    try {
      new Navbar().start();
      this._listenForClicks();

      try {
        const originalText = document.getElementById('tunesGalleryText').innerText;
        if (SharedHelper.isMobileScreenSize()) {
          //remove A from "A Tunes Gallery" on mobile
          document.getElementById('tunesGalleryText').innerHTML = originalText.substr(2);
        }
      }
      catch (e) {
        ErrorMonitor.logError(e);
      }

      const ownerAddress = new URL(window.location.href).searchParams.get('owner');

      if (!ownerAddress || ownerAddress === '') {
        SharedHelper.displayMessage('No address found from URL. Make sure the url is formatted correctly.');
        return;
      }
      document.getElementById('ownerText').innerHTML = ownerAddress;

      const web3 = new Web3Wrapper();
      const tuneIds = await web3.getOwnersTuneIds(ownerAddress);
      if (!tuneIds) { throw new Error(`tune ids were null for owner`) }
      if (tuneIds.length === 0) { SharedHelper.displayMessage('No tunes were found for this address') }

      const tunes = await SharedHelper.loadTuneIds(tuneIds);

      this._addOrRemoveAlbumElements(tunes.length);
      SharedHelper.displayAlbums(this.albumElements, tunes);
    }
    catch (e) {
      ErrorMonitor.logError(e);
      ErrorMonitor.showErrorMessage(e, 'loading your tunes');
    }
  }

  _addOrRemoveAlbumElements(numOfTunes) {
    try {
      const numOfAlbumElements = this.albumElements.length;

      if (numOfAlbumElements > numOfTunes) {
        // remove un-needed album elements from the end
        for (let i = numOfAlbumElements; i > numOfTunes; i--) {
          this.albumElements[i - 1].remove();
        }
        this.albumElements = SharedHelper.getAlbumElements();
      }
      else if (numOfAlbumElements < numOfTunes) {
        // add album elements to the end
        let newAlbumElements = '';
        for (let i = numOfAlbumElements; i < numOfTunes; i++) {
          newAlbumElements += SharedHelper.getEmptyAlbumHtml();
        }
        this.albumElements = SharedHelper.getAlbumElements();
      }
    }
    catch (e) {
      ErrorMonitor.logError(e);
    }
  }

  _listenForClicks() {
    document.getElementById('shareYourGalleryButton').addEventListener('click', () => {
      try {
        SharedHelper.copyTextToClipboard(window.location.href, false);
      }
      catch (e) {
        alert(`⚠️ Couldn't copy to your clipboard. Instead, just copy the url and share it.`);
      }
    });
  }
}