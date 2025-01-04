"use server";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";

const Header = async () => {
  return (
    <header className="w-full shadow flex justify-center py-2 print:hidden">
      <div className="w-[700px] flex justify-between items-center">
        <div>
          <Link href="/">Domov</Link>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/new"
            className={`rounded-full border border-solid border-transparent
                transition-colors flex items-center justify-center bg-foreground text-background gap-2
                hover:bg-[#ccc] h-7 px-3 text-sm
            `}
          >
            Nový zápis
          </Link>
          <SignedOut>
            <SignInButton>Prihlásiť sa</SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </header>
  );
};

export default Header;
