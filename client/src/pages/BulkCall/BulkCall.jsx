import React, { useState, useEffect } from "react";
import axios from "axios";
import "./BulkCall.scss";
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
} from "@mui/material";
import Papa from "papaparse";

export default function BulkCall() {
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [formData, setFormData] = useState({
    csvFile: null,
    phone_numbers: [
      {
        country_code: "",
        actual_phone_number: "",
      },
    ],
    prompt: "",
    voices: [],
    voice: "",
    transfer_number: {
      country_code: "",
      phone_number: "",
    },
    from_number: {
      country_code: "",
      phone_number: "",
    },
    max_duration: 0,
  });
  const admin = useSelector((state) => state.admin.admin);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      csvFile: file,
    }));
    parseCsv(file);
  };

  const parseCsv = (e, file) => {
    e.preventDefault();

    Papa.parse(file, {
      header: true,
      complete: (result) => {
        const phone_numbers = result.data
          .map((row) => {
            return {
              country_code: row.country_code,
              actual_phone_number: row.actual_phone_number,
            };
          })
          .filter(
            (number) => number.country_code && number.actual_phone_number
          );
        setFormData({
          ...formData,
          phone_numbers,
        });
      },
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (admin.email.length > 0) {
          setLoading(true);
          const response = await axios.get(
            `${REACT_APP_BACK_URL}/admin/get-all-voices`,
            {
              headers: {
                Authorization: `Bearer ${admin.token}`,
              },
            }
          );
          setFormData((prevData) => ({
            ...prevData,
            voices: response.data.voices,
          }));
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
  }, [admin, navigate]); // Added navigate to dependency array

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      console.log(formData);
      const response = await axios.post(
        `${REACT_APP_BACK_URL}/admin/bulk-call`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${admin.token}`,
          },
        }
      );
      setAlert(
        <Alert
          style={{ position: "fixed", bottom: "3%", left: "2%", zIndex: 999 }}
          variant="filled"
          severity="success"
        >
          <p>Call Sent Successfully</p>
        </Alert>
      );
      setTimeout(() => setAlert(null), 5000);
      setLoading(false);
    } catch (error) {
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

  const handleChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  return (
    <div id="BulkCall" className="BulkCall flex">
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
        <div className="flex flex-col justify-center gap-8 w-3/4 md:w-full md:items-center md:mt-24 p-6">
          <h1 className="BulkCall-title md:text-center">Bulk Call</h1>

          <form className="flex flex-col gap-12 w-full md:items-center" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2 md:w-full">
              <label htmlFor="csvFile" className="BulkCall-label">
                Upload CSV File:
              </label>
              <div className="file-upload-container">
                <input
                  type="file"
                  id="csvFile"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
                {formData.csvFile ? (
                  <div className="flex items-center gap-2">
                    <img src="/public/Assets/Images/file.png" alt="" />
                    <span className="underline">{formData.csvFile.name}</span>
                  </div>
                ) : (
                  <div className="gap-2 flex items-center">
                    <img src="/public/Assets/Images/cloud.png" alt="" />
                    <div className="flex flex-col gap-1">
                      <span>Drag and drop here</span>
                      <span>or</span>
                      <label htmlFor="csvFile" className="underline">
                        Choose File
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <textarea
              rows={3}
              className="BulkCall-input md:w-full"
              placeholder="Fill Prompt in Detail"
              value={formData.prompt}
              onChange={(e) => handleChange("prompt", e.target.value)} // Changed handleChange function
            />
            <div className="w-full flex flex-col gap-2">
              <label htmlFor="transferPhoneNumber" className="BulkCall-label">
                Transfer Number
              </label>{" "}
              <div className="flex w-full gap-6 md:gap-0 md:justify-between">
                <input
                  type="number"
                  id="transferCountryCode"
                  className="BulkCall-input w-1/5"
                  placeholder="Ex: +91"
                  value={formData.transfer_number.country_code}
                  onChange={(e) =>
                    handleChange("transfer_number", {
                      ...formData.transfer_number,
                      country_code: e.target.value,
                    })
                  }
                />
                <input
                  type="number"
                  id="transferPhoneNumber"
                  className="BulkCall-input w-2/5 md:w-3/4"
                  placeholder="Ex: 9999999999"
                  value={formData.transfer_number.phone_number}
                  onChange={(e) =>
                    handleChange("transfer_number", {
                      ...formData.transfer_number,
                      phone_number: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            {formData.voices.length > 0 && (
              <div className="flex flex-col gap-2 w-1/5 md:w-full">
                <label htmlFor="voice" className="BulkCall-label">
                  Voice
                </label>
                <select
                  id="voice"
                  value={formData.voice}
                  className="BulkCall-input cursor-pointer"
                  onChange={(e) => handleChange("voice", e.target.value)} // Changed handleChange function
                >
                  {formData.voices.map((voice) => (
                    <option key={voice.voice_id} value={voice.voice_id}>
                      {voice.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="w-full flex flex-col gap-2">
              <label htmlFor="fromPhoneNumber" className="BulkCall-label">
                From Phone Number
              </label>{" "}
              <div className="flex w-full gap-6 md:gap-0 md:justify-between">
                <input
                  type="number"
                  id="fromCountryCode"
                  className="BulkCall-input w-1/5"
                  placeholder="Ex: +91"
                  value={formData.from_number.country_code}
                  onChange={(e) =>
                    handleChange("from_number", {
                      ...formData.from_number,
                      country_code: e.target.value,
                    })
                  }
                />

                <input
                  type="number"
                  id="fromPhoneNumber"
                  className="BulkCall-input w-2/5 md:w-3/4"
                  placeholder="Ex: 9999999999"
                  value={formData.from_number.phone_number}
                  onChange={(e) =>
                    handleChange("from_number", {
                      ...formData.from_number,
                      phone_number: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="flex flex-col gap-2 w-1/5 md:w-full">
              <label htmlFor="maxDuration" className="BulkCall-label">
                Max Duration (minutes)
              </label>
              <input
                type="number"
                id="maxDuration"
                placeholder="Ex: 2"
                className="BulkCall-input"
                value={formData.max_duration}
                onChange={(e) => handleChange("max_duration", e.target.value)} // Changed handleChange function
              />
            </div>
            <button className="button-filled">
              {" "}
              {/* Changed onClick to type="submit" */}
              Call
            </button>{" "}
          </form>
        </div>
      </div>
    </div>
  );
}
