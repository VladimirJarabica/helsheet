"use client";
import Link from "next/link";
import { useState } from "react";

interface ButtonProps {
  href?: React.ComponentProps<typeof Link>["href"];
  children: React.ReactNode;
  onClick?: () => void | Promise<void>;
}

const Button = ({ href, children, onClick }: ButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const inner = (
    <button
      className={`rounded-full border border-solid border-transparent relative w-fit h-fit
        transition-colors flex items-center justify-center bg-foreground text-background gap-2
        hover:bg-[#ccc] px-3 py-2 text-sm
    `}
      onClick={
        onClick
          ? () => {
              const res = onClick();
              if (res instanceof Promise) {
                setIsLoading(true);
                res.finally(() => {
                  setIsLoading(false);
                });
              }
            }
          : undefined
      }
    >
      <div className={`${isLoading ? "invisible" : ""}`}>{children}</div>
      {isLoading && <div className="absolute">...</div>}
    </button>
  );

  if (href) {
    return <Link href={href}>{inner}</Link>;
  }
  return inner;
};

export default Button;
