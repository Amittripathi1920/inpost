import { useEffect, useState } from "react";

export function useChartAnimation(data: any[]) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  return {
    isAnimationActive: true,
    animationBegin: 0,
    animationDuration: 1000,
    animationEasing: "ease" as const, // Type assertion to match recharts expected values
  };
}
