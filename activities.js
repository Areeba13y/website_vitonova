// Activities Page Specific Scripts
document.addEventListener('DOMContentLoaded', () => {
    console.log('Activities page scripts loaded.');

<<<<<<< Updated upstream
    // Add simple animation delay for grid items
    const cards = document.querySelectorAll('.event-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('animate__animated', 'animate__fadeInUp');
    });
=======
    try {
        const data = await window.VitaNovaApi.get('/events/upcoming');
        const events = data.events || [];

        if (!events.length) return;

        grid.innerHTML = events
          .map(
            (event) => `
            <div class="event-card" data-event-id="${event.id}">
                <div class="event-image">
                    <img src="${escapeHtml(event.image)}" alt="${escapeHtml(event.title)}">
                </div>
                <div class="event-details">
                    <span class="event-category">${escapeHtml(event.category)}</span>
                    <h3>${escapeHtml(event.title)}</h3>
                    <p>${escapeHtml(event.description)}</p>
                    <div class="event-meta">
                        <span><i class="fas fa-clock"></i> Submission: ${escapeHtml(event.submission_deadline || "-")}</span>
                        <span><i class="fas fa-calendar-alt"></i> Event: ${escapeHtml(event.event_date || "-")}</span>
                    </div>
                    <button type="button" class="btn-event" onclick="openEventRegisterModal(${event.id}, '${encodeURIComponent(event.title)}')">Register Now <i class="fas fa-arrow-right"></i></button>
                </div>
            </div>
        `,
          )
          .join("");

        appendRegisterModal();

        const cards = document.querySelectorAll('.event-card');
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            card.classList.add('animate__animated', 'animate__fadeInUp');
        });
    } catch (error) {
        console.error('Unable to load events:', error);
    }
>>>>>>> Stashed changes
});
