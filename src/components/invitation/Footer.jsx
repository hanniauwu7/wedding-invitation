const Footer = ({ data, basePath }) => {
    return (
        <footer className="relative py-12 bg-inv-cream text-center border-t border-inv-lily/30 overflow-hidden">
            <div className="max-w-md mx-auto px-6 relative z-10">
                {data.emojis && (
                    <div className="flex items-center justify-center gap-3 mb-4">
                        {data.emojis.map((e, i) => <span key={i} className="text-2xl">{e}</span>)}
                    </div>
                )}
                <p className="font-inv-display italic text-xl mb-2 text-inv-primary">{data.name}</p>
                <p className="text-inv-gray text-sm mb-4">{data.subtitle}</p>
                <a href="https://invita-ya.com" target="_blank" rel="noopener noreferrer" className="text-inv-primary hover:text-inv-teal transition-colors text-xs uppercase tracking-widest">
                    Creado con Invita-Ya.com
                </a>
            </div>
        </footer>
    );
};

export default Footer;
