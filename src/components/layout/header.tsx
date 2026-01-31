'use client';

import { Logo } from '@/components/icons';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';
import { ArrowLeft } from 'lucide-react';

export function Header() {
  const pathname = usePathname();
  const auth = useAuth();
  const router = useRouter();
  const { user } = useUser();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/admin/login');
  };

  const isFullUser = user && !user.isAnonymous;
  const showBackButton = pathname === '/admin/login';

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <div className="flex items-center gap-4">
        {showBackButton && (
          <Button variant="outline" size="icon" onClick={() => router.push('/')} className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to homepage</span>
          </Button>
        )}
        <Link href="/" className="flex items-center gap-2 text-foreground no-underline">
          <Logo className="h-6 w-6 text-primary" />
          <h1 className="font-headline text-xl font-semibold tracking-tight">
            CriticalFirst
          </h1>
        </Link>
      </div>
      
      {pathname === '/' && !isFullUser && (
        <Button asChild>
          <Link href="/admin/login">Admin Login</Link>
        </Button>
      )}

      {isFullUser && (
         <Button variant="outline" onClick={handleLogout}>
            Log Out
         </Button>
      )}
    </header>
  );
}
