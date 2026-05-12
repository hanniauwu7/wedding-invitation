const DressCode = ({ data, basePath }) => {
    return (
        <section className="relative py-16 px-4 bg-inv-light text-center overflow-hidden">
            <div className="max-w-sm mx-auto bg-white p-8 rounded-3xl shadow-md border border-inv-lily/50 relative z-10">
                <h3 className="text-lg font-semibold text-inv-dark uppercase tracking-widest mb-6">Código de Vestimenta</h3>
                <div className="bg-gradient-to-br from-inv-cream to-inv-light p-6 rounded-2xl border border-inv-lily/30 mb-4">
                    <div className="flex justify-center items-end gap-6 mb-5">
                        {/* Suit / Tuxedo icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 80" className="w-12 h-16 text-inv-primary" fill="currentColor" opacity="0.7">
                            <path d="M32 0L22 12l4 3-6 65h24L38 15l4-3L32 0zm-4 14l4 5 4-5 2 2-6 8-6-8 2-2z"/>
                        </svg>
                        {/* Dress icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 80" className="w-12 h-16 text-inv-primary" fill="currentColor" opacity="0.7">
                            <path d="M32 0c-4 0-8 3-8 8s3 10 8 10 8-5 8-10-4-8-8-8zm-6 20l-2 8-8 4 12 48h8l-4-40 0-20zm12 0v20l-4 40h8l12-48-8-4-2-8h-6z"/>
                        </svg>
                    </div>
                    <p className="font-bold text-inv-primary text-2xl tracking-wide">{data.type}</p>
                </div>
            </div>
        </section>
    );
};

export default DressCode;
