import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cpu, Users, AlertTriangle, WifiOff } from 'lucide-react';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function LandingPage() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-image');

  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full flex items-center justify-center text-center text-white h-[70vh] md:h-[60vh] bg-background">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover"
              data-ai-hint={heroImage.imageHint}
              priority
            />
          )}
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none font-headline">
                  Revolutionizing Emergency Care with AI-Powered Triage
                </h1>
                <p className="max-w-[700px] mx-auto text-gray-200 md:text-xl">
                  CriticalFirst optimizes patient flow, reduces wait times, and improves outcomes with intelligent, real-time decision support.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg" variant="secondary">
                  <Link href="/dashboard">
                    Launch Dashboard
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Faster, Smarter, Safer Patient Triage</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform is equipped with cutting-edge features to handle the complexities of modern emergency departments.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-2 mt-12">
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <Cpu className="h-8 w-8 text-primary" />
                  <CardTitle>AI-Powered Semantic Triage</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Leverage advanced AI to instantly analyze symptom descriptions and assign accurate triage priorities, ensuring critical patients are seen first.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <Users className="h-8 w-8 text-primary" />
                  <CardTitle>Real-Time Dynamic Queue</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Monitor the patient queue live, with automatically updated wait times based on automatically updated wait times based on staff availability and patient priority.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <AlertTriangle className="h-8 w-8 text-primary" />
                  <CardTitle>Intelligent Alerts & Escalation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Receive automatic alerts for critical patients exceeding wait time thresholds, enabling proactive intervention.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <WifiOff className="h-8 w-8 text-primary" />
                  <CardTitle>Offline-First Capability</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Continue patient registration and basic triage even during network outages, with data syncing automatically when connectivity is restored.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
          <p className="text-xs text-muted-foreground">&copy; 2024 CriticalFirst. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}
