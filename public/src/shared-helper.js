'use strict';

import Pages from "./pages.js";

export default class SharedHelper {
  static getTunePageUrl(tuneId) {
    return `${window.location.origin}/${Pages.TUNE.file}?id=${tuneId}`;
  }
}