const Intro = ({ data, basePath }) => {
    return (
        <section className="relative py-20 px-6 bg-gradient-to-b from-inv-cream to-inv-light text-center overflow-hidden">
            <div className="max-w-2xl mx-auto relative z-10">

                <p className="text-inv-gray text-sm uppercase tracking-[0.3em] mb-4">{data.message}</p>

                <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 md:p-10 shadow-lg border border-inv-lily/50 mb-8">
                    <h3 className="text-sm uppercase tracking-[0.25em] text-inv-primary font-semibold mb-3">{data.label}</h3>
                    <p className="font-inv-display text-2xl md:text-3xl text-inv-dark leading-relaxed">
                        {data.parent1}
                    </p>
                    <div className="flex items-center justify-center gap-3 my-2">
                        <div className="w-8 h-[1px] bg-inv-accent" />
                        <span className="text-inv-accent text-lg">&</span>
                        <div className="w-8 h-[1px] bg-inv-accent" />
                    </div>
                    <p className="font-inv-display text-2xl md:text-3xl text-inv-dark leading-relaxed">
                        {data.parent2}
                    </p>
                </div>

                <p className="text-inv-gray text-base md:text-lg italic leading-relaxed max-w-lg mx-auto">
                    "{data.closingMessage}"
                </p>

                <div className="flex items-center justify-center gap-3 mt-6">
                    <div className="w-12 h-[1px] bg-inv-accent/60" />
                    <span className="text-inv-accent text-xl">✦</span>
                    <div className="w-12 h-[1px] bg-inv-accent/60" />
                </div>
            </div>
    </section>
    );
};

export default Intro;
