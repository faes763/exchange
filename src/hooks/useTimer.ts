'use client'
import { useEffect, useState } from "react";

const useCountdownTimer = (dateTimeString: string, hours: number) => {
    const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining(dateTimeString, hours));
  
    function calculateTimeRemaining(dateTimeString: string, hours: number) {
      const now = new Date().getTime();
      const target = new Date(dateTimeString).getTime() + hours * 60 * 60 * 1000;
      const difference = target - now;
      if (difference <= 0) return { hours: 0, minutes: 0, seconds: 0 };
      const hoursRemaining = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      return { hours: hoursRemaining, minutes, seconds };
    }
  
    useEffect(() => {
      const interval = setInterval(() => {
        setTimeRemaining(calculateTimeRemaining(dateTimeString, hours));
      }, 1000);
      return () => clearInterval(interval);
    }, [dateTimeString, hours]);
  
    return timeRemaining;
  };
  
  export default useCountdownTimer;