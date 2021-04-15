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
npm i @reactfetchtree/rft
```

**Configure the parser to read from your root file:**

React Fetch Tree uses an abstract syntax parser to find data requests within your React app and maps these to the component tree visualization in the browser. In order for the parser to run correctly and access all of your components, you will need to pass in the root file path to the parser directly

To do this:

1. Open your node_modules folder, and navigate to the @reactfetchtree/rft folder.
2. Go to the parser.ts file and enter the path for the entry file. Your entry file is the place where you are hanging your app(The path is already set up with ../../../ which should bring you to your root folder).
   The place to add your entry file will look like this:

```javascript
const resultObj: string = JSON.stringify(
  dependenciesGraph(path.join(__dirname, "../../../ENTER PATH HERE"))
);
```

3. Save this file. Now in your terminal within your app directory, run the following command:

```javascript
npm explore @reactfetchtree/rft -- npm run parser
```

4. Your component table has now been generated! If you want to see this data you can find it at node_modules/@reactfetchtree/rft/componentStore.js.

**Import the Fetch Tree Hook to your React application:**

1. Inside your top level component (for example, your App.js file), import the Fetch Tree Hook and add the hook component inside the return statement within the outer enclosing div's or fragment.

```javascript
import FetchTreeHook from "@reactfetchtree/rft/FetchTreeHook";
```

2. You can now start your local server and run the Fetch Tree Chrome Extension in your browser.


## Project contributors

Trevor Carr 
  - [linkedin](https://www.linkedin.com/in/carr-trevor/)
  - [Github](https://github.com/trevcarr95)

Cara Dibdin
  - [Linkedin](https://www.linkedin.com/in/cara-dibdin/)
  - [Github](https://github.com/caradubdub)

James Ferrell
  - [Linkedin](https://www.linkedin.com/in/james-d-ferrell/)
  - [Github](https://github.com/jdferrell009)

Chris Lung
  - [Linkedin](https://www.linkedin.com/in/chris-lung-cpa-5b69b2ba/)
  - [Github](https://github.com/chrisl-13)

Anika Mustafiz
  - [Linkedin](https://www.linkedin.com/in/anikamustafiz-lillies/)
  - [Github](https://github.com/amustafiz)