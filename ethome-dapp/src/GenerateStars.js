const generateStars = (numStars) => {
    const newStars = [];
    for (let i = 0; i < numStars; i++) {
        const size = Math.random() * 2 + 1; // Random size for each star
        const top = Math.random() * 100; // Random top position in viewport height
        const left = Math.random() * 100; // Random left position in viewport width
        const animationDuration = Math.random() * 70 + 5; // Random animation duration

        newStars.push({
            key: i,
            size: `${size}px`,
            top: `${top}vh`,
            left: `${left}vw`,
            animationDuration: `${animationDuration}s`,
            animationDelay: `-${Math.random() * 10}s`,
        });
    }
    return newStars;
};

export default generateStars;
