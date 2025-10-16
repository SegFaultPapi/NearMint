# 🎨 NearMint - The First Web3 Pawn Shop

> **Transform your physical collectibles into liquid financial assets**

NearMint is a revolutionary platform that bridges the gap between physical collectibles and Web3 liquidity. Turn your sports cards, memorabilia, and valuable collectibles into digital assets without losing physical ownership.

![NearMint Banner](https://img.shields.io/badge/Web3-Pawn%20Shop-orange?style=for-the-badge&logo=ethereum)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![Starknet](https://img.shields.io/badge/Starknet-Cairo-purple?style=for-the-badge&logo=starknet)
![ChipiPay](https://img.shields.io/badge/ChipiPay-LATAM-green?style=for-the-badge)

## 🚀 **What is NearMint?**

NearMint is the first Web3 pawn shop that allows you to:

- **Tokenize** your physical collectibles into NFTs
- **Use NFTs as collateral** for instant loans
- **Access liquidity** without selling your collectibles
- **Trade** tokenized collectibles on the secondary market
- **Withdraw** your physical items anytime

### 🎯 **Target Market**
- **$522B** global collectibles market
- **LATAM** regional focus
- **Web3** technology with invisible complexity

## ✨ **Key Features**

### 🔐 **Secure Tokenization**
- Professional verification of collectibles
- High-security vault custody
- Full shipping insurance
- Blockchain traceability

### 💰 **Instant Liquidity**
- Competitive loan rates (5.2% APR)
- Use NFTs as collateral
- Daily payment options
- Risk assessment system

### 🌐 **ChipiPay Integration**
- Massive onboarding in LATAM
- Frictionless payments
- Custodial wallet support
- Local payment methods

### 🎨 **Invisible Web3**
- No blockchain knowledge required
- Simple user interface
- Traditional payment methods
- Optional Web3 participation

## 🛠️ **Tech Stack**

### **Frontend**
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Shadcn/ui** - Component library
- **Framer Motion** - Animations

### **Backend & Blockchain**
- **Starknet** - Layer 2 blockchain
- **Cairo** - Smart contract language
- **IPFS** - Decentralized storage
- **ChipiPay SDK** - Payment integration

### **Authentication & Security**
- **Clerk** - User authentication
- **Custodial Wallets** - Secure key management
- **PIN Protection** - Additional security layer

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js 18+ 
- npm/yarn/pnpm
- Git

### **Installation**

1. **Clone the repository**
```bash
git clone https://github.com/your-username/near-mint.git
cd near-mint
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Fill in the required environment variables:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret
NEXT_PUBLIC_CHIPI_API_KEY=your_chipi_key
NEXT_PUBLIC_STARKNET_RPC_URL=your_starknet_rpc
```

4. **Run the development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 **How It Works**

### **Step 1: Send Your Collectibles**
- Upload photos of your collectibles
- Enter details (name, category, year, condition, value)
- Professional verification included
- Secure shipping to vault

### **Step 2: Automatic Tokenization**
- 100% automated process
- Digital certificate of authenticity
- Full blockchain traceability
- NFT minted on Starknet

### **Step 3: Access Instant Liquidity**
- Use tokens as collateral for loans
- Competitive interest rates
- Active secondary market
- Withdraw collectibles anytime

## 🎨 **User Interface**

### **Dashboard**
- Portfolio overview
- Active loans management
- Tokenized collectibles
- Payment history

### **Tokenization Flow**
- Step-by-step process
- Real-time verification
- Progress tracking
- Status updates

### **Loan Management**
- Dynamic interest rates
- Risk assessment
- Payment scheduling
- Liquidation alerts

## 🔧 **Development**

### **Project Structure**
```
near-mint/
├── app/                    # Next.js app directory
│   ├── dashboard/         # Dashboard pages
│   ├── api/              # API routes
│   └── globals.css       # Global styles
├── components/           # React components
│   ├── ui/              # UI components
│   └── forms/           # Form components
├── hooks/               # Custom React hooks
├── contexts/            # React contexts
├── lib/                 # Utility functions
├── public/             # Static assets
└── Documentation/      # Project documentation
```

### **Key Components**
- `LoanCalculator` - Dynamic loan calculations
- `VESULendingProcess` - Loan application flow
- `UserNFTs` - NFT management
- `WalletConnect` - Wallet integration

### **Available Scripts**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

## 📚 **Documentation**

Detailed documentation is available in the `Documentation/` folder:

- **[NFT Tokenization Plan](Documentation/NFT_TOKENIZATION_PLAN.md)** - Complete tokenization strategy
- **[Wallet Integration](Documentation/WALLET_INTEGRATION.md)** - Wallet setup and management
- **[ChipiPay Integration](Documentation/CHIPI_SDK_UPDATE.md)** - Payment system integration
- **[Onboarding Flow](Documentation/ONBOARDING_FLOW.md)** - User onboarding process
- **[Troubleshooting](Documentation/TROUBLESHOOTING_ONBOARDING.md)** - Common issues and solutions

## 🌍 **Deployment**

### **Vercel (Recommended)**
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### **Manual Deployment**
```bash
npm run build
npm run start
```

## 🤝 **Contributing**

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### **Development Workflow**
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 **Support**

- **Documentation**: Check the `Documentation/` folder
- **Issues**: [GitHub Issues](https://github.com/your-username/near-mint/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/near-mint/discussions)

## 🎯 **Roadmap**

### **Phase 1: MVP** ✅
- [x] User authentication
- [x] Collectible tokenization
- [x] Loan system
- [x] Payment integration

### **Phase 2: Enhancement** 🚧
- [ ] Mobile app
- [ ] Advanced analytics
- [ ] Multi-chain support
- [ ] Insurance integration

### **Phase 3: Scale** 📋
- [ ] Global expansion
- [ ] Enterprise features
- [ ] API marketplace
- [ ] DeFi integrations

## 📊 **Statistics**

- **Total Market**: $522B collectibles market
- **Regional Focus**: LATAM expansion
- **Technology**: Web3 with traditional UX
- **Security**: Bank-grade custody

---

<div align="center">

**Built with ❤️ for the collectibles community**

[🌐 Website](https://nearmint.com) • [📱 Twitter](https://twitter.com/nearmint) • [💼 LinkedIn](https://linkedin.com/company/nearmint)

</div>
