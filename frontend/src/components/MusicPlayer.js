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

const MusicPlayer = () => {
  const { song } = useParams();
  const songProgress = (song.time / song.duration) * 100;

  const imageUrl = song.image_url || ""; // Fallback if the property doesn't exist
  const title = song.title || "Unknown Title";
  const artist = song.artist || "Unknown Artist";
  const isPlaying = song.is_playing || false;
  return (
    <Card>
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
          <div>
            <IconButton>
              {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
            </IconButton>
            <IconButton>
              <SkipNextIcon />
            </IconButton>
          </div>
        </Grid>
      </Grid>
      <LinearProgress variant="determinate" value={songProgress} />
    </Card>
  );
};
export default MusicPlayer;
