# sBTC-Streamr

A Bitcoin-native, multi-token streaming protocol on Stacks that enables continuous, clock-based payments denominated in **sBTC** and other SIP-010 tokens.

## 🚀 Project Overview

sBTC-Streamr is a permissionless streaming protocol that allows organizations and individuals to create continuous payments for:
- **Freelance work** - Pay contractors over time instead of lump-sum
- **DAO grants** - Distribute funding to projects over time
- **Payroll** - Bitcoin-denominated recurring payments
- **Subscriptions** - Continuous service payments

## ✨ Key Features

### ✅ **Core Functionality (Implemented & Deployed)**
- **STX Streaming** - Create, refuel, withdraw, and refund STX streams
- **Block-based Calculations** - Precise time-based payment calculations
- **Signature Verification** - Secure stream parameter updates with 2-party consent
- **Comprehensive Testing** - 13/16 tests passing (81% coverage)
- **Testnet Deployment** - Live on Stacks Testnet

### 🎯 **Planned Features (sBTC Enhancement)**
- **Multi-token Support** - Stream sBTC and other SIP-010 tokens
- **Deposit-then-Create Pattern** - Safe token deposit flow for SIP-010 tokens
- **Frontend Integration** - React PWA with wallet connectivity
- **Chainhook Indexing** - Real-time event monitoring and webhooks

## 🏗️ Architecture

```
User Wallets (Leather / Xverse)
↓ (signed txs / token transfers)
Frontend (React PWA) — Stacks.js & Sats-Connect
↕
Stacks Chain — Clarity Contracts:
├── StreamFactory.clar (registry + create)
├── StreamCore.clar (stream data + logic)
└── TokenAdapter trait (SIP-010 adapter)
On-chain Events → Chainhook → Postgres → Frontend
```

## 🛠️ Development Setup

### Prerequisites
- [Clarinet](https://docs.hiro.so/clarinet/getting-started) - Clarity development toolkit
- [Node.js](https://nodejs.org/) - JavaScript runtime
- [Git](https://git-scm.com/) - Version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/austinLorenzMccoy/sBTC-Streamr.git
   cd sBTC-Streamr
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run tests**
   ```bash
   npm test
   ```

4. **Start development environment**
   ```bash
   clarinet console
   ```

## 📁 Project Structure

```
sBTC-Streamr/
├── contracts/           # Clarity smart contracts
│   └── stream.clar     # Main streaming contract
├── tests/              # Test suite
│   └── stream.test.ts  # Comprehensive tests
├── frontend/           # Next.js React application
├── docs/               # Documentation
│   ├── projects.md     # Original requirements
│   └── sBTC-Streamrprd.md # Project PRD
├── settings/           # Clarinet configuration
└── deployments/        # Deployment plans
```

## 🧪 Testing

The project includes a comprehensive test suite with 16 test cases covering:

- ✅ Stream creation and initialization
- ✅ Refueling functionality
- ✅ Withdrawal calculations
- ✅ Refund mechanisms
- ✅ Authorization and security
- ✅ Balance calculations
- ✅ Block-based timing
- ✅ Error handling

**Current Status: 13/16 tests passing (81% coverage)**

Run tests with:
```bash
npm test
```

## 🚀 Deployment

### Testnet Deployment
The contract is **live on Stacks Testnet**:

- **Contract Address**: `ST1PGECE9RYR303FHZ24BJVYY3MG63FC3NHBSR6X4.stream`
- **Transaction ID**: `da79f2ffa520c753a3f1478624dffabdae5b714061f1b489c333343773cb245e`
- **Deployment Cost**: 0.058690 STX
- **Network**: Stacks Testnet
- **Status**: ✅ **Confirmed**

### View on Explorer
Check your contract on [Stacks Explorer Testnet](https://explorer.stacks.co/?chain=testnet)

### Interact with Contract
You can now call functions like:
```typescript
// Create a stream
await contract.call("stream-to", [
  Cl.principal("ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG"), // recipient
  Cl.uint(1000000), // 1 STX in microSTX
  Cl.tuple({ "start-block": Cl.uint(100), "stop-block": Cl.uint(200) }),
  Cl.uint(10000) // 0.01 STX per block
], deployer);
```

## 📋 Smart Contract Functions

### Core Functions
- `stream-to` - Create a new payment stream
- `refuel` - Add tokens to an existing stream
- `withdraw` - Withdraw available tokens (recipient)
- `refund` - Withdraw excess tokens (sender)
- `update-details` - Update stream parameters with 2-party consent

### Read-only Functions
- `balance-of` - Check available balance for a party
- `calculate-block-delta` - Calculate active blocks
- `hash-stream` - Generate stream hash for signatures
- `validate-signature` - Verify signature authenticity

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built on [Stacks](https://stacks.co/) blockchain
- Inspired by [LearnWeb3DAO](https://github.com/LearnWeb3DAO/stacks-token-streaming) tutorial
- Developed with [Clarinet](https://docs.hiro.so/clarinet/) toolkit

## 📞 Contact

- **Developer**: austinLorenzMccoy
- **Email**: chibuezeaugustine23@gmail.com
- **GitHub**: [@austinLorenzMccoy](https://github.com/austinLorenzMccoy)

---

**Status**: 🚀 Deployed to Testnet | **Test Coverage**: 81% | **Last Updated**: December 2024
