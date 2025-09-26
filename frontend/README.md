# sBTC-Streamr Frontend

A modern React frontend for the sBTC-Streamr multi-token streaming protocol built on Stacks.

## Features

- 🔗 **Wallet Integration**: Connect with Leather, Xverse, or any Stacks-compatible wallet
- 💰 **Multi-Token Support**: Stream STX, sBTC, and other SIP-010 tokens
- 📊 **Analytics Dashboard**: Track stream performance and insights
- 🎨 **Modern UI**: Beautiful, responsive design with Tailwind CSS
- ⚡ **Real-time Updates**: Live stream status and balance updates

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **@stacks/connect-react** for wallet integration
- **React Router** for navigation
- **Lucide React** for icons

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn
- A Stacks-compatible wallet (Leather, Xverse, etc.)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/          # React components
│   ├── Header.tsx      # Navigation header
│   ├── Dashboard.tsx   # Main dashboard
│   ├── CreateStream.tsx # Stream creation form
│   ├── StreamDetails.tsx # Individual stream view
│   ├── Analytics.tsx   # Analytics dashboard
│   └── ConnectWallet.tsx # Wallet connection
├── hooks/              # Custom React hooks
│   └── useAuth.ts     # Authentication hook
├── utils/              # Utility functions
├── App.tsx            # Main app component
├── main.tsx           # App entry point
└── index.css          # Global styles
```

## Features Overview

### Dashboard
- View all your streams
- Quick stats and metrics
- Stream status and progress
- Easy navigation to stream details

### Create Stream
- Support for STX, sBTC, and custom tokens
- Flexible timing options
- Real-time stream preview
- Form validation

### Stream Details
- Detailed stream information
- Withdraw available funds
- Refuel streams with additional tokens
- Update stream settings

### Analytics
- Performance metrics
- Token usage statistics
- Monthly trends
- Growth insights

## Wallet Integration

The app uses `@stacks/connect-react` for seamless wallet integration:

- **Leather Wallet** (formerly Hiro Wallet)
- **Xverse Wallet**
- **Any Stacks-compatible wallet**

## Smart Contract Integration

The frontend integrates with the sBTC-Streamr smart contract:

- `stream-to`: Create STX streams
- `stream-token-to`: Create token streams
- `withdraw`: Withdraw available funds
- `refuel`: Add funds to streams
- `refund`: Withdraw excess funds

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_CONTRACT_ADDRESS=your_contract_address
VITE_NETWORK=testnet
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support and questions:
- GitHub Issues
- Stacks Discord
- Stacks Forum
