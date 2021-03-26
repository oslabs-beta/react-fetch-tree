import React, { useEffect } from 'react';
import axios from 'axios';

const Nav = () => {
  useEffect(() => {
    axios.get('/name').then(res => console.log(res));
  });

  return (
    <div>
      <h1>The navbar</h1>
      <button>press me</button>
    </div>
  )
}

export default Nav;
