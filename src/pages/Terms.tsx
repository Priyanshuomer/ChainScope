import React from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileText, Shield, AlertTriangle, Scale, Users, Globe, Mail } from "lucide-react"
import { SEOHead } from "@/components/seo-head"

const Terms = () => {
  return (
    <>
      <SEOHead 
        title="Terms of Service - ChainScope"
        description="Read ChainScope's Terms of Service to understand your rights and obligations when using our blockchain network analytics platform. Comprehensive legal terms for users and service providers."
        keywords="terms of service, user agreement, legal terms, blockchain platform terms, ChainScope terms, service agreement"
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
            <FileText className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold">Terms of Service</h1>
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
                <Globe className="w-5 h-5" />
                Introduction
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Welcome to ChainScope. These Terms of Service ("Terms") govern your access to and use of ChainScope's blockchain network analytics platform, website, and related services (collectively, the "Service").
              </p>
              <p>
                By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of these terms, then you may not access the Service.
              </p>
              <p>
                <strong>Service Description:</strong> ChainScope provides real-time blockchain network analytics, RPC endpoint monitoring, network comparison tools, and related blockchain infrastructure services. Our platform aggregates and analyzes publicly available blockchain data to provide insights and tools for developers, researchers, and blockchain enthusiasts.
              </p>
            </CardContent>
          </Card>

          {/* Acceptance of Terms */}
          <Card>
            <CardHeader>
              <CardTitle>Acceptance of Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                By accessing or using ChainScope, you confirm that you accept these Terms and agree to comply with them. If you are using our Service on behalf of a company or other legal entity, you represent that you have the authority to bind such entity to these Terms.
              </p>
              <p className="text-sm text-muted-foreground">
                These Terms constitute a legally binding agreement between you and ChainScope regarding your use of the Service.
              </p>
            </CardContent>
          </Card>

          {/* Eligibility */}
          <Card>
            <CardHeader>
              <CardTitle>Eligibility and Age Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                To use our Service, you must:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>Be at least 18 years old or have reached the age of majority in your jurisdiction</li>
                <li>Have the legal capacity to enter into binding agreements</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Not be prohibited from using the Service under applicable law</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                If you are under 18, you may only use our Service with the involvement and consent of a parent or guardian.
              </p>
            </CardContent>
          </Card>

          {/* Service Description */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Service Description and Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>ChainScope provides the following services and features:</p>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li><strong>Blockchain Network Analytics:</strong> Real-time data and insights about blockchain networks</li>
                <li><strong>RPC Endpoint Monitoring:</strong> Health checks and performance metrics for RPC endpoints</li>
                <li><strong>Network Comparison Tools:</strong> Side-by-side comparison of blockchain networks</li>
                <li><strong>Wallet Integration:</strong> Tools to add blockchain networks to Web3 wallets</li>
                <li><strong>API Access:</strong> Programmatic access to blockchain data and analytics</li>
                <li><strong>Educational Content:</strong> Information and resources about blockchain technology</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                We reserve the right to modify, suspend, or discontinue any part of our Service at any time with reasonable notice.
              </p>
            </CardContent>
          </Card>

          {/* User Accounts */}
          <Card>
            <CardHeader>
              <CardTitle>User Accounts and Registration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                While most of our Service is available without registration, certain features may require account creation. When creating an account, you agree to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and update your account information as necessary</li>
                <li>Keep your account credentials secure and confidential</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                We reserve the right to refuse service, terminate accounts, or remove content at our sole discretion.
              </p>
            </CardContent>
          </Card>

          {/* Acceptable Use */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Acceptable Use Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>You agree to use our Service only for lawful purposes and in accordance with these Terms. You agree not to:</p>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>Use the Service for any illegal or unauthorized purpose</li>
                <li>Violate any applicable laws, regulations, or third-party rights</li>
                <li>Attempt to gain unauthorized access to our systems or networks</li>
                <li>Interfere with or disrupt the Service or servers</li>
                <li>Use automated systems to access the Service (except as permitted)</li>
                <li>Transmit viruses, malware, or other harmful code</li>
                <li>Engage in any activity that could damage or impair the Service</li>
                <li>Use the Service to harass, abuse, or harm others</li>
                <li>Attempt to reverse engineer or decompile our software</li>
                <li>Use the Service for commercial purposes without our written consent</li>
              </ul>
            </CardContent>
          </Card>

          {/* Intellectual Property */}
          <Card>
            <CardHeader>
              <CardTitle>Intellectual Property Rights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Our Rights</h3>
                <p className="text-sm text-muted-foreground">
                  The Service and its original content, features, and functionality are owned by ChainScope and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Your Rights</h3>
                <p className="text-sm text-muted-foreground">
                  Subject to these Terms, we grant you a limited, non-exclusive, non-transferable, and revocable license to use the Service for personal, non-commercial purposes.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Blockchain Data</h3>
                <p className="text-sm text-muted-foreground">
                  The blockchain data we display is publicly available information. We do not claim ownership of this data, but our presentation, analysis, and aggregation of this data is protected by our intellectual property rights.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Data and Privacy */}
          <Card>
            <CardHeader>
              <CardTitle>Data and Privacy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference.
              </p>
              <p className="text-sm text-muted-foreground">
                By using our Service, you consent to the collection and use of information as described in our Privacy Policy.
              </p>
            </CardContent>
          </Card>

          {/* Disclaimers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Disclaimers and Limitations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Service Availability</h3>
                <p className="text-sm text-muted-foreground">
                  We strive to provide reliable service but cannot guarantee uninterrupted or error-free operation. The Service is provided "as is" and "as available" without warranties of any kind.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Data Accuracy</h3>
                <p className="text-sm text-muted-foreground">
                  While we strive for accuracy, blockchain data may be subject to delays, errors, or inaccuracies. We do not guarantee the accuracy, completeness, or timeliness of any information on our platform.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Third-Party Content</h3>
                <p className="text-sm text-muted-foreground">
                  Our Service may contain links to third-party websites or services. We are not responsible for the content, privacy policies, or practices of any third-party sites.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Investment Disclaimer</h3>
                <p className="text-sm text-muted-foreground">
                  Information provided on our platform is for informational purposes only and should not be considered as investment advice. We do not recommend any specific investments or trading strategies.
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
                To the maximum extent permitted by law, ChainScope shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>Loss of profits, data, or business opportunities</li>
                <li>Damages resulting from use of our Service</li>
                <li>Damages resulting from reliance on information provided</li>
                <li>Damages resulting from service interruptions</li>
                <li>Damages resulting from security breaches</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                Our total liability to you for any claims arising from these Terms or your use of the Service shall not exceed the amount you paid us, if any, in the twelve months preceding the claim.
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
                You agree to defend, indemnify, and hold harmless ChainScope and its officers, directors, employees, and agents from and against any claims, damages, obligations, losses, liabilities, costs, or debt arising from:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>Your use of the Service</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any third-party rights</li>
                <li>Any content you submit or transmit through the Service</li>
              </ul>
            </CardContent>
          </Card>

          {/* Termination */}
          <Card>
            <CardHeader>
              <CardTitle>Termination</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                We may terminate or suspend your access to the Service immediately, without prior notice, for any reason, including breach of these Terms.
              </p>
              <p className="text-sm text-muted-foreground">
                Upon termination, your right to use the Service will cease immediately. All provisions of these Terms which by their nature should survive termination shall survive termination.
              </p>
            </CardContent>
          </Card>

          {/* Governing Law */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="w-5 h-5" />
                Governing Law and Dispute Resolution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                These Terms shall be governed by and construed in accordance with the laws of [Jurisdiction], without regard to its conflict of law provisions.
              </p>
              <p className="text-sm text-muted-foreground">
                Any disputes arising from these Terms or your use of the Service shall be resolved through binding arbitration in accordance with the rules of [Arbitration Organization]. The arbitration shall be conducted in [Location].
              </p>
            </CardContent>
          </Card>

          {/* Changes to Terms */}
          <Card>
            <CardHeader>
              <CardTitle>Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                We reserve the right to modify these Terms at any time. We will notify users of any material changes by:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>Posting the updated Terms on our platform</li>
                <li>Sending email notifications to registered users</li>
                <li>Displaying prominent notices on our website</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                Your continued use of the Service after any changes indicates your acceptance of the updated Terms.
              </p>
            </CardContent>
          </Card>

          {/* Severability */}
          <Card>
            <CardHeader>
              <CardTitle>Severability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                If any provision of these Terms is held to be invalid or unenforceable, such provision shall be struck and the remaining provisions shall be enforced to the fullest extent under law.
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
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p><strong>Email:</strong> <a href="mailto:hello@chainscope.app" className="text-primary hover:underline">hello@chainscope.app</a></p>
                <p><strong>Subject Line:</strong> Terms of Service Inquiry</p>
              </div>
              <p className="text-sm text-muted-foreground">
                We will respond to your inquiry within 30 days of receipt.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

export default Terms 