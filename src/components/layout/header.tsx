'use client';

import { Logo } from '@/components/icons';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';

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

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <div className="flex items-center gap-4">
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
         <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground">
                Signed in as <span className="font-semibold">{user.email}</span>
            </p>
            <Button variant="outline" onClick={handleLogout}>
                Log Out
            </Button>
         </div>
      )}
    </header>
  );
}
