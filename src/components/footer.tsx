import React from 'react'
import { Link } from 'react-router-dom'
import { getSemanticUrl } from "@/lib/url-mapping"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import { 
  Globe, 
  Github, 
  Twitter, 
  Mail, 
  Heart,
  Shield,
  Zap,
  Users,
  ExternalLink,
  Star,
  TrendingUp,
  Search,
  GitCompare,
  BarChart3,
  Circle,
  Hexagon,
  Square,
  Triangle,
  Diamond,
  Octagon
} from "lucide-react"
import { Logo } from "./logo"

export const Footer = () => {
  const currentYear = new Date().getFullYear()

  const popularNetworks = [
    { name: 'Ethereum', chainId: 1, icon: Circle, color: 'text-blue-500' },
    { name: 'Polygon', chainId: 137, icon: Hexagon, color: 'text-purple-500' },
    { name: 'Arbitrum', chainId: 42161, icon: Square, color: 'text-blue-600' },
    { name: 'Optimism', chainId: 10, icon: Triangle, color: 'text-red-500' },
    { name: 'BSC', chainId: 56, icon: Circle, color: 'text-yellow-500' },
    { name: 'Avalanche', chainId: 43114, icon: Triangle, color: 'text-red-600' },
    { name: 'Base', chainId: 8453, icon: Square, color: 'text-blue-400' },
    { name: 'Linea', chainId: 59144, icon: Hexagon, color: 'text-green-500' }
  ]

  const features = [
    { name: 'Network Discovery', description: 'Explore 2,000+ blockchain networks with detailed specifications', icon: Search },
    { name: 'RPC Health Monitoring', description: 'Real-time endpoint status tracking and performance analytics', icon: Shield },
    { name: 'Network Comparison', description: 'Side-by-side analysis of blockchain networks and features', icon: GitCompare },
    { name: 'Analytics Dashboard', description: 'Comprehensive network insights and ecosystem statistics', icon: BarChart3 },
    { name: 'Wallet Integration', description: 'One-click network addition to popular Web3 wallets', icon: Globe },
    { name: 'Trending Networks', description: 'Discover popular and emerging blockchain networks', icon: TrendingUp }
  ]

  const footerLinks = {
    pages: [
      { name: 'Home', href: '/' },
      { name: 'Compare Networks', href: '/compare' },
      { name: 'Network Details', href: '/chain/1' },
      { name: 'Analytics', href: '/#analytics' }
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'Disclaimer', href: '/disclaimer' }
    ]
  }

  return (
    <footer className="bg-gradient-to-b from-background via-background to-muted/10 border-t border-border/50">
      <div className="container mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-8 sm:mb-12">
          {/* Brand & Description */}
                      <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <Logo size="lg" />
            </div>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              The definitive blockchain network explorer and RPC directory for developers and users worldwide. 
              Discover, monitor, and connect to 2,000+ blockchain networks with real-time RPC health monitoring, 
              comprehensive analytics, and instant wallet integration capabilities.
            </p>
            
                         {/* Contact for Advertising */}
             <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
               <h4 className="font-semibold text-foreground mb-2">Promote Your Brand</h4>
               <p className="text-sm text-muted-foreground mb-3">
                 Reach our global community of Web3 developers, blockchain enthusiasts, and crypto users. 
               </p>
               <Button size="sm" variant="outline" asChild className="w-full">
                 <a href="mailto:hello@chainscope.app?subject=ChainScope Advertising Inquiry&body=Hello ChainScope Team,%0D%0A%0D%0AI'm interested in advertising on your platform.%0D%0A%0D%0APlease provide information about:%0D%0A- Available advertising options%0D%0A- Pricing details%0D%0A- Promotion opportunities%0D%0A- Target audience demographics%0D%0A%0D%0AThank you!">
                   <Mail className="w-4 h-4 mr-2" />
                   Advertise With Us
                 </a>
               </Button>
             </div>

                         {/* Social Links */}
             <div className="flex items-center gap-3">
               <Button variant="ghost" size="sm" asChild>
                 <a href="https://twitter.com/chainscopeHQ" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                   <Twitter className="w-4 h-4" />
                 </a>
               </Button>
               <Button variant="ghost" size="sm" asChild>
                 <a href="mailto:hello@chainscope.app" aria-label="Email">
                   <Mail className="w-4 h-4" />
                 </a>
               </Button>
             </div>
          </div>

          {/* Popular Networks */}
          <div>
            <h3 className="font-semibold text-foreground mb-6">
              Popular Networks
            </h3>
                         <div className="grid grid-cols-1 gap-3">
               {popularNetworks.map((network) => (
                 <Link 
                   key={network.chainId}
                   to={getSemanticUrl(network.chainId)}
                   className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                 >
                   <div className={`w-6 h-6 ${network.color} flex items-center justify-center`}>
                     <network.icon className="w-4 h-4" />
                   </div>
                   <div>
                     <div className="font-medium text-foreground group-hover:text-primary transition-colors">
                       {network.name}
                     </div>
                     <div className="text-xs text-muted-foreground">Chain ID: {network.chainId}</div>
                   </div>
                 </Link>
               ))}
             </div>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-semibold text-foreground mb-6">
              Features
            </h3>
            <div className="space-y-4">
              {features.map((feature) => (
                <div key={feature.name} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground text-sm">{feature.name}</div>
                    <div className="text-xs text-muted-foreground">{feature.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-6">
              Quick Links
            </h3>
            <div className="space-y-4">
              {Object.entries(footerLinks).map(([category, links]) => (
                <div key={category}>
                  <h4 className="font-medium text-foreground mb-3 capitalize">{category}</h4>
                  <ul className="space-y-2">
                    {links.map((link) => (
                      <li key={link.name}>
                        <Link 
                          to={link.href}
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border/50 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>© {currentYear} ChainScope. Made with</span>
              <Heart className="w-4 h-4 text-red-500" />
              <span>for the blockchain community.</span>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Globe className="w-4 h-4" />
                <span>2,000+ Networks</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="w-4 h-4" />
                <span>10,000+ RPCs</span>
              </div>
            </div>
          </div>

          {/* SEO Links */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
            <a href="/sitemap.xml" className="hover:text-foreground transition-colors">Sitemap</a>
            <span>•</span>
            <a href="/robots.txt" className="hover:text-foreground transition-colors">Robots.txt</a>
            <span>•</span>
            <a href="/manifest.json" className="hover:text-foreground transition-colors">Web App Manifest</a>
            <span>•</span>
            <a href="mailto:hello@chainscope.app" className="hover:text-foreground transition-colors">Contact</a>
          </div>

          {/* Additional Info */}
          <div className="mt-6 text-center text-xs text-muted-foreground">
            <p>
              ChainScope is an independent blockchain network directory and analytics platform. 
              We are not affiliated with any blockchain project or organization. 
              All data is provided as-is for informational purposes only. 
              Users should conduct their own research before making any investment or technical decisions.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
} 