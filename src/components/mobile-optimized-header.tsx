import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { 
  Menu, 
  X, 
  GitCompare, 
  BarChart3, 
  Globe
} from "lucide-react"
import { Logo } from "./logo"
import { WalletConnectButton } from "./wallet-connect-button"  // ✅ Import WalletConnectButton

import {ConnectWalletButton} from "./connectWallet"

export const MobileOptimizedHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  const navigationItems = [
    {
      name: 'Networks',
      href: '/',
      icon: Globe,
      description: 'Explore blockchain networks'
    },
    {
      name: 'Compare',
      href: '/compare',
      icon: GitCompare,
      description: 'Compare networks side-by-side'
    },
    {
      name: 'Analytics',
      href: '/#analytics',
      icon: BarChart3,
      description: 'Network analytics and insights'
    }
  ]

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(href)
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2" onClick={closeMenu}>
            <Logo size="sm" />
            <span className="hidden sm:inline-block font-bold text-xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <Tooltip key={item.name}>
                  <TooltipTrigger asChild>
                    <Link
                      to={item.href}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive(item.href)
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{item.description}</p>
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </nav>

          {/* ✅ Desktop Actions - Replaced Contact & Settings with WalletConnectButton */}
          <div className="hidden md:flex items-center space-x-2">
            <ConnectWalletButton />
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-muted/50 rounded-lg mt-2">
              {navigationItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActive(item.href)
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                    onClick={closeMenu}
                  >
                    <Icon className="w-5 h-5" />
                    <div>
                      <div>{item.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {item.description}
                      </div>
                    </div>
                  </Link>
                )
              })}

              {/* ✅ Add WalletConnectButton in Mobile Menu too */}
              <div className="pt-4 border-t border-border">
                <ConnectWalletButton />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
