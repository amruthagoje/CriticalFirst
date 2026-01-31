'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Header } from '@/components/layout/header';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
        if (isSignUp) {
            await createUserWithEmailAndPassword(auth, email, password);
            toast({
                title: "Account Created",
                description: "You have been successfully signed in.",
            });
        } else {
            await signInWithEmailAndPassword(auth, email, password);
        }
        router.push('/dashboard');
    } catch (error: any) {
        let description = "An unexpected error occurred. Please try again.";
        if (error.code === 'auth/email-already-in-use') {
            description = "This email is already in use. Please sign in.";
        } else if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
            description = "Invalid email or password. Please try again.";
        } else if (error.code === 'auth/weak-password') {
            description = "Password should be at least 6 characters.";
        }
      
        toast({
            variant: "destructive",
            title: isSignUp ? "Sign Up Failed" : "Login Failed",
            description,
        });
        setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
        <Header />
        <main className="flex flex-1 items-center justify-center p-6">
            <Card className="w-full max-w-sm">
                <form onSubmit={handleSubmit}>
                    <CardHeader className="relative text-center">
                        <Link href="/" className="absolute left-6 top-6">
                            <Button variant="outline" size="sm" type="button">
                                Back
                            </Button>
                        </Link>
                        <CardTitle className="text-2xl">{isSignUp ? 'Create Admin Account' : 'Admin Login'}</CardTitle>
                        <CardDescription>
                            {isSignUp ? 'Create an account to get started.' : 'Sign in to manage the triage system.'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="admin@criticalfirst.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col items-center justify-center gap-4">
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
                        </Button>
                        <div className="text-center text-sm text-muted-foreground">
                            {isSignUp ? "Already have an account?" : "Don't have an account?"}
                            <Button variant="link" type="button" onClick={() => setIsSignUp(!isSignUp)} className="pl-1 text-primary">
                                {isSignUp ? "Sign In" : "Sign Up"}
                            </Button>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </main>
    </div>
  );
}
