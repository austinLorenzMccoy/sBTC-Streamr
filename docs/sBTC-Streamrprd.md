Nice — I picked the **least-expected** project variant from the document and built a full, production-ready PRD: **sBTC-Streamr — a Bitcoin-native, multi-token streaming protocol on Stacks**.
(Why “least expected”? everyone building tutorials picks STX-only streaming — I chose a more ambitious, Bitcoin-first twist: streaming **sBTC + SIP-010 tokens** with practical flows for deposits, signed updates, and robust UX for real-world payroll/grant use.)

Below is a robust, well-structured PRD with step-by-step implementation, tests, security, acceptance criteria, timeline, and deliverables you can use for development or a Stacks Ascent submission.

# sBTC-Streamr — PRD (10/10 grade target)

## 1) One-line pitch

A permissionless streaming protocol on Stacks that lets organizations and individuals create continuous, clock-based payments denominated in **sBTC** (and other SIP-010 tokens or STX), with on-chain clarity contracts, signature-based updates, Chainhook indexing, and mobile wallet UX (Leather + Xverse).

---

## 2) Why this project matters

* Unlocks **Bitcoin liquidity** for recurring payments (payroll, grants, subscriptions) without selling BTC.
* sBTC gives users a 1:1 BTC peg on Stacks — streaming it means Bitcoin value becomes productive.
* Most tutorials show STX streams; building robust sBTC streaming (multi-token + deposit patterns + consented updates) is harder and more valuable.

---

## 3) Target users & personas

* Freelancers & contractors who want BTC-denominated recurring payments.
* DAOs & grantmakers paying teams over time.
* Payroll providers targeting BTC payroll.
* Builders/integrators who want composable streaming primitives for DeFi apps.

---

## 4) Core features (MVP → +1)

**MVP (must-have)**

1. Create STX stream (single-tx flow) — baseline fast flow.
2. Create sBTC (SIP-010) stream with **deposit-then-create** flow (safe pattern explained below).
3. Withdraw by recipient at any time (pro rata, block-based).
4. Refuel by sender.
5. Refund remaining funds to sender after stream end.
6. Update stream params with **2-party consent** via on-chain signature verification (hash + secp256k1 recover).
7. Chainhook indexer to emit & surface events (StreamCreated, Withdrawn, Refueled, Updated, Refunded).

**Nice-to-have (phase 2)**

* Substreams / split streams (one stream paying multiple recipients).
* Gasless UX / meta-txs (wallet relayer).
* Permit-like “signed-approval” deposits for SIP-010 tokens (if tokens add permit extensions).
* On-chain schedule anchors for payroll (monthly/biweekly presets).

---

## 5) High-level architecture

User Wallets (Leather / Xverse / other)
↓ (signed txs / token transfers)
Frontend (React PWA) — Stacks.js & Sats-Connect
↕
Stacks Chain — Clarity Contracts:

* **StreamFactory.clar** (registry + create)
* **StreamCore.clar** (stream data + logic)
* **TokenAdapter trait** (SIP-010 adapter / helpers)
  On-chain Events → Chainhook pipeline → Postgres / Search / Webhooks → Frontend / Dashboard

---

## 6) Important design decisions & tradeoffs (short)

* **STX vs SIP-010 token flows**

  * STX: contract can pull STX from tx-sender in same tx (simple single-TX create).
  * SIP-010 (e.g., sBTC): streaming contract **cannot** unilaterally pull tokens from user unless the user calls the token transfer. So we use a safe **deposit-then-create** flow: user `contract-call?`s token.transfer → sends tokens to Stream contract, then calls `create-stream` which verifies deposit balance and mints stream entry. (Frontend orchestrates two sequential txs.)
* **Signed updates** use `sha256` over canonicalized stream data + new params; counterparty signs off-chain; verifier uses `secp256k1-recover?` to match principal.
* **No approvals**: we do not rely on token permits; we support them if tokens implement an allowance or permit extension later.

---

## 7) Data model (Clarity storage sketch)

```
define-map streams
  uint ;; stream-id
  {
    token-contract: principal, ;; SIP-010 contract or special 'STX' sentinel
    sender: principal,
    recipient: principal,
    deposit: uint,              ;; total tokens deposited to the stream
    withdrawn: uint,            ;; tokens withdrawn by recipient
    rate-per-block: uint,       ;; units per block
    timeframe: (tuple (start uint) (stop uint)),
    created-at: uint
  }
define-data-var latest-stream-id uint u0
```

Use a `token-contract` field where:

* For STX streams: set `'STX` sentinel (or null) and use `stx-transfer?` logic.
* For SIP-010 tokens (sBTC or others): store the contract principal and use `contract-call?` to token methods as read-only checks; deposits are expected to be actual token transfers into the stream contract.

---

## 8) Clarity contract interface (essential functions)

**StreamFactory**

* `define-public (create-stream-stx (recipient principal) (initial-balance uint) (timeframe tuple) (rate uint))`

  * Transfers STX from `tx-sender` → contract (single tx), stores stream record.

* `define-public (create-stream-token (recipient principal) (token-contract principal) (deposit-id? buff?) (timeframe ...) (rate uint))`

  * Verifies `ft-get-balance` or deposit precondition then creates stream id. (Frontend must ensure deposit of SIP-010 tokens happened.)

* `define-public (refuel-stx stream-id amount)` / `refuel-token stream-id amount`

  * STX variant uses `stx-transfer?`; token variant expects user to transfer token to contract then call refuel which validates new balance.

* `define-public (withdraw stream-id)`

  * computes withdrawable = earned − withdrawn; updates `withdrawn`, transfers tokens via `stx-transfer?` or `contract-call? token.transfer`.

* `define-public (refund stream-id)`

  * after end, sends leftover deposit back to sender.

* `define-read-only (hash-stream stream-id new-rate new-timeframe)`

* `define-read-only (validate-signature hash signature signer)`

* `define-public (update-details stream-id new-rate new-timeframe signer signature)`

  * validates signature & ownership, updates mapping.

(Example code snippets provided in Phase 1 below.)

---

## 9) Step-by-step implementation plan (Phase-by-phase)

### Phase 0 — Prep & infra (Days 0–5)

* Create GitHub org + repo `sbtc-streamr`.
* Add issue templates, project board (Ascent milestones).
* Install Clarinet, Node.js, and set up `clarinet new sbtc-streamr`.
* Create `contracts/`, `test/`, `frontend/` folders and CI skeleton (GitHub Actions).

**Deliverables:** repo scaffold, Clarinet dev config, README with dev onboarding.

---

### Phase 1 — Core contracts & local tests (Days 6–28) **(Priority)**

Goal: Working Clarity contracts and full Clarinet test coverage for STX flows + token deposit pattern.

Tasks:

1. **Stream storage & primitives** — implement `streams` map and `latest-stream-id`.
2. **STX flows** — `create-stream-stx`, `withdraw`, `refuel-stx`, `refund`.

   * Reuse patterns from PROJECT1.md but modularize into `StreamCore` library functions.
3. **SIP-010 support (deposit pattern)**:

   * Implement helper read-only `token-balance-of` that uses `(contract-call? token-contract get-balance tx-sender)` or checks `(ft-get-balance token-contract principal)` semantics (adapt to token trait).
   * `create-stream-token` expects the user to have transferred tokens into the contract before calling; validate by comparing `contract` balance delta vs recorded deposit.
4. **Signature helpers**: `hash-stream`, `validate-signature` using `sha256` + `secp256k1-recover?`.
5. **Unit tests (Clarinet)**: cover happy & edge paths:

   * STX create + withdraw + refund.
   * Token deposit → create → withdraw → refund.
   * Refuel + unauthorized calls + invalid signature paths.

**Deliverables:** `stream.clar` contracts, `stream.test.ts` (vitest) with 90%+ coverage, passing CI.

**Developer commands**

```bash
# create project
clarinet new sbtc-streamr
# run tests
clarinet test
# start devnet
clarinet devnet
```

---

### Phase 2 — Indexing, events & backend (Days 20–40)

Goal: real-time webhooks, analytics, and UX readiness.

Tasks:

1. Add event emissions in contracts: `StreamCreated`, `Refueled`, `Withdrawn`, `Refunded`, `StreamUpdated`.
2. Deploy a Chainhook pipeline:

   * Listen to those events, index to Postgres/TimescaleDB.
   * Provide REST endpoints for frontends and dashboards.
3. Backend microservice:

   * Orchestrates deposit validation for SIP-010 flows (e.g., watch token transfers to stream contract address and mark deposit receipt id).
   * Maintains ephemeral caches for quick quotes, stream balances.
4. Webhooks to notify wallets when recipient withdrawable crosses threshold.

**Deliverables:** Chainhook transforms, Postgres schema, backend endpoints.

---

### Phase 3 — Frontend + Wallet integration (Days 36–60)

Goal: polished PWA with flows for STX, sBTC deposit & streaming.

Tasks:

1. React (Vite + TS + Tailwind) PWA scaffold.
2. Integrate `@stacks/connect` / `@stacks/transactions` and Sats-Connect for PSBT signing where needed.
3. UX flows:

   * **STX flow**: one-click create (single tx), show live balance.
   * **sBTC flow**:

     1. User deposits sBTC: call token transfer (wallet) to contract address.
     2. Frontend detects deposit via backend webhook / chain indexer.
     3. User calls `create-stream-token` to bind deposit to stream (one click after deposit confirmation).
   * Update details: generate hash (via contract read-only), request counterparty signature via wallet, call `update-details`.
4. Notifications: in-app + wallet popup when funds available.
5. Mobile-first UX, low-bandwidth optimizations, PWA offline caching.

**Deliverables:** demo app, walkthrough video, onboarding flow docs.

---

### Phase 4 — Audit, bounty & beta launch (Days 55–90)

Goal: security validation + real users.

Tasks:

1. Run internal fuzzing and property tests (simulate reorgs, forks, race conditions).
2. Lightweight third-party audit (focus on fund-safety flows).
3. Public bug-bounty on testnet.
4. Beta: onboard 10+ real users (freelancers, DAO grants), record metrics.

**Deliverables:** Audit report, bug-bounty results, user testimonials.

---

### Phase 5 — Mainnet prepare & Ascent application (Days 85–100)

* Final polish, prepare Ascent package (repo, testnet addresses, pitch video, tutorials, metrics, commit history).
* Apply to Ascent and Code for STX.

---

## 10) Clarity snippets (skeletons)

**hash-stream / validate-signature**

```clarity
(define-read-only (hash-stream (stream-id uint) (new-rate uint) (new-timeframe (tuple (start uint) (stop uint))))
  (let ((s (unwrap! (map-get? streams stream-id) (sha256 0))))
    (sha256 (concat (concat (unwrap-panic (to-consensus-buff? s)) (unwrap-panic (to-consensus-buff? new-rate)))
                   (unwrap-panic (to-consensus-buff? new-timeframe)))))
)

(define-read-only (validate-signature (hash (buff 32)) (signature (buff 65)) (expected-signer principal))
  (is-eq (principal-of? (unwrap! (secp256k1-recover? hash signature) false)) (ok expected-signer))
)
```

**withdraw (simplified)**

```clarity
(define-public (withdraw (stream-id uint))
  (let ((s (unwrap! (map-get? streams stream-id) (err u3)))
        (amount (calculate-withdrawable stream-id tx-sender)))
    (asserts! (> amount u0) (err u4))
    (map-set streams stream-id (merge s { withdrawn: (+ (get withdrawn s) amount) }))
    ;; token dispatch
    (if (is-stx-stream? s)
      (try! (as-contract (stx-transfer? amount tx-sender (get recipient s))))
      ;; token stream: call token contract transfer (caller must be contract? see design note)
      (try! (contract-call? (get token-contract s) transfer amount (as-contract tx-sender) (get recipient s) (optional 0x)))
    )
    (ok amount)
  )
)
```

> **Note:** token transfer pattern above requires contract-calls to token contracts. For SIP-010 token transfers from contract to recipient this is possible because the contract is the holder of deposited tokens; we will only send tokens that the contract itself owns.

---

## 11) Testing plan

* Unit & integration tests (Clarinet + vitest) for all contract functions.
* Property tests: race conditions (refuel + withdraw same block), reorg simulation, signature replay attempts.
* Fuzzing: random stream parameters & edge values (max uint, zero rates).
* Integration tests for token deposit flow (simulate token.transfer to stream contract, then create-stream-token).

Include sample testcases (based on PROJECT1.md tests) adjusted to sBTC deposit flow.

---

## 12) Security & threat model

* **Funds safety**: contract must never be able to move tokens it does not own. Deposit verification ensures the contract only streams tokens that were actually transferred in.
* **Signature replay**: include stream-id + nonce + canonicalized fields when hashing to prevent replay. Use `created-at` + `latest-update-nonce` field.
* **Denial-of-service**: require gas-efficient data structures, caps on map sizes per tx, and limits on batch operations.
* **Oracle trust**: none required for core flows. For optional scheduled automation, use decentralized relayers.
* **Audit**: specification + unit tests + external audit + public bug bounty.

---

## 13) Acceptance criteria (what gets you a 10/10)

* Contracts: deployed to testnet, Clarinet tests passing (CI badge), 90%+ test coverage on critical flows.
* Functionality: STX single-tx streaming + sBTC deposit→create flow working end-to-end.
* UX: front end able to deposit sBTC, create stream, withdraw, update with signature, and refund.
* Security: audit addressing critical/major issues, bug bounty results minimal.
* Community: 3 tutorials (Clarity contract deep-dive, sBTC deposit flow, frontend wallet integration), 10 beta users, video demo, clear Ascent application pack.

---

## 14) Metrics & KPIs (first 90 days)

* 10+ active streams, cumulative streaming volume ≥ 1 BTC (testnet-equivalent)
* Average withdraw latency < 5s (indexing updates)
* 90% of tests passing in CI, audit fixes resolved.
* 3 published how-tos + 1 video walkthrough.

---

## 15) Rough budget (example \$25K)

* Dev hours (2 devs x 2 months): \$10k
* Audit (partial/critical flows): \$8k
* Hosting & indexer infra (Chainhook + DB): \$2k
* Tutorials, content, bounties: \$2k
* Contingency/legal: \$3k

---

## 16) Team (recommended)

* Product lead / founder
* Lead Clarity engineer (contracts + tests)
* Full-stack (React + backend + Chainhook)
* DevOps / Indexer specialist
* Security auditor (outsourced)
* Community / docs writer

---

## 17) Deliverables & Ascent pack checklist

* Public GitHub repo (with milestone board).
* Clarinet test results + CI badge.
* Testnet contract addresses + explorer links.
* Demo web app + recorded 2–5 minute pitch + 2–3 minute demo.
* 3 step-by-step tutorials (contract, sBTC deposit flow, wallet integration).
* Audit plan + bug bounty summary.
* Metrics snapshot & 10 beta user bios.

---

## 18) Quick next steps (actionable now)

1. I’ll scaffold the repo with Clarinet + sample `stream.clar` skeleton and vitest tests (based on PROJECT1.md) — tell me if you want STX-only first or STX + sBTC skeleton.
2. Decide token support priority: (A) STX first, (B) STX + token deposit pattern (recommended), or (C) STX + permit-enabled SIP-010 (if permit exists).
3. I can generate: contract skeleton + `stream.test.ts` adapted for sBTC deposit flow, or the frontend demo scaffold — pick one and I’ll produce code now.

---

Want me to scaffold the Clarinet contract + tests for the **sBTC deposit→create** flow now (I’ll output the Clarity skeleton + vitest test file you can paste into `contracts/` and `test/`)?
