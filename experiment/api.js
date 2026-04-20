function cleanSenders(doc) {
  doc.querySelectorAll("span.sender").forEach(span => {
    const text = span.textContent;
    const bracket = text.indexOf(" <");
    if (bracket !== -1) {
      span.textContent = text.substring(0, bracket);
    }
  });
}

function attachToBrowser(browser) {
  if (browser._senderCleanupAttached) return;
  browser._senderCleanupAttached = true;

  const attach = () => {
    try {
      const doc = browser.contentDocument;
      if (!doc || !doc.documentElement) return;
      cleanSenders(doc);
      const observer = new browser.contentWindow.MutationObserver(() => cleanSenders(doc));
      observer.observe(doc.documentElement, { childList: true, subtree: true });
    } catch(e) {
      console.error("SenderCleanup attach:", e);
    }
  };

  if (browser.contentDocument?.readyState === "complete") {
    attach();
  }

  browser.addEventListener("load", attach, true);
}

function observeWindow(win) {
  try {
    const doc = win.document;

    doc.querySelectorAll("browser").forEach(b => attachToBrowser(b));

    const observer = new win.MutationObserver(() => {
      doc.querySelectorAll("browser").forEach(b => attachToBrowser(b));
    });
    observer.observe(doc.documentElement, { childList: true, subtree: true });
  } catch(e) {
    console.error("SenderCleanup observeWindow:", e);
  }
}

this.SenderCleanup = class extends ExtensionCommon.ExtensionAPI {
  onStartup() {
    for (let win of Services.wm.getEnumerator("mail:3pane")) {
      observeWindow(win);
    }
    Services.wm.addListener({
      onOpenWindow(xulWindow) {
        const win = xulWindow.QueryInterface(Ci.nsIInterfaceRequestor)
          .getInterface(Ci.nsIDOMWindow);
        win.addEventListener("load", () => {
          if (win.document.documentElement.getAttribute("windowtype") === "mail:3pane") {
            observeWindow(win);
          }
        }, { once: true });
      }
    });
  }

  onShutdown() {}

  getAPI(context) {
    return { SenderCleanup: {} };
  }
};