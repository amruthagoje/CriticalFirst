'use client';

import { Logo } from '@/components/icons';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Link href="/" className="flex items-center gap-2 text-foreground no-underline">
        <Logo className="h-6 w-6 text-primary" />
        <h1 className="font-headline text-xl font-semibold tracking-tight">
          CriticalFirst
        </h1>
      </Link>
      {pathname === '/' && (
        <Button asChild>
          <Link href="/admin/login">Admin Login</Link>
        </Button>
      )}
    </header>
  );
}
