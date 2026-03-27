type BadgeVariant = "caramel" | "sage" | "purple" | "gray";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  caramel: "bg-caramel/10 text-caramel border-caramel/20",
  sage: "bg-sage-lt text-sage border-sage/20",
  purple: "bg-purple-lt text-purple border-purple/20",
  gray: "bg-cream text-text-mid border-border",
};

export default function Badge({
  variant = "caramel",
  children,
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full
        text-xs font-medium border
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
