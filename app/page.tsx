import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Zap, Share2, Palette, Smartphone, Globe } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <span className="font-bold text-xl">Brandcard</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/dashboard" className="text-slate-600 hover:text-slate-900">
              Dashboard
            </Link>
            <Link href="/templates/new" className="text-slate-600 hover:text-slate-900">
              Create Template
            </Link>
            <Button asChild>
              <Link href="/dashboard">Get Started</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
          Create On-Brand Images
          <span className="block text-slate-600">In Seconds</span>
        </h1>
        <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
          Generate beautiful, professional images from simple inputs. Perfect for social media, 
          marketing campaigns, and content creation.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/t/1">Try Live Demo</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/dashboard">Start Creating</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
          Everything You Need to Create Stunning Images
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <Palette className="w-8 h-8 text-blue-600 mb-2" />
              <CardTitle>Template Editor</CardTitle>
              <CardDescription>
                Create custom templates with text fields, images, and your brand colors.
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader>
              <Zap className="w-8 h-8 text-yellow-600 mb-2" />
              <CardTitle>Smart Fill</CardTitle>
              <CardDescription>
                AI-powered content generation. One sentence in, perfect copy out.
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader>
              <Share2 className="w-8 h-8 text-green-600 mb-2" />
              <CardTitle>Shareable Forms</CardTitle>
              <CardDescription>
                Create public forms that anyone can use to generate images.
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader>
              <Globe className="w-8 h-8 text-purple-600 mb-2" />
              <CardTitle>URL to Image</CardTitle>
              <CardDescription>
                Paste any URL and automatically extract content for your images.
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader>
              <Smartphone className="w-8 h-8 text-pink-600 mb-2" />
              <CardTitle>Platform Pack</CardTitle>
              <CardDescription>
                Generate all social media sizes in one click with auto-fit text.
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="w-8 h-8 bg-slate-600 rounded mb-2 flex items-center justify-center">
                <span className="text-white text-xs font-bold">S</span>
              </div>
              <CardTitle>Slack Integration</CardTitle>
              <CardDescription>
                Generate images directly from Slack with slash commands.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-slate-300 mb-8">
            Join thousands of creators making beautiful images with Brandcard.
          </p>
          <Button size="lg" asChild>
            <Link href="/dashboard">
              Start Creating Now
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-8">
        <div className="container mx-auto px-4 text-center text-slate-600">
          <p>&copy; 2024 Brandcard. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}