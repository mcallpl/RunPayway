import Link from "next/link";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "lg" | "md" | "sm";

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-navy-900 text-white hover:bg-navy-800 focus:ring-navy-900",
  secondary:
    "border border-navy-900 text-navy-900 hover:bg-navy-900 hover:text-white focus:ring-navy-900",
  ghost:
    "text-navy-700 underline underline-offset-4 hover:text-navy-900 focus:ring-navy-700",
};

const sizeStyles: Record<ButtonSize, string> = {
  lg: "px-8 py-4 text-lg",
  md: "px-6 py-3 text-base",
  sm: "px-4 py-2 text-sm",
};

export default function Button({
  variant = "primary",
  size = "md",
  children,
  className = "",
  href,
  onClick,
  type = "button",
}: ButtonProps) {
  const baseStyles =
    "inline-block rounded-none font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  const classes = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`.trim();

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
