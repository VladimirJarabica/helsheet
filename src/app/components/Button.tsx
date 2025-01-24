"use client";
import { MouseEvent as ReactMouseEvent } from "react";
import Link from "next/link";
import { useState } from "react";

interface ButtonProps {
  href?: React.ComponentProps<typeof Link>["href"];
  children: React.ReactNode;
  onClick?: (
    e: ReactMouseEvent<HTMLButtonElement, MouseEvent>
  ) => void | Promise<void>;
  className?: string;
  variant: "primary" | "secondary" | "danger";
}

const Button = ({
  href,
  children,
  onClick,
  className,
  variant,
}: ButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const inner = (
    <button
      //   className={`rounded border border-solid border-gray-400 bg-hel-bgDefault relative w-fit h-fit
      // transition-colors duration-300 flex items-center justify-center text-foreground gap-2
      // hover:border-foreground px-2 py-1 text-sm
      // `}
      className={`inline-flex w-auto justify-center rounded-md
        px-3 py-2 
        text-sm 
        shadow-xs
        ${
          variant === "primary"
            ? "bg-indigo-600 hover:bg-indigo-500 text-white"
            : ""
        }
        ${
          variant === "secondary"
            ? "bg-white hover:bg-gray-50 text-gray-900 ring-1 ring-inset ring-gray-300"
            : ""
        }
        ${variant === "danger" ? "bg-red-600 hover:bg-red-500 text-white" : ""}
        `}
      onClick={
        onClick
          ? (e) => {
              const res = onClick(e);
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
      <div
        className={`${isLoading ? "invisible" : ""} 
        ${className}`}
      >
        {children}
      </div>
      {isLoading && <div className="absolute">...</div>}
    </button>
  );

  if (href) {
    return <Link href={href}>{inner}</Link>;
  }
  return inner;
};

export default Button;
