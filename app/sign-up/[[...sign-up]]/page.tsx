import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="fixed top-20 left-1/4 w-96 h-96 bg-success/10 rounded-full blur-3xl animate-pulse" />
      <div className="fixed bottom-20 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-2xl shadow-primary/40 hover:scale-110 transition-smooth">
              <span className="text-primary-foreground font-bold text-2xl">NM</span>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-success bg-clip-text text-transparent">
              NearMint
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">Crea tu cuenta para comenzar</p>
        </div>
        
        <SignUp 
          appearance={{
            elements: {
              rootBox: "mx-auto w-full",
              card: "glass-effect shadow-2xl border-white/10 rounded-2xl",
              headerTitle: "text-foreground text-2xl font-bold",
              headerSubtitle: "text-muted-foreground",
              socialButtonsBlockButton: "glass-effect border-white/10 hover:bg-white/10 text-foreground transition-smooth hover:scale-105 hover:border-primary/50",
              socialButtonsBlockButtonText: "text-foreground font-medium",
              dividerLine: "bg-white/10",
              dividerText: "text-muted-foreground",
              formButtonPrimary: "bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-xl shadow-primary/50 hover:shadow-2xl hover:shadow-primary/60 transition-smooth hover:scale-105 text-primary-foreground font-semibold rounded-xl",
              formFieldLabel: "text-foreground font-medium",
              formFieldInput: "glass-effect border-white/10 text-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/20 rounded-xl transition-smooth",
              footerActionLink: "text-primary hover:text-primary/80 font-semibold transition-smooth",
              identityPreviewText: "text-foreground",
              identityPreviewEditButton: "text-primary hover:text-primary/80",
              formResendCodeLink: "text-primary hover:text-primary/80",
              otpCodeFieldInput: "glass-effect border-white/10 text-foreground focus:border-primary/50",
              formFieldInputShowPasswordButton: "text-muted-foreground hover:text-foreground",
              alertText: "text-foreground",
              formFieldErrorText: "text-destructive",
              formFieldSuccessText: "text-success",
            },
            variables: {
              colorPrimary: 'hsl(20, 100%, 63%)',
              colorDanger: 'hsl(0, 84.2%, 60.2%)',
              colorSuccess: 'hsl(145, 100%, 47%)',
              colorWarning: 'hsl(20, 100%, 63%)',
              colorTextOnPrimaryBackground: 'hsl(0, 0%, 98%)',
              colorBackground: 'hsl(240, 10%, 3.9%)',
              colorInputBackground: 'rgba(255, 255, 255, 0.03)',
              colorInputText: 'hsl(0, 0%, 98%)',
              colorText: 'hsl(0, 0%, 98%)',
              colorTextSecondary: 'hsl(240, 5%, 64.9%)',
              borderRadius: '0.75rem',
            }
          }}
        />
      </div>
    </div>
  )
}

