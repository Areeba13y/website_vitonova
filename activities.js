// Activities Page Specific Scripts
document.addEventListener('DOMContentLoaded', async () => {
    const grid = document.querySelector('.activities-grid');
    if (!grid) return;

    try {
        const data = await window.VitaNovaApi.get('/events/upcoming');
        const events = data.events || [];

        if (!events.length) return;

        grid.innerHTML = events.map((event) => `
            <div class="event-card" data-event-id="${event.id}">
                <div class="event-image">
                    <img src="${escapeHtml(event.image_url)}" alt="${escapeHtml(event.title)}">
                </div>
                <div class="event-details">
                    <span class="event-category">${escapeHtml(event.category)}</span>
                    <h3>${escapeHtml(event.title)}</h3>
                    <p>${escapeHtml(event.description)}</p>
                    <div class="event-meta">
                        <span><i class="fas fa-clock"></i> Submission: ${escapeHtml(event.submission_deadline || '-')}</span>
                        <span><i class="fas fa-calendar-alt"></i> Event: ${escapeHtml(event.event_date || '-')}</span>
                    </div>
                    <button type="button" class="btn-event" onclick="openEventRegisterModal(${event.id}, '${encodeURIComponent(event.title)}')">Register Now <i class="fas fa-arrow-right"></i></button>
                </div>
            </div>
        `).join('');

        appendRegisterModal();

        const cards = document.querySelectorAll('.event-card');
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            card.classList.add('animate__animated', 'animate__fadeInUp');
        });
    } catch (error) {
        console.error('Unable to load events:', error);
    }
});

function appendRegisterModal() {
    if (document.getElementById('eventRegisterModal')) return;

    const html = `
    <div id="eventRegisterModal" class="event-modal">
      <div class="event-modal-card">
        <div class="event-modal-head">
            <h3 id="eventRegisterTitle" class="event-modal-title">Event Registration</h3>
            <button type="button" class="event-modal-close" onclick="closeEventRegisterModal()" aria-label="Close form">&times;</button>
        </div>
        <form id="eventRegisterForm" class="event-register-form">
          <input type="hidden" id="eventIdField">
          <div class="event-form-grid">
            <label class="event-form-group">
                <span class="event-form-label">Email</span>
                <input class="event-form-input" name="email" type="email" placeholder="you@example.com" required>
            </label>
            <label class="event-form-group">
                <span class="event-form-label">Name</span>
                <input class="event-form-input" name="name" placeholder="Your full name" required>
            </label>
            <label class="event-form-group">
                <span class="event-form-label">Contact</span>
                <input class="event-form-input" name="contact" placeholder="+92..." required>
            </label>
            <label class="event-form-group">
                <span class="event-form-label">University Name</span>
                <input class="event-form-input" name="university_name" placeholder="University / Institute" required>
            </label>
            <label class="event-form-group">
                <span class="event-form-label">Semester and Degree</span>
                <input class="event-form-input" name="semester_degree" placeholder="e.g. 6th Semester BSCS" required>
            </label>
            <label class="event-form-group">
                <span class="event-form-label">Country</span>
                <input class="event-form-input" name="country" placeholder="Country name" required>
            </label>
            <div class="event-form-group event-form-group-full">
                <span class="event-form-label">Which of the following suits your interest the most?</span>
                <div class="event-options">
                    <label class="event-option"><input type="radio" name="interests" value="Scholarship Aspirant" required> Scholarship Aspirant</label>
                    <label class="event-option"><input type="radio" name="interests" value="Lead Ambassador" required> Lead Ambassador</label>
                    <label class="event-option"><input type="radio" name="interests" value="Member" required> Member</label>
                    <label class="event-option"><input type="radio" name="interests" value="Research Team" required> Research Team</label>
                </div>
            </div>
            <div class="event-form-group event-form-group-full">
                <span class="event-form-label">Soft Skills</span>
                <div class="event-options">
                    <label class="event-option"><input type="checkbox" name="soft_skills[]" value="Graphic Designing"> Graphic Designing</label>
                    <label class="event-option"><input type="checkbox" name="soft_skills[]" value="Video Editor"> Video Editor</label>
                    <label class="event-option"><input type="checkbox" name="soft_skills[]" value="Social Media Handling"> Social Media Handling</label>
                    <label class="event-option"><input type="checkbox" name="soft_skills[]" value="Web Development"> Web development</label>
                    <label class="event-option"><input type="checkbox" name="soft_skills[]" value="Scientific Writing"> Scientific Writing</label>
                    <label class="event-option"><input type="checkbox" name="soft_skills[]" value="N/A"> N/A</label>
                </div>
            </div>
            <div class="event-form-group event-form-group-full">
                <span class="event-form-label">Interpersonal Skills</span>
                <div class="event-options">
                    <label class="event-option"><input type="checkbox" name="interpersonal_skills[]" value="Leadership skills"> Leadership skills</label>
                    <label class="event-option"><input type="checkbox" name="interpersonal_skills[]" value="Communication skills"> Communication skills</label>
                    <label class="event-option"><input type="checkbox" name="interpersonal_skills[]" value="Event Management"> Event Management</label>
                </div>
            </div>
            <label class="event-form-group event-form-group-full">
                <span class="event-form-label">Why do you want to join?</span>
                <textarea class="event-form-textarea" name="reason_to_join" placeholder="Tell us your motivation..." required></textarea>
            </label>
          </div>
          <div class="event-form-actions">
            <button type="button" class="event-btn-secondary" onclick="closeEventRegisterModal()">Cancel</button>
            <button type="submit" class="event-btn-primary">Submit Registration</button>
          </div>
        </form>
      </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', html);

    document.getElementById('eventRegisterForm').addEventListener('submit', async function (e) {
        e.preventDefault();
        const eventId = document.getElementById('eventIdField').value;
        const formData = new FormData(this);
        const submitBtn = this.querySelector('.event-btn-primary');
        const originalBtnHtml = submitBtn.innerHTML;

        const payload = {
            email: formData.get('email'),
            name: formData.get('name'),
            contact: formData.get('contact'),
            university_name: formData.get('university_name'),
            semester_degree: formData.get('semester_degree'),
            country: formData.get('country'),
            interests: formData.get('interests'),
            soft_skills: formData.getAll('soft_skills[]'),
            interpersonal_skills: formData.getAll('interpersonal_skills[]'),
            reason_to_join: formData.get('reason_to_join'),
        };

        if (!payload.soft_skills.length) {
            window.VitaNovaUI?.toastError('Please select at least one soft skill.');
            return;
        }

        if (!payload.interpersonal_skills.length) {
            window.VitaNovaUI?.toastError('Please select at least one interpersonal skill.');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

        try {
            const res = await window.VitaNovaApi.postJson(`/events/${eventId}/register`, payload);
            window.VitaNovaUI?.toastSuccess(res.message || 'Registration submitted successfully.');
            this.reset();
            closeEventRegisterModal();
        } catch (error) {
            let msg = error.message;
            if (error.data && error.data.errors) {
                msg = Object.values(error.data.errors).flat().join('\n');
            }
            window.VitaNovaUI?.toastError(msg || 'Unable to submit registration.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHtml;
        }
    });

    const modal = document.getElementById('eventRegisterModal');
    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            closeEventRegisterModal();
        }
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeEventRegisterModal();
        }
    });
}

window.openEventRegisterModal = function (eventId, titleEncoded) {
    const modal = document.getElementById('eventRegisterModal');
    document.getElementById('eventIdField').value = eventId;
    document.getElementById('eventRegisterTitle').textContent = `Event Registration - ${decodeURIComponent(titleEncoded || '')}`;
    modal.style.display = 'block';
};

window.closeEventRegisterModal = function () {
    const modal = document.getElementById('eventRegisterModal');
    if (modal) modal.style.display = 'none';
};

function escapeHtml(value) {
    return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
