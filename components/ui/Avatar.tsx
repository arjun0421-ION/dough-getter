interface AvatarProps {
  src?: string | null;
  name?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeStyles = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-14 h-14 text-lg",
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Generate a consistent color from a name string
function getColor(name: string): string {
  const colors = [
    "bg-caramel",
    "bg-sage",
    "bg-purple",
    "bg-caramel-lt",
    "bg-brown",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export default function Avatar({
  src,
  name = "User",
  size = "md",
  className = "",
}: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`
          ${sizeStyles[size]} rounded-full object-cover
          ${className}
        `}
      />
    );
  }

  return (
    <div
      className={`
        ${sizeStyles[size]} ${getColor(name)}
        rounded-full flex items-center justify-center
        font-semibold text-white
        ${className}
      `}
    >
      {getInitials(name)}
    </div>
  );
}
