import React from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Cookie, Settings, Shield, Eye, Clock, Database, Mail } from "lucide-react"
import { SEOHead } from "@/components/seo-head"

const Cookies = () => {
  return (
    <>
      <SEOHead 
        title="Cookie Policy - ChainScope"
        description="Learn about how ChainScope uses cookies and similar technologies to enhance your experience on our blockchain analytics platform. Understand your cookie preferences and control options."
        keywords="cookie policy, cookies, tracking technologies, browser cookies, ChainScope cookies, data collection, user preferences"
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
            <Cookie className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold">Cookie Policy</h1>
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
                This Cookie Policy explains how ChainScope ("we," "our," or "us") uses cookies and similar tracking technologies when you visit our blockchain analytics platform. This policy should be read alongside our Privacy Policy, which explains how we use your personal information.
              </p>
              <p>
                By using our platform, you consent to the use of cookies in accordance with this policy. You can control and manage cookies through your browser settings, as explained in this policy.
              </p>
              <p>
                <strong>What are Cookies?</strong> Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you visit a website. They help websites remember information about your visit, such as your preferred language and other settings, which can make your next visit easier and more useful.
              </p>
            </CardContent>
          </Card>

          {/* Types of Cookies */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Types of Cookies We Use
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">1. Essential Cookies</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  These cookies are necessary for the website to function properly and cannot be disabled. They do not store any personally identifiable information.
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Security cookies to protect against fraud and unauthorized access</li>
                  <li>Load balancing cookies to distribute traffic across servers</li>
                  <li>Session management cookies to maintain your session</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">2. Performance and Analytics Cookies</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  These cookies help us understand how visitors interact with our platform by collecting and reporting information anonymously.
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Google Analytics cookies to analyze website traffic and user behavior</li>
                  <li>Performance monitoring cookies to track page load times and errors</li>
                  <li>User experience analytics to improve our platform functionality</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">3. Functionality Cookies</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  These cookies enable enhanced functionality and personalization, such as remembering your preferences and settings.
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Language preference cookies</li>
                  <li>Theme and display preference cookies</li>
                  <li>Search history and filter preferences</li>
                  <li>Network comparison settings</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">4. Third-Party Cookies</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Some cookies are placed by third-party services that appear on our pages, such as social media platforms and analytics providers.
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Social media cookies (if you interact with social media features)</li>
                  <li>Advertising cookies (if we display advertisements)</li>
                  <li>External service provider cookies</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Cookie Duration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Cookie Duration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Session Cookies</h3>
                <p className="text-sm text-muted-foreground">
                  These cookies are temporary and are deleted when you close your browser. They are used to maintain your session and provide essential functionality during your visit.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Persistent Cookies</h3>
                <p className="text-sm text-muted-foreground">
                  These cookies remain on your device for a set period or until you delete them. They are used to remember your preferences and settings for future visits.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Third-Party Cookie Duration</h3>
                <p className="text-sm text-muted-foreground">
                  The duration of third-party cookies is determined by the respective third-party providers and may vary. Please refer to their privacy policies for more information.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Information Collected */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Information Collected by Cookies
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                The cookies we use may collect the following types of information:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li><strong>Technical Information:</strong> Browser type, operating system, device information, IP address</li>
                <li><strong>Usage Information:</strong> Pages visited, time spent on pages, features used, search queries</li>
                <li><strong>Preferences:</strong> Language settings, theme preferences, display options</li>
                <li><strong>Performance Data:</strong> Page load times, error rates, user interactions</li>
                <li><strong>Analytics Data:</strong> Traffic sources, user behavior patterns, platform performance</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                This information is used to improve our platform, provide personalized experiences, and ensure optimal performance.
              </p>
            </CardContent>
          </Card>

          {/* Cookie Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Managing Your Cookie Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Browser Settings</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  You can control and manage cookies through your browser settings. Most browsers allow you to:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>View and delete existing cookies</li>
                  <li>Block cookies from specific websites</li>
                  <li>Block all cookies</li>
                  <li>Set preferences for different types of cookies</li>
                  <li>Receive notifications when cookies are being set</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Browser-Specific Instructions</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</p>
                  <p><strong>Firefox:</strong> Options → Privacy & Security → Cookies and Site Data</p>
                  <p><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</p>
                  <p><strong>Edge:</strong> Settings → Cookies and site permissions → Cookies and site data</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Impact of Disabling Cookies</h3>
                <p className="text-sm text-muted-foreground">
                  Disabling certain cookies may affect the functionality of our platform. Essential cookies cannot be disabled as they are necessary for basic platform operation.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Third-Party Services */}
          <Card>
            <CardHeader>
              <CardTitle>Third-Party Services and Cookies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Our platform may use third-party services that place their own cookies. These services include:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li><strong>Google Analytics:</strong> Website analytics and performance monitoring</li>
                <li><strong>Cloudflare:</strong> Content delivery and security services</li>
                <li><strong>Social Media Platforms:</strong> If you interact with social media features</li>
                <li><strong>Advertising Networks:</strong> If we display advertisements</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                These third-party services have their own privacy policies and cookie practices. We encourage you to review their policies to understand how they use cookies and your information.
              </p>
            </CardContent>
          </Card>

          {/* Mobile Applications */}
          <Card>
            <CardHeader>
              <CardTitle>Mobile Applications and Tracking Technologies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                If you access our platform through a mobile application, similar tracking technologies may be used, including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>Mobile device identifiers</li>
                <li>App analytics and crash reporting</li>
                <li>Push notification tokens</li>
                <li>Device and usage analytics</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                You can control these tracking technologies through your device settings and app permissions.
              </p>
            </CardContent>
          </Card>

          {/* Updates to Policy */}
          <Card>
            <CardHeader>
              <CardTitle>Updates to This Cookie Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                We may update this Cookie Policy from time to time to reflect changes in our practices, technology, or legal requirements. We will notify you of any material changes by:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>Posting the updated policy on our platform</li>
                <li>Displaying a prominent notice about the changes</li>
                <li>Sending email notifications to registered users</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                Your continued use of our platform after any changes indicates your acceptance of the updated Cookie Policy.
              </p>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card>
            <CardHeader>
              <CardTitle>Your Rights Regarding Cookies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Depending on your location, you may have certain rights regarding cookies and tracking technologies:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li><strong>Right to Information:</strong> You have the right to be informed about our use of cookies</li>
                <li><strong>Right to Control:</strong> You can control cookie settings through your browser</li>
                <li><strong>Right to Object:</strong> You can object to certain types of cookies</li>
                <li><strong>Right to Withdraw Consent:</strong> You can withdraw consent for non-essential cookies</li>
                <li><strong>Right to Data Portability:</strong> You can request a copy of data collected through cookies</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                To exercise these rights, please contact us using the information provided below.
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
                If you have any questions about our use of cookies or this Cookie Policy, please contact us:
              </p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p><strong>Email:</strong> <a href="mailto:hello@chainscope.app" className="text-primary hover:underline">hello@chainscope.app</a></p>
                <p><strong>Subject Line:</strong> Cookie Policy Inquiry</p>
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

export default Cookies 