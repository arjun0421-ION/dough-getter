export default function Problem() {
  return (
    <section id="why-us" className="bg-white py-20 sm:py-28 border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text */}
          <div>
            <p className="text-caramel text-sm font-semibold uppercase tracking-widest mb-4">The Real Problem</p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-brown leading-tight">
              Because &ldquo;Passion&rdquo; Doesn&apos;t Have a Spreadsheet.
            </h2>

            <div className="mt-8 space-y-5 text-text-mid text-base leading-relaxed">
              <p>
                You started baking because you <strong className="text-brown">loved</strong> the magic of wild yeast and
                a perfect crust. You <strong className="text-brown">didn&apos;t sign up</strong> for ingredient math, utility
                tracking, or the midnight panic of realising you&apos;re out of bread
                flour for <strong className="text-brown">tomorrow&apos;s market</strong>.
              </p>
              <p>
                Most home-to-market businesses fail not because the product is
                bad — but because <strong className="text-brown">the operations are overwhelming</strong>. Dough Getter bridges that gap
                with a <strong className="text-brown">digital partner that sits outside the kitchen</strong>, managing
                your &ldquo;office&rdquo; while you&apos;re at the flour bench.
              </p>
            </div>

            {/* Quick stats */}
            <div className="mt-10 grid grid-cols-3 gap-4 pt-8 border-t border-border">
              {[
                { value: "8hrs", label: "Saved per week on admin" },
                { value: "23%", label: "Average margin uplift" },
                { value: "Free", label: "To get started today" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="font-serif text-2xl font-bold text-caramel">{stat.value}</div>
                  <div className="mt-1 text-xs text-text-light leading-snug">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Warm decorative panel */}
          <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-gradient-to-br from-caramel/20 via-cream to-caramel/5 border border-border">
            {/* Layered warm circles */}
            <div className="absolute top-6 right-6 w-32 h-32 rounded-full bg-caramel/10 blur-2xl" />
            <div className="absolute bottom-6 left-6 w-24 h-24 rounded-full bg-sage/10 blur-xl" />
            {/* Floating quote card */}
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-border max-w-xs text-center">
                <div className="text-3xl mb-3">🍞</div>
                <p className="font-serif text-brown text-base leading-snug italic">
                  &ldquo;I went from losing money to knowing my exact margin on every loaf.&rdquo;
                </p>
                <p className="mt-3 text-xs text-text-light">— Home baker, turned market regular</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
