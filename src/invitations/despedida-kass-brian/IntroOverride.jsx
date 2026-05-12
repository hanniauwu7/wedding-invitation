/**
 * IntroOverride — Compact intro for the bachelor party.
 * Removes the empty parent1/parent2 card and excess whitespace.
 */
const IntroOverride = ({ data }) => {
    return (
        <section className="relative pt-2 pb-8 px-6 bg-gradient-to-b from-white to-inv-light text-center overflow-hidden">
            <div className="max-w-xl mx-auto relative z-10">
                <p className="text-inv-gray text-sm uppercase tracking-[0.3em] mb-3">{data.label}</p>
                <h2 className="font-inv-display text-4xl md:text-5xl text-inv-primary mb-3">
                    {data.closingMessage}
                </h2>
                <p className="text-inv-gray text-base md:text-lg leading-relaxed max-w-md mx-auto">
                    {data.message}
                </p>
                <div className="flex items-center justify-center gap-3 mt-5">
                    <div className="w-12 h-[1px] bg-inv-primary/40" />
                    <span className="text-inv-primary text-xl">✦</span>
                    <div className="w-12 h-[1px] bg-inv-primary/40" />
                </div>
            </div>
        </section>
    );
};

export default IntroOverride;
