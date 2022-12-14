import clsx from "clsx";
import NextLink from "next/link";
import { PropsWithChildren } from "react";

export default function LinkText({
  href,
  label,
  customStyle,
  testId,
  children,
}: PropsWithChildren<{
  href: string;
  label?: string;
  customStyle?: string;
  testId?: string;
}>): JSX.Element {
  return (
    <NextLink
      data-testid={testId}
      href={href}
      className={clsx(
        "text-lightBlue brand-gradient-1 active:brand-gradient-2 bg-clip-text hover:text-transparent transition-all ease-in duration-300",
        customStyle
      )}
    >
      {label}
      {children}
    </NextLink>
  );
}
