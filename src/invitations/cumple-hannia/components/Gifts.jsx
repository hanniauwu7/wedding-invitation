import React from 'react';
import { Gift } from 'lucide-react';
import config from '../config.json';

const Gifts = () => {
    if (!config.gifts) return null;
    return (
        <section className="py-20 px-4 bg-white text-center">
            <div className="max-w-3xl mx-auto">
                <div className="inline-flex items-center justify-center p-4 bg-secondary rounded-full mb-6">
                    <Gift className="w-8 h-8 text-primary" />
                </div>

                <h3 className="text-3xl font-serif text-slate-800 mb-4">Mesa de Regalos</h3>
                <p className="text-slate-600 mb-8 max-w-md mx-auto">
                    {config.gifts.message || 'Su presencia es nuestro mayor regalo, pero si desean tener un detalle con nosotros:'}
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    {(config.gifts.links || []).map((gift, i) => (
                        <a
                            key={i}
                            href={gift.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-3 bg-primary-dark text-white px-8 py-4 rounded-lg hover:opacity-90 transition-all hover:-translate-y-1 shadow-md"
                        >
                            {gift.icon && <i className={gift.icon + ' text-xl'}></i>}
                            <span className="font-medium">{gift.label}</span>
                        </a>
                    ))}
                </div>

                {config.gifts.envelopeOption && (
                    <p className="mt-8 text-sm text-slate-500 bg-secondary inline-block px-4 py-2 rounded-full border border-slate-100">
                        O la opción en mesa será: <span className="font-semibold text-slate-700">"Lluvia de sobres"</span> 💌
                    </p>
                )}
            </div>
        </section>
    );
};

export default Gifts;
