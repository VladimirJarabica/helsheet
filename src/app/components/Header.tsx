"use server";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Button from "./Button";
import MenuItem from "./HeaderButton";
import NewSheetButton from "./NewSheetButtonServer";

const Header = async () => {
  return (
    <header className="w-full shadow mb-1 flex justify-center print:hidden">
      <div className="max-w-[700px] w-11/12 flex justify-between items-center">
        <div className="h-full flex">
          <MenuItem href="/" exact>
            Domov
          </MenuItem>
          <MenuItem href="/sheet">Piesne</MenuItem>
        </div>
        <div className="flex items-center gap-4 py-2">
          <NewSheetButton size="small" />
          <SignedOut>
            <SignInButton>
              <Button variant="primary" size="small">
                Prihlásiť sa
              </Button>
            </SignInButton>
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
