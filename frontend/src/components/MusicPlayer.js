import React from "react";
import { Grid, Typography, IconButton, LinearProgress } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SkipNextIcon from "@mui/icons-material/SkipNext";

const MusicPlayer = ({ song_ }) => {
  const skipSong = () => {
    fetch("/spotify/skip", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
  };

  const pauseSong = () => {
    fetch("/spotify/pause", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    });
  };

  const playSong = () => {
    fetch("/spotify/play", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    });
  };

  if (!song_ || Object.keys(song_).length === 0) {
    return <Typography>No song selected</Typography>;
  }

  const songProgress = song_.duration ? (song_.time / song_.duration) * 100 : 0;
  const {
    image_url: imageUrl,
    title,
    artist,
    is_playing: isPlaying,
    votes,
    votes_required: votesRequired,
  } = song_;

  return (
    <Grid container alignItems="center">
      <Grid item align="center" xs={4}>
        <img src={imageUrl} height="100%" width="100%" alt={title} />
      </Grid>
      <Grid item align="center" xs={8}>
        <Typography component="h5" variant="h5">
          {title || "Unknown Title"}
        </Typography>
        <Typography color="textSecondary" variant="subtitle1">
          {artist || "Unknown Artist"}
        </Typography>
        <IconButton onClick={() => (isPlaying ? pauseSong() : playSong())}>
          {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
        </IconButton>
        <IconButton onClick={skipSong}>
          {votes} / {votesRequired}
          <SkipNextIcon />
        </IconButton>
      </Grid>
      <LinearProgress variant="determinate" value={songProgress} />
    </Grid>
  );
};

export default MusicPlayer;
