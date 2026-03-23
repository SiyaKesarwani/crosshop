/**
 * Simple file-based database for tracking processed transactions
 */

const fs = require("fs");
const path = require("path");

class ProcessedDatabase {
  constructor(dbPath) {
    this.dbPath = dbPath;
    this.ensureDatabase();
  }

  ensureDatabase() {
    const dir = path.dirname(this.dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(this.dbPath)) {
      fs.writeFileSync(this.dbPath, JSON.stringify({ processed: {} }), "utf8");
    }
  }

  /**
   * Read database file
   */
  read() {
    try {
      const data = fs.readFileSync(this.dbPath, "utf8");
      return JSON.parse(data);
    } catch (err) {
      console.error("Error reading database:", err);
      return { processed: {} };
    }
  }

  /**
   * Write database file
   */
  write(data) {
    try {
      fs.writeFileSync(this.dbPath, JSON.stringify(data, null, 2), "utf8");
    } catch (err) {
      console.error("Error writing database:", err);
    }
  }

  /**
   * Check if transaction with kappa is already processed
   */
  isProcessed(kappa) {
    const db = this.read();
    return db.processed[kappa] !== undefined;
  }

  /**
   * Mark transaction as processed
   */
  markProcessed(kappa, transactionData) {
    const db = this.read();
    db.processed[kappa] = {
      timestamp: new Date().toISOString(),
      txHash: transactionData.txHash,
      sourceChain: transactionData.sourceChain,
      destinationChain: transactionData.destinationChain,
      eventType: transactionData.eventType,
      relayTxHash: transactionData.relayTxHash || null,
      status: transactionData.status || "pending",
    };
    this.write(db);
  }

  /**
   * Get all processed transactions
   */
  getProcessed() {
    const db = this.read();
    return db.processed;
  }

  /**
   * Update relay transaction hash
   */
  updateRelayTxHash(kappa, relayTxHash, status = "confirmed") {
    const db = this.read();
    if (db.processed[kappa]) {
      db.processed[kappa].relayTxHash = relayTxHash;
      db.processed[kappa].status = status;
      this.write(db);
    }
  }
}

module.exports = ProcessedDatabase;
