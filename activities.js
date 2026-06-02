// Activities Page Specific Scripts
document.addEventListener('DOMContentLoaded', () => {
    console.log('Activities page scripts loaded.');

    // Add simple animation delay for grid items
    const cards = document.querySelectorAll('.event-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('animate__animated', 'animate__fadeInUp');
    });
});
