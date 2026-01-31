import { Logo } from '@/components/icons';
import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Link href="/" className="flex items-center gap-2 text-foreground no-underline">
        <Logo className="h-6 w-6 text-primary" />
        <h1 className="font-headline text-xl font-semibold tracking-tight">
          CriticalFirst
        </h1>
      </Link>
    </header>
  );
}
