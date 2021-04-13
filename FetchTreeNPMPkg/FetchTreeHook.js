import componentObj from "./componentStore";

//declare FetchTreeHook that user will import into their codebase
// const FetchTreeHook = () => {
//   //set up listener for messages coming from browser/chrome extension
//   window.addEventListener('message', (event) => {
//     // only accept messages from the current tab
//     if (event.source !== window) return;
//     if (event.data) {
//       //conditional check to see if inject script has been initialized in the browser
//       if (event.data.type === 'message' && event.data.payload === 'InjectScriptInitialized') {
//         console.log("inject script message has been received in FetchTreeHook", event.data);
//         //send componentObj to chrome extension
//         window.postMessage({ type: 'componentObj', payload: componentObj });
//       }
//     }
//   });
//   return null;
// };
const FetchTreeHook = () => {
  const [dummy, setDummy] = useState(true);
  window.postMessage({ type: 'componentObj', payload: componentObj }, "*");
  setTimeout(() => {
    setDummy(!dummy);
  }, 2000);
  return null;
};

export default FetchTreeHook;