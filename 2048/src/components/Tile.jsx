import React from "react";
import './tile.css';

function getTileStyle(value) {
  const backgroundColors = {
    2: "#eee4da",
    4: "#ede0c8",
    8: "#f2b179",
    16: "#f59563",
    32: "#f67c5f",
    64: "#f65e3b",
    128: "#edcf72",
    256: "#edcc61",
    512: "#edc850",
    1024: "#edc53f",
    2048: "#edc22e",
  };

  return {
    backgroundColor: backgroundColors[value] || "#3c3a32",
    color: "#000", // Todos los números en negro para máximo contraste
  };
}

export default function Tile({ left, top, size, value }) {
  const style = getTileStyle(value);

  // Aumentamos el tamaño del texto según el valor
  let fontSize = 32;
  if (value >= 128) fontSize = 28;
  if (value >= 512) fontSize = 24;
  if (value >= 2048) fontSize = 20;

  const TILE_MARGIN = 6; // 🔹 margen fijo para que se vea el gap

  return (
    <div
      className="tile"
      style={{
        position: "absolute",
        left: `${left + TILE_MARGIN}px`,
        top: `${top + TILE_MARGIN}px`,
        width: `${size - TILE_MARGIN * 2}px`,
        height: `${size - TILE_MARGIN * 2}px`,
        backgroundColor: style.backgroundColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "8px",
      }}
    >
      <span
        className="text"
        style={{
          color: style.color,
          fontSize: `${fontSize}px`,
          fontWeight: "bold",
        }}
      >
        {value}
      </span>
    </div>
  );
}
