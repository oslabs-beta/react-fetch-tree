import React from 'react';

//Orientation settings for visualization
const controlStyles = { fontSize: 14, fontWeight: 500, color: '#282828' };

type Props = {
  orientation: string;
  setOrientation: (orientation: string) => void;
};


export default function LinkControls({
  orientation,
  setOrientation,
}: Props) {

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
    </div>
  );
}
