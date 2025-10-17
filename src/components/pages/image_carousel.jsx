import React, { useEffect, useState } from "react";

const CategoryCarousel = ({ categoryimages }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || categoryimages.length === 0) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % categoryimages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [categoryimages, isPaused]);

  return (
    <div
      className="relative bg-gray-100 w-full overflow-hidden pt-13 "
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className="flex"
        style={{
          width: `${categoryimages.length * 100}%`,
          transform: `translateX(-${currentImageIndex * (100 / categoryimages.length)}%)`,
          transition: "transform 0.7s ease-in-out",
        }}
      >
        {categoryimages.map((img, idx) => (
          <div key={idx} className="w-full flex justify-center items-center">
            <img
              src={img}
              alt={`Slide ${idx}`}
              className=" h-[460px] object-contain"
            />
          </div>
        ))}
      </div>

      <div className="absolute bottom-2 w-full flex justify-center gap-2">
        {categoryimages.map((_, idx) => (
          <span
            key={idx}
            onClick={() => setCurrentImageIndex(idx)}
            className={`cursor-pointer text-xl ${
              idx === currentImageIndex ? "text-black" : "text-gray-400"
            }`}
          >
            {idx === currentImageIndex ? "●" : "○"}
          </span>
        ))}
      </div>
    </div>
  );
};

export default CategoryCarousel;
