import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminDashboard.scss";
import { useParams } from "react-router-dom";
import Panel from "../../components/Panel/Panel"
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Spinnerf from "../../components/Spinnerf";
import { TextField, Select, MenuItem } from "@mui/material";
import { TextareaAutosize } from "@mui/base/TextareaAutosize";
import CancelIcon from "@mui/icons-material/Cancel";
import Checkbox from "@mui/material/Checkbox";
import { Radio, RadioGroup, FormControlLabel } from "@mui/material";
import LinearProgress from "@mui/joy/LinearProgress";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Avatar from "@mui/joy/Avatar";
import AccordionGroup from "@mui/joy/AccordionGroup";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const admin = useSelector((state) => state.admin.admin);

  return (
    <div id="AdminDashboard" className="AdminDashboard flex">
      <Panel tab="Dashboard" />
      <Stack spacing={2}>{alert}</Stack>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem, reprehenderit quia dolores itaque non maxime sequi iste debitis soluta fugiat impedit velit error illum veritatis culpa totam qui, quasi saepe reiciendis atque asperiores ipsum. Quo inventore rem omnis ratione deserunt quam laboriosam harum! Cum nulla quo veniam quod eligendi temporibus!\
    </div>
  );
}
