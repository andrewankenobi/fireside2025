document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.card-container');
    const dots = document.querySelectorAll('.nav-dot');
    const cards = document.querySelectorAll('.card'); // Get all cards to calculate scroll position

    if (!container || dots.length === 0 || cards.length === 0) {
        console.error("Scrolling container, dots, or cards not found!");
        return; // Exit if essential elements aren't found
    }

    const cardWidth = cards[0].offsetWidth; // Assuming all cards have the same width

    // Function to update the active dot
    const updateActiveDot = () => {
        // Calculate the index of the card closest to the center of the viewport
        // Add half the container width to center the calculation point
        const scrollLeft = container.scrollLeft;
        const containerWidth = container.offsetWidth;
        
        // Calculate index based on which card's start edge is closest to the container's start edge
        // Add a small tolerance (e.g., 10 pixels) to handle potential rounding issues
        const currentIndex = Math.round(scrollLeft / cardWidth);

        dots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    };

    // Use Intersection Observer for potentially better performance (alternative to scroll event)
    // This observes when cards enter/leave the viewport
    const observerOptions = {
      root: container, // Observe intersections within the container
      rootMargin: '0px',
      threshold: 0.6 // Trigger when 60% of the card is visible
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const intersectingCardIndex = Array.from(cards).indexOf(entry.target);
          dots.forEach((dot, index) => {
              dot.classList.toggle('active', index === intersectingCardIndex);
          });
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    cards.forEach(card => observer.observe(card));

    // --- Click navigation --- 
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const index = parseInt(dot.getAttribute('data-index'));
            const targetScrollLeft = index * cardWidth;

            container.scrollTo({
                left: targetScrollLeft,
                behavior: 'smooth' // Smooth scroll animation
            });
        });
    });

    // Initial update in case the page loads scrolled (though less likely here)
    // updateActiveDot(); // Can use this if observer is not preferred
}); 