import componentObj from './componentStore';
import { useState } from 'react';

//Declare FetchTreeHook that user will import into their codebase
const FetchTreeHook = () => {
  const [dummy, setDummy] = useState(true);
  //Send componentObj to devtools panel 
  window.postMessage({ type: 'componentObj', payload: componentObj }, '*');
  //Trigger state change to populate data in panel
  setTimeout(() => {
    setDummy(!dummy);
  }, 2000);
  return null;
};

export default FetchTreeHook;