const crypto = require("crypto");

exports.deterministicPartitionKey = (event) => {
  const TRIVIAL_PARTITION_KEY = "0";
  const MAX_PARTITION_KEY_LENGTH = 256;
  
  let candidate = TRIVIAL_PARTITION_KEY; // we can just set TRIVIAL_PARTITION_KEY as a default parameter

  if (event?.partitionKey) { // in this part we don't need double-checking and we can use the optional chaining operator which works like condition in this key
    candidate = event.partitionKey;
  } else if (event) {
    candidate = crypto.createHash("sha3-512").update(JSON.stringify(event)).digest("hex"); // in this key we don't need another link in memory
  }

  if (typeof candidate !== "string") { // in this key we don't need to double-check if variale exists because we have because a default value
    candidate = JSON.stringify(candidate);
  }

  if (candidate.length > MAX_PARTITION_KEY_LENGTH) {
    candidate = crypto.createHash("sha3-512").update(candidate).digest("hex");
  }
  
  return candidate;
};