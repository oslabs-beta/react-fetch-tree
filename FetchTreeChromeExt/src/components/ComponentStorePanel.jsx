import React from 'react';

const componentStore = JSON.parse('{"App":{},"null":{},"Nav":{"line: 6, column: 4":{"reqType":"axios","parentName":"Nav"}},"Body":{"line: 7, column: 4":{"reqType":"fetch","parentName":"Body"},"line: 1, column: 26":{"reqType":"fetch","parentName":"testVarExp"}},"Footer":{"line: 11, column: 2":{"reqType":"fetch","parentName":"Footer"},"line: 21, column: 9":{"reqType":"fetch","parentName":"testArrowExp"}}}')
const componentArr = Object.entries(componentStore);
console.log(componentArr);

const ComponentStorePanel = () => {
  return (
    <div>
      <h1>{ componentArr.map( key => <div> { key[0] !== "null" && key[0] } </div>) }</h1>
      <h1>{ componentArr.map( key => <div> { key[1] === {} ? 'No Data Requests' : Object.values(key[1]).map( key => <div> Data Reqest Type: { key.reqType } </div>)} </div>) }</h1>
    </div>
  )
}

export default ComponentStorePanel;