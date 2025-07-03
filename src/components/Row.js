import React, { useEffect, useState } from "react";
import axios from "../axios";
import "./Row.css";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";

const base_url = "https://image.tmdb.org/t/p/w300";

function Row({ title, fetchURL, isLargeRow = false }) {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const request = await axios.get(fetchURL);
        setMovies(request.data.results);
      } catch (error) {
        console.error("Failed to load movies", error);
      }
    }
    fetchData();
  }, [fetchURL]);

  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      autoplay: 1,
    },
  };

  const handleClick = (movie) => {
    if (trailerUrl && selectedMovieId === movie.id) {
      setTrailerUrl("");
      setSelectedMovieId(null);
    } else {
      movieTrailer(movie?.name || movie?.title || movie?.original_name || "")
        .then((url) => {
          const urlParams = new URLSearchParams(new URL(url).search);
          setTrailerUrl(urlParams.get("v"));
          setSelectedMovieId(movie.id);
        })
        .catch((error) => {
          console.error("Trailer not found", error);
          setTrailerUrl("");
        });
    }
  };

  return (
    <div className="row">
      <h2>{title}</h2>

      <div className="row__posters">
        {movies.map((movie) => (
          <div key={movie.id} className="row__posterContainer">
            <img
              onClick={() => handleClick(movie)}
              className={`row__poster ${isLargeRow && "row__posterLarge"}`}
              src={`${base_url}${isLargeRow ? movie.poster_path : movie.backdrop_path}`}
              alt={movie.title || movie.name}
            />
            <p className="row__movieTitle">{movie.title || movie.name}</p>

            {trailerUrl && selectedMovieId === movie.id && (
              <YouTube videoId={trailerUrl} opts={opts} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Row;
