import React from 'react';
import { render } from 'react-dom';
import './sandbox-styles.css';
import Panel from "./Panel";

render(
  <div>
    <Panel />
  </div>,
  document.getElementById('app'),
);
