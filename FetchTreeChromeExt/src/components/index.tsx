import React from 'react';
import { render } from 'react-dom';
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import Viz from './treeViz';
import './sandbox-styles.css';

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



  render(
    <ParentSize>{({ width, height }) => <Viz width={width} height={height * 0.9} />}</ParentSize>,
    document.getElementById('app'),
  );
