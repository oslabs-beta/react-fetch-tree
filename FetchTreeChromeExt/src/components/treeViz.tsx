import React, { useDebugValue, useState, useMemo } from "react";
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
interface DataRequest {
  name: string;
  dataRequest: string;
}

const defaultMargin = { top: 30, left: 30, right: 30, bottom: 30 };

export type LinkTypesProps = {
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  orgChart: TreeNode;
};

export default function Viz({
  width: totalWidth,
  height: totalHeight,
  margin = defaultMargin,
  orgChart: orgChart,
}: LinkTypesProps) {
  const [layout, setLayout] = useState<string>("cartesian");
  const [orientation, setOrientation] = useState<string>("vertical");
  const [linkType, setLinkType] = useState<string>("diagonal");
  const [stepPercent, setStepPercent] = useState<number>(0.5);
  // const [slider, setSlider] = useState<number>(5);
  const forceUpdate = useForceUpdate();
  const [displayFetch, setDisplayFetch] = useState<boolean>(false);
  const [fetchComponent, setFetchComponent] = useState<DataRequest>({ name: "", dataRequest: "" })
  // const [orgChart, setOrgChart] = useState<TreeNode>({ name: "App" });


  const innerWidth = totalWidth - margin.left - margin.right;
  const innerHeight = totalHeight - margin.top - margin.bottom;

  const data: TreeNode = useMemo(() => {
    return orgChart;
  }, [orgChart]);

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
      <div className="fetchBox">
        {displayFetch ? <p id="requestDisplay">{`Name: ${fetchComponent.name}, Data Request: ${fetchComponent.dataRequest}`}</p> : <p></p>}
        <LinkControls
          // slider={slider}
          // setSlider={setSlider}
          orientation={orientation}
          setOrientation={setOrientation}
        />
      </div>
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
            >
              <LinearGradient id="links-gradient" from="#26deb0" to="#94ffe4" />
              <rect
                width={totalWidth}
                height={totalHeight}
                rx={0}
                fill="#272b4d"
              />
              <Group
                top={margin.top}
                left={margin.left}
                transform={zoom.toString()}
              >
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

                <Tree
                  root={hierarchy(orgChart, (d) =>
                    d.isExpanded ? null : d.children
                  )}
                  size={[sizeWidth, sizeHeight]}
                  separation={(a, b) =>
                    (a.parent === b.parent ? 5 : 5)
                  }
                >
                  {(tree) => (
                    <Group top={origin.y} left={origin.x}>
                      {tree.links().map((link, i) => (
                        <LinkComponent
                          key={i}
                          data={link}
                          percent={stepPercent}
                          stroke="rgb(104, 210, 245, 0.6)"
                          strokeWidth="1"
                          fill="none"
                        />
                      ))}

                      {tree.descendants().map((node, key) => {
                        const width = 60;
                        const height = 30;

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
                                  forceUpdate();
                                }}
                              />
                            )}
                            {node.depth !== 0 && (

                              <rect
                                height={30}
                                width={node.data.name.length < 4 ? 30 : node.data.name.length > 15 ? node.data.name.length * 4.5 : node.data.name.length * 6}

                                y={-height / 2}
                                x={node.data.name.length < 4 ? -15 : node.data.name.length > 15 ? -node.data.name.length * 2.25 : -node.data.name.length * 3}
                                fill={
                                  node.data.dataRequest ? "#e8e8e8" : "#272b4d"
                                }
                                stroke={
                                  node.data.children ? "#b998f4" : "#26deb0"
                                }
                                strokeWidth={1}
                                strokeDasharray={
                                  node.data.children ? "0" : "2,2"
                                }
                                strokeOpacity={node.data.children ? 1 : 0.6}
                                rx={node.data.children ? 0 : 10}

                                onClick={() => {
                                  if (node.data.dataRequest) {
                                    setDisplayFetch(true);
                                    setFetchComponent({ name: node.data.name, dataRequest: node.data.dataRequest })
                                  } else {
                                    setDisplayFetch(false)
                                  }
                                  // node.data.isExpanded = !node.data.isExpanded;
                                  forceUpdate();
                                }}
                              />
                            )}
                            <text
                              dy={node.data.dataRequest ? "0em" : "0.33em"}
                              fontSize={9}
                              fontFamily="Arial"
                              textAnchor="middle"
                              style={{
                                pointerEvents: "none",
                                textAlign: "center",
                                display: "flex",
                                flexWrap: "wrap",
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
                          </Group>
                        );
                      })}
                    </Group>
                  )}
                </Tree>

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
