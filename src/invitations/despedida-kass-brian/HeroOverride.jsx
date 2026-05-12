import { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, ChevronDown } from 'lucide-react';

/**
 * HeroOverride — Bachelor party hero with the caricature image
 * displayed prominently against a dark blue gradient background.
 */
const HeroOverride = ({ data, basePath }) => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
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

    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !audioRef.current.muted;
            setIsMuted(!isMuted);
        }
    };

    return (
        <header className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center text-center"
            style={{ background: 'linear-gradient(180deg, #0f2644 0%, #1a3a5c 40%, #1e3a5f 100%)' }}>

            {/* Top text */}
            <div className="relative z-10 text-white pt-10 px-6 space-y-2">
                <p className="text-sm md:text-base uppercase tracking-[0.4em] font-light text-blue-300 drop-shadow-md">
                    {data.subtitle}
                </p>
            </div>

            {/* Caricature image — centered and large */}
            <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-6 w-full max-w-lg">
                <img
                    src={`${basePath}/img/${data.backgroundImage}`}
                    alt="Kass & Brian Caricatura"
                    loading="eager"
                    decoding="async"
                    className="w-full max-h-[55vh] object-contain drop-shadow-2xl"
                    style={{ filter: 'drop-shadow(0 8px 30px rgba(0,0,0,0.4))' }}
                />
            </div>

            {/* Bottom text */}
            <div className="relative z-10 text-white pb-24 md:pb-16 px-6 space-y-3">
                <h1 className="font-inv-display text-6xl md:text-8xl drop-shadow-lg leading-tight text-white">
                    {data.name}
                </h1>
                <div className="flex items-center justify-center gap-4">
                    <div className="w-20 h-[2px] bg-blue-400/60" />
                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                    <div className="w-20 h-[2px] bg-blue-400/60" />
                </div>
                <p className="text-base md:text-xl tracking-[0.2em] font-light text-blue-200 drop-shadow-md">
                    {data.date}
                </p>
            </div>

            {/* Audio Player */}
            {data.song && (
                <>
                    <audio id="invitationAudio" loop ref={audioRef} onTimeUpdate={handleTimeUpdate}>
                        <source src={`${basePath}/audio/${data.song}`} type="audio/mpeg" />
                    </audio>
                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-[90%] max-w-md bg-black/50 backdrop-blur-md rounded-full px-6 py-3 shadow-lg flex items-center gap-4 z-20 border border-blue-400/30">
                        <button onClick={toggleMusic} className="text-blue-400 hover:text-white transition-colors">
                            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                        </button>
                        <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 transition-all duration-100 ease-linear" style={{ width: `${progress}%` }} />
                        </div>
                        <button onClick={toggleMute} className="text-white/60 hover:text-white transition-colors">
                            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                        </button>
                    </div>
                </>
            )}

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce z-20 text-blue-300/80">
                <span className="text-xs uppercase tracking-[0.2em] font-light">Desliza</span>
                <ChevronDown size={24} />
            </div>
        </header>
    );
};

export default HeroOverride;
