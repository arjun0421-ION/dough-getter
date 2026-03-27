import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export default function Card({
  hover = true,
  className = "",
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={`
        bg-white border border-border rounded-xl shadow-sm p-6
        ${hover ? "transition-shadow duration-200 hover:shadow-md" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
