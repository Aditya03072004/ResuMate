import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText, Sparkles, Download, Users, Zap, Shield, Star, ArrowRight, CheckCircle } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-gray-800">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-gray-900">
                ResuMate
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <Button variant="ghost" asChild>
                <Link href="#features">Features</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="#pricing">Pricing</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="#testimonials">Testimonials</Link>
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" asChild>
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button className="shimmer-button bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
                <Link href="/sign-up">Get Started</Link>
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
        <div className="relative text-center">
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
          
          <div className="relative z-10">
            <Badge variant="secondary" className="mb-6 bg-primary/10 text-primary border-primary/20 animate-fade-in-down">
              <Sparkles className="h-4 w-4 mr-2" />
              Powered by AI
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-gray-900 tracking-tight mb-6 animate-fade-in-down animation-delay-200">
              Craft Your Future,
              <span className="block text-primary">One Resume at a Time.</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-10 animate-fade-in-down animation-delay-400">
              ResuMate helps you create professional, ATS-friendly resumes in minutes. Let our AI guide you to your dream job.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-down animation-delay-600">
              <Button size="lg" className="shimmer-button bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
                <Link href="/sign-up">
                  <Zap className="h-5 w-5 mr-2" />
                  Start Building for Free
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="#features">
                  Learn More <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
            </div>
            <p className="mt-6 text-sm text-gray-500 animate-fade-in-down animation-delay-800">No credit card required.</p>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-24 lg:py-32 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">A Smarter Way to Build Your Resume</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">Everything you need to create a standout resume and land your dream job.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center border-0 bg-gray-50 hover:shadow-xl transition-shadow p-6 transform hover:-translate-y-2">
              <CardHeader>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl font-bold">AI-Powered Content</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Generate professional summaries and bullet points tailored to your desired role in seconds.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center border-0 bg-gray-50 hover:shadow-xl transition-shadow p-6 transform hover:-translate-y-2">
              <CardHeader>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl font-bold">Professional Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Choose from a library of beautiful, ATS-friendly templates designed by experts.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center border-0 bg-gray-50 hover:shadow-xl transition-shadow p-6 transform hover:-translate-y-2">
              <CardHeader>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Download className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl font-bold">Easy Export</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Download your resume as a PDF, ready to impress recruiters and hiring managers.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center border-0 bg-gray-50 hover:shadow-xl transition-shadow p-6 transform hover:-translate-y-2">
              <CardHeader>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl font-bold">Privacy Focused</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Your data is your own. We are committed to protecting your privacy and information.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center border-0 bg-gray-50 hover:shadow-xl transition-shadow p-6 transform hover:-translate-y-2">
              <CardHeader>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl font-bold">Collaborate & Share</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Easily share your resume with others for feedback and collaborate in real-time.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center border-0 bg-gray-50 hover:shadow-xl transition-shadow p-6 transform hover:-translate-y-2">
              <CardHeader>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl font-bold">Instant Previews</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  See your changes in real-time with our live resume preview feature.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 sm:py-24 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">Choose Your Plan</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">Simple, transparent pricing. No hidden fees.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-2 border-gray-200 rounded-lg shadow-lg p-8 flex flex-col transform hover:-translate-y-2 transition-transform">
              <CardHeader className="p-0">
                <CardTitle className="text-2xl font-bold">Free</CardTitle>
                <CardDescription className="text-4xl font-extrabold mt-2 mb-4">$0<span className="text-lg font-medium">/mo</span></CardDescription>
              </CardHeader>
              <CardContent className="p-0 flex-grow">
                <ul className="space-y-4 text-gray-600">
                  <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2" />1 Resume</li>
                  <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2" />AI-Powered Suggestions</li>
                  <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2" />Basic Templates</li>
                  <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2" />PDF Export</li>
                </ul>
              </CardContent>
              <Button variant="outline" className="mt-8 w-full">Get Started</Button>
            </Card>
            <Card className="border-2 border-primary rounded-lg shadow-xl p-8 flex flex-col relative animate-float">
              <Badge className="absolute top-0 -translate-y-1/2 bg-primary text-primary-foreground">Most Popular</Badge>
              <CardHeader className="p-0">
                <CardTitle className="text-2xl font-bold">Pro</CardTitle>
                <CardDescription className="text-4xl font-extrabold mt-2 mb-4">$10<span className="text-lg font-medium">/mo</span></CardDescription>
              </CardHeader>
              <CardContent className="p-0 flex-grow">
                <ul className="space-y-4 text-gray-600">
                  <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2" />Unlimited Resumes</li>
                  <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2" />Advanced AI Features</li>
                  <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2" />Premium Templates</li>
                  <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2" />Remove ResuMate Branding</li>
                  <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2" />Priority Support</li>
                </ul>
              </CardContent>
              <Button className="mt-8 w-full bg-primary hover:bg-primary/90 text-primary-foreground shimmer-button">Choose Pro</Button>
            </Card>
            <Card className="border-2 border-gray-200 rounded-lg shadow-lg p-8 flex flex-col transform hover:-translate-y-2 transition-transform">
              <CardHeader className="p-0">
                <CardTitle className="text-2xl font-bold">Team</CardTitle>
                <CardDescription className="text-4xl font-extrabold mt-2 mb-4">$25<span className="text-lg font-medium">/mo</span></CardDescription>
              </CardHeader>
              <CardContent className="p-0 flex-grow">
                <ul className="space-y-4 text-gray-600">
                  <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2" />For up to 5 users</li>
                  <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2" />Team Collaboration Features</li>
                  <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2" />Centralized Billing</li>
                  <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2" />All Pro Features</li>
                </ul>
              </CardContent>
              <Button variant="outline" className="mt-8 w-full">Contact Sales</Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 sm:py-24 lg:py-32 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">Loved by Job Seekers Worldwide</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">Don't just take our word for it. Here's what our users have to say.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-gray-50 border-0 transform hover:-translate-y-2 transition-transform">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <span className="text-xl font-bold text-primary">JD</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">John Doe</p>
                    <p className="text-sm text-gray-500">Software Engineer</p>
                  </div>
                </div>
                <p className="text-gray-600">"ResuMate is a game-changer. The AI suggestions helped me craft a resume that got me noticed. I landed my dream job in weeks!"</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-50 border-0 transform hover:-translate-y-2 transition-transform">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <span className="text-xl font-bold text-primary">JS</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Jane Smith</p>
                    <p className="text-sm text-gray-500">Product Manager</p>
                  </div>
                </div>
                <p className="text-gray-600">"I used to dread updating my resume. ResuMate makes it so easy and the templates are beautiful. Highly recommended!"</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-50 border-0 transform hover:-translate-y-2 transition-transform">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <span className="text-xl font-bold text-primary">MB</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Michael Brown</p>
                    <p className="text-sm text-gray-500">UX Designer</p>
                  </div>
                </div>
                <p className="text-gray-600">"The ability to instantly preview my resume as I make changes is fantastic. It saved me so much time and effort."</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
          <div className="bg-primary rounded-2xl shadow-xl overflow-hidden">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/90 mix-blend-multiply"></div>
              <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 py-16">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  Ready to Land Your Dream Job?
                </h2>
                <p className="mt-4 text-lg text-primary-foreground/80">
                  Start building your resume with ResuMate today and take the next step in your career.
                </p>
                <Button size="lg" className="mt-8 bg-white text-primary hover:bg-gray-100 font-bold shimmer-button" asChild>
                  <Link href="/sign-up">
                    Create Your Resume Now <ArrowRight className="h-5 w-5 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold text-gray-900">ResuMate</span>
              </div>
              <p className="text-gray-500 text-sm">
                Craft your future, one resume at a time.
              </p>
            </div>
            <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Product</h3>
                <ul className="mt-4 space-y-4">
                  <li><Link href="#features" className="text-base text-gray-500 hover:text-gray-900">Features</Link></li>
                  <li><Link href="#pricing" className="text-base text-gray-500 hover:text-gray-900">Pricing</Link></li>
                  <li><Link href="#testimonials" className="text-base text-gray-500 hover:text-gray-900">Testimonials</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Company</h3>
                <ul className="mt-4 space-y-4">
                  <li><Link href="#" className="text-base text-gray-500 hover:text-gray-900">About</Link></li>
                  <li><Link href="#" className="text-base text-gray-500 hover:text-gray-900">Careers</Link></li>
                  <li><Link href="#" className="text-base text-gray-500 hover:text-gray-900">Contact</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Legal</h3>
                <ul className="mt-4 space-y-4">
                  <li><Link href="#" className="text-base text-gray-500 hover:text-gray-900">Privacy</Link></li>
                  <li><Link href="#" className="text-base text-gray-500 hover:text-gray-900">Terms</Link></li>
                </ul>
              </div>
.
              <div>
                <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Connect</h3>
                <ul className="mt-4 space-y-4">
                  <li><Link href="#" className="text-base text-gray-500 hover:text-gray-900">Twitter</Link></li>
                  <li><Link href="#" className="text-base text-gray-500 hover:text-gray-900">LinkedIn</Link></li>
                  <li><Link href="#" className="text-base text-gray-500 hover:text-gray-900">Facebook</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-200 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} ResuMate. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 sm:mt-0">
              {/* Social Icons can go here */}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
