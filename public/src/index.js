'use strict'

import ErrorMonitor from "./error-monitor.js";
import Web3Wrapper from "./web3-wrapper.js";
import Pages from "./pages.js";

export default class IndexPage {
  async start() {
    try {
      this._listenForClicks();

      const web3 = new Web3Wrapper();
      let tuneId = new URL(window.location.href).searchParams.get('id');

      if (!tuneId) {
        tuneId = await web3.getOwnersTuneId()
      }
      if (!tuneId) { window.location = Pages.HOME.uri }

      await this._displayTune(tuneId, web3);
    }
    catch (e) {
      //TODO show blank album art and songs
      ErrorMonitor.logError(e);
    }
  }

  async _displayTune(tuneId, web3) {
    const tune = await web3.getTune(tuneId);

    Amplitude.init({
      "bindings": {
        37: 'prev',
        39: 'next',
        32: 'play_pause'
      },
      "songs": [tune]
    });
  }

  _listenForClicks() {
    //ignore space bar so we can pause/play 
    window.onkeydown = function(e) {
      const SPACE_BAR = 32;
      return !(e.keyCode == SPACE_BAR);
    };

    //Handles a click on the song played progress bar.
    document.getElementById('song-played-progress').addEventListener('click', function( e ){
      const offset = this.getBoundingClientRect();
      const x = e.pageX - offset.left;

      Amplitude.setSongPlayedPercentage( ( parseFloat( x ) / parseFloat( this.offsetWidth) ) * 100 );
    });

  }
}