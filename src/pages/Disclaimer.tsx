import React from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, AlertTriangle, Shield, Info, Scale, Globe, Mail, FileText } from "lucide-react"
import { SEOHead } from "@/components/seo-head"

const Disclaimer = () => {
  return (
    <>
      <SEOHead 
        title="Disclaimer - ChainScope"
        description="Important legal disclaimers and limitations regarding ChainScope's blockchain analytics platform. Understand the scope, limitations, and your responsibilities when using our services."
        keywords="disclaimer, legal disclaimer, blockchain disclaimer, investment disclaimer, ChainScope disclaimer, terms and conditions"
        type="website"
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <AlertTriangle className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold">Disclaimer</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Last updated: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Introduction */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5" />
                Introduction
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                This Disclaimer ("Disclaimer") applies to your use of ChainScope's blockchain network analytics platform, website, and related services (collectively, the "Service"). By accessing or using our Service, you acknowledge and agree to the terms of this Disclaimer.
              </p>
              <p>
                <strong>Important:</strong> Please read this Disclaimer carefully before using our Service. If you do not agree with any part of this Disclaimer, you should not use our Service.
              </p>
              <p>
                <strong>Service Description:</strong> ChainScope is an independent blockchain network analytics platform that provides real-time data, insights, and tools for blockchain networks, RPC endpoints, and related infrastructure. Our platform aggregates publicly available blockchain data for informational and educational purposes.
              </p>
            </CardContent>
          </Card>

          {/* General Disclaimer */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                General Disclaimer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                The information provided on ChainScope is for general informational and educational purposes only. We make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the information, products, services, or related graphics contained on our platform.
              </p>
              <p className="text-sm text-muted-foreground">
                Any reliance you place on such information is strictly at your own risk. In no event will we be liable for any loss or damage including without limitation, indirect or consequential loss or damage, arising from loss of data or profits arising out of, or in connection with, the use of our Service.
              </p>
            </CardContent>
          </Card>

          {/* Investment Disclaimer */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="w-5 h-5" />
                Investment and Financial Disclaimer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="font-semibold text-yellow-800 mb-2">⚠️ Important Investment Warning</p>
                <p className="text-sm text-yellow-700">
                  The information provided on ChainScope is NOT financial advice, investment advice, or trading advice. We do not recommend any specific investments, trading strategies, or financial decisions.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">No Investment Advice</h3>
                <p className="text-sm text-muted-foreground">
                  ChainScope does not provide investment, financial, legal, or tax advice. The information on our platform is for informational purposes only and should not be construed as:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground mt-2">
                  <li>Recommendations to buy, sell, or hold any cryptocurrency or digital asset</li>
                  <li>Advice on investment strategies or portfolio management</li>
                  <li>Financial planning or retirement advice</li>
                  <li>Legal or tax advice</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Market Risks</h3>
                <p className="text-sm text-muted-foreground">
                  Cryptocurrency and blockchain investments involve substantial risk, including but not limited to:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground mt-2">
                  <li>High volatility and potential for significant losses</li>
                  <li>Regulatory changes and legal uncertainties</li>
                  <li>Technical risks and security vulnerabilities</li>
                  <li>Market manipulation and fraud risks</li>
                  <li>Liquidity risks and trading limitations</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Professional Consultation</h3>
                <p className="text-sm text-muted-foreground">
                  Before making any investment decisions, we strongly recommend consulting with qualified professionals, including:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground mt-2">
                  <li>Licensed financial advisors</li>
                  <li>Investment professionals</li>
                  <li>Legal counsel</li>
                  <li>Tax professionals</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Data Accuracy Disclaimer */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Data Accuracy and Reliability Disclaimer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Data Sources</h3>
                <p className="text-sm text-muted-foreground">
                  Our platform aggregates data from multiple sources, including:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground mt-2">
                  <li>Public blockchain networks and APIs</li>
                  <li>Third-party data providers and aggregators</li>
                  <li>Community-contributed information</li>
                  <li>Public repositories and documentation</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">No Guarantee of Accuracy</h3>
                <p className="text-sm text-muted-foreground">
                  While we strive to provide accurate and up-to-date information, we cannot guarantee:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground mt-2">
                  <li>The accuracy, completeness, or timeliness of any data</li>
                  <li>The reliability of third-party data sources</li>
                  <li>The absence of errors, delays, or technical issues</li>
                  <li>The availability of real-time data updates</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Data Delays and Discrepancies</h3>
                <p className="text-sm text-muted-foreground">
                  Blockchain data may be subject to delays, network congestion, and synchronization issues. Information displayed on our platform may not reflect the most current state of blockchain networks or may differ from other sources.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Independent Verification</h3>
                <p className="text-sm text-muted-foreground">
                  We encourage users to independently verify any information before making decisions based on it. Always cross-reference data with official sources and multiple references.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Technical Disclaimer */}
          <Card>
            <CardHeader>
              <CardTitle>Technical and Security Disclaimer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">No Technical Support</h3>
                <p className="text-sm text-muted-foreground">
                  While we provide tools and information for blockchain networks, we do not provide technical support for:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground mt-2">
                  <li>Individual blockchain transactions</li>
                  <li>Wallet setup or management</li>
                  <li>Smart contract development or deployment</li>
                  <li>Network-specific technical issues</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Security Risks</h3>
                <p className="text-sm text-muted-foreground">
                  Blockchain technology involves inherent security risks, including:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground mt-2">
                  <li>Private key loss or theft</li>
                  <li>Smart contract vulnerabilities</li>
                  <li>Network attacks and consensus failures</li>
                  <li>Regulatory and compliance risks</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">No Liability for Technical Issues</h3>
                <p className="text-sm text-muted-foreground">
                  We are not responsible for any technical issues, losses, or damages that may occur from using blockchain networks, RPC endpoints, or related technologies. Users are responsible for their own security and technical decisions.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Third-Party Disclaimer */}
          <Card>
            <CardHeader>
              <CardTitle>Third-Party Content and Services Disclaimer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">External Links</h3>
                <p className="text-sm text-muted-foreground">
                  Our platform may contain links to third-party websites, services, or resources. We do not:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground mt-2">
                  <li>Endorse or recommend any third-party content</li>
                  <li>Guarantee the accuracy of third-party information</li>
                  <li>Control or monitor third-party websites</li>
                  <li>Accept responsibility for third-party content</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Third-Party Services</h3>
                <p className="text-sm text-muted-foreground">
                  We may integrate with or reference third-party services, including:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground mt-2">
                  <li>Blockchain networks and protocols</li>
                  <li>RPC providers and infrastructure services</li>
                  <li>Analytics and monitoring tools</li>
                  <li>Social media platforms</li>
                </ul>
                <p className="text-sm text-muted-foreground mt-2">
                  These services have their own terms, policies, and disclaimers that you should review independently.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Regulatory Disclaimer */}
          <Card>
            <CardHeader>
              <CardTitle>Regulatory and Legal Disclaimer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Regulatory Compliance</h3>
                <p className="text-sm text-muted-foreground">
                  Blockchain and cryptocurrency regulations vary by jurisdiction and are subject to change. Users are responsible for:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground mt-2">
                  <li>Understanding applicable laws in their jurisdiction</li>
                  <li>Complying with tax obligations</li>
                  <li>Following regulatory requirements</li>
                  <li>Seeking legal advice when necessary</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">No Legal Advice</h3>
                <p className="text-sm text-muted-foreground">
                  ChainScope does not provide legal advice. Information on our platform should not be construed as legal advice or recommendations regarding regulatory compliance.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Jurisdictional Issues</h3>
                <p className="text-sm text-muted-foreground">
                  Our Service may not be available in all jurisdictions. Some jurisdictions may have restrictions on blockchain technology or cryptocurrency activities. Users should verify the legality of their activities in their jurisdiction.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Limitation of Liability */}
          <Card>
            <CardHeader>
              <CardTitle>Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                To the maximum extent permitted by applicable law, ChainScope shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages, including but not limited to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>Loss of profits, revenue, or business opportunities</li>
                <li>Loss of data or information</li>
                <li>Investment losses or financial damages</li>
                <li>Technical failures or service interruptions</li>
                <li>Security breaches or data breaches</li>
                <li>Regulatory penalties or legal consequences</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                This limitation applies regardless of the form of action, whether in contract, tort, negligence, strict liability, or otherwise, even if ChainScope has been advised of the possibility of such damages.
              </p>
            </CardContent>
          </Card>

          {/* Indemnification */}
          <Card>
            <CardHeader>
              <CardTitle>Indemnification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                You agree to defend, indemnify, and hold harmless ChainScope and its officers, directors, employees, agents, and affiliates from and against any claims, damages, obligations, losses, liabilities, costs, or debt arising from:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>Your use of our Service</li>
                <li>Your violation of any applicable laws or regulations</li>
                <li>Your reliance on information provided on our platform</li>
                <li>Your investment or trading decisions</li>
                <li>Your use of third-party services or content</li>
              </ul>
            </CardContent>
          </Card>

          {/* Changes to Disclaimer */}
          <Card>
            <CardHeader>
              <CardTitle>Changes to This Disclaimer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                We reserve the right to modify this Disclaimer at any time. Changes will be effective immediately upon posting on our platform. Your continued use of our Service after any changes indicates your acceptance of the updated Disclaimer.
              </p>
              <p className="text-sm text-muted-foreground">
                We encourage you to review this Disclaimer periodically to stay informed about our policies and limitations.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                If you have any questions about this Disclaimer or our Service, please contact us:
              </p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p><strong>Email:</strong> <a href="mailto:hello@chainscope.app" className="text-primary hover:underline">hello@chainscope.app</a></p>
                <p><strong>Subject Line:</strong> Disclaimer Inquiry</p>
              </div>
              <p className="text-sm text-muted-foreground">
                We will respond to your inquiry within 30 days of receipt.
              </p>
            </CardContent>
          </Card>

          {/* Final Notice */}
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-800">
                <AlertTriangle className="w-5 h-5" />
                Final Notice
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-yellow-800">
                By using ChainScope, you acknowledge that you have read, understood, and agree to this Disclaimer. You understand that blockchain technology involves significant risks and that you are responsible for your own decisions and actions.
              </p>
              <p className="text-sm text-yellow-700">
                If you do not agree with any part of this Disclaimer, you should not use our Service.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

export default Disclaimer 