import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import {
  collection,
  getDocs,
  query,
  where
} from "firebase/firestore";
import movieTrailer from "movie-trailer";
import YouTube from "react-youtube";
import "./Watchlist.css";

function Watchlist() {
  const { user } = useAuth();
  const [watchlist, setWatchlist] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchWatchlist = async () => {
      try {
        const q = query(
          collection(db, "watchlist"),
          where("userId", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);
        const items = querySnapshot.docs.map((doc) => doc.data());
        setWatchlist(items);
      } catch (err) {
        console.error("Error fetching watchlist:", err);
      }
    };

    fetchWatchlist();
  }, [user]);

  const handleClickPoster = (movie) => {
    if (trailerUrl && selectedMovieId === movie.id) {
      // Close trailer if clicking again
      setTrailerUrl("");
      setSelectedMovieId(null);
    } else {
      movieTrailer(movie?.title || movie?.name || movie?.original_name || "")
        .then((url) => {
          const urlParams = new URLSearchParams(new URL(url).search);
          setTrailerUrl(urlParams.get("v"));
          setSelectedMovieId(movie.id);
        })
        .catch((err) => {
          console.error("Trailer not found:", err);
          alert("Trailer not found");
        });
    }
  };

  return (
    <div style={{ padding: "80px 30px", color: "white" }}>
      <h2>📄 My Watchlist</h2>

      {watchlist.length === 0 ? (
        <p>No movies in your watchlist yet.</p>
      ) : (
        <div className="watchlist__grid">
          {watchlist.map((movie) => (
            <div key={movie.id} className="watchlist__card">
              <img
                className="watchlist__poster"
                src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                alt={movie.title}
                onClick={() => handleClickPoster(movie)}
              />
              <h4 className="watchlist__title">{movie.title || movie.name}</h4>

              {trailerUrl && selectedMovieId === movie.id && (
                <div className="watchlist__trailer">
                  <YouTube
                    videoId={trailerUrl}
                    opts={{
                      height: "250",
                      width: "100%",
                      playerVars: {
                        autoplay: 1,
                        mute: 0,
                        controls: 1,
                      },
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Watchlist;
