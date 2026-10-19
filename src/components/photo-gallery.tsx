"use client";
import { useState } from "react";
import Image from "next/image";

export function PhotoGallery({
  photos,
  alt,
  tag,
}: {
  photos: string[];
  alt: string;
  tag: string;
}) {
  const [active, setActive] = useState(0);
  const current = photos[active] ?? photos[0];
  return (
    <div className="detail-gallery">
      <div className="detail-photo">
        <Image
          src={current}
          alt={alt}
          fill
          priority
          unoptimized={current.startsWith("/api/")}
          sizes="(max-width: 900px) 100vw, 65vw"
        />
        <span className="photo-tag">{tag}</span>
      </div>
      {photos.length > 1 && (
        <div className="detail-thumbs">
          {photos.map((src, index) => (
            <button
              type="button"
              key={src}
              className={`detail-thumb${index === active ? " active" : ""}`}
              onClick={() => setActive(index)}
              aria-label={`Show photo ${index + 1} of ${photos.length}`}
              aria-current={index === active}
            >
              <Image
                src={src}
                alt=""
                fill
                unoptimized={src.startsWith("/api/")}
                sizes="120px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
