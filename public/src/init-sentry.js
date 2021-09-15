'use strict';

initSentry();

function initSentry() {
  Sentry.onLoad(() => {
    //init sentry
    Sentry.init({
      beforeSend(event, hint) {
        if (hint.originalException === "Timeout") return null;
        return event;
      },
      dsn: "https://fdbb4f93909345b2877c34db1399c6e7@o519294.ingest.sentry.io/5629394",
      allowUrls: [
        //Only allow errors from our website. DenyUrls is a safety net but probably isn't actually helpful.
        // "localhost",
        "tunes-viewer.web.app"
      ],
      ignoreErrors: [
        // Random plugins/extensions
        "top.GLOBALS",
        // See: http://blog.errorception.com/2012/03/tale-of-unfindable-js-error.html
        "originalCreateNotification",
        "canvas.contentDocument",
        "MyApp_RemoveAllHighlights",
        "http://tt.epicplay.com",
        "Can't find variable: ZiteReader",
        "jigsaw is not defined",
        "ComboSearch is not defined",
        "http://loading.retry.widdit.com/",
        "atomicFindClose",
        // Facebook borked
        "fb_xd_fragment",
        // ISP "optimizing" proxy - `Cache-Control: no-transform` seems to
        // reduce this. (thanks @acdha)
        // See http://stackoverflow.com/questions/4113268
        "bmi_SafeAddOnload",
        "EBCallBackMessageReceived",
        // See http://toolbar.conduit.com/Developer/HtmlAndGadget/Methods/JSInjection.aspx
        "conduitPage",
      ],
      denyUrls: [
        // Facebook flakiness
        /graph\.facebook\.com/i,
        // Facebook blocked
        /connect\.facebook\.net\/en_US\/all\.js/i,
        // Woopra flakiness
        /eatdifferent\.com\.woopra-ns\.com/i,
        /static\.woopra\.com\/js\/woopra\.js/i,
        // Chrome extensions
        /extensions\//i,
        /^chrome:\/\//i,
        // Other plugins
        /127\.0\.0\.1:4001\/isrunning/i, // Cacaoweb
        /webappstoolbarba\.texthelp\.com\//i,
        /metrics\.itunes\.apple\.com\.edgesuite\.net\//i,
      ],
    });
  });

}