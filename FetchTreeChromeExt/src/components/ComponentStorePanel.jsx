import React from 'react';

const componentStore = JSON.parse('{"App":{},"null":{},"Nav":{"line: 6, column: 4":{"reqType":"axios","parentName":"Nav"}},"Body":{"line: 7, column: 4":{"reqType":"fetch","parentName":"Body"},"line: 1, column: 26":{"reqType":"fetch","parentName":"testVarExp"}},"Footer":{"line: 11, column: 2":{"reqType":"fetch","parentName":"Footer"},"line: 21, column: 9":{"reqType":"fetch","parentName":"testArrowExp"}}}')
const componentArr = Object.entries(componentStore);
console.log(componentArr);

const ComponentStorePanel = () => {
  return (
    <div id='componentStore'>
        {componentArr.map((key, i) => 
          <div key={`component${i}`} className='component'> 
            <span className='componentName'> { key[0] !== "null" && key[0] } </span>
            <div className='componentDetails'> 
              <span className='details'>{ key[0] !== "null" && Object.entries(key[1]).length === 0 && '"No data requests"' }</span>
            </div>
            {Object.values(key[1]).map(key => 
              <div key={`${key.reqType}${key.parentName}${i}`} class='componentDetails'> 
                <span className='detailsLabel'>Data Request Type:</span> <span className='details'>"{ key.reqType }"</span>, <span className='detailsLabel'>Parent:</span> <span className='details'>"{ key.parentName }"</span> 
              </div>
            )}
          </div>
        )}
    </div>
  )
}

export default ComponentStorePanel;