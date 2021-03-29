import React, { useEffect } from 'react';
import { testVarExp } from './mockDataReq.js'


const Body = () => {
  useEffect(() => {
    fetch(`https://swapi.dev/api/people/${id}/`)
    .then((response) => response.json())
    .then((data) => {
      const { starships } = data;
      return starships;
    });

    const secondResult = testVarExp();
  })

  return (
    <div>
      <p>Hello world, this is the body</p>
    </div>
  )
}

export default Body;
