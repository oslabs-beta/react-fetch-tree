import React, { useMemo, useState, useEffect } from "react";
import { Group } from "@visx/group";
import { Cluster, hierarchy } from "@visx/hierarchy";
import { LinkVertical } from "@visx/shape";
import { LinearGradient } from "@visx/gradient";

const citrus = "#ddf163";
const white = "#ffffff";
const green = "#79d259";
const aqua = "#37ac8c";
const merlinsbeard = "#f7f7f3";
const background = "#306c90";

function Node({ node }) {
  const isRoot = node.depth === 0;
  const isParent = !!node.children;
  const width = node.data.name.length * 4.5 + 10;
  const height = 20;
  const centerX = -width / 2;
  const centerY = -height / 2;
  if (isRoot) return <RootNode node={node} />;
  console.log("name", node.data.name.length);
  return (
    <Group top={node.y} left={node.x}>
      {node.depth !== 0 && (
        <rect
          width={width}
          height={height}
          x={-width / 2}
          y={-height / 2}
          fill={background}
          stroke={isParent ? white : citrus}
          onClick={() => {
            alert(`clicked: ${JSON.stringify(node.data.name)}`);
          }}
        />
      )}
      <text
        dy=".33em"
        fontSize={9}
        fontFamily="Arial"
        textAnchor="middle"
        style={{ pointerEvents: "none" }}
        fill={isParent ? white : citrus}
      >
        {node.data.name}
      </text>
    </Group>
  );
}

function RootNode({ node }) {
  const width = 50;
  const height = 20;
  const centerX = -width / 2;
  const centerY = -height / 2;

  return (
    <Group top={node.y} left={node.x}>
      <rect
        width={width}
        height={height}
        y={centerY}
        x={centerX}
        fill="url('#top')"
      />
      <text
        dy=".33em"
        fontSize={9}
        fontFamily="Arial"
        textAnchor="middle"
        style={{ pointerEvents: "none" }}
        fill={background}
      >
        {node.data.name}
      </text>
    </Group>
  );
}

const defaultMargin = { top: 40, left: 10, right: 10, bottom: 40 };

function Example({ width, height, margin = defaultMargin }) {
  const [orgChart, setOrgChart] = useState({ name: "App", children: [] });

  const port = chrome.runtime.connect({ name: "React Fetch Tree" });

  // establishes a connection between devtools and background page
  port.postMessage({
    name: "connect",
    tabId: chrome.devtools.inspectedWindow.tabId,
  });

  // Listens for posts sent in specific ports and redraws tree
  port.onMessage.addListener((message) => {
    // if (!message.data) return; // abort if data not present, or if not of type object
    // if (typeof msg !== 'object') return;
    // curData = msg; // assign global data object
    // throttledDraw();
    console.log("in tree viz", message);
    setOrgChart(message.payload);
  });

  // console.log(orgChart);

  //USING useMemo
  const data = useMemo(() => {
    console.log("orgChart", orgChart);
    return hierarchy(orgChart);
  }, [orgChart]);

  //Using useEffect
  // var data = hierarchy(orgChart);
  // useEffect(() => {
  //   console.log("useEffect fired", orgChart);
  //   data = hierarchy(orgChart);
  // }, [orgChart]);

  const xMax = width - margin.left - margin.right - 20;
  const yMax = height - margin.top - margin.bottom;

  return width < 10 ? null : (
    <svg width={width} height={height}>
      <LinearGradient id="top" from={green} to={aqua} />
      <rect width={width} height={height} rx={14} fill={background} />
      <Cluster root={data} size={[xMax, yMax]}>
        {(cluster) => (
          <Group top={margin.top} left={margin.left}>
            {cluster.links().map((link, i) => (
              <LinkVertical
                key={`cluster-link-${i}`}
                data={link}
                stroke={merlinsbeard}
                strokeWidth="1"
                strokeOpacity={0.2}
                fill="none"
              />
            ))}
            {cluster.descendants().map((node, i) => (
              <Node key={`cluster-node-${i}`} node={node} />
            ))}
          </Group>
        )}
      </Cluster>
    </svg>
  );
}

export default function Viz() {
  return (
    <div className="Viz" style={{ display: "flex" }}>
      <Example
        width={500}
        height={400}
        style={{ width: "500px", height: "300px" }}
      />
    </div>
  );
}
