import React from "react";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { auth } from "../firebase";

function WatchlistButton({ movie }) {
  const user = auth.currentUser;

  const handleAddToWatchlist = async () => {
    if (!user) {
      alert("Please log in to save to watchlist.");
      return;
    }

    const movieRef = doc(db, "users", user.uid, "watchlist", movie.id.toString());
    await setDoc(movieRef, movie);
    alert("Added to watchlist ✅");
  };

  return (
    <button
      onClick={handleAddToWatchlist}
      style={{
        padding: "8px 16px",
        backgroundColor: "#444",
        color: "white",
        border: "none",
        borderRadius: "4px",
        marginLeft: "10px",
        cursor: "pointer",
      }}
    >
      + My List
    </button>
  );
}

export default WatchlistButton;
