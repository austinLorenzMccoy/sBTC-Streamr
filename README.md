# sBTC-Streamr 🚀

**The first multi-token streaming protocol on Stacks**

A decentralized streaming protocol that enables continuous payments with STX, sBTC, and other SIP-010 tokens. Built for the Stacks Ascent Trailblazer Program as an original feature enhancement.

## 🌟 Features

### Multi-Token Support (Original Feature)
- **STX Streaming**: Native Stacks token streaming
- **sBTC Streaming**: Bitcoin-backed token streaming  
- **Custom Token Support**: Any SIP-010 compliant token
- **Unified Interface**: Single protocol for all token types

### Core Functionality
- **Continuous Payments**: Stream tokens over time instead of lump sums
- **Flexible Timing**: Start immediately or schedule for future blocks
- **Real-time Withdrawals**: Recipients can withdraw accumulated tokens anytime
- **Stream Refueling**: Add more tokens to existing streams
- **Excess Refunds**: Reclaim unused tokens after stream completion
- **Cryptographic Updates**: Secure stream parameter modifications

### Frontend Features
- **Modern UI**: Beautiful, responsive React interface
- **Wallet Integration**: Connect with Leather, Xverse, or any Stacks wallet
- **Analytics Dashboard**: Track performance and insights
- **Stream Management**: Create, monitor, and manage streams
- **Real-time Updates**: Live balance and status updates

## 🏗️ Architecture

### Smart Contract (Clarity)
```
contracts/
└── sBTC-Streamr.clar    # Main streaming protocol
```

**Key Functions:**
- `stream-to`: Create STX streams
- `stream-token-to`: Create token streams  
- `withdraw`: Withdraw available funds
- `refuel`: Add funds to streams
- `refund`: Withdraw excess funds
- `update-details`: Modify stream parameters

### Frontend (React + TypeScript)
```
frontend/
├── src/
│   ├── components/      # UI components
│   ├── hooks/          # Custom hooks
│   └── utils/          # Utilities
└── public/             # Static assets
```

### Testing
```
tests/
└── sBTC-Streamr.test.ts # Comprehensive test suite
```

## 🚀 Quick Start

### Prerequisites
- [Clarinet](https://docs.hiro.so/clarinet/getting-started) - Stacks development toolkit
- [Node.js](https://nodejs.org/) 16+ 
- A Stacks-compatible wallet

### Smart Contract Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Run tests:**
```bash
npm run test
```

3. **Deploy to testnet:**
```bash
clarinet deployments generate --testnet --low-cost
clarinet deployment apply -p deployments/default.testnet-plan.yaml
```

### Frontend Setup

1. **Navigate to frontend:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start development server:**
```bash
npm run dev
```

4. **Open [http://localhost:3000](http://localhost:3000)**

## 📊 Test Results

All tests passing ✅

```
✓ 12 tests passed
- Stream creation and management
- Multi-token support
- Withdrawal and refund functionality  
- Signature verification
- Error handling
```

## 🎯 Use Cases

### Freelance Payments
- **Client → Freelancer**: Continuous payment streams for ongoing work
- **Flexible Withdrawals**: Freelancers withdraw as needed
- **Multi-token Support**: Pay in STX, sBTC, or custom tokens

### Grant Distribution
- **Organization → Project**: Structured funding over time
- **Transparent Tracking**: Public stream visibility
- **Automated Payments**: No manual intervention required

### Subscription Services
- **User → Service**: Recurring payments for services
- **Token Flexibility**: Pay with preferred tokens
- **Real-time Updates**: Live balance tracking

## 🔧 Development

### Smart Contract Development
```bash
# Create new contract
clarinet contract new my-contract

# Run tests
npm run test

# Deploy to testnet
clarinet deployment apply -p deployments/default.testnet-plan.yaml
```

### Frontend Development
```bash
cd frontend

# Start dev server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint
```

## 🧪 Testing

The project includes comprehensive tests covering:

- **Stream Creation**: STX and token streams
- **Multi-token Support**: Different token types
- **Withdrawal Logic**: Balance calculations
- **Refund System**: Excess token recovery
- **Signature Verification**: Cryptographic updates
- **Error Handling**: Edge cases and failures

Run tests:
```bash
npm run test
```

## 📈 Analytics

The frontend includes analytics features:

- **Stream Performance**: Volume, duration, success rates
- **Token Usage**: Popular tokens and trends
- **User Behavior**: Withdrawal patterns and preferences
- **Growth Metrics**: Adoption and usage statistics

## 🔐 Security

- **Clarity Smart Contracts**: Formally verifiable
- **Cryptographic Signatures**: Secure parameter updates
- **Access Controls**: Proper authorization checks
- **Error Handling**: Comprehensive error management

## 🌐 Deployment

### Testnet Deployment
1. Set up wallet with testnet STX
2. Configure `settings/Testnet.toml`
3. Generate deployment plan
4. Deploy contract

### Frontend Deployment
1. Build production bundle
2. Deploy to hosting service
3. Configure environment variables
4. Update contract addresses

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 🙏 Acknowledgments

- **Stacks Foundation** for the Ascent Trailblazer Program
- **LearnWeb3** for the foundational streaming protocol tutorial
- **Clarity Community** for development tools and support

## 📞 Support

- **GitHub Issues**: Bug reports and feature requests
- **Stacks Discord**: Community support
- **Documentation**: [Stacks Docs](https://docs.stacks.co)

---

**Built with ❤️ for the Stacks Ascent Trailblazer Program**

*This project demonstrates advanced Clarity development, multi-token support, and modern frontend integration as an original feature enhancement to the LearnWeb3 streaming protocol tutorial.*
