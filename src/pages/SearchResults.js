import React, { useEffect, useState, useCallback } from "react";
import axios from "../axios";
import { useLocation } from "react-router-dom";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";
import { useInView } from "react-intersection-observer";
import "./SearchResults.css";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SearchResults() {
  const query = useQuery();
  const searchTerm = query.get("q");
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const [trailerUrl, setTrailerUrl] = useState("");
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  const { ref, inView } = useInView();

  const fetchResults = useCallback(async () => {
    if (!searchTerm || !hasMore) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `/search/movie?api_key=e4c84a1beede05689ff6c2d3677261e6&language=en-US&query=${encodeURIComponent(
          searchTerm
        )}&include_adult=false&page=${page}`
      );
      setResults((prev) => [...prev, ...response.data.results]);
      if (response.data.page >= response.data.total_pages) {
        setHasMore(false);
      } else {
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, page, hasMore]);

  useEffect(() => {
    setResults([]);
    setPage(1);
    setHasMore(true);
  }, [searchTerm]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  useEffect(() => {
    if (inView && !loading) {
      fetchResults();
    }
  }, [inView, loading, fetchResults]);

  const handleAddToWatchlist = async (movie) => {
    if (!user) return alert("Login required");

    const movieRef = doc(db, "watchlist", `${user.uid}_${movie.id}`);
    try {
      await setDoc(movieRef, { ...movie, userId: user.uid });
      alert("Added to Watchlist!");
    } catch (err) {
      console.error("Firestore Error:", err);
    }
  };

  const handleClickPoster = (movie) => {
    if (trailerUrl && selectedMovieId === movie.id) {
      setTrailerUrl("");
      setSelectedMovieId(null);
    } else {
      movieTrailer(movie?.title || "")
        .then((url) => {
          const urlParams = new URLSearchParams(new URL(url).search);
          setTrailerUrl(urlParams.get("v"));
          setSelectedMovieId(movie.id);
        })
        .catch(() => {
          setTrailerUrl("");
        });
    }
  };

  return (
    <div style={{ padding: "80px 30px", color: "white" }}>
      <h2>
        Search Results for:{" "}
        <span style={{ color: "lightblue" }}>{searchTerm}</span>
      </h2>

      <div className="searchResult__grid">
        {results.map((movie) => (
          <div key={movie.id} className="searchResult__card">
            <img
              className="searchResult__poster"
              src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
              alt={movie.title}
              onClick={() => handleClickPoster(movie)}
            />
            <h4 className="searchResult__title">{movie.title}</h4>
            <p className="searchResult__overview">
              {movie.overview
                ? movie.overview.slice(0, 100) + "..."
                : "No description available."}
            </p>
            <button
              className="searchResult__button"
              onClick={() => handleAddToWatchlist(movie)}
            >
              + Add to Watchlist
            </button>
            {trailerUrl && selectedMovieId === movie.id && (
              <div className="trailer__player">
                <YouTube videoId={trailerUrl} opts={{ height: "250", width: "100%" }} />
              </div>
            )}
          </div>
        ))}
      </div>

      {loading && (
        <h3 style={{ color: "gray", marginTop: "20px" }}>🔄 Loading...</h3>
      )}

      <div ref={ref} style={{ height: "1px" }}></div>
    </div>
  );
}

export default SearchResults;
