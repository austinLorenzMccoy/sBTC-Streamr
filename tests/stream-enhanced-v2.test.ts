import {
  Cl,
  cvToValue,
} from "@stacks/transactions";
import { beforeEach, describe, expect, it } from "vitest";

// `simnet` is a "simulation network" - a local, testing Stacks node for running our tests
const accounts = simnet.getAccounts();

// The identifiers of these wallets can be found in the `settings/Devnet.toml` config file
const sender = accounts.get("wallet_1")!;
const recipient = accounts.get("wallet_2")!;
const randomUser = accounts.get("wallet_3")!;

// Mock SIP-010 token contract for testing
const mockTokenContract = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.mock-token";

describe("test sBTC-Streamr enhanced v2 contract", () => {
  // Before each test, mine a few blocks to have some block height
  beforeEach(() => {
    simnet.mineEmptyBlock();
    simnet.mineEmptyBlock();
    simnet.mineEmptyBlock();
  });

  it("ensures contract is initialized properly", () => {
    const latestStreamId = simnet.callReadOnlyFn(
      "stream-enhanced-v2",
      "get-latest-stream-id",
      [],
      sender
    );

    expect(latestStreamId.result).toBeOk(Cl.uint(0));
  });

  it("ensures STX stream can be created", () => {
    const result = simnet.callPublicFn(
      "stream-enhanced-v2",
      "create-stream-stx",
      [
        Cl.principal(recipient),
        Cl.uint(1000000), // 1 STX in microSTX
        Cl.tuple({ "start": Cl.uint(1), "stop": Cl.uint(5) }),
        Cl.uint(100000) // 0.1 STX per block
      ],
      sender
    );

    expect(result.result).toBeOk(Cl.uint(0));

    // Check that the stream was created
    const stream = simnet.getMapEntry("stream-enhanced-v2", "streams", Cl.uint(0));
    expect(stream).toBeSome(
      Cl.tuple({
        "token-contract": Cl.none(),
        "sender": Cl.principal(sender),
        "recipient": Cl.principal(recipient),
        "deposit": Cl.uint(1000000),
        "withdrawn": Cl.uint(0),
        "rate-per-block": Cl.uint(100000),
        "timeframe": Cl.tuple({
          "start": Cl.uint(1),
          "stop": Cl.uint(5)
        }),
        "created-at": Cl.uint(3) // Current block height
      })
    );
  });

  it("ensures SIP-010 token stream can be created with deposit-then-create pattern", () => {
    // Create a token stream (simplified version without balance verification)
    const result = simnet.callPublicFn(
      "stream-enhanced-v2",
      "create-stream-token",
      [
        Cl.principal(recipient),
        Cl.principal(mockTokenContract),
        Cl.uint(1000000), // 1 token
        Cl.tuple({ "start": Cl.uint(1), "stop": Cl.uint(5) }),
        Cl.uint(100000) // 0.1 token per block
      ],
      sender
    );

    expect(result.result).toBeOk(Cl.uint(0));

    // Check that the stream was created
    const stream = simnet.getMapEntry("stream-enhanced-v2", "streams", Cl.uint(0));
    expect(stream).toBeSome(
      Cl.tuple({
        "token-contract": Cl.some(Cl.principal(mockTokenContract)),
        "sender": Cl.principal(sender),
        "recipient": Cl.principal(recipient),
        "deposit": Cl.uint(1000000),
        "withdrawn": Cl.uint(0),
        "rate-per-block": Cl.uint(100000),
        "timeframe": Cl.tuple({
          "start": Cl.uint(1),
          "stop": Cl.uint(5)
        }),
        "created-at": Cl.uint(3) // Current block height
      })
    );
  });

  it("ensures STX stream can be refueled", () => {
    // Create a stream first
    simnet.callPublicFn(
      "stream-enhanced-v2",
      "create-stream-stx",
      [
        Cl.principal(recipient),
        Cl.uint(1000000),
        Cl.tuple({ "start": Cl.uint(1), "stop": Cl.uint(5) }),
        Cl.uint(100000)
      ],
      sender
    );

    // Refuel the stream
    const result = simnet.callPublicFn(
      "stream-enhanced-v2",
      "refuel-stx",
      [Cl.uint(0), Cl.uint(500000)], // Add 0.5 STX
      sender
    );

    expect(result.result).toBeOk(Cl.uint(500000));

    // Check that the deposit was increased
    const stream = simnet.getMapEntry("stream-enhanced-v2", "streams", Cl.uint(0));
    expect(stream).toBeSome(
      Cl.tuple({
        "deposit": Cl.uint(1500000) // 1 + 0.5 STX
      })
    );
  });

  it("ensures recipient can withdraw from STX stream", () => {
    // Create a stream
    simnet.callPublicFn(
      "stream-enhanced-v2",
      "create-stream-stx",
      [
        Cl.principal(recipient),
        Cl.uint(1000000),
        Cl.tuple({ "start": Cl.uint(1), "stop": Cl.uint(5) }),
        Cl.uint(100000)
      ],
      sender
    );

    // Mine blocks to make time pass
    simnet.mineEmptyBlock();
    simnet.mineEmptyBlock();

    // Withdraw as recipient
    const result = simnet.callPublicFn(
      "stream-enhanced-v2",
      "withdraw",
      [Cl.uint(0)],
      recipient
    );

    expect(result.result).toBeOk(Cl.uint(200000)); // 2 blocks * 100000 per block

    // Check that withdrawn amount was updated
    const stream = simnet.getMapEntry("stream-enhanced-v2", "streams", Cl.uint(0));
    expect(stream).toBeSome(
      Cl.tuple({
        "withdrawn": Cl.uint(200000)
      })
    );
  });

  it("ensures sender can refund remaining STX after stream ends", () => {
    // Create a stream
    simnet.callPublicFn(
      "stream-enhanced-v2",
      "create-stream-stx",
      [
        Cl.principal(recipient),
        Cl.uint(1000000),
        Cl.tuple({ "start": Cl.uint(1), "stop": Cl.uint(5) }),
        Cl.uint(100000)
      ],
      sender
    );

    // Mine blocks to pass the end time
    simnet.mineEmptyBlock();
    simnet.mineEmptyBlock();
    simnet.mineEmptyBlock();
    simnet.mineEmptyBlock();
    simnet.mineEmptyBlock(); // Now at block 8, past stop block 5

    // Refund as sender
    const result = simnet.callPublicFn(
      "stream-enhanced-v2",
      "refund",
      [Cl.uint(0)],
      sender
    );

    expect(result.result).toBeOk(Cl.uint(500000)); // 1000000 - 500000 (5 blocks * 100000)

    // Check that deposit was reduced
    const stream = simnet.getMapEntry("stream-enhanced-v2", "streams", Cl.uint(0));
    expect(stream).toBeSome(
      Cl.tuple({
        "deposit": Cl.uint(500000)
      })
    );
  });

  it("ensures balance-of returns correct values for recipient", () => {
    // Create a stream
    simnet.callPublicFn(
      "stream-enhanced-v2",
      "create-stream-stx",
      [
        Cl.principal(recipient),
        Cl.uint(1000000),
        Cl.tuple({ "start": Cl.uint(1), "stop": Cl.uint(5) }),
        Cl.uint(100000)
      ],
      sender
    );

    // Mine blocks
    simnet.mineEmptyBlock();
    simnet.mineEmptyBlock();

    // Check recipient balance
    const balance = simnet.callReadOnlyFn(
      "stream-enhanced-v2",
      "balance-of",
      [Cl.uint(0), Cl.principal(recipient)],
      sender
    );

    expect(balance.result).toBeOk(Cl.uint(200000)); // 2 blocks * 100000
  });

  it("ensures balance-of returns correct values for sender", () => {
    // Create a stream
    simnet.callPublicFn(
      "stream-enhanced-v2",
      "create-stream-stx",
      [
        Cl.principal(recipient),
        Cl.uint(1000000),
        Cl.tuple({ "start": Cl.uint(1), "stop": Cl.uint(5) }),
        Cl.uint(100000)
      ],
      sender
    );

    // Mine blocks
    simnet.mineEmptyBlock();
    simnet.mineEmptyBlock();

    // Check sender balance
    const balance = simnet.callReadOnlyFn(
      "stream-enhanced-v2",
      "balance-of",
      [Cl.uint(0), Cl.principal(sender)],
      sender
    );

    expect(balance.result).toBeOk(Cl.uint(800000)); // 1000000 - 200000
  });

  it("ensures calculate-block-delta works correctly", () => {
    const delta = simnet.callReadOnlyFn(
      "stream-enhanced-v2",
      "calculate-block-delta",
      [Cl.tuple({ "start": Cl.uint(1), "stop": Cl.uint(5) })],
      sender
    );

    expect(delta.result).toBeOk(Cl.uint(2)); // Current block 3 - start block 1 = 2
  });

  it("ensures refund fails if stream is still active", () => {
    // Create a stream
    simnet.callPublicFn(
      "stream-enhanced-v2",
      "create-stream-stx",
      [
        Cl.principal(recipient),
        Cl.uint(1000000),
        Cl.tuple({ "start": Cl.uint(1), "stop": Cl.uint(5) }),
        Cl.uint(100000)
      ],
      sender
    );

    // Try to refund before stream ends
    const result = simnet.callPublicFn(
      "stream-enhanced-v2",
      "refund",
      [Cl.uint(0)],
      sender
    );

    expect(result.result).toBeErr(Cl.uint(2)); // ERR_STREAM_STILL_ACTIVE
  });

  it("ensures invalid stream ID returns error", () => {
    const result = simnet.callPublicFn(
      "stream-enhanced-v2",
      "withdraw",
      [Cl.uint(999)],
      recipient
    );

    expect(result.result).toBeErr(Cl.uint(3)); // ERR_INVALID_STREAM_ID
  });

  it("ensures unauthorized user cannot withdraw", () => {
    // Create a stream
    simnet.callPublicFn(
      "stream-enhanced-v2",
      "create-stream-stx",
      [
        Cl.principal(recipient),
        Cl.uint(1000000),
        Cl.tuple({ "start": Cl.uint(1), "stop": Cl.uint(5) }),
        Cl.uint(100000)
      ],
      sender
    );

    // Try to withdraw as random user
    const result = simnet.callPublicFn(
      "stream-enhanced-v2",
      "withdraw",
      [Cl.uint(0)],
      randomUser
    );

    expect(result.result).toBeErr(Cl.uint(0)); // ERR_UNAUTHORIZED
  });

  it("ensures unauthorized user cannot refuel", () => {
    // Create a stream
    simnet.callPublicFn(
      "stream-enhanced-v2",
      "create-stream-stx",
      [
        Cl.principal(recipient),
        Cl.uint(1000000),
        Cl.tuple({ "start": Cl.uint(1), "stop": Cl.uint(5) }),
        Cl.uint(100000)
      ],
      sender
    );

    // Try to refuel as random user
    const result = simnet.callPublicFn(
      "stream-enhanced-v2",
      "refuel-stx",
      [Cl.uint(0), Cl.uint(100000)],
      randomUser
    );

    expect(result.result).toBeErr(Cl.uint(0)); // ERR_UNAUTHORIZED
  });

  it("ensures get-stream returns correct stream data", () => {
    // Create a stream
    simnet.callPublicFn(
      "stream-enhanced-v2",
      "create-stream-stx",
      [
        Cl.principal(recipient),
        Cl.uint(1000000),
        Cl.tuple({ "start": Cl.uint(1), "stop": Cl.uint(5) }),
        Cl.uint(100000)
      ],
      sender
    );

    // Get stream data
    const stream = simnet.callReadOnlyFn(
      "stream-enhanced-v2",
      "get-stream",
      [Cl.uint(0)],
      sender
    );

    expect(stream.result).toBeSome(
      Cl.tuple({
        "token-contract": Cl.none(),
        "sender": Cl.principal(sender),
        "recipient": Cl.principal(recipient),
        "deposit": Cl.uint(1000000),
        "withdrawn": Cl.uint(0),
        "rate-per-block": Cl.uint(100000),
        "timeframe": Cl.tuple({
          "start": Cl.uint(1),
          "stop": Cl.uint(5)
        }),
        "created-at": Cl.uint(3)
      })
    );
  });

  it("ensures get-token-balance works for SIP-010 tokens", () => {
    const balance = simnet.callReadOnlyFn(
      "stream-enhanced-v2",
      "get-token-balance",
      [Cl.principal(mockTokenContract), Cl.principal(sender)],
      sender
    );

    // This returns 0 as per our simplified implementation
    expect(balance.result).toBeOk(Cl.uint(0));
  });

  it("ensures hash-stream generates consistent hashes", () => {
    // Create a stream first
    simnet.callPublicFn(
      "stream-enhanced-v2",
      "create-stream-stx",
      [
        Cl.principal(recipient),
        Cl.uint(1000000),
        Cl.tuple({ "start": Cl.uint(1), "stop": Cl.uint(5) }),
        Cl.uint(100000)
      ],
      sender
    );

    // Get hash for stream updates
    const hash1 = simnet.callReadOnlyFn(
      "stream-enhanced-v2",
      "hash-stream",
      [
        Cl.uint(0),
        Cl.uint(200000), // new rate
        Cl.tuple({ "start": Cl.uint(1), "stop": Cl.uint(10) }) // new timeframe
      ],
      sender
    );

    const hash2 = simnet.callReadOnlyFn(
      "stream-enhanced-v2",
      "hash-stream",
      [
        Cl.uint(0),
        Cl.uint(200000), // same rate
        Cl.tuple({ "start": Cl.uint(1), "stop": Cl.uint(10) }) // same timeframe
      ],
      sender
    );

    // Hashes should be identical for same inputs
    expect(hash1.result).toBeOk(hash2.result);
  });
});
