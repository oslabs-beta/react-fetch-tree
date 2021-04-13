# React Fetch Tree

React Fetch Tree is a tool for visualizing the location of data requests in a React app. React Fetch Tree can be used to get a bird’s eye view of your React application, show you at a glance where data requests are within your components, and show you a schema of components and their corresponding data requests.

# Setting up React Fetch Tree

To use React Fetch Tree there are two steps -

1. Download Chrome Extension here - the Chrome extension provides a panel in the Chrome Dev Tools that shows the visualization of your component tree and schema of your components with corresponding data requests.
2. Download this NPM package in your React application. This allows the parser to access your root application folder and find all data requests in the application.

In order to obtain the structure of your app for the visualization React Fetch Tree relies on the React Developer Tools. Please install the [React Developer Tools here](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en) if you haven't already.

# Installation

**To download the package:**

```javascript
npm i @rft/reactfetchtree
```

**Configure the parser to read from your root file:**

tk

**Import the Fetch Tree Hook to your React application:**

tk
