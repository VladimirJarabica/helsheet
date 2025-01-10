"use server";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import NewSheetButton from "./NewSheetButtonServer";

const Header = async () => {
  return (
    <header className="w-full shadow flex justify-center py-2 print:hidden">
      <div className="max-w-[700px] w-11/12 flex justify-between items-center">
        <div>
          <Link href="/">Domov</Link>
        </div>
        <div className="flex items-center gap-4">
          <NewSheetButton />
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
