import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-brown text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-caramel rounded-lg flex items-center justify-center shadow-sm">
                <span className="font-serif font-bold text-white text-sm">DG</span>
              </div>
              <span className="font-serif font-bold text-white text-lg">
                Dough Getter
              </span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              The AI-powered business companion for home bakers. Bake smarter,
              price better, grow faster.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-xs uppercase tracking-widest text-white/40 mb-4">
              Product
            </h3>
            <ul className="space-y-2.5">
              {[
                { label: "Features", href: "/#features" },
                { label: "Pricing", href: "/#pricing" },
                { label: "Calculator", href: "/app/calculator" },
                { label: "Community", href: "/app/community" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-white/60 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-xs uppercase tracking-widest text-white/40 mb-4">
              Company
            </h3>
            <ul className="space-y-2.5">
              {["About Us", "Contact", "Privacy Policy", "Terms of Service"].map((item) => (
                <li key={item}>
                  <span className="text-sm text-white/60">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-semibold text-xs uppercase tracking-widest text-white/40 mb-4">
              Connect
            </h3>
            <ul className="space-y-2.5">
              {["Instagram", "Twitter / X", "Email Us"].map((item) => (
                <li key={item}>
                  <span className="text-sm text-white/60">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-white/40">
            &copy; {new Date().getFullYear()} Dough Getter. All rights reserved.
          </p>
          <p className="text-xs text-white/30">Made with care, for bakers who care.</p>
        </div>
      </div>
    </footer>
  );
}
