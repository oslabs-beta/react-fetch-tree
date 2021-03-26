import React, { useEffect } from 'react';
import { testFuncExp, testArrowExp } from './mockDataReq.js'


const Footer = () => {
  let fetchResult;
  useEffect(() => {
    fetchResult = testArrowExp();
  })

  return (
    <div>
      <h2>I am the footer {fetchResult}</h2>
    </div>
  )
}

export default Footer;
