"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Zap, Globe, Lock, TrendingUp, Wallet, CheckCircle2 } from "lucide-react"
import { WalletConnectDialog } from "@/components/wallet-connect-dialog"
import { useWallet } from "@/contexts/wallet-context"

export default function Home() {
  const router = useRouter()
  const { isSignedIn } = useUser()
  const [showWalletDialog, setShowWalletDialog] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)
  const { connect } = useWallet()

  const handleStartNow = () => {
    console.log('Botón clickeado, isSignedIn:', isSignedIn)
    setIsNavigating(true)
    
    // Si el usuario ya está autenticado, ir directo al dashboard
    if (isSignedIn) {
      console.log('Usuario autenticado, navegando al dashboard')
      router.push('/dashboard')
    } else {
      // Si no está autenticado, redirigir a sign-in
      console.log('Usuario no autenticado, navegando a sign-in')
      router.push('/sign-in')
    }
  }

  const handleConnect = () => {
    setShowWalletDialog(false)
    connect()
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <WalletConnectDialog open={showWalletDialog} onOpenChange={setShowWalletDialog} onConnect={handleConnect} />

      <div className="fixed top-20 right-1/4 w-1 h-1 bg-accent rounded-full animate-pulse" />
      <div className="fixed top-40 right-1/3 w-1.5 h-1.5 bg-primary rounded-full animate-pulse delay-100" />
      <div className="fixed top-60 left-1/4 w-1 h-1 bg-success rounded-full animate-pulse delay-200" />
      <div className="fixed bottom-40 right-1/4 w-1 h-1 bg-accent rounded-full animate-pulse delay-300" />

      {/* Header */}
      <header className="border-b border-border/50 bg-background/95 backdrop-blur-md sticky top-0 z-50 transition-smooth">
        <div className="container mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-smooth hover:scale-105">
              <Image
                src="/images/logo-nearmint.png"
                alt="NearMint Logo"
                width={44}
                height={44}
                className="object-contain"
              />
            </div>
            <span className="text-foreground font-bold text-2xl">NearMint</span>
          </div>
          <nav className="hidden md:flex items-center gap-10">
            <a
              href="#features"
              className="text-muted-foreground hover:text-foreground text-base font-medium transition-smooth"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-muted-foreground hover:text-foreground text-base font-medium transition-smooth"
            >
              How It Works
            </a>
            <a
              href="#about"
              className="text-muted-foreground hover:text-foreground text-base font-medium transition-smooth"
            >
              About
            </a>
            <Button
              onClick={handleStartNow}
              disabled={isNavigating}
              className="bg-primary hover:bg-primary/80 text-primary-foreground rounded-full px-10 py-6 text-base shadow-xl shadow-primary/50 font-semibold hover:shadow-2xl hover:shadow-primary/60 transition-smooth hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isNavigating ? 'Cargando...' : 'Start Now'}
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-success rounded-full animate-pulse" />

        <div className="container mx-auto px-6 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 glass-effect text-primary px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm hover:bg-primary/10 transition-smooth">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                Transforming a $522B Market
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight text-balance">
                The First <span className="text-primary">Web3</span> Pawn Shop
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed text-pretty max-w-xl">
                Turn your physical collectibles into liquid financial assets. No complications, no need to understand
                blockchain.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleStartNow}
                  disabled={isNavigating}
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-10 text-lg font-semibold shadow-2xl shadow-primary/60 group hover:shadow-[0_0_60px_rgba(255,107,53,0.8)] transition-smooth hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isNavigating ? 'Cargando...' : 'Tokenize Now'}
                  {!isNavigating && <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-8 text-base border-2 border-border hover:bg-card bg-transparent hover:border-primary/50 transition-smooth hover:scale-105"
                >
                  Watch Demo
                </Button>
              </div>
              <div className="flex items-center gap-8 pt-4">
                <div className="group cursor-pointer">
                  <div className="text-3xl font-bold text-primary group-hover:scale-110 transition-smooth">$522B</div>
                  <div className="text-sm text-muted-foreground">Total Market</div>
                </div>
                <div className="w-px h-12 bg-border" />
                <div className="group cursor-pointer">
                  <div className="text-3xl font-bold text-accent group-hover:scale-110 transition-smooth">LATAM</div>
                  <div className="text-sm text-muted-foreground">Regional Focus</div>
                </div>
                <div className="w-px h-12 bg-border" />
                <div className="group cursor-pointer">
                  <div className="text-3xl font-bold text-success group-hover:scale-110 transition-smooth">Web3</div>
                  <div className="text-sm text-muted-foreground">Technology</div>
                </div>
              </div>
            </div>

            <div className="relative h-[500px]">
              {/* Top left card */}
              <div className="absolute -top-4 -left-4 w-64 h-80 group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl blur-xl group-hover:blur-lg transition-smooth" />
                <div className="relative glass-effect rounded-2xl p-2 shadow-xl border border-border/50 hover:border-primary/50 transition-smooth hover:scale-105 hover:-rotate-3 h-full">
                  <Image
                    src="/images/card-1.png"
                    alt="Baseball card"
                    width={234}
                    height={312}
                    className="rounded-xl w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Top right card */}
              <div className="absolute top-0 -right-4 w-56 h-80 group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-success/20 rounded-2xl blur-xl group-hover:blur-lg transition-smooth" />
                <div className="relative glass-effect rounded-2xl p-2 shadow-xl border border-border/50 hover:border-accent/50 transition-smooth hover:scale-105 hover:rotate-3 h-full">
                  <Image
                    src="/images/card-2.png"
                    alt="Pokemon card"
                    width={213}
                    height={291}
                    className="rounded-xl w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Center card - larger */}
              <div className="absolute top-24 left-1/2 -translate-x-1/2 w-72 h-72 group cursor-pointer z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 rounded-2xl blur-2xl group-hover:blur-xl transition-smooth" />
                <div className="relative glass-effect rounded-2xl p-2 shadow-2xl border border-border/50 hover:border-primary/50 transition-smooth hover:scale-110 h-full">
                  <Image
                    src="/images/card-3.jpg"
                    alt="Sports card"
                    width={288}
                    height={288}
                    className="rounded-xl w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Bottom left card */}
              <div className="absolute bottom-4 left-16 w-52 h-72 group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-success/20 to-primary/20 rounded-2xl blur-xl group-hover:blur-lg transition-smooth" />
                <div className="relative glass-effect rounded-2xl p-2 shadow-xl border border-border/50 hover:border-success/50 transition-smooth hover:scale-105 hover:rotate-6 h-full">
                  <Image
                    src="/images/card-4.png"
                    alt="Trading card"
                    width={192}
                    height={270}
                    className="rounded-xl w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Bottom right card */}
              <div className="absolute bottom-4 right-12 w-56 h-80 group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/20 rounded-2xl blur-xl group-hover:blur-lg transition-smooth" />
                <div className="relative glass-effect rounded-2xl p-2 shadow-xl border border-border/50 hover:border-accent/50 transition-smooth hover:scale-105 hover:-rotate-6 h-full">
                  <Image
                    src="/images/card-5.png"
                    alt="Collectible card"
                    width={213}
                    height={291}
                    className="rounded-xl w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground text-balance">
              Liquidity for Your <span className="text-primary">Collectibles</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Convert illiquid assets into financial opportunities without losing physical ownership
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="glass-effect rounded-2xl p-8 shadow-sm hover:shadow-2xl hover:shadow-primary/20 transition-smooth group hover:border-primary/50 hover:-translate-y-1">
              <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-smooth shadow-lg shadow-primary/20">
                <Zap className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Fast Tokenization</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                Convert your collectibles into digital tokens in minutes. Simple and secure process.
              </p>
              <Button
                variant="ghost"
                className="text-primary hover:text-primary/80 p-0 h-auto font-semibold group/btn transition-smooth"
              >
                Learn more
                <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </div>

            {/* Feature 2 */}
            <div className="glass-effect rounded-2xl p-8 shadow-sm hover:shadow-2xl hover:shadow-accent/20 transition-smooth group hover:border-accent/50 hover:-translate-y-1">
              <div className="w-14 h-14 bg-accent/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-smooth shadow-lg shadow-accent/20">
                <Shield className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Secure Custody</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                Your physical collectibles remain safe while you access instant liquidity.
              </p>
              <Button
                variant="ghost"
                className="text-primary hover:text-primary/80 p-0 h-auto font-semibold group/btn transition-smooth"
              >
                Learn more
                <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </div>

            {/* Feature 3 */}
            <div className="glass-effect rounded-2xl p-8 shadow-sm hover:shadow-2xl hover:shadow-success/20 transition-smooth group hover:border-success/50 hover:-translate-y-1">
              <div className="w-14 h-14 bg-success/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-smooth shadow-lg shadow-success/20">
                <Globe className="w-7 h-7 text-success" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">ChipiPay Integrated</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                Massive onboarding in LATAM with ChipiPay integration for frictionless payments.
              </p>
              <Button
                variant="ghost"
                className="text-primary hover:text-primary/80 p-0 h-auto font-semibold group/btn transition-smooth"
              >
                Learn more
                <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </div>

            {/* Feature 4 */}
            <div className="glass-effect rounded-2xl p-8 shadow-sm hover:shadow-2xl hover:shadow-accent/20 transition-smooth group hover:border-accent/50 hover:-translate-y-1">
              <div className="w-14 h-14 bg-accent/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-smooth shadow-lg shadow-accent/20">
                <Lock className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Invisible Web3</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                No need to know about blockchain. But if you want, you can fully participate in web3.
              </p>
              <Button
                variant="ghost"
                className="text-primary hover:text-primary/80 p-0 h-auto font-semibold group/btn transition-smooth"
              >
                Learn more
                <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        <div className="container mx-auto px-6 relative">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground text-balance">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Three simple steps to convert your collectibles into liquidity
            </p>
          </div>

          {/* Step 1 */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="space-y-6">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-primary text-primary-foreground rounded-2xl font-bold text-xl shadow-xl shadow-primary/40 hover:scale-110 transition-smooth">
                1
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-foreground">Send Your Collectibles</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Send us your sports cards, memorabilia, or any valuable collectible. Our team of experts will verify the
                authenticity and condition of each piece.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 group cursor-pointer">
                  <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-primary/30 transition-smooth">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-muted-foreground group-hover:text-foreground transition-smooth">
                    Professional verification included
                  </span>
                </li>
                <li className="flex items-start gap-3 group cursor-pointer">
                  <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-primary/30 transition-smooth">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-muted-foreground group-hover:text-foreground transition-smooth">
                    Full shipping insurance
                  </span>
                </li>
                <li className="flex items-start gap-3 group cursor-pointer">
                  <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-primary/30 transition-smooth">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-muted-foreground group-hover:text-foreground transition-smooth">
                    High-security vault custody
                  </span>
                </li>
              </ul>
            </div>
            <div className="relative group max-w-[400px] mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl blur-2xl group-hover:blur-xl transition-smooth" />
              <div className="relative glass-effect rounded-3xl p-2 shadow-2xl hover:shadow-primary/20 transition-smooth">
                <Image
                  src="/images/card-1.png"
                  alt="Collectibles"
                  width={400}
                  height={300}
                  className="rounded-2xl"
                />
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="relative order-2 lg:order-1 group max-w-[400px] mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-success/10 rounded-3xl blur-2xl group-hover:blur-xl transition-smooth" />
              <div className="relative glass-effect rounded-3xl p-2 shadow-2xl hover:shadow-accent/20 transition-smooth">
                <Image
                  src="/images/landing-1.PNG"
                  alt="Digital tokenization"
                  width={400}
                  height={300}
                  className="rounded-2xl"
                />
              </div>
            </div>
            <div className="space-y-6 order-1 lg:order-2">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-accent text-accent-foreground rounded-2xl font-bold text-xl shadow-xl shadow-accent/40 hover:scale-110 transition-smooth">
                2
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-foreground">Automatic Tokenization</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Once verified, your collectibles are automatically tokenized on blockchain. You receive digital tokens
                representing the ownership and value of your physical assets.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 group cursor-pointer">
                  <div className="w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-accent/30 transition-smooth">
                    <CheckCircle2 className="w-4 h-4 text-accent" />
                  </div>
                  <span className="text-muted-foreground group-hover:text-foreground transition-smooth">
                    100% automated process
                  </span>
                </li>
                <li className="flex items-start gap-3 group cursor-pointer">
                  <div className="w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-accent/30 transition-smooth">
                    <CheckCircle2 className="w-4 h-4 text-accent" />
                  </div>
                  <span className="text-muted-foreground group-hover:text-foreground transition-smooth">
                    Digital certificate of authenticity
                  </span>
                </li>
                <li className="flex items-start gap-3 group cursor-pointer">
                  <div className="w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-accent/30 transition-smooth">
                    <CheckCircle2 className="w-4 h-4 text-accent" />
                  </div>
                  <span className="text-muted-foreground group-hover:text-foreground transition-smooth">
                    Full blockchain traceability
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Step 3 */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-success text-background rounded-2xl font-bold text-xl shadow-xl shadow-success/40 hover:scale-110 transition-smooth">
                3
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-foreground">Access Instant Liquidity</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Use your tokens as collateral for loans, sell them on the secondary market, or simply hold them while
                your physical collectibles remain safely in custody.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 group cursor-pointer">
                  <div className="w-6 h-6 bg-success/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-success/30 transition-smooth">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                  </div>
                  <span className="text-muted-foreground group-hover:text-foreground transition-smooth">
                    Competitive loan rates
                  </span>
                </li>
                <li className="flex items-start gap-3 group cursor-pointer">
                  <div className="w-6 h-6 bg-success/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-success/30 transition-smooth">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                  </div>
                  <span className="text-muted-foreground group-hover:text-foreground transition-smooth">
                    Active secondary market
                  </span>
                </li>
                <li className="flex items-start gap-3 group cursor-pointer">
                  <div className="w-6 h-6 bg-success/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-success/30 transition-smooth">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                  </div>
                  <span className="text-muted-foreground group-hover:text-foreground transition-smooth">
                    Withdraw your collectibles anytime
                  </span>
                </li>
              </ul>
            </div>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-success/10 to-primary/10 rounded-3xl blur-2xl group-hover:blur-xl transition-smooth" />
              <div className="relative glass-effect rounded-3xl p-8 shadow-2xl hover:shadow-success/20 transition-smooth">
                <div className="bg-gradient-to-br from-card/80 to-secondary/80 backdrop-blur-sm rounded-2xl p-8 space-y-6 border border-border/50">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Total Value</span>
                    <span className="text-3xl font-bold text-primary">$12,450</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 glass-effect rounded-xl hover:bg-primary/5 transition-smooth group/card cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center group-hover/card:scale-110 transition-smooth">
                          <TrendingUp className="w-5 h-5 text-primary" />
                        </div>
                        <span className="font-medium text-foreground">Available Loan</span>
                      </div>
                      <span className="font-bold text-primary text-lg">$8,715</span>
                    </div>
                    <div className="flex items-center justify-between p-4 glass-effect rounded-xl hover:bg-accent/5 transition-smooth group/card cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center group-hover/card:scale-110 transition-smooth">
                          <Wallet className="w-5 h-5 text-accent" />
                        </div>
                        <span className="font-medium text-foreground">Interest Rate</span>
                      </div>
                      <span className="font-bold text-accent text-lg">5.2%</span>
                    </div>
                  </div>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/40 hover:shadow-2xl hover:shadow-primary/60 transition-smooth hover:scale-105">
                    Request Loan
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/20 to-success/20" />
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>
        <div className="container mx-auto px-6 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-6xl font-bold text-foreground text-balance">
              Transform Your Collectibles into <span className="text-primary">Liquid Assets</span>
            </h2>
            <p className="text-xl text-muted-foreground text-pretty">
              Join the financial revolution of collectibles. No complications, no need to understand blockchain.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleStartNow}
                disabled={isNavigating}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-12 text-lg font-semibold shadow-[0_0_50px_rgba(255,107,53,0.7)] hover:shadow-[0_0_80px_rgba(255,107,53,0.9)] transition-smooth hover:scale-110 animate-glow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isNavigating ? 'Cargando...' : 'Start Now'}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 text-base border-2 border-border hover:bg-card bg-transparent hover:border-primary/50 transition-smooth hover:scale-105"
              >
                Talk to an Expert
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="glass-effect py-12 border-t border-border/50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30 hover:scale-110 transition-smooth">
                <span className="text-primary-foreground font-bold text-base">NM</span>
              </div>
              <span className="text-foreground font-bold text-xl">NearMint</span>
            </div>
            <p className="text-muted-foreground text-sm">© 2025 - 2026 NearMint Inc. All rights reserved.</p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 glass-effect rounded-lg flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-smooth hover:scale-110 hover:-translate-y-1"
              >
                <span className="sr-only">Twitter</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 glass-effect rounded-lg flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-smooth hover:scale-110 hover:-translate-y-1"
              >
                <span className="sr-only">LinkedIn</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 glass-effect rounded-lg flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-smooth hover:scale-110 hover:-translate-y-1"
              >
                <span className="sr-only">Instagram</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-4.358-.2-6.78 2.618-6.98 6.98-.058 1.281-.073 1.689-.073 4.948 0 3.259.013 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.013-3.663-.072-4.949-.196-4.354-2.617-6.78-6.979-6.98-1.281-.057-1.69-.073-4.949-.073zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.057-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-border/50">
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Product</h4>
              <div className="flex flex-col gap-3">
                <a href="#" className="text-muted-foreground hover:text-primary text-sm transition-smooth">
                  Features
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary text-sm transition-smooth">
                  Pricing
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary text-sm transition-smooth">
                  Security
                </a>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Company</h4>
              <div className="flex flex-col gap-3">
                <a href="#" className="text-muted-foreground hover:text-primary text-sm transition-smooth">
                  About
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary text-sm transition-smooth">
                  Blog
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary text-sm transition-smooth">
                  Careers
                </a>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Resources</h4>
              <div className="flex flex-col gap-3">
                <a href="#" className="text-muted-foreground hover:text-primary text-sm transition-smooth">
                  Documentation
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary text-sm transition-smooth">
                  Help
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary text-sm transition-smooth">
                  Community
                </a>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Legal</h4>
              <div className="flex flex-col gap-3">
                <a href="#" className="text-muted-foreground hover:text-primary text-sm transition-smooth">
                  Privacy
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary text-sm transition-smooth">
                  Terms
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary text-sm transition-smooth">
                  Cookies
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
