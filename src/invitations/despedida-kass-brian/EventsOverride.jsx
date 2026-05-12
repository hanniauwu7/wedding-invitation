import { MapPin, PartyPopper } from 'lucide-react';

const EventsOverride = ({ data, basePath }) => {
    return (
        <section className="relative py-16 px-6 bg-inv-cream overflow-hidden">
            <div className="max-w-4xl mx-auto relative z-10">
                <div className="text-center mb-8">
                    <h2 className="text-4xl md:text-5xl font-inv-display text-inv-primary">Te esperamos en:</h2>
                </div>
                <div className="flex flex-col md:flex-row justify-center items-stretch gap-8">
                    {data.map((event, i) => (
                        <div key={i} className="flex-1 min-w-[280px] max-w-md mx-auto bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-md text-center flex flex-col items-center border border-inv-lily/50">
                            {/* Icon */}
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-inv-primary to-inv-teal flex items-center justify-center text-white mb-5 shadow-md">
                                <PartyPopper className="w-8 h-8 text-white" strokeWidth={2.5} />
                            </div>

                            {/* Title — display font */}
                            <h3 className="text-3xl font-inv-display text-inv-primary mb-2">{event.title}</h3>

                            {/* Location */}
                            {event.location && (
                                <p className="text-inv-dark font-semibold text-base mb-1 tracking-wide">{event.location}</p>
                            )}

                            {/* Address — italic */}
                            <p className="text-inv-gray text-sm italic mb-3">{event.address}</p>

                            <div className="w-16 h-[1px] bg-inv-primary/30 mx-auto my-3" />

                            {/* Time — big and bold */}
                            <p className="text-inv-primary font-bold text-2xl font-inv-display mb-5">{event.time} hrs</p>

                            {/* Map link */}
                            {event.mapLink && (
                                <a href={event.mapLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-gradient-to-r from-inv-primary to-inv-teal text-white px-6 py-2.5 rounded-full text-sm font-semibold uppercase tracking-wide hover:opacity-90 transition-all shadow-md">
                                    <MapPin size={16} /> Ver Ubicación
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default EventsOverride;
