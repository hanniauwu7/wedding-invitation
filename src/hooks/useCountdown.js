import { useState, useEffect } from 'react';

/**
 * Hook reutilizable para cuenta regresiva.
 * @param {string} targetDate - Fecha objetivo en formato ISO (e.g. "2026-05-02T19:00:00")
 * @returns {{ days, hours, minutes, seconds, isTime }}
 */
export default function useCountdown(targetDate) {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [isTime, setIsTime] = useState(false);

    useEffect(() => {
        if (!targetDate) return;

        const eventDate = new Date(targetDate).getTime();

        const updateTimer = () => {
            const now = new Date().getTime();
            const distance = eventDate - now;

            if (distance < 0) {
                setIsTime(true);
            } else {
                setTimeLeft({
                    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((distance % (1000 * 60)) / 1000),
                });
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [targetDate]);

    return { ...timeLeft, isTime };
}

export { useCountdown };
