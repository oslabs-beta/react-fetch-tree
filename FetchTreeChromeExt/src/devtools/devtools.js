//Create panel 
chrome.devtools.panels.create(
  "React Fetch Tree", // Title for the panel tab
  null, // Can specify path to an icon
  "index.html", // Html page for injecting into the tab's content
  () => { }
);
