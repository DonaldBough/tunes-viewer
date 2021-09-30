'use strict'

import ErrorMonitor from "./error-monitor.js";
import Web3Wrapper from "./web3-wrapper.js";
import Pages from "./pages.js";
import SharedHelper from "./shared-helper.js";
import Navbar from "./navbar.js";

export default class TunePage {
  async start() {
    try {
      new Navbar().start();
      this._listenForClicks();

      const web3 = new Web3Wrapper();
      let tuneId = new URL(window.location.href).searchParams.get('id');

      if (!tuneId) {
        SharedHelper.displayMessage('No tune id found in url. Make sure your URL is correct. We\'ll take you back to the home page for now.');
        window.location = Pages.HOME.uri;
        return;
      }

      await this._displayTune(tuneId, web3);
    }
    catch (e) {
      ErrorMonitor.logError(e);
      ErrorMonitor.showErrorMessage(e, 'loading this tune', 'try viewing a different one until we figure out the problem');
      document.querySelector(`h1[data-amplitude-song-info="name"]`).innerHTML = `⚠️ could not load tune`;
    }
  }

  async _displayTune(tuneId, web3) {
    const tuneWithDerivatives = await web3.getTuneWithDerivatives(tuneId);

    this._addOrRemoveCarouselImages(tuneWithDerivatives.images.length);
    tuneWithDerivatives.images.forEach((tuneImage, i) => {
      const carouselImage = document.getElementsByClassName('carousel-item')[i].querySelector('img');
      carouselImage.src = tuneImage.image;
    });

    document.getElementById('tuneNumber').innerHTML = tuneWithDerivatives.id;
    document.getElementById('openSeaLink').href = `https://opensea.io/assets/0xfa932d5cbbdc8f6ed6d96cc6513153afa9b7487c/${tuneId}`;
    document.getElementById('openSeaLink').innerHTML = `https://opensea.io/assets/0xfa932d5cbbdc8f6ed6d96cc6513153afa9b7487c/${tuneId}`;
    document.getElementById('imagesCarousel').classList.add('glow');
    document.getElementById('imagesTitle').innerHTML = `Images for ${tuneWithDerivatives.name}`;
    document.getElementById('songsTitle').innerHTML = `Songs for ${tuneWithDerivatives.name}`;
    this._displayDerivativeImagesMetadata(tuneWithDerivatives.images);
    this.displayDerivativeSongsMetadata(tuneWithDerivatives.songs);

    const songs = tuneWithDerivatives.songs.reduce((accum, song) => {
      accum.push({
        url: song.song,
        album: song.songName,
        name: tuneWithDerivatives.songName,
        owner: tuneWithDerivatives.owner,
      });
      return accum;
    }, []);

    Amplitude.init({
      "bindings": {
        37: 'prev',
        39: 'next',
        32: 'play_pause'
      },
      "songs": songs
    });
  }

  displayDerivativeSongsMetadata(derivativeSongs) {
    derivativeSongs.forEach(derivative => {
      const link = derivative.song.length > 90 ? derivative.song.slice(0, 90) + '...' : derivative.song;
      document.getElementById('songsContainer').insertAdjacentHTML('beforeend', `
        <div class="mt-5">
          <h3>${derivative.name}</h3>
          <span class="h5 text-secondary">
            <i class="fas fa-link"></i>
          </span>
          <span>
            <a href="${derivative.song}" target="_blank" class="h5 font-italic" style="overflow-wrap: anywhere;">
              ${link}
            </a>
          </span>
          <div class="mt-2">
            <span class="h5 text-secondary">
              Website:
            </span>
            <span class="h5 text-secondary">
              <a href="${derivative.website}" target="_blank"  style="overflow-wrap: anywhere;">
                ${derivative.website}
              </a>
            </span>
          </div>
        </div>
      `);
    });
  }

  _displayDerivativeImagesMetadata(derivativeImages) {
    derivativeImages.forEach(derivative => {
      const link = derivative.image.length > 90 ? derivative.image.slice(0, 90) + '...' : derivative.image;
      document.getElementById('imagesContainer').insertAdjacentHTML('beforeend', `
        <div class="mt-5">
          <h3>${derivative.name}</h3>
          <span class="h5 text-secondary">
            <i class="fas fa-link"></i>
          </span>
          <span>
            <a href="${derivative.image}" target="_blank" class="h5 font-italic" style="overflow-wrap: anywhere;">
              ${link}
            </a>
          </span>
          <div class="mt-2">
            <span class="h5 text-secondary">
              Website:
            </span>
            <span class="h5 text-secondary">
              <a href="${derivative.website}" target="_blank"  style="overflow-wrap: anywhere;">
                ${derivative.website}
              </a>
            </span>
          </div>
        </div>
      `);
    });
  }

  _listenForClicks() {
    //handles a click on the song played progress bar.
    document.getElementById('song-played-progress').addEventListener('click', function( e ){
      const offset = this.getBoundingClientRect();
      const x = e.pageX - offset.left;

      Amplitude.setSongPlayedPercentage( ( parseFloat( x ) / parseFloat( this.offsetWidth) ) * 100 );
    });

  }

  _addOrRemoveCarouselImages(numOfImages) {
    try {
      const numOfHardcodedImages = 3;

      if (numOfHardcodedImages > numOfImages) {
        // remove un-needed elements from the end
        for (let i = numOfHardcodedImages; i > numOfImages; i--) {
          const indicators =  [...document.querySelectorAll('li[data-target="#imagesCarousel"]')];
          indicators[i - 1].remove();

          const images = [...document.getElementsByClassName('carousel-item')];
          images[i - 1].remove();
        }
      }
      else if (numOfHardcodedImages < numOfImages) {
        // add elements to the end
        for (let i = numOfHardcodedImages; i < numOfImages; i++) {
          document.getElementsByClassName('carousel-indicators')[0].insertAdjacentHTML('beforeend', `
            <li data-target="#imagesCarousel" data-slide-to="${i}"></li>
          `);
          document.getElementsByClassName('carousel-inner')[0].insertAdjacentHTML('beforeend', `
            <div class="carousel-item">
              <img class="d-block w-100" src="img/tunes-logo.png" style="height: 550px;">
            </div>
          `);
        }
      }
    }
    catch (e) {
      ErrorMonitor.logError(e);
    }
  }
}