import useCountdown from '../../hooks/useCountdown';
import AddToCalendar from './AddToCalendar';

const Countdown = ({ data, calendar, basePath }) => {
    const { days, hours, minutes, seconds, isTime } = useCountdown(data.targetDate);

    return (
        <section className="relative py-20 px-4 bg-gradient-to-b from-inv-light to-inv-cream text-center">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
            </div>
            <div className="max-w-4xl mx-auto relative z-10">
                <h2 className="text-4xl md:text-5xl font-inv-display text-inv-primary mb-12">{isTime ? "¡Es Hoy!" : "¡Falta Poco!"}</h2>
                {!isTime && (
                    <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-10">
                        <TimerBox value={days} label="Días" />
                        <TimerBox value={hours} label="Hrs" />
                        <TimerBox value={minutes} label="Min" />
                        <TimerBox value={seconds} label="Seg" />
                    </div>
                )}
                {!isTime && (
                    <div className="mb-8 animate-fade-in">
                        <p className="text-xl md:text-3xl text-inv-dark font-inv-display mb-2">{data.displayDate}</p>
                        <p className="text-lg text-inv-gray uppercase tracking-widest">{data.displayYear}</p>
                    </div>
                )}
                {!isTime && <AddToCalendar data={calendar} />}
            </div>
        </section>
    );
};

const TimerBox = ({ value, label }) => (
    <div className="flex flex-col items-center">
        <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-inv-primary to-inv-teal text-white rounded-2xl flex flex-col items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300 border border-inv-accent/20">
            <span className="text-2xl md:text-3xl font-bold leading-none">{value < 10 ? `0${value}` : value}</span>
            <span className="text-[0.65rem] uppercase tracking-wider mt-1 opacity-90 text-inv-firefly">{label}</span>
        </div>
    </div>
);

export default Countdown;
