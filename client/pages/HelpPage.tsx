import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Search,
  HelpCircle,
  Book,
  MessageCircle,
  Mail,
  Phone,
  ExternalLink,
  FileText,
  Video,
  Users,
  Clock,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const popularArticles = [
    {
      title: "Getting Started with CryptoTax Pro",
      description:
        "Learn the basics of setting up your account and importing transactions",
      category: "Getting Started",
      readTime: "5 min read",
      views: "2.1k views",
    },
    {
      title: "Importing Transactions from Exchanges",
      description:
        "Step-by-step guide to connect and sync your exchange accounts",
      category: "Transactions",
      readTime: "8 min read",
      views: "1.8k views",
    },
    {
      title: "Understanding Tax Forms (8949 & Schedule D)",
      description:
        "Complete guide to crypto tax forms and reporting requirements",
      category: "Tax Forms",
      readTime: "12 min read",
      views: "3.2k views",
    },
    {
      title: "DeFi and Staking Tax Implications",
      description:
        "How to handle DeFi protocols, yield farming, and staking rewards",
      category: "Advanced",
      readTime: "10 min read",
      views: "1.5k views",
    },
  ];

  const faqItems = [
    {
      question: "How do I import transactions from my exchange?",
      answer:
        "You can import transactions in several ways: 1) Connect your exchange via API (recommended), 2) Upload CSV files manually, or 3) Use our auto-sync feature for supported exchanges. Go to Wallets > Add Exchange to get started.",
    },
    {
      question: "What exchanges are supported?",
      answer:
        "We support 300+ exchanges including Coinbase, Binance, Kraken, KuCoin, FTX, and many more. You can find the complete list in our supported exchanges page under Wallet Ingestion.",
    },
    {
      question: "How accurate are the tax calculations?",
      answer:
        "Our tax calculations follow IRS guidelines and use industry-standard accounting methods (FIFO, LIFO, HIFO). All calculations are auditable and include detailed transaction histories for your records.",
    },
    {
      question: "Can I edit or correct transactions?",
      answer:
        "Yes, you can edit transaction details, add missing transactions, or mark transactions as duplicates. All edits are tracked for audit purposes and won't affect your original import data.",
    },
    {
      question: "What if I'm missing transaction data?",
      answer:
        "If you're missing transactions, you can manually add them, upload additional CSV files, or use our transaction reconstruction tools to help identify gaps in your trading history.",
    },
    {
      question: "How do I handle DeFi transactions?",
      answer:
        "DeFi transactions can be complex. Our platform automatically categorizes common DeFi activities like liquidity provision, yield farming, and token swaps. For complex protocols, you may need to manually categorize some transactions.",
    },
  ];

  return (
    <DashboardLayout activeItem="Help Page">
      <div className="app-content bg-muted">
        {/* Page Header */}
        <div className="page-titlebar">
          <div className="flex flex-col p-6 text-left">
            <h1 className="text-heading-lg font-bold text-foreground">
              Help Center
            </h1>
            <p className="text-body-md text-muted-foreground mt-1">
              Find answers, guides, and get support when you need it
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4 sm:p-6 space-y-6 no-h-scroll">
          {/* Search Bar */}
          <Card>
            <CardContent className="p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  placeholder="Search for help articles, guides, or common questions..."
                  className="pl-10 pr-4 py-3 text-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Quick Help Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Book className="h-8 w-8 text-info mx-auto mb-3" />
                <h2 className="font-semibold text-foreground mb-2">
                  User Guides
                </h2>
                <p className="text-sm text-muted-foreground">
                  Step-by-step tutorials
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Video className="h-8 w-8 text-success mx-auto mb-3" />
                <h2 className="font-semibold text-foreground mb-2">
                  Video Tutorials
                </h2>
                <p className="text-sm text-muted-foreground">Watch and learn</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <HelpCircle className="h-8 w-8 text-category-purple mx-auto mb-3" />
                <h2 className="font-semibold text-foreground mb-2">FAQ</h2>
                <p className="text-sm text-muted-foreground">
                  Common questions
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <MessageCircle className="h-8 w-8 text-warning mx-auto mb-3" />
                <h2 className="font-semibold text-foreground mb-2">
                  Contact Support
                </h2>
                <p className="text-sm text-muted-foreground">
                  Get personalized help
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Popular Articles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Popular Articles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {popularArticles.map((article, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted transition-colors cursor-pointer"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-foreground">
                        {article.title}
                      </h4>
                      <Badge variant="secondary" className="text-xs">
                        {article.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {article.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {article.readTime}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {article.views}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}

              <div className="text-center pt-4">
                <Button variant="outline">
                  View All Articles
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* FAQ Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Contact Support */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Live Chat Support
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Get instant help from our support team during business hours.
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>Average response time: 2 minutes</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Available: Mon-Fri, 9 AM - 6 PM EST</span>
                </div>
                <Button className="w-full">
                  Start Live Chat
                  <MessageCircle className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Support
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Send us a detailed message and we'll get back to you within 24
                  hours.
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>Average response time: 4 hours</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>support@cryptotaxpro.com</span>
                </div>
                <Button variant="outline" className="w-full">
                  Send Email
                  <Mail className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Additional Resources */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted transition-colors cursor-pointer">
                  <Video className="h-5 w-5 text-info" />
                  <div>
                    <p className="font-medium text-sm">Video Library</p>
                    <p className="text-xs text-muted-foreground">
                      Watch tutorials
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted transition-colors cursor-pointer">
                  <Book className="h-5 w-5 text-success" />
                  <div>
                    <p className="font-medium text-sm">Knowledge Base</p>
                    <p className="text-xs text-muted-foreground">
                      Browse articles
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted transition-colors cursor-pointer">
                  <Users className="h-5 w-5 text-category-purple" />
                  <div>
                    <p className="font-medium text-sm">Community Forum</p>
                    <p className="text-xs text-muted-foreground">
                      Ask the community
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
