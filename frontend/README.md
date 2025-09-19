# sBTC-Streamr Frontend

A modern React frontend for the sBTC-Streamr token streaming protocol built with Next.js and Stacks Connect.

## Features

- 🔗 **Wallet Integration** - Connect with Leather, Xverse, and other Stacks wallets
- 📊 **Stream Management** - Create, view, and manage payment streams
- 💰 **Real-time Balances** - View stream balances and withdrawal amounts
- 🎨 **Modern UI** - Beautiful, responsive design with Tailwind CSS
- 🌙 **Dark Mode** - Built-in dark mode support

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- A Stacks wallet (Leather, Xverse, etc.)

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
npm start
```

## Contract Integration

The frontend connects to the deployed sBTC-Streamr contract on Stacks Testnet:

- **Contract Address**: `ST1PGECE9RYR303FHZ24BJVYY3MG63FC3NHBSR6X4.stream`
- **Network**: Stacks Testnet
- **Explorer**: [View on Stacks Explorer](https://explorer.stacks.co/address/ST1PGECE9RYR303FHZ24BJVYY3MG63FC3NHBSR6X4?chain=testnet)

## Usage

### Creating a Stream

1. Connect your wallet using the "Connect Wallet" button
2. Fill in the stream details:
   - **Recipient Address**: The Stacks address to receive payments
   - **Initial Balance**: Amount of STX to lock in the stream
   - **Start Block**: Block height when streaming begins
   - **Stop Block**: Block height when streaming ends
   - **Payment Per Block**: Amount of STX to stream per block
3. Click "Create Stream" and confirm the transaction

### Withdrawing from a Stream

1. Connect your wallet (must be the recipient)
2. Find your stream in the "Active Streams" section
3. Click "Withdraw" to claim available streamed tokens

## Technical Details

### Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **Blockchain**: Stacks.js for contract interaction
- **Wallet**: Stacks Connect for wallet integration
- **TypeScript**: Full type safety

### Key Components

- `page.tsx` - Main application interface
- `layout.tsx` - Stacks Connect provider setup
- `lib/contract.ts` - Contract interaction utilities

### Contract Functions

The frontend interacts with these contract functions:

- `stream-to` - Create new payment streams
- `withdraw` - Withdraw available tokens
- `refuel` - Add more tokens to existing streams
- `refund` - Get back unstreamed tokens

## Development

### Project Structure

```
src/
├── app/
│   ├── layout.tsx      # Root layout with Stacks Connect
│   ├── page.tsx        # Main application page
│   └── globals.css     # Global styles
├── lib/
│   └── contract.ts     # Contract interaction utilities
└── components/         # Reusable components (future)
```

### Environment Variables

Create a `.env.local` file for environment-specific configuration:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=ST1PGECE9RYR303FHZ24BJVYY3MG63FC3NHBSR6X4
NEXT_PUBLIC_CONTRACT_NAME=stream
NEXT_PUBLIC_NETWORK=testnet
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

- **Documentation**: [Stacks Documentation](https://docs.stacks.co/)
- **Community**: [Stacks Discord](https://discord.gg/stacks)
- **Issues**: [GitHub Issues](https://github.com/austinLorenzMccoy/sBTC-Streamr/issues)