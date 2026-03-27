import Link from "next/link";

export default function CTABanner() {
  return (
    <section className="bg-cream py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-br from-brown via-brown to-caramel/80 px-8 py-16 text-center overflow-hidden shadow-xl shadow-brown/20">
          {/* Warm glow overlays */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-caramel/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-caramel/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Your Bakery Deserves a<br />
              <span className="text-caramel-lt italic">Business Partner.</span>
            </h2>
            <p className="mt-6 text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
              Join bakers who have stopped drowning in spreadsheets and started building
              the business they always imagined — one loaf at a time.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="flex items-center gap-2 px-8 py-3.5 bg-caramel hover:bg-caramel-lt text-white font-semibold rounded-full transition-colors shadow-lg shadow-caramel/30 text-sm sm:text-base"
              >
                Start for Free
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <Link
                href="/#pricing"
                className="px-8 py-3.5 border border-white/25 text-white hover:border-white/50 hover:bg-white/10 font-semibold rounded-full transition-colors text-sm sm:text-base"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
