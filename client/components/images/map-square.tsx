import React from "react";

interface MapSquareProps {
  src: string;
}

const MapSquare = ({ src }: MapSquareProps) => {
  return (
    <div>
      <img src={src} alt="map" className="h-20 w-20" />
    </div>
  );
};

export default MapSquare;
