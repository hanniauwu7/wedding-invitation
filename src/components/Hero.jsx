import { useState, useRef } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';

const Hero = () => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);

    const toggleMusic = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            const current = audioRef.current.currentTime;
            const duration = audioRef.current.duration;
            if (duration) {
                setProgress((current / duration) * 100);
            }
        }
    };

    return (
        <header className="relative h-screen w-full flex flex-col items-center justify-end pb-20 text-center overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/img/Portada.jpeg"
                    alt="Fondo Boda"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            </div>

            <div className="relative z-10 text-white animate-fade-in space-y-4 px-4">
                <h1 className="font-serif text-6xl md:text-8xl drop-shadow-md">Nos Casamos</h1>
                <p className="text-lg md:text-xl uppercase tracking-[0.3em] font-light">KASSANDRA & BRIAN</p>
            </div>

            {/* Audio Player */}
            <audio
                id="bodaAudio"
                loop
                ref={audioRef}
                onTimeUpdate={handleTimeUpdate}
            >
                <source src="/audio/MMXX's.mp3" type="audio/mpeg" />
            </audio>

            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-[90%] max-w-md bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg flex items-center gap-4 z-20">
                <button onClick={toggleMusic} className="text-primary hover:text-slate-800 transition-colors">
                    {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                </button>

                <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary transition-all duration-100 ease-linear"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <Volume2 size={16} className="text-gray-400" />
            </div>
        </header>
    );
};

export default Hero;
