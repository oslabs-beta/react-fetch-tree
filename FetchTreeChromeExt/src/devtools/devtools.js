let orgChart;
chrome.devtools.panels.create(
  "React Fetch Tree", // title for the panel tab
  null, // you can specify here path to an icon
  "index.html", // html page for injecting into the tab's content
  () => {
    console.log("panel top level");
    const port = chrome.runtime.connect({ name: "React Fetch Tree" });

    // establishes a connection between devtools and background page
    port.postMessage({
      name: "connect",
      tabId: chrome.devtools.inspectedWindow.tabId,
    });

    // Listens for posts sent in specific ports and redraws tree
    port.onMessage.addListener((message) => {
      // if (!message.data) return; // abort if data not present, or if not of type object
      // if (typeof msg !== 'object') return;
      // curData = msg; // assign global data object
      // throttledDraw();
      console.log("in panel", message);
      orgChart = message.payload;
    });
  }
);
