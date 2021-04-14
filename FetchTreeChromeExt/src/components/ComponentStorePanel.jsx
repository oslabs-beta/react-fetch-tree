import React from 'react';

//Display all components and their corresponding data requests 
const ComponentStorePanel = (props) => {
  return (
    <div id='componentStore'>
      {props.componentArr.map((key, i) =>
        <div key={`component${i}`} className='component'>
          <span className='componentName'> {key[0] !== "null" && key[0]} </span>
          <div className='componentDetails'>
            <span className='details'>{key[0] !== "null" && Object.entries(key[1]).length === 0 && '"No data requests"'}</span>
          </div>

          {Object.values(key[1]).map(key =>
            <div key={`${key.reqType}${key.parentName}${i}`} className='componentDetails'>
              <span className='detailsLabel'>Data Request Type:</span> <span className='details'>"{key.reqType}"</span> <span className='detailsLabel'>Parent:</span> <span className='details'>"{key.parentName}"</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ComponentStorePanel;