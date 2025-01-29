import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Grid,
  Typography,
  TextField,
  FormHelperText,
  FormControl,
  Radio,
  RadioGroup,
  FormControlLabel,
  Collapse,
  Alert,
  LinearProgress,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SkipNextIcon from "@mui/icons-material/SkipNext";

const MusicPlayer = ({ song_ }) => {
  console.log("This is song_ in MusicPlayer:", song_);
  if (!song_ || Object.keys(song_).length === 0) {
    return <Typography>No song selected</Typography>;
  } else {
    const songProgress =
      song_?.time && song_?.duration ? (song_.time / song_.duration) * 100 : 0;

    const imageUrl = song_?.image_url || "";
    const title = song_?.title || "Unknown Title";
    const artist = song_?.artist || "Unknown Artist";
    const isPlaying = song_?.is_playing || false;
    console.log(imageUrl, title, artist, isPlaying, songProgress);

    return (
      <Grid container alignItems="center">
        <Grid item align="center" xs={4}>
          <img src={imageUrl} height="100%" width="100%" alt={title} />
        </Grid>
        <Grid item align="center" xs={8}>
          <Typography component="h5" variant="h5">
            {title}
          </Typography>
          <Typography color="textSecondary" variant="subtitle1">
            {artist}
          </Typography>
        </Grid>

        <LinearProgress variant="determinate" value={songProgress} />
      </Grid>
    );
  }
};
export default MusicPlayer;
