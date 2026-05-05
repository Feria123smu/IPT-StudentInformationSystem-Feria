import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import "./MovieWatchList.css";

function movie() {
  const [movieTitle, setMovieTitle] = useState("");
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");

  const handleAddMovie = () => {
    if (movieTitle.trim() === "") {
      setError("Movie title cannot be empty.");
      return;
    }

    const newMovie = {
      id: Date.now(),
      title: movieTitle,
      watched: false,
    };

    setMovies([...movies, newMovie]);
    setMovieTitle("");
    setError("");
  };

  const toggleWatched = (id) => {
    setMovies(
      movies.map((movie) =>
        movie.id === id
          ? { ...movie, watched: !movie.watched }
          : movie
      )
    );
  };

  const removeMovie = (id) => {
    setMovies(movies.filter((movie) => movie.id !== id));
  };

  return (
    <Box className="watchlist-container">
      <Typography variant="h4" align="center" gutterBottom>
        🎬 Movie Watchlist
      </Typography>

      <Box className="input-section">
        <TextField
          fullWidth
          label="Movie Title"
          value={movieTitle}
          onChange={(e) => setMovieTitle(e.target.value)}
        />
        <Button variant="contained" onClick={handleAddMovie}>
          Add
        </Button>
      </Box>

      {error && (
        <Alert severity="error" className="error-message">
          {error}
        </Alert>
      )}

      <List>
        {movies.map((movie) => (
          <ListItem
            key={movie.id}
            divider
            className={`movie-item ${movie.watched ? "watched" : ""}`}
          >
            <ListItemText primary={movie.title} />

            <Chip
              label={movie.watched ? "Watched" : "Unwatched"}
              color={movie.watched ? "success" : "default"}
              onClick={() => toggleWatched(movie.id)}
              className="status-chip"
            />

            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                color="error"
                onClick={() => removeMovie(movie.id)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default MovieWatchList;
