"use client";
import { MouseEvent as ReactMouseEvent } from "react";
import Link from "next/link";
import { useState } from "react";

interface ButtonProps {
  href?: React.ComponentProps<typeof Link>["href"];
  children: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: (
    e: ReactMouseEvent<HTMLButtonElement, MouseEvent>
  ) => void | Promise<void>;
  className?: string;
  variant: "primary" | "secondary" | "danger" | "link";
  size?: "small" | "medium";
  smOnlyIcon?: boolean;
}

const Button = ({
  href,
  icon,
  children,
  onClick,
  className,
  variant,
  size = "medium",
  smOnlyIcon = false,
}: ButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const inner = (
    <button
      //   className={`rounded border border-solid border-gray-400 bg-hel-bgDefault relative w-fit h-fit
      // transition-colors duration-300 flex items-center justify-center text-foreground gap-2
      // hover:border-foreground px-2 py-1 text-sm
      // `}
      className={`inline-flex w-auto items-center justify-center rounded-md tracking-wide flex-nowrap text-nowrap
        ${size === "medium" ? "px-3 py-1.5" : ""}
        ${size === "small" ? "px-2 py-1" : ""}
        text-sm 
        shadow-xs
        ${
          variant === "primary"
            ? "bg-hel-buttonPrimary hover:bg-hel-buttonPrimaryHover text-hel-buttonPrimaryColor"
            : ""
        }
        ${
          variant === "secondary"
            ? "hover:bg-hel-buttonSecondaryHover text-hel-buttonSecondaryColor bg-hel-buttonSecondary ring-1 ring-inset ring-gray-300"
            : ""
        }
        ${
          variant === "danger"
            ? "bg-hel-buttonDanger hover:bg-hel-buttonDangerHover text-hel-buttonDangerColor"
            : ""
        }
        ${
          variant === "link"
            ? "text-hel-buttonLinkColor hover:text-hel-buttonLinkHoverColor"
            : ""
        }
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
        className={`flex gap-1 ${isLoading ? "invisible" : ""} 
        ${className}`}
      >
        {icon}
        <div className={icon && smOnlyIcon ? "hidden sm:block" : undefined}>
          {children}
        </div>
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
