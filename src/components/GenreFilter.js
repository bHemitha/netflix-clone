import React from "react";

function GenreFilter({ onSelect }) {
  const genres = [
    { label: "Action", value: "action" },
    { label: "Comedy", value: "comedy" },
    { label: "Horror", value: "horror" },
    { label: "Romance", value: "romance" },
  ];

  return (
    <div style={{ margin: "20px", textAlign: "center" }}>
      <label style={{ color: "white", marginRight: "10px" }}>🎯 Filter by Genre:</label>
      <select onChange={(e) => onSelect(e.target.value)} style={{ padding: "8px" }}>
        <option value="">-- Select Genre --</option>
        {genres.map((genre) => (
          <option key={genre.value} value={genre.value}>
            {genre.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default GenreFilter;
