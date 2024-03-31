const adminModel = require("../Model/Admin");
const callsModel = require("../Model/Calls");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const axios = require("axios");
const { OpenAIApi, Configuration, default: OpenAI } = require("openai");
const moment = require("moment");
const { sendErrorEmail } = require("../utils/Errormail");
const uuid = require("uuid");
const dotenv = require("dotenv");
const path = require("path");
const cron = require("node-cron");
const sgMail = require("@sendgrid/mail");
const { google } = require("googleapis");
const { OAuth2Client } = require("google-auth-library");
const { authenticate } = require("@google-cloud/local-auth");

dotenv.config({ path: path.join(__dirname, "..", "api", ".env") });

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const apiKey = process.env.BLAND_API_KEY;

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

const TOKEN_PATH = path.join(process.cwd(), "token.json");
const CREDENTIALS_PATH = path.join(process.cwd(), "credentials.json");
const scopes = ["https://www.googleapis.com/auth/calendar"];

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URL
);
console.log(process.env.REDIRECT_URL);
const googleauthf = async () => {
  const url = await oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes.join(" "), // Convert array to string
  });
  console.log(url);
};

googleauthf();
const schedule = "* * * * *";

exports.CalenderAuth = async (req, res, next) => {
  console.log(req.query);
  const code = req.query.code;
  console.log("here1")
  const {tokens}=await oauth2Client.getToken(code)
  console.log("here2")

  oauth2Client.setCredentials(tokens)
  console.log("here3")

  console.log(oauth2Client)

  const event = {
    'summary': 'Google I/O 2015',
    'location': '800 Howard St., San Francisco, CA 94103',
    'description': 'A chance to hear more about Google\'s developer products.',
    'start': {
      'dateTime': '2015-05-28T09:00:00-07:00',
      'timeZone': 'America/Los_Angeles',
    },
    'end': {
      'dateTime': '2015-05-28T17:00:00-07:00',
      'timeZone': 'America/Los_Angeles',
    },
    'recurrence': [
      'RRULE:FREQ=DAILY;COUNT=2'
    ],
    'attendees': [
      {'email': 'lpage@example.com'},
      {'email': 'sbrin@example.com'},
    ],
    'reminders': {
      'useDefault': false,
      'overrides': [
        {'method': 'email', 'minutes': 24 * 60},
        {'method': 'popup', 'minutes': 10},
      ],
    },
  };
  console.log("here4")

  calendar.events.insert({
    auth: auth,
    calendarId: 'primary',
    resource: event,
  }, function(err, event) {
    if (err) {
      console.log('There was an error contacting the Calendar service: ' + err);
      return;
    }
    console.log('Event created: %s', event.htmlLink);
  });
  console.log("here5")

authorize().then(listEvents).catch(console.error);

const schedule = "* * * * *";

// const job = cron.schedule(schedule, async () => {
const cronjobf = async () => {
  try {
    const options = { method: "GET", headers: { authorization: apiKey } };
    const oneHourAgo = moment().subtract(200, "hours").format();
    const response = await axios.get(`https://api.bland.ai/v1/calls`, options);
    const calls = response.data.calls;

    callIdsInLastHour = calls
      .filter((call) => {
        const callTime = moment(call.created_at);
        return callTime.isAfter(oneHourAgo);
      })
      .map((call) => call.c_id);

    console.log("Calls made in the last hour:");
    console.log(oneHourAgo, callIdsInLastHour);
  } catch (error) {
    sendErrorEmail("Error in fetching call logs");
  }

  try {
    for (let i = 0; i < callIdsInLastHour.length; i++) {
      const options = { method: "GET", headers: { authorization: apiKey } };
      const response = await axios.get(
        `https://api.bland.ai/v1/calls/${callIdsInLastHour[i]}`,
        options
      );
      if (response.status === 200) {
        const concatenatedTranscript = response.data.concatenated_transcript;
        let prompt = `From the below conversation extract the following details 1):email: user's email 2):meeting_requested: has user requested for meeting?  Boolean 3):meeting_time: Extract date and time. Convert it to Date() format  4):summary: Detailed summary of entire conversaton. The response should be strictly in json format with 4 attribute names exactly mentioned inside : : marks. If mentioned 4 atttributes aren't present in given conversation then don't mention the attribute${concatenatedTranscript}`;
        const GPTresponse = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: `${prompt}` }],
          max_tokens: 100,
        });
        console.log(GPTresponse.choices[0].message.content);
        jsonObject = JSON.parse(GPTresponse.choices[0].message.content);
        console.log(jsonObject);
        const callData = new callsModel({
          call_id: response.data.call_id,
          corrected_duration: response.data.corrected_duration,
          created_at: response.data.created_at,
          call_length: response.data.call_length,
          to: response.data.to,
          from: response.data.from,
          completed: response.data.completed,
          email: jsonObject.email ? jsonObject.email : null,
          meeting_requested: jsonObject.meeting_requested
            ? jsonObject.meeting_requested
            : null,
          meeting_time: jsonObject.meeting_time
            ? jsonObject.meeting_time
            : null,
        });
        await callData.save();
        if (
          jsonObject.email &&
          jsonObject.meeting_requested &&
          moment(jsonObject.meeting_time).isValid()
        ) {
          const event = {
            summary: "Meeting",
            description: "Meeting description",
            start: {
              dateTime: moment(jsonObject.meeting_time).toISOString(),
              timeZone: "Asia/Kolkata", // Set your timezone here
            },
            end: {
              dateTime: moment(jsonObject.meeting_time)
                .add(1, "hour")
                .toISOString(),
              timeZone: "Asia/Kolkata", // Set your timezone here
            },
            attendees: [{ email: jsonObject.email }],
            reminders: {
              useDefault: false,
              overrides: [
                { method: "email", minutes: 24 * 60 },
                { method: "popup", minutes: 10 },
              ],
            },
          };

          calendar.events.insert(
            {
              calendarId: "primary",
              resource: event,
            },
            (err, event) => {
              if (err) {
                console.error("Error adding event:", err);
                return;
              }
              console.log("Event created: %s", event.data.htmlLink);
              const msg = {
                to: jsonObject.email,
                from: "techavtar.tech@gmail.com",
                subject: "Invitation for meeting",
                text: `Thanks for connecting with us. Here is the link through which you can join the meet: ${event.data.htmlLink}`,
              };
              sgMail
                .send(msg)
                .then(() => console.log("Mail sent successfully"))
                .catch((error) => {
                  console.error("Error sending email:", error);
                });
            }
          );
        }
      } else {
        sendErrorEmail("Error in fetching transcript");
      }
    }
  } catch (error) {
    console.error("Internal Server Error:", error);
    sendErrorEmail("Internal Server Error");
  }
};
// });
// cronjobf();
// job.start();

exports.AdminLogin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        error: "enter a valid email",
      });
    }
    const admin = await adminModel.findOne({ email: email });

    if (!admin) {
      return res.status(401).json({
        error: "wrong email or password",
      });
    }

    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      return res.status(400).json({
        error: "wrong email or password",
      });
    }

    const token = jwt.sign(
      { userId: admin._id, email: admin.email },
      process.env.ADMINJWTSECRET
    );

    res.status(200).json({
      email: admin.email,
      token: token,
    });
  } catch (error) {
    sendErrorEmail(email, "Someone tried to Login to Admin Panel");
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

exports.GetAllVoices = async (req, res, next) => {
  res.status(200).json({
    voices: [
      {
        voice_id: 2,
        name: "jen-english",
        is_custom: false,
        reduce_latency: true,
      },
      {
        voice_id: 0,
        name: "matt",
        is_custom: false,
        reduce_latency: true,
      },
    ],
  });
};

exports.SingleCall = async (req, res, next) => {
  const {
    phone_number,
    prompt,
    transfer_number,
    voice,
    from_number,
    max_duration,
  } = req.body;

  const { country_code: countryCode, actual_phone_number: phoneNumber } =
    phone_number;

  const {
    country_code: transferCountryCode,
    phone_number: transferPhoneNumber,
  } = transfer_number;

  const data = {
    phone_number: countryCode + phoneNumber,
    task: prompt,
    voice_id: 1,
    reduce_latency: false,
    transfer_phone_number: transferCountryCode + transferPhoneNumber,
  };

  axios
    .post("https://api.bland.ai/v1/calls", data, {
      headers: {
        authorization: apiKey,
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      const { status } = response.data;

      if (status) {
        res
          .status(200)
          .json({ message: "Phone call dispatched", status: "success" });
      }
    })
    .catch((error) => {
      console.log("Error:", error);
      res
        .status(400)
        .json({ message: "Error dispatching phone call", status: "error" });
    });
};

exports.BulkCall = async (req, res, next) => {
  try {
    const {
      prompt,
      transfer_number,
      voice,
      max_duration,
      phone_numbers,
      from_number,
    } = req.body;
    const {
      country_code: transferCountryCode,
      phone_number: transferPhoneNumber,
    } = transfer_number;

    if (!phone_numbers || phone_numbers.length === 0) {
      console.log("Phone numbers are missing"); // Debug statement
      return res
        .status(400)
        .json({ message: "Phone numbers are missing", status: "error" });
    }

    const processedPhoneNumbers = new Set();

    const batches = [];
    for (let i = 0; i < phone_numbers.length; i += 10) {
      batches.push(phone_numbers.slice(i, i + 10));
    }

    // Iterate through each batch of phone numbers and dispatch calls
    for (const batch of batches) {
      console.log("Processing batch of phone numbers:", batch); // Debug statement
      const calls = batch
        .map((phoneNumber) => {
          // Check if the phone number has already been processed
          if (processedPhoneNumbers.has(phoneNumber.actual_phone_number)) {
            console.log(
              "Phone number already processed:",
              phoneNumber.actual_phone_number
            ); // Debug statement
            return null; // Skip this phone number
          }
          console.log(
            "Processing phone number:",
            phoneNumber.actual_phone_number
          ); // Debug statement
          processedPhoneNumbers.add(phoneNumber.actual_phone_number); // Add the phone number to the processed set
          return {
            phone_number:
              "+" + phoneNumber.country_code + phoneNumber.actual_phone_number, // Add country code to the phone number
            task: prompt,
            voice_id: voice,
            reduce_latency: false,
            transfer_phone_number: transferCountryCode + transferPhoneNumber,
          };
        })
        .filter((call) => call !== null); // Remove null entries (skipped phone numbers)

      // Dispatch the phone calls for the current batch
      console.log("Dispatching phone calls with data:", calls); // Debug statement
      await Promise.all(
        calls.map((call) => {
          return axios.post("https://api.bland.ai/v1/calls", call, {
            headers: {
              authorization: apiKey, // Assuming apiKey is defined somewhere in your code
              "Content-Type": "application/json",
            },
          });
        })
      );
    }

    res
      .status(200)
      .json({ message: "Bulk calls dispatched", status: "success" });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(400)
      .json({ message: "Error dispatching bulk calls", status: "error" });
  }
};

exports.GetCallLogs = async (req, res) => {
  try {
    console.log("Fetching call logs with API Key:", apiKey);
    const options = { method: "GET", headers: { authorization: apiKey } };
    const response = await axios.get("https://api.bland.ai/v1/calls", options);

    console.log("Received response from API:", response.status);

    if (response.status === 200) {
      console.log("Call logs data:", response.data);
      res.status(200).json(response.data);
    } else {
      res
        .status(response.status)
        .json({ message: "Failed to fetch call logs" });
    }
  } catch (error) {
    console.error("Error fetching call logs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.GetTranscript = async (req, res) => {
  const { callId } = req.params;
  if (!callId) {
    return res.status(400).json({ message: "Call ID is missing" });
  }
  try {
    const options = { method: "GET", headers: { authorization: apiKey } };
    const response = await axios.get(
      `https://api.bland.ai/v1/calls/${callId}`,
      options
    );

    if (response.status === 200) {
      console.log(response.data);
      const transcripts = response.data.transcripts;
      if (transcripts && transcripts.length > 0) {
        const concatenatedTranscript = response.data.concatenated_transcript;
        console.log("Transcripts:");
        transcripts.forEach((transcript) => {
          console.log(transcript);
        });
        console.log("Concatenated Transcript:");
        console.log(concatenatedTranscript);
        return res.status(200).json({ transcripts, concatenatedTranscript });
      } else {
        console.log("Transcripts not found");
        return res.status(404).json({ message: "Transcripts not found" });
      }
    } else {
      console.error("Failed to fetch transcript");
      return res
        .status(response.status)
        .json({ message: "Failed to fetch transcript" });
    }
  } catch (error) {
    console.error("Error fetching transcript:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.GetSummary = async (req, res) => {
  console.log("Starting GetSummary function.");
  const { callId } = req.params;
  if (!callId) {
    console.log("Call ID is missing in the request.");
    return res.status(400).json({ message: "Call ID is missing" });
  }

  let concatenatedTranscript = "";

  try {
    console.log(`Fetching transcripts for call ID: ${callId}`);
    const options = { method: "GET", headers: { authorization: apiKey } };
    const response = await axios.get(
      `https://api.bland.ai/v1/calls/${callId}`,
      options
    );

    if (
      response.status === 200 &&
      response.data.transcripts &&
      response.data.transcripts.length > 0
    ) {
      concatenatedTranscript = response.data.concatenated_transcript;
      console.log("Successfully fetched and concatenated transcripts.");
    } else {
      console.log("Transcripts not found or empty.");
      return res.status(404).json({ message: "Transcripts not found" });
    }
  } catch (error) {
    console.error("Error fetching transcript:", error);
    return res.status(500).json({ message: "Internal server error++++++++" });
  }

  console.log("Generating summary with OpenAI.");
  const prompt = `Summarize this conversation:\n${concatenatedTranscript}`;

  try {
    const summaryResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: `${prompt}` }],
      max_tokens: 100,
    });
    console.log("Summary generated succ.");
    console.log(summaryResponse);
    return res.status(200).json({ summaryResponse });
  } catch (error) {
    console.error("Error generating summary with OpenAI:", error);
    return res
      .status(500)
      .json({ message: "Internal server error++", error: error.message });
  }
};
