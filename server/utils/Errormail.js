const axios = require("axios");
const moment = require("moment");
const nodemailer = require("nodemailer");
const express = require("express");

const sgMail = require("@sendgrid/mail");

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY
sgMail.setApiKey(SENDGRID_API_KEY);

const sendErrorEmail = async (action) => {
  try {
    const msg = {
      to: "ganeshghatti6@gmail.com", 
      from: "techavtar.tech@gmail.com", 
      subject: "Error Alert!!",
      text: action,
    };
  
    sgMail
      .send(msg)
      .then(() => console.log("Error mail sent successfully"))
      .catch((error) => {
        console.log(error.response.body);
      });
    return true;
  } catch (error) {
    console.error("Error sending error email:", error.message);
    return false;
  }
};

module.exports = { sendErrorEmail };
