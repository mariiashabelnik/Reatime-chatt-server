const fs = require("fs");
const path = require("path");

// file to write log to
const filename = path.join(__dirname, "../logfile.ndjson");
const log_file = fs.createWriteStream(filename, {});

const write = (data) => {
  // add timestamp
  const log = { stamp: new Date(), ...data };
  log_file.write(JSON.stringify(log) + "\n");
};

module.exports = { write };
