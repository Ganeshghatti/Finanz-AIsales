import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CallLog.scss";
import { useParams, useNavigate } from "react-router-dom";
import Panel from "../../components/Panel/Panel";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { useSelector } from "react-redux";
import Spinnerf from "../../components/Spinnerf";
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
import { REACT_APP_BACK_URL } from "../../config/config";
import {
  TextField,
  TextareaAutosize,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import Papa from "papaparse";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export default function CallLog() {
  const [callLog, setcallLog] = useState([]);
  const admin = useSelector((state) => state.admin.admin);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [transcriptDialogOpen, setTranscriptDialogOpen] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [summaryDialogOpen, setSummaryDialogOpen] = useState(false); // State to manage dialog visibility
  const [callSummary, setCallSummary] = useState(""); // State to store summary data

  const handleTranscriptDialogOpen = () => {
    setTranscriptDialogOpen(true);
  };

  const handleTranscriptDialogClose = () => {
    setTranscriptDialogOpen(false);
  };

  const handleViewTranscript = async (callId) => {
    console.log(`Attempting to fetch transcript for call ID: ${callId}`); // Debug statement
    try {
      const response = await axios.get(
        `${REACT_APP_BACK_URL}/admin/get-transcript/${callId}`, // Ensure this URL matches the endpoint exactly
        {
          headers: {
            Authorization: `Bearer ${admin.token}`,
          },
        }
      );
      console.log("Transcript fetch response data:", response.data); // Debug statement
      setTranscript(response.data.transcripts); // Adjust based on actual response structure
      handleTranscriptDialogOpen();
    } catch (error) {
      console.log("Error fetching transcript:", error); // Debug statement
      // Adjust error handling as necessary
    }
  };

  // Function to open the summary dialog
  const handleSummaryDialogOpen = () => {
    setSummaryDialogOpen(true);
  };

  // Function to close the summary dialog
  const handleSummaryDialogClose = () => {
    setSummaryDialogOpen(false);
  };

  // Function to fetch and display the call summary
  const handleViewSummary = async (callId) => {
    try {
      const response = await axios.get(
        `${REACT_APP_BACK_URL}/admin/get-summary/${callId}`,
        {
          headers: {
            Authorization: `Bearer ${admin.token}`,
          },
        }
      );
      setCallSummary(response.data.summaryResponse.choices[0].message.content); // Adjust depending on your API response structure
      handleSummaryDialogOpen();
    } catch (error) {
      console.log("Error fetching summary:", error);
      // Handle error (e.g., set an error alert state here)
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (admin.email.length > 0) {
          setLoading(true);
          const response = await axios.get(
            `${REACT_APP_BACK_URL}/admin/call-logs`,
            {
              headers: {
                Authorization: `Bearer ${admin.token}`,
              },
            }
          );
          console.log(response.data.calls);
          setcallLog(response.data.calls);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
        if (error.response && error.response.status === 401) {
          setLoading(false);
          return navigate(`/`);
        }
        setAlert(
          <Alert
            style={{ position: "fixed", bottom: "3%", left: "2%", zIndex: 999 }}
            variant="filled"
            severity="error"
          >
            {error.response.data.error}
          </Alert>
        );
        setTimeout(() => setAlert(null), 5000);
        setLoading(false);
      }
    };

    fetchData();
  }, [admin]);

  return (
    <div id="CallLog" className="CallLog flex">
      <Panel />
      <Stack spacing={2}>{alert}</Stack>
      <div className="flex flex-col gap-2 flex-1">
        <div
          className="flex h-24 w-full py-4 px-6 md:hidden"
          style={{ borderBottom: "1px solid #B0BBC9" }}
        >
          <img
            src="/public\Assets\Images\logo3.png"
            className="object-contain"
            alt=""
          />
        </div>
        <div className="flex flex-col justify-center gap-8 w-full md:items-center p-6">
          <h1 className="CallLog-title">Call Log</h1>
          {callLog && callLog.length > 0 ? (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>To</TableCell>{" "}
                    <TableCell align="center">Answered By</TableCell>
                    <TableCell align="center">Call Length</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell align="center">Call from</TableCell>
                    <TableCell align="center">Call ID</TableCell>
                    <TableCell align="center">Transcript</TableCell>
                    <TableCell align="center">Summary</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {callLog.map((call) => (
                    <TableRow
                      key={call.name}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {call.to}
                      </TableCell>
                      <TableCell align="right">{call.answered_by}</TableCell>
                      <TableCell align="right">{call.call_length}</TableCell>
                      <TableCell align="right">{call.queue_status}</TableCell>
                      <TableCell align="right">{call.from}</TableCell>
                      <TableCell align="right">{call.call_id}</TableCell>
                      <TableCell align="right">
                        <Button
                          variant="contained"
                          onClick={() => handleViewTranscript(call.call_id)}
                        >
                          View Transcript
                        </Button>
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          variant="contained"
                          onClick={() => handleViewSummary(call.call_id)}
                        >
                          View Summary
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Spinnerf />
          )}
        </div>
      </div>
      <Dialog
        open={transcriptDialogOpen}
        onClose={handleTranscriptDialogClose}
        aria-labelledby="transcript-dialog-title"
        aria-describedby="transcript-dialog-description"
      >
        <DialogTitle id="transcript-dialog-title">Transcript</DialogTitle>
        <DialogContent>
          <DialogContentText id="transcript-dialog-description">
            {transcript && Array.isArray(transcript) ? (
              transcript.map((item, index) => (
                <div key={index}>
                  <strong>
                    {item.user === "user" ? "User: " : "Assistant: "}
                  </strong>
                  {item.text}
                </div>
              ))
            ) : (
              <div>
                <strong>
                  {transcript.user === "user" ? "User: " : "Assistant: "}
                </strong>
                {transcript.text}
              </div>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleTranscriptDialogClose}>Close</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={summaryDialogOpen}
        onClose={handleSummaryDialogClose}
        aria-labelledby="summary-dialog-title"
        aria-describedby="summary-dialog-description"
      >
        <DialogTitle id="summary-dialog-title">Call Summary</DialogTitle>
        <DialogContent>
          <DialogContentText id="summary-dialog-description">
            {callSummary}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSummaryDialogClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
