import React, { useEffect, useState } from "react";
import axios from "../axios";
import requests from "../requests";
import "./Banner.css";
import movieTrailer from "movie-trailer";
import YouTube from "react-youtube";
import { useNavigate } from "react-router-dom";

function Banner() {
  const [movie, setMovie] = useState(null);
  const [trailerUrl, setTrailerUrl] = useState("");
  const [genreNames, setGenreNames] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(requests.fetchTrending);
      const randomMovie = request.data.results[Math.floor(Math.random() * request.data.results.length)];
      setMovie(randomMovie);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (!movie) return;
    async function fetchGenres() {
      try {
        const res = await axios.get(
          `/movie/${movie.id}?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US`
        );
        const genres = res.data.genres.map((g) => g.name);
        setGenreNames(genres);
      } catch (err) {
        console.error("Genre fetch failed:", err);
      }
    }
    fetchGenres();
  }, [movie]);

  const handlePlayClick = () => {
    if (trailerUrl) {
      setTrailerUrl("");
    } else {
      movieTrailer(movie?.title || movie?.name || movie?.original_name || "")
        .then((url) => {
          const urlParams = new URLSearchParams(new URL(url).search);
          setTrailerUrl(urlParams.get("v"));
        })
        .catch((err) => {
          console.error("Trailer error:", err);
          alert("Trailer not found");
        });
    }
  };

  const handleGenreClick = (genre) => {
    navigate(`/search?q=${genre}`);
  };

  if (!movie) return null;

  return (
    <header
      className="banner"
      style={{
        backgroundSize: "cover",
        backgroundImage: `url("https://image.tmdb.org/t/p/original/${movie.backdrop_path}")`,
        backgroundPosition: "center center",
        position: "relative",
      }}
    >
      <div className="banner__contents">
        <h1 className="banner__title">
          {movie.title || movie.name || movie.original_name}
        </h1>

        <div className="banner__genres">
          {genreNames.map((genre) => (
            <span key={genre} className="banner__genre" onClick={() => handleGenreClick(genre)}>
              {genre}
            </span>
          ))}
          <span className="banner__rating">| ⭐ {movie.vote_average}</span>
        </div>

        <div className="banner__buttons">
          <button className="banner__button" onClick={handlePlayClick}>▶ Play</button>
          <button className="banner__button">+ My List</button>
        </div>

        <p className="banner__description">
          {movie.overview?.length > 150
            ? movie.overview.slice(0, 150) + "..."
            : movie.overview}
        </p>
      </div>

      <div className="banner--fadeBottom" />

      {trailerUrl && (
        <YouTube
          videoId={trailerUrl}
          opts={{
            height: "390",
            width: "100%",
            playerVars: {
              autoplay: 1,
              mute: 1,
              controls: 0,
              modestbranding: 1,
              loop: 1,
            },
          }}
        />
      )}
    </header>
  );
}

export default Banner;
