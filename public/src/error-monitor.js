'use strict';

import SharedHelper from "./shared-helper.js";

export default class ErrorMonitor {
  static logError(error, isSlackError = false) {
    console.error(`${error} - ${error?.stack}`);

    try {
      if (window.location.href.includes('localhost')) { return; }

      //TODO enable Sentry or other error monitoring
      if (window.Sentry) {
        Sentry.captureException(error);
      }
      else {
        console.error(`Sentry was not loaded during ${this.logError.name}`);
        // if (!isSlackError) { await this.logErrorThroughSlack(error) }
      }
    }
    catch (e) {
      console.error(`Exception raised while logging an error through Sentry or Slack`);
      // if (!isSlackError) { await this.logErrorThroughSlack(e) }
    }
  }

  static showErrorMessage(error = {}, actionCausingError, errorSolution) {
    const formattedMessage = this._getFormattedErrorMessage(error, actionCausingError, errorSolution);
    ErrorMonitor.displayErrorMessage(formattedMessage, error);
  }

  static displayErrorMessage(message, error) {
    prompt(message, `${error}\n\n${error?.stack}`);
  }

  static logDebug(message) {
    console.warn(message);
  }

  static _getFormattedErrorMessage(error, actionCausingError, errorSolution = 'try refreshing the page or try again later') {
    let displayMessage;

    if (actionCausingError) {
      displayMessage = `❌🙃 Sorry, we had a problem ${actionCausingError}. For now ${errorSolution}.`;
    }
    else {
      displayMessage = `❌🙃 Sorry, we ran into an error, ${errorSolution}`
    }

    displayMessage +=
        `\n\nIf this keeps happening, copy and send this technical jargon to @thedon in Discord or donaldbough@gmail.com so we can fix it:`;

    return displayMessage;
  }
}