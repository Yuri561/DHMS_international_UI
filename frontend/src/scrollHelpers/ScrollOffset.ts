export const scrollWithOffset = (el: HTMLElement, duration = 600) => {
    const yCoordinate = el.getBoundingClientRect().top + window.pageYOffset;
    const yOffset = -80; // header height offset
  
    const startY = window.scrollY;
    const targetY = yCoordinate + yOffset;
    const distance = targetY - startY;
    let startTime: number | null = null;
  
    const easeInOutQuad = (t: number) =>
      t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  
    const animateScroll = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const easedProgress = easeInOutQuad(progress);
  
      window.scrollTo(0, startY + distance * easedProgress);
  
      if (timeElapsed < duration) {
        requestAnimationFrame(animateScroll);
      }
    };
  
    requestAnimationFrame(animateScroll);
  };
  