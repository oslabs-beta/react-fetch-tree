import React, { useState } from "react";
import { Group } from "@visx/group";
import { hierarchy, Tree } from "@visx/hierarchy";
import { LinearGradient } from "@visx/gradient";
import useForceUpdate from "./useForceUpdate";
import LinkControls from "./LinkControls";
import getLinkComponent from "./getLinkComponent";
import { Zoom } from "@visx/zoom";
import { localPoint } from "@visx/event";
interface TreeNode {
  name: string;
  isExpanded?: boolean;
  children?: TreeNode[];
  dataRequest?: string;
}

const data: TreeNode = {
  name: "T",
  children: [
    {
      name: "App",
      dataRequest: "fetch",
      children: [
        { name: "Component 1" },
        { name: "Component 2" },
        { name: "This is a very long name component 3" },
        {
          name: "Im outraged",
          children: [
            {
              name: "C1",
            },
            {
              name: "D",
              children: [
                {
                  name: "D1",
                },
                {
                  name: "D2",
                },
                {
                  name: "D3",
                },
              ],
            },
          ],
        },
      ],
    },
    { name: "Z" },
    {
      name: "B",
      children: [{ name: "B1" }, { name: "B2" }, { name: "B3" }],
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
  const [layout, setLayout] = useState<string>("cartesian");
  const [orientation, setOrientation] = useState<string>("vertical");
  const [linkType, setLinkType] = useState<string>("diagonal");
  const [stepPercent, setStepPercent] = useState<number>(0.5);
  const forceUpdate = useForceUpdate();

  const innerWidth = totalWidth - margin.left - margin.right;
  const innerHeight = totalHeight - margin.top - margin.bottom;

  let origin: { x: number; y: number };
  let sizeWidth: number;
  let sizeHeight: number;

  origin = { x: 0, y: 0 };
  if (orientation === "vertical") {
    sizeWidth = innerWidth;
    sizeHeight = innerHeight;
  } else {
    sizeWidth = innerHeight;
    sizeHeight = innerWidth;
  }

  const LinkComponent = getLinkComponent({ layout, linkType, orientation });

  const initialTransform = {
    scaleX: 1,
    scaleY: 1,
    translateX: 0,
    translateY: 0,
    skewX: 0,
    skewY: 0,
  };

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

      <Zoom
        width={totalWidth - 20}
        height={totalHeight}
        scaleXMin={1 / 2}
        scaleXMax={4}
        scaleYMin={1 / 2}
        scaleYMax={4}
        transformMatrix={initialTransform}
      >
        {(zoom) => (
          <div className="relative">
            <svg
              width={totalWidth}
              height={totalHeight}
              style={{ cursor: zoom.isDragging ? "grabbing" : "grab" }}
            >
              <LinearGradient id="links-gradient" from="#fd9b93" to="#fe6e9e" />
              <rect
                width={totalWidth}
                height={totalHeight}
                rx={14}
                fill="#272b4d"
              />
              <Group
                top={margin.top}
                left={margin.left}
                transform={zoom.toString()}
              >
                <Tree
                  root={hierarchy(data, (d) =>
                    d.isExpanded ? null : d.children
                  )}
                  size={[sizeWidth, sizeHeight]}
                  separation={(a, b) =>
                    (a.parent === b.parent ? 1 : 0.5) / a.depth
                  }
                >
                  {(tree) => (
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
                        const width = 60;
                        const height = 40;

                        let top: number;
                        let left: number;
                        if (orientation === "vertical") {
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
                                height={30}
                                width={node.data.name.length * 9}
                                y={-height / 2}
                                x={-width / 2}
                                fill={
                                  node.data.dataRequest ? "#fee12b" : "#272b4d"
                                }
                                stroke={
                                  node.data.children ? "#03c0dc" : "#26deb0"
                                }
                                strokeWidth={1}
                                strokeDasharray={
                                  node.data.children ? "0" : "2,2"
                                }
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
                              //dy="0em"
                              dy={node.data.dataRequest ? "0em" : "0.33em"}
                              fontSize={9}
                              fontFamily="Arial"
                              textAnchor="middle"
                              style={{
                                pointerEvents: "none",
                                textAlign: "center",
                              }}
                              fill={
                                node.depth === 0
                                  ? "#71248e"
                                  : node.data.dataRequest
                                  ? "black"
                                  : "#26deb0"
                              }
                            >
                              {node.data.name}
                            </text>
                            {node.data.dataRequest ? (
                              <text
                                dy="1em"
                                fontSize={9}
                                fontFamily="Arial"
                                textAnchor="middle"
                                style={{ pointerEvents: "none" }}
                                fill="black"
                              >
                                {"contains: "} {node.data.dataRequest}
                              </text>
                            ) : null}
                          </Group>
                        );
                      })}
                    </Group>
                  )}
                </Tree>
                <rect
                  width={totalWidth}
                  height={totalHeight}
                  rx={14}
                  fill="transparent"
                  onTouchStart={zoom.dragStart}
                  onTouchMove={zoom.dragMove}
                  onTouchEnd={zoom.dragEnd}
                  onMouseDown={zoom.dragStart}
                  onMouseMove={zoom.dragMove}
                  onMouseUp={zoom.dragEnd}
                  onMouseLeave={() => {
                    if (zoom.isDragging) zoom.dragEnd();
                  }}
                  onDoubleClick={(event) => {
                    const point = localPoint(event) || { x: 0, y: 0 };
                    zoom.scale({ scaleX: 1.1, scaleY: 1.1, point });
                  }}
                />
              </Group>
            </svg>
            <div className="controls">
              <button
                type="button"
                className="btn btn-zoom"
                onClick={() => zoom.scale({ scaleX: 1.2, scaleY: 1.2 })}
                style={{ border: "1px solid grey" }}
              >
                +
              </button>
              <button
                type="button"
                className="btn btn-zoom btn-bottom"
                onClick={() => zoom.scale({ scaleX: 0.8, scaleY: 0.8 })}
                style={{ border: "1px solid grey" }}
              >
                -
              </button>
              <button
                type="button"
                className="btn btn-lg"
                onClick={zoom.center}
                style={{
                  width: "50px",
                  marginBottom: "2px",
                  border: "1px solid grey",
                }}
              >
                Center
              </button>
              <button
                type="button"
                className="btn btn-lg"
                onClick={zoom.reset}
                style={{
                  width: "50px",
                  marginTop: "2px",
                  border: "1px solid grey",
                }}
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </Zoom>
    </div>
  );
}
