'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CheckCircle2, MapPin, Clock, TrendingUp, Users, Zap } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border bg-white/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="text-2xl font-bold text-primary">TranSync PH</div>
          <div className="flex items-center gap-4">
            <Link href="/map" className="text-foreground hover:text-primary transition">
              Route Finder
            </Link>
            <Link href="/login" className="text-foreground hover:text-primary transition">
              Log in
            </Link>
            <Link href="/register">
              <Button className="bg-primary hover:bg-primary/90 text-white">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Streamline Your Bus Operations
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Manage routes, schedules, and driver assignments from one powerful platform. Reduce operational costs and improve service reliability.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white w-full sm:w-auto">
                  Start Free Trial
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Watch Demo
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-6">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
          <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <Zap className="w-24 h-24 mx-auto mb-4 opacity-50" />
              <p>Dashboard Preview</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-secondary/5 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Powerful Features Built for Operators</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to run efficient, profitable bus operations.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: MapPin,
                title: 'Route Management',
                description: 'Create, edit, and optimize routes with real-time traffic data.',
              },
              {
                icon: Clock,
                title: 'Smart Scheduling',
                description: 'Automated scheduling system that minimizes idle time.',
              },
              {
                icon: Users,
                title: 'Driver Management',
                description: 'Track assignments, hours, and performance metrics.',
              },
              {
                icon: TrendingUp,
                title: 'Analytics Dashboard',
                description: 'Real-time insights into operations and profitability.',
              },
              {
                icon: MapPin,
                title: 'Public Terminal Map',
                description: 'Commuters can search routes and find terminals easily.',
              },
              {
                icon: Zap,
                title: 'Notifications',
                description: 'Real-time alerts for delays and operational issues.',
              },
            ].map((feature, i) => (
              <Card key={i} className="p-8 hover:shadow-lg transition-shadow">
                <feature.icon className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">Simple, Transparent Pricing</h2>
          <p className="text-lg text-muted-foreground">Choose the plan that fits your operation size.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              name: 'Starter',
              price: '₱4,999',
              period: '/month',
              description: 'Perfect for small operators',
              features: ['Up to 10 vehicles', 'Basic route management', '5 team members', 'Email support'],
              cta: 'Get Started',
            },
            {
              name: 'Professional',
              price: '₱12,999',
              period: '/month',
              description: 'For growing bus companies',
              features: ['Up to 50 vehicles', 'Advanced analytics', '25 team members', 'Priority support', 'API access'],
              cta: 'Get Started',
              highlighted: true,
            },
            {
              name: 'Enterprise',
              price: 'Custom',
              period: 'pricing',
              description: 'For large operations',
              features: ['Unlimited vehicles', 'Custom features', 'Dedicated support', 'SLA guarantee', 'On-premise option'],
              cta: 'Contact Sales',
            },
          ].map((plan, i) => (
            <Card
              key={i}
              className={`p-8 flex flex-col ${
                plan.highlighted ? 'ring-2 ring-primary shadow-xl' : ''
              }`}
            >
              {plan.highlighted && (
                <div className="bg-primary text-white text-sm font-semibold px-3 py-1 rounded-full w-fit mb-4">
                  Most Popular
                </div>
              )}
              <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
              <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                <span className="text-muted-foreground text-sm ml-2">{plan.period}</span>
              </div>
              <Button
                className={`mb-6 ${
                  plan.highlighted
                    ? 'bg-primary hover:bg-primary/90 text-white'
                    : 'bg-secondary hover:bg-secondary/90'
                }`}
              >
                {plan.cta}
              </Button>
              <ul className="space-y-3">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-3 text-muted-foreground">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to transform your operations?</h2>
          <p className="text-lg text-primary-foreground/80 mb-8">
            Join hundreds of bus operators who trust TranSync PH to run their business.
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-white hover:bg-white/90 text-primary">
              Start Your Free Trial Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-secondary/5 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-muted-foreground text-sm">
            <p>&copy; 2024 TranSync PH. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
