import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { box: "w-8 h-8", letter: "text-lg", text: "text-lg" },
  md: { box: "w-10 h-10", letter: "text-xl", text: "text-xl" },
  lg: { box: "w-14 h-14", letter: "text-3xl", text: "text-2xl" },
};

export default function Logo({
  size = "md",
  showText = true,
  className = "",
}: LogoProps) {
  const s = sizeMap[size];

  return (
    <Link href="/" className={`flex items-center gap-2.5 ${className}`}>
      <div
        className={`
          ${s.box} bg-caramel rounded-lg flex items-center justify-center
          shadow-sm
        `}
      >
        <span className={`font-serif font-bold text-white ${s.letter}`}>
          C
        </span>
      </div>
      {showText && (
        <span className={`font-serif font-bold text-brown ${s.text}`}>
          Dough Getter
        </span>
      )}
    </Link>
  );
}
