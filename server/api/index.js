const app = require("../main");
const mongoose = require('mongoose');

const PORT = process.env.PORT;

const server = app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});