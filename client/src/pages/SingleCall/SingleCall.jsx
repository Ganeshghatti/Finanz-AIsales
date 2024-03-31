import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SingleCall.scss";
import { useParams } from "react-router-dom";
import Panel from "../../components/Panel/Panel";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Spinnerf from "../../components/Spinnerf";
import CancelIcon from "@mui/icons-material/Cancel";
import Avatar from "@mui/joy/Avatar";
import { FormControl, FormHelperText } from "@mui/material";
import { REACT_APP_BACK_URL } from "../../config/config";

export default function SingleCall() {
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const admin = useSelector((state) => state.admin.admin);
  const [formData, setFormData] = useState({
    phone_number: {
      country_code: "",
      actual_phone_number: "",
    },
    prompt: "",
    transfer_number: {
      country_code: "",
      phone_number: "",
    },
    voices: [],
    voice: "",
    from_number: {
      country_code: "",
      phone_number: "",
    },
    max_duration: "",
  });

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
  }, [admin]);

  const handleChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const response = await axios.post(
        `${REACT_APP_BACK_URL}/admin/single-call`,
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
  return (
    <div id="SingleCall" className="SingleCall flex">
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
          <h1 className="SingleCall-title md:text-center">Send a Phone Call</h1>
          <form className="flex flex-col gap-12 w-full md:items-center" onSubmit={handleSubmit}>
            <div className="w-full flex flex-col gap-2">
              <label htmlFor="countryCode" className="SingleCall-label">
                To Phone Number
              </label>
              <div className="flex gap-6 md:gap-0 md:justify-between">
                <input
                  type="number"
                  id="actualPhoneNumber"
                  value={formData.phone_number.country_code}
                  className="SingleCall-input w-1/5"
                  placeholder="Ex: +91"
                  onChange={(e) =>
                    handleChange("phone_number", {
                      ...formData.phone_number,
                      country_code: e.target.value,
                    })
                  }
                />
                <input
                  type="number"
                  id="actualPhoneNumber"
                  placeholder="Ex: 9999999999"
                  className="SingleCall-input w-2/5 md:w-3/4"
                  value={formData.phone_number.actual_phone_number}
                  onChange={(e) =>
                    handleChange("phone_number", {
                      ...formData.phone_number,
                      actual_phone_number: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            {/* Prompt */}
            <textarea
              rows={3}
              className="SingleCall-input md:w-full"
              placeholder="Fill Prompt in Detail"
              value={formData.prompt}
              onChange={(e) => handleChange("prompt", e.target.value)}
            />

            <div className="w-full flex flex-col gap-2">
              <label htmlFor="transferPhoneNumber" className="SingleCall-label">
                Transfer Number
              </label>{" "}
              <div className="flex w-full gap-6 md:gap-0 md:justify-between">
                <input
                  type="number"
                  id="transferCountryCode"
                  className="SingleCall-input w-1/5"
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
                  className="SingleCall-input w-2/5 md:w-3/4"
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

            {/* Voice Dropdown */}
            {formData.voices.length > 0 && (
              <div className="flex flex-col gap-2 w-1/5 md:w-full">
                <label htmlFor="voice" className="SingleCall-label">
                  Voice
                </label>
                <select
                  id="voice"
                  value={formData.voice}
                  className="SingleCall-input cursor-pointer"
                  onChange={(e) => handleChange("voice", e.target.value)}
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
              <label htmlFor="fromPhoneNumber" className="SingleCall-label">
                From Phone Number
              </label>{" "}
              <div className="flex w-full gap-6 md:gap-0 md:justify-between">
                <input
                  type="number"
                  id="fromCountryCode"
                  className="SingleCall-input w-1/5"
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
                  className="SingleCall-input w-2/5 md:w-3/4"
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

            {/* Max Duration */}
            <div className="flex flex-col gap-2 w-1/5 md:w-full">
              <label htmlFor="maxDuration" className="SingleCall-label">
                Max Duration (minutes)
              </label>
              <input
                type="number"
                id="maxDuration"
                placeholder="Ex: 2"
                className="SingleCall-input"
                value={formData.max_duration}
                onChange={(e) => handleChange("max_duration", e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <button onClick={handleSubmit} className="button-filled">
              Call
            </button>
          </form>
        </div>{" "}
      </div>
    </div>
  );
}
