import React from "react";
import useMapGalleryStore from "@/stores/use-map-gallery-store";
import { CheckIcon } from "@radix-ui/react-icons";
import { maps } from "@/constants/maps";

const MapGallery = () => {
  const { selected, setSelected } = useMapGalleryStore();

  return (
    <div className="relative w-full grid grid-cols-4 gap-2">
      {maps.map((map, index) => {
        return (
          <div
            key={index}
            className="relative w-full h-full transition-transform duration-150 hover:scale-110"
            onClick={() => setSelected(index)}
          >
            <img
              src={map.src}
              alt={map.alt}
              className="w-full h-full object-cover object-center"
            />
            {selected === index && (
              <div className="absolute top-2 right-2 bg-accent w-6 h-6 flex items-center justify-center">
                <CheckIcon />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MapGallery;
