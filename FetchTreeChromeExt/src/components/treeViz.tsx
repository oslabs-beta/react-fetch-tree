// import React, { useMemo, useState, useEffect } from "react";
// import { Group } from "@visx/group";
// import { Cluster, hierarchy } from "@visx/hierarchy";
// import { LinkVertical } from "@visx/shape";
// import { LinearGradient } from "@visx/gradient";

// const citrus = "#ddf163";
// const white = "#ffffff";
// const green = "#79d259";
// const aqua = "#37ac8c";
// const merlinsbeard = "#f7f7f3";
// const background = "#306c90";

// function Node({ node }) {
//   const isRoot = node.depth === 0;
//   const isParent = !!node.children;
//   const width = node.data.name.length * 4.5 + 10;
//   const height = 20;
//   const centerX = -width / 2;
//   const centerY = -height / 2;
//   if (isRoot) return <RootNode node={node} />;
//   console.log("name", node.data.name.length);
//   return (
//     <Group top={node.y} left={node.x}>
//       {node.depth !== 0 && (
//         <rect
//           width={width}
//           height={height}
//           x={-width / 2}
//           y={-height / 2}
//           fill={background}
//           stroke={isParent ? white : citrus}
//           onClick={() => {
//             alert(`clicked: ${JSON.stringify(node.data.name)}`);
//           }}
//         />
//       )}
//       <text
//         dy=".33em"
//         fontSize={9}
//         fontFamily="Arial"
//         textAnchor="middle"
//         style={{ pointerEvents: "none" }}
//         fill={isParent ? white : citrus}
//       >
//         {node.data.name}
//       </text>
//     </Group>
//   );
// }

// function RootNode({ node }) {
//   const width = 50;
//   const height = 20;
//   const centerX = -width / 2;
//   const centerY = -height / 2;

//   return (
//     <Group top={node.y} left={node.x}>
//       <rect
//         width={width}
//         height={height}
//         y={centerY}
//         x={centerX}
//         fill="url('#top')"
//       />
//       <text
//         dy=".33em"
//         fontSize={9}
//         fontFamily="Arial"
//         textAnchor="middle"
//         style={{ pointerEvents: "none" }}
//         fill={background}
//       >
//         {node.data.name}
//       </text>
//     </Group>
//   );
// }

// const defaultMargin = { top: 40, left: 10, right: 10, bottom: 40 };

// function Example({ width, height, margin = defaultMargin }) {
//   const [orgChart, setOrgChart] = useState({ name: "App", children: [] });

//   const port = chrome.runtime.connect({ name: "React Fetch Tree" });

//   // establishes a connection between devtools and background page
//   port.postMessage({
//     name: "connect",
//     tabId: chrome.devtools.inspectedWindow.tabId,
//   });

//   // Listens for posts sent in specific ports and redraws tree
//   port.onMessage.addListener((message) => {
//     // if (!message.data) return; // abort if data not present, or if not of type object
//     // if (typeof msg !== 'object') return;
//     // curData = msg; // assign global data object
//     // throttledDraw();
//     console.log("in tree viz", message);
//     setOrgChart(message.payload);
//   });

//   // console.log(orgChart);

  //USING useMemo
  // const data = useMemo(() => {
  //   console.log("orgChart", orgChart);
  //   return hierarchy(orgChart);
  // }, [orgChart]);

  //Using useEffect
  // var data = hierarchy(orgChart);
  // useEffect(() => {
  //   console.log("useEffect fired", orgChart);
  //   data = hierarchy(orgChart);
  // }, [orgChart]);

//   const xMax = width - margin.left - margin.right - 20;
//   const yMax = height - margin.top - margin.bottom;

//   return width < 10 ? null : (
//     <svg width={width} height={height}>
//       <LinearGradient id="top" from={green} to={aqua} />
//       <rect width={width} height={height} rx={14} fill={background} />
//       <Cluster root={data} size={[xMax, yMax]}>
//         {(cluster) => (
//           <Group top={margin.top} left={margin.left}>
//             {cluster.links().map((link, i) => (
//               <LinkVertical
//                 key={`cluster-link-${i}`}
//                 data={link}
//                 stroke={merlinsbeard}
//                 strokeWidth="1"
//                 strokeOpacity={0.2}
//                 fill="none"
//               />
//             ))}
//             {cluster.descendants().map((node, i) => (
//               <Node key={`cluster-node-${i}`} node={node} />
//             ))}
//           </Group>
//         )}
//       </Cluster>
//     </svg>
//   );
// }

// export default function Viz() {
//   return (
//     <div className="Viz" style={{ display: "flex" }}>
//       <Example
//         width={500}
//         height={400}
//         style={{ width: "500px", height: "300px" }}
//       />
//     </div>
//   );
// }

import React, { useState } from 'react';
import { Group } from '@visx/group';
import { hierarchy, Tree } from '@visx/hierarchy';
import { LinearGradient } from '@visx/gradient';
import { pointRadial } from 'd3-shape';
import useForceUpdate from './useForceUpdate';
import LinkControls from './LinkControls';
import getLinkComponent from './getLinkComponent';

interface TreeNode {
  name: string;
  isExpanded?: boolean;
  children?: TreeNode[];
}

const data: TreeNode = {
  name: 'T',
  children: [
    {
      name: 'A',
      children: [
        { name: 'A1' },
        { name: 'A2' },
        { name: 'A3' },
        {
          name: 'C',
          children: [
            {
              name: 'C1',
            },
            {
              name: 'D',
              children: [
                {
                  name: 'D1',
                },
                {
                  name: 'D2',
                },
                {
                  name: 'D3',
                },
              ],
            },
          ],
        },
      ],
    },
    { name: 'Z' },
    {
      name: 'B',
      children: [{ name: 'B1' }, { name: 'B2' }, { name: 'B3' }],
    },
  ],
};

const defaultMargin = { top: 30, left: 30, right: 30, bottom: 70 };

export type LinkTypesProps = {
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
};

export default function Viz({
  width: totalWidth,
  height: totalHeight,
  margin = defaultMargin,
}: LinkTypesProps) {
  const [layout, setLayout] = useState<string>('cartesian');
  const [orientation, setOrientation] = useState<string>('horizontal');
  const [linkType, setLinkType] = useState<string>('diagonal');
  const [stepPercent, setStepPercent] = useState<number>(0.5);
  const forceUpdate = useForceUpdate();

  const innerWidth = totalWidth - margin.left - margin.right;
  const innerHeight = totalHeight - margin.top - margin.bottom;

  let origin: { x: number; y: number };
  let sizeWidth: number;
  let sizeHeight: number;

  if (layout === 'polar') {
    origin = {
      x: innerWidth / 2,
      y: innerHeight / 2,
    };
    sizeWidth = 2 * Math.PI;
    sizeHeight = Math.min(innerWidth, innerHeight) / 2;
  } else {
    origin = { x: 0, y: 0 };
    if (orientation === 'vertical') {
      sizeWidth = innerWidth;
      sizeHeight = innerHeight;
    } else {
      sizeWidth = innerHeight;
      sizeHeight = innerWidth;
    }
  }

  const LinkComponent = getLinkComponent({ layout, linkType, orientation });

  return totalWidth < 10 ? null : (
    <div>
      <LinkControls
        layout={layout}
        orientation={orientation}
        linkType={linkType}
        stepPercent={stepPercent}
        setLayout={setLayout}
        setOrientation={setOrientation}
        setLinkType={setLinkType}
        setStepPercent={setStepPercent}
      />
      <svg width={totalWidth} height={totalHeight}>
        <LinearGradient id="links-gradient" from="#fd9b93" to="#fe6e9e" />
        <rect width={totalWidth} height={totalHeight} rx={14} fill="#272b4d" />
        <Group top={margin.top} left={margin.left}>
          <Tree
            root={hierarchy(data, d => (d.isExpanded ? null : d.children))}
            size={[sizeWidth, sizeHeight]}
            separation={(a, b) => (a.parent === b.parent ? 1 : 0.5) / a.depth}
          >
            {tree => (
              <Group top={origin.y} left={origin.x}>
                {tree.links().map((link, i) => (
                  <LinkComponent
                    key={i}
                    data={link}
                    percent={stepPercent}
                    stroke="rgb(254,110,158,0.6)"
                    strokeWidth="1"
                    fill="none"
                  />
                ))}

                {tree.descendants().map((node, key) => {
                  const width = 40;
                  const height = 20;

                  let top: number;
                  let left: number;
                  if (layout === 'polar') {
                    const [radialX, radialY] = pointRadial(node.x, node.y);
                    top = radialY;
                    left = radialX;
                  } else if (orientation === 'vertical') {
                    top = node.y;
                    left = node.x;
                  } else {
                    top = node.x;
                    left = node.y;
                  }

                  return (
                    <Group top={top} left={left} key={key}>
                      {node.depth === 0 && (
                        <circle
                          r={12}
                          fill="url('#links-gradient')"
                          onClick={() => {
                            node.data.isExpanded = !node.data.isExpanded;
                            console.log(node);
                            forceUpdate();
                          }}
                        />
                      )}
                      {node.depth !== 0 && (
                        <rect
                          height={height}
                          width={width}
                          y={-height / 2}
                          x={-width / 2}
                          fill="#272b4d"
                          stroke={node.data.children ? '#03c0dc' : '#26deb0'}
                          strokeWidth={1}
                          strokeDasharray={node.data.children ? '0' : '2,2'}
                          strokeOpacity={node.data.children ? 1 : 0.6}
                          rx={node.data.children ? 0 : 10}
                          onClick={() => {
                            node.data.isExpanded = !node.data.isExpanded;
                            console.log(node);
                            forceUpdate();
                          }}
                        />
                      )}
                      <text
                        dy=".33em"
                        fontSize={9}
                        fontFamily="Arial"
                        textAnchor="middle"
                        style={{ pointerEvents: 'none' }}
                        fill={node.depth === 0 ? '#71248e' : node.children ? 'white' : '#26deb0'}
                      >
                        {node.data.name}
                      </text>
                    </Group>
                  );
                })}
              </Group>
            )}
          </Tree>
        </Group>
      </svg>
    </div>
  );
}

