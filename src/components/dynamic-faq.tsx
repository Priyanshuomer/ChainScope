import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react"
import { MergedChainData } from "@/types/chain"

interface FAQItem {
  question: string
  answer: string
}

interface DynamicFAQProps {
  chain: MergedChainData
  className?: string
}

export const DynamicFAQ = ({ chain, className = "" }: DynamicFAQProps) => {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set())

  // Generate dynamic FAQ based on chain data
  const generateFAQ = (chain: MergedChainData): FAQItem[] => {
    const faq: FAQItem[] = []

    // Essential Network Information
    faq.push({
      question: `What is ${chain.name} and how does it work?`,
      answer: `${chain.name} is a ${chain.isTestnet ? 'testnet' : 'mainnet'} blockchain network with Chain ID ${chain.chainId}. It operates as a decentralized ledger that records transactions using ${chain.nativeCurrency.symbol} as its native cryptocurrency. The network ${chain.verified ? 'has been verified' : 'is currently unverified'} by the community, ensuring ${chain.verified ? 'reliability and accuracy' : 'you should verify information independently'}.`
    })

    // RPC and Connectivity
    if (chain.rpc && chain.rpc.length > 0) {
      const onlineRpcs = chain.rpcEndpoints?.filter(rpc => rpc.status === 'online').length || 0
      const totalRpcs = chain.rpc.length
      
      faq.push({
        question: `How do I connect to ${chain.name}?`,
        answer: `${chain.name} has ${totalRpcs} RPC endpoints with ${onlineRpcs} currently online. RPC (Remote Procedure Call) endpoints are connection points that allow your wallet or application to communicate with the blockchain. Use any online endpoint to connect - the more endpoints available, the better the network's reliability.`
      })

      faq.push({
        question: `How do I add ${chain.name} to my wallet safely?`,
        answer: `To add ${chain.name} to your wallet: 1) Use the "Add to Wallet" button on this page for automatic setup, or 2) Manually add: Network Name: "${chain.name}", Chain ID: ${chain.chainId}, Currency Symbol: ${chain.nativeCurrency.symbol}, and an RPC URL from the list above. Always double-check the Chain ID to avoid scams.`
      })
    }

    // Network Type and Security
    if (chain.isTestnet) {
      faq.push({
        question: `What is a testnet and why use ${chain.name}?`,
        answer: `${chain.name} is a testnet - a testing environment for blockchain applications. Testnets allow developers and users to experiment with new features, test smart contracts, and learn about blockchain technology without using real funds. Test tokens have no real value and are provided through faucets.`
      })
    } else {
      faq.push({
        question: `Is ${chain.name} safe for real transactions?`,
        answer: `${chain.name} is a mainnet network where real transactions occur and real value is transferred. ${chain.verified ? 'The network has been verified by the community, indicating higher reliability.' : 'The network is unverified, so conduct additional research before use.'} Always verify transaction details and start with small amounts when trying new networks.`
      })
    }

    // Layer 2 and Scaling Information
    if (chain.parent) {
      faq.push({
        question: `What is ${chain.name}'s relationship to ${chain.parent.chain}?`,
        answer: `${chain.name} is a ${chain.parent.type} built on ${chain.parent.chain}. This means it processes transactions off the main ${chain.parent.chain} network while inheriting its security. Layer 2 solutions provide faster transactions and lower fees while maintaining the security of the parent chain.`
      })
    }

    // Network Features and Capabilities
    if (chain.features && chain.features.length > 0) {
      const featureNames = chain.features.map(f => f.name).join(', ')
      faq.push({
        question: `What can I do on ${chain.name}?`,
        answer: `${chain.name} supports: ${featureNames}. These features determine the network's capabilities - from basic token transfers to advanced smart contract interactions. The more features supported, the more versatile the network is for different types of applications.`
      })
    }

    // Cross-Chain Functionality
    if (chain.bridges && chain.bridges.length > 0) {
      const bridgeTypes = chain.bridges.map(b => b.type).filter((v, i, a) => a.indexOf(v) === i)
      faq.push({
        question: `How do I transfer assets to ${chain.name} from other networks?`,
        answer: `${chain.name} supports ${chain.bridges.length} bridge${chain.bridges.length > 1 ? 's' : ''} (${bridgeTypes.join(', ')}). Bridges allow you to transfer tokens between different blockchain networks. Always research bridge security, check for official documentation, and start with small amounts when using bridges.`
      })
    }

    // Gas and Transaction Costs
    faq.push({
      question: `What are gas fees and how do they work on ${chain.name}?`,
      answer: `Gas fees on ${chain.name} are transaction costs paid in ${chain.nativeCurrency.symbol}. These fees compensate network validators for processing your transactions. Gas fees vary based on network congestion and transaction complexity. Higher congestion means higher fees. You can check current gas prices through blockchain explorers.`
    })

    // Getting Started Guide
    faq.push({
      question: `What's the best way to get started with ${chain.name}?`,
      answer: `To get started with ${chain.name}: 1) Add the network to your wallet using the "Add to Wallet" button, 2) ${chain.isTestnet ? 'Get test tokens from the faucet' : `Get some ${chain.nativeCurrency.symbol} for gas fees`}, 3) Explore dApps and start with small transactions, 4) Use blockchain explorers to verify transactions. Always start small and learn the network's behavior.`
    })

    // Security Best Practices
    faq.push({
      question: `What security measures should I take when using ${chain.name}?`,
      answer: `Security best practices for ${chain.name}: 1) Always verify the Chain ID (${chain.chainId}) before adding to wallet, 2) Use official RPC endpoints, 3) Start with small amounts, 4) Keep your private keys secure, 5) Use hardware wallets for large amounts, 6) Verify smart contract addresses before interacting, 7) Be cautious of phishing attempts.`
    })

    // Network Status and Monitoring
    if (chain.status) {
      faq.push({
        question: `How can I monitor ${chain.name}'s network status?`,
        answer: `The current status of ${chain.name} is "${chain.status}". You can monitor network health through: 1) RPC endpoint status (${chain.rpcEndpoints?.filter(rpc => rpc.status === 'online').length || 0} online), 2) Blockchain explorers, 3) Network status pages, 4) Community forums. Active status indicates normal operation.`
      })
    }

    // Advanced Usage
    faq.push({
      question: `What are some advanced use cases for ${chain.name}?`,
      answer: `Advanced use cases for ${chain.name} include: 1) DeFi protocols (lending, borrowing, trading), 2) NFT marketplaces, 3) Gaming applications, 4) DAO governance, 5) Cross-chain applications, 6) Smart contract development. The network's features determine which applications are supported.`
    })

    return faq
  }

  const faqItems = generateFAQ(chain)

  const toggleItem = (index: number) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedItems(newExpanded)
  }

  if (faqItems.length === 0) {
    return null
  }

  return (
    <Card className="bg-gradient-card border-border/50">
      <CardHeader>
        <CardTitle>
          Frequently Asked Questions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {faqItems.map((item, index) => (
            <div key={index} className="border border-border/50 rounded-lg overflow-hidden hover:border-border transition-colors">
              <Button
                variant="ghost"
                className="w-full justify-between p-4 h-auto text-left font-medium hover:bg-muted/30 transition-colors"
                onClick={() => toggleItem(index)}
              >
                <span className="flex-1 pr-4 leading-relaxed">{item.question}</span>
                {expandedItems.has(index) ? (
                  <ChevronUp className="w-4 h-4 ml-2 flex-shrink-0 text-primary" />
                ) : (
                  <ChevronDown className="w-4 h-4 ml-2 flex-shrink-0 text-muted-foreground" />
                )}
              </Button>
              {expandedItems.has(index) && (
                <div className="px-4 pb-4 text-muted-foreground leading-relaxed">
                  <div className="prose prose-sm max-w-none">
                    {item.answer}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 