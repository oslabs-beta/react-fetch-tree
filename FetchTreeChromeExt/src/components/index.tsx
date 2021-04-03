// import React from "react";
// import ReactDOM from "react-dom";
// import ParentSize from '@visx/responsive/lib/components/ParentSize';
// import Viz from "./treeViz.js";
// //import componentStore from "@reactfetchtree/rft/componentStore";

// //let that = componentStore;
// function ProfileTimeline() {
//   return (
//     <div>
//       <p style={{ color: "white" }}>This element </p>
//       <Viz />
//     </div>
//   );
// }

// ReactDOM.render(<ProfileTimeline />, document.getElementById("app"));

import React from 'react';
import { render } from 'react-dom';
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import NavBar from './Nav';

import Viz from './treeViz.tsx';
import './sandbox-styles.css';


//function ProfileTimeline() {
  render(
    <div>
      <NavBar/>
      {/* <ParentSize>{({ width, height }) => <Viz width={width} height={height} />}</ParentSize> */}
    </div>
   ,
    document.getElementById('app'),
  );
//};
