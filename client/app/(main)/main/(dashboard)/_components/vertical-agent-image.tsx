import React from "react";

interface VerticalAgentImageProps {
  agent: string;
}

const VerticalAgentImage = ({ agent }: VerticalAgentImageProps) => {
  return (
    <div>
      <img
        src={
          agent == "KAY/O"
            ? "/agents/vertical/Kay-o.png"
            : `/agents/vertical/${agent}.png`
        }
        alt={agent}
        className=""
      />
    </div>
  );
};

export default VerticalAgentImage;
