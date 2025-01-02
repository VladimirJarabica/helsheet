"use server";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";

const Header = () => {
  //   const user = await currentUser();
  //   console.log("user", user);
  return (
    <header className="w-full shadow flex justify-center py-2">
      <div className="w-[700px] flex justify-between items-center">
        <div>
          <Link href="/">Domov</Link>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/new"
            className={`rounded-full border border-solid border-transparent
                transition-colors flex items-center justify-center bg-foreground text-background gap-2
                hover:bg-[#ccc] text-sm sm:text-base h-7 px-4 sm:px-5
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
