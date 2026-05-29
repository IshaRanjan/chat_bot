import { ChatWidget } from "@/components/chatbot/ChatWidget";
import { Building2, Shield, Wallet } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-dvh">
      <div className="from-primary/5 via-background to-background border-b bg-gradient-to-b">
        <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-16 sm:py-24">
          <div className="flex items-center gap-3">
            <div className="bg-primary text-primary-foreground flex size-10 items-center justify-center rounded-lg">
              <Building2 className="size-5" />
            </div>
            <span className="text-foreground text-lg font-semibold tracking-tight">
              SecureBank
            </span>
          </div>
          <div className="max-w-2xl space-y-4">
            <h1 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
              Banking made simple, support made faster
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Manage accounts, cards, and transfers with confidence. Need help?
              Use the support chat in the bottom-right corner for instant answers
              to common questions.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: Shield,
                title: "Secure by design",
                desc: "Enterprise-grade encryption on every transaction.",
              },
              {
                icon: Wallet,
                title: "Smart accounts",
                desc: "Track spending and savings in one dashboard.",
              },
              {
                icon: Building2,
                title: "24/7 FAQ support",
                desc: "Structured help flows for cards, loans, and more.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <article
                key={title}
                className="bg-card border-border rounded-xl border p-5 shadow-sm"
              >
                <Icon className="text-primary mb-3 size-5" />
                <h2 className="text-sm font-semibold">{title}</h2>
                <p className="text-muted-foreground mt-1 text-sm">{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
      <ChatWidget />
    </main>
  );
}
