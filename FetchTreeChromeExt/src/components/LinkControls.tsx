import React from 'react';

//Orientation settings for visualization
const controlStyles = { fontSize: 14, fontWeight: 500, color: '#282828' };

type Props = {
  slider: number;
  setSlider: (slider: number) => void;
  orientation: string;
  setOrientation: (orientation: string) => void;
};


export default function LinkControls({
  slider,
  setSlider,
  orientation,
  setOrientation,
}: Props) {

  const changeSlider = (e) => {
    setSlider(e.target.value);
  }

  return (
    <div style={controlStyles}>
      &nbsp;&nbsp;
      <label>Orientation:</label>&nbsp;
      <select
        onClick={e => e.stopPropagation()}
        onChange={e => setOrientation(e.target.value)}
        value={orientation}
      >
        <option value="vertical">Vertical</option>
        <option value="horizontal">Horizontal</option>
      </select>
      &nbsp;&nbsp;
      <div className="slidecontainer">
        <span>Node Spread: {slider} </span><input type="range" min="1" max="10" value={slider} className="slider" id="myRange" onChange={changeSlider}/>
      </div>
    </div>
  );
}
