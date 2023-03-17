const { deterministicPartitionKey } = require("./dpk");
const crypto = require("crypto");

describe("deterministicPartitionKey", () => {
  test('should return "0" for empty input', () => {
    expect(deterministicPartitionKey()).toBe('0');
  });

  test('should return partitionKey if present in event', () => {
    const event = {
      partitionKey: 'my-partition-key'
    };
    expect(deterministicPartitionKey(event)).toBe('my-partition-key');
  });

  test('should return hash of event if partitionKey not present', () => {
    const event = {
      foo: 'bar'
    };
    const hash = crypto.createHash('sha3-512').update(JSON.stringify(event)).digest('hex');
    expect(deterministicPartitionKey(event)).toBe(hash);
  });

  test('should stringify non-string partitionKey', () => {
    const event = {
      partitionKey: {
        foo: 'bar'
      }
    };
    expect(deterministicPartitionKey(event)).toBe(JSON.stringify(event.partitionKey));
  });

  test('should hash partitionKey if it exceeds max length', () => {
    const event = {
      partitionKey: 'a'.repeat(257)
    };
    const hash = crypto.createHash('sha3-512').update(event.partitionKey).digest('hex');
    expect(deterministicPartitionKey(event)).toBe(hash);
  });
});
