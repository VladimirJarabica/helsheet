"use client";

import { usePathname } from "next/navigation";
import Button from "./Button";

interface MenuItemProps {
  href: string;
  children: React.ReactNode;
}
const MenuItem = ({ href, children }: MenuItemProps) => {
  const pathname = usePathname();
  console.log("pathname", pathname);

  const isActive = pathname === href;
  return (
    <div
      className={`flex items-center border-b-2 ${
        isActive
          ? "border-b-gray-700 hover:border-b-gray-800"
          : "border-b-transparent hover:border-b-gray-300"
      }`}
      // Does not work with tailwind
      style={{ height: "calc(100% + 2px)" }}
    >
      <Button variant="link" href={href}>
        {children}
      </Button>
    </div>
  );
};

export default MenuItem;
