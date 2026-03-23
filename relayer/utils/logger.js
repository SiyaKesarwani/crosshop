/**
 * Logger utility for relayer
 */

const fs = require("fs");
const path = require("path");

class Logger {
  constructor(logFile) {
    this.logFile = logFile;
    this.ensureLogDirectory();
    this.levels = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3,
    };
    this.currentLevel = this.levels[process.env.LOG_LEVEL || "info"] || this.levels.info;
  }

  ensureLogDirectory() {
    const dir = path.dirname(this.logFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  formatMessage(level, message, data) {
    const timestamp = new Date().toISOString();
    let output = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    if (data) {
      output += ` ${JSON.stringify(data)}`;
    }
    return output;
  }

  write(level, message, data) {
    if (this.levels[level] <= this.currentLevel) {
      const formatted = this.formatMessage(level, message, data);
      console.log(formatted);

      try {
        fs.appendFileSync(this.logFile, formatted + "\n");
      } catch (err) {
        console.error("Failed to write to log file:", err);
      }
    }
  }

  error(message, data) {
    this.write("error", message, data);
  }

  warn(message, data) {
    this.write("warn", message, data);
  }

  info(message, data) {
    this.write("info", message, data);
  }

  debug(message, data) {
    this.write("debug", message, data);
  }
}

module.exports = Logger;
