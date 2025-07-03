import React from "react";
import Banner from "../components/Banner";
import Row from "../components/Row";
import requests from "../requests";

function Home() {
  return (
    <div style={{ backgroundColor: "black", minHeight: "100vh", color: "white" }}>
      <Banner />
      <Row title="🔥 Trending Now" fetchURL={requests.fetchTrending} isLargeRow />
      <Row title="⭐ Top Rated" fetchURL={requests.fetchTopRated} />
      <Row title="🎬 Upcoming" fetchURL={requests.fetchUpcoming} />
      <Row title="📺 TV Shows" fetchURL={requests.fetchTV} />
      <Row title="🎥 Action Movies" fetchURL={requests.fetchActionMovies} />
    </div>
  );
}

export default Home;
