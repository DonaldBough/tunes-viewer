'use strict';

export default class ErrorMonitor {
  static logError(error, isSlackError = false) {
    console.error(`${error} - ${error?.stack}`);

    try {
      if (window.location.href.includes('localhost')) { return; }

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
}