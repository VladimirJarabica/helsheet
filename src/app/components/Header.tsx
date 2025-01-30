"use client";
import { SignInButton, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import {
  HomeIcon,
  MusicalNoteIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import Button from "./Button";
import MenuItem from "./HeaderButton";

interface HeaderProps {
  newSheetButton: React.ReactNode;
}

const Header = ({ newSheetButton }: HeaderProps) => {
  const { user } = useUser();

  return (
    <header className="w-full shadow mb-1 flex justify-center print:hidden h-11">
      <div className="max-w-[700px] w-11/12 flex justify-between items-center">
        <div className="h-full flex">
          <MenuItem href="/" exact>
            <HomeIcon className="w-4" />
          </MenuItem>
          <MenuItem href="/sheet">
            <div className="flex gap-1 items-center">
              <MusicalNoteIcon className="w-4 h-4" />
              Piesne
            </div>
          </MenuItem>
          {user && (
            <MenuItem href={`/user/${user?.id}`}>
              <div className="flex gap-1 items-center">
                <PencilSquareIcon className="w-4 h-4" />
                Moje zápisy
              </div>
            </MenuItem>
          )}
        </div>
        <div className="flex items-center gap-4 py-2">
          {newSheetButton}
          <SignedOut>
            <SignInButton>
              <Button variant="primary" size="small">
                Prihlásiť sa
              </Button>
            </SignInButton>
          </SignedOut>
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Link
                label="Moje zápisy"
                labelIcon={<PencilSquareIcon className="w-4 h-4" />}
                href={`/user/${user?.id}`}
              />
            </UserButton.MenuItems>
          </UserButton>
        </div>
      </div>
    </header>
  );
};

export default Header;
