import React from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Shield, Eye, Lock, Database, Globe, Mail } from "lucide-react"
import { SEOHead } from "@/components/seo-head"

const Privacy = () => {
  return (
    <>
      <SEOHead 
        title="Privacy Policy - ChainScope"
        description="Learn how ChainScope collects, uses, and protects your personal information. Our comprehensive privacy policy ensures transparency and data protection for blockchain network analytics."
        keywords="privacy policy, data protection, GDPR, blockchain privacy, ChainScope privacy, user data protection, cookie policy"
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
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold">Privacy Policy</h1>
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
                <Eye className="w-5 h-5" />
                Introduction
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                ChainScope ("we," "our," or "us") is committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our blockchain network analytics platform and related services.
              </p>
              <p>
                By accessing or using ChainScope, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our service.
              </p>
              <p>
                <strong>Service Description:</strong> ChainScope is a blockchain network explorer and analytics platform that provides real-time data about blockchain networks, RPC endpoints, and network performance metrics. Our platform serves developers, researchers, and blockchain enthusiasts worldwide.
              </p>
            </CardContent>
          </Card>

          {/* Information We Collect */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">1.1 Information You Provide</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Contact information (email address) when you reach out for support or advertising inquiries</li>
                  <li>Feedback, comments, or communications you send to us</li>
                  <li>Information you provide when reporting issues or requesting features</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">1.2 Automatically Collected Information</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li><strong>Usage Data:</strong> Information about how you interact with our platform, including pages visited, features used, and time spent on the site</li>
                  <li><strong>Technical Data:</strong> IP address, browser type and version, operating system, device information, and unique device identifiers</li>
                  <li><strong>Analytics Data:</strong> Performance metrics, error logs, and platform usage statistics</li>
                  <li><strong>Blockchain Data:</strong> Public blockchain information that we aggregate and analyze (this is publicly available data)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">1.3 Third-Party Information</h3>
                <p className="text-sm text-muted-foreground">
                  We may collect information from third-party sources, including blockchain networks, RPC providers, and public APIs. This information is used to provide accurate and up-to-date blockchain analytics.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Your Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>We use the collected information for the following purposes:</p>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li><strong>Service Provision:</strong> To provide, maintain, and improve our blockchain analytics platform</li>
                <li><strong>User Experience:</strong> To personalize your experience and provide relevant content and features</li>
                <li><strong>Communication:</strong> To respond to your inquiries, provide support, and send important service updates</li>
                <li><strong>Analytics:</strong> To analyze usage patterns, improve our platform, and develop new features</li>
                <li><strong>Security:</strong> To detect, prevent, and address technical issues and security threats</li>
                <li><strong>Compliance:</strong> To comply with legal obligations and enforce our terms of service</li>
                <li><strong>Research:</strong> To conduct research and analysis on blockchain networks and trends</li>
              </ul>
            </CardContent>
          </Card>

          {/* Information Sharing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Information Sharing and Disclosure
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>We do not sell, trade, or otherwise transfer your personal information to third parties, except in the following circumstances:</p>
              
              <div>
                <h3 className="font-semibold mb-2">2.1 Service Providers</h3>
                <p className="text-sm text-muted-foreground">
                  We may share information with trusted third-party service providers who assist us in operating our platform, conducting business, or servicing users. These providers are contractually obligated to protect your information and use it only for specified purposes.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">2.2 Legal Requirements</h3>
                <p className="text-sm text-muted-foreground">
                  We may disclose your information if required by law, regulation, legal process, or governmental request, or to protect our rights, property, or safety, or that of our users or the public.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">2.3 Business Transfers</h3>
                <p className="text-sm text-muted-foreground">
                  In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the transaction, subject to the same privacy protections.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">2.4 Aggregated Data</h3>
                <p className="text-sm text-muted-foreground">
                  We may share aggregated, anonymized, or de-identified information that does not personally identify you for research, analytics, or other purposes.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Data Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security assessments and vulnerability testing</li>
                <li>Access controls and authentication mechanisms</li>
                <li>Secure data centers and infrastructure</li>
                <li>Employee training on data protection practices</li>
                <li>Incident response and breach notification procedures</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
              </p>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card>
            <CardHeader>
              <CardTitle>Your Privacy Rights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Depending on your location, you may have the following rights regarding your personal information:</p>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li><strong>Access:</strong> Request access to your personal information</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
                <li><strong>Restriction:</strong> Request restriction of processing in certain circumstances</li>
                <li><strong>Objection:</strong> Object to processing based on legitimate interests</li>
                <li><strong>Withdrawal:</strong> Withdraw consent where processing is based on consent</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                To exercise these rights, please contact us using the information provided below. We will respond to your request within the timeframes required by applicable law.
              </p>
            </CardContent>
          </Card>

          {/* Cookies and Tracking */}
          <Card>
            <CardHeader>
              <CardTitle>Cookies and Tracking Technologies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                We use cookies and similar tracking technologies to enhance your experience on our platform. These technologies help us:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>Remember your preferences and settings</li>
                <li>Analyze platform usage and performance</li>
                <li>Provide personalized content and features</li>
                <li>Improve our services and user experience</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                You can control cookie settings through your browser preferences. However, disabling certain cookies may affect the functionality of our platform.
              </p>
            </CardContent>
          </Card>

          {/* International Transfers */}
          <Card>
            <CardHeader>
              <CardTitle>International Data Transfers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Your information may be transferred to and processed in countries other than your own. We ensure that such transfers comply with applicable data protection laws and implement appropriate safeguards to protect your information.
              </p>
              <p className="text-sm text-muted-foreground">
                For users in the European Economic Area (EEA), we ensure that international transfers are made under appropriate safeguards, such as Standard Contractual Clauses approved by the European Commission.
              </p>
            </CardContent>
          </Card>

          {/* Children's Privacy */}
          <Card>
            <CardHeader>
              <CardTitle>Children's Privacy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Our platform is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
              </p>
            </CardContent>
          </Card>

          {/* Changes to Privacy Policy */}
          <Card>
            <CardHeader>
              <CardTitle>Changes to This Privacy Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will notify you of any material changes by:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>Posting the updated policy on our platform</li>
                <li>Sending an email notification to registered users</li>
                <li>Displaying a prominent notice on our platform</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                Your continued use of our platform after any changes indicates your acceptance of the updated Privacy Policy.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Contact Us
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p><strong>Email:</strong> <a href="mailto:hello@chainscope.app" className="text-primary hover:underline">hello@chainscope.app</a></p>
                <p><strong>Subject Line:</strong> Privacy Policy Inquiry</p>
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

export default Privacy 