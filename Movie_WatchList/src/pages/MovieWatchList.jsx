import { useState } from "react";
import "./MovieWatchList.css";

function MovieWatchList() {
  const [title, setTitle] = useState("");
  const [movies, setMovies] = useState([]);

  function addMovie() {
    if (title.trim() === "") return;

    setMovies([
      ...movies,
      { id: Date.now(), title, status: "Unwatched" }
    ]);
    setTitle("");
  }

  function toggle(id) {
    setMovies(
      movies.map(m =>
        m.id === id
          ? { ...m, status: m.status === "Watched" ? "Unwatched" : "Watched" }
          : m
      )
    );
  }

  function remove(id) {
    setMovies(movies.filter(m => m.id !== id));
  }

  return (
    <div className="watchlist-container">
      <h3>Movie WatchList</h3>

      {}
      <div className="input-group">
        <input
          className="movie-input"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Movie title"
        />
        <button className="add-btn" onClick={addMovie}>Add</button>
      </div>

      {}
      <div className="movie-list">
        {movies.map(m => (
          <div 
            key={m.id} 
            className={`movie-item ${m.status === "Watched" ? "watched" : ""}`}
          >
            <span className="movie-text">
              {m.title} - {m.status}
            </span>
            
            <div className="actions">
              <button className="toggle-btn" onClick={() => toggle(m.id)}>
                State
              </button>
              <button className="remove-btn" onClick={() => remove(m.id)}>
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MovieWatchList;