#!/usr/bin/env node

/**
 * RelayerService Entry Point
 * Run as: node relayer/index.js
 */

require("dotenv").config();
const RelayerService = require("./service/relayerService");

const relayer = new RelayerService();

// Handle graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n\nReceived SIGINT, shutting down gracefully...");
  relayer.stop();
  const stats = relayer.getStats();
  console.log("Final Statistics:", JSON.stringify(stats, null, 2));
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\n\nReceived SIGTERM, shutting down gracefully...");
  relayer.stop();
  const stats = relayer.getStats();
  console.log("Final Statistics:", JSON.stringify(stats, null, 2));
  process.exit(0);
});

// Start the relayer
(async () => {
  try {
    await relayer.start();

    // Print stats every 5 minutes
    setInterval(() => {
      const stats = relayer.getStats();
      console.log("\n=== Relayer Statistics ===");
      console.log(JSON.stringify(stats, null, 2));
      console.log("===========================\n");
    }, 5 * 60 * 1000);
  } catch (err) {
    console.error("Fatal error:", err);
    process.exit(1);
  }
})();
