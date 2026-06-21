// Activities Page Specific Scripts
document.addEventListener('DOMContentLoaded', async () => {
    const grid = document.querySelector('.activities-grid');
    if (!grid) return;

    if (!window.VitaNovaApi) {
        grid.innerHTML = '<p style="text-align:center;color:#b42318;padding:20px;">API client not loaded. Please refresh the page.</p>';
        return;
    }

    try {
        const data = await window.VitaNovaApi.get('/events/upcoming');
        const events = data.events || [];

        if (!events.length) {
            grid.innerHTML = '<p style="text-align:center;color:#3f3f46;padding:20px;">No upcoming activities available right now.</p>';
            return;
        }

        grid.innerHTML = events.map((event) => {
            const title = escapeHtml(event.title || 'Event');
            const category = escapeHtml(event.category || 'Activity');
            const description = escapeHtml(event.description || '');
            const imageUrl = escapeHtml(resolveEventImage(event.image_url || event.image));
            
            // Format dates
            const submission = formatDate(event.submission_deadline || 'MOD');
            const eventDate = formatDate(event.event_date || '-');
            
            const eventId = Number(event.id || 0);

            return `
                <div class="event-card" data-event-id="${eventId}">
                    <div class="event-card-inner">
                        <div class="event-image">
                            <img src="${imageUrl}" alt="${title}" onerror="this.src='logos/main_logo.jpeg'">
                        </div>
                        <div class="event-content">
                            <span class="event-category">${category}</span>
                            <h3 class="event-title">${title}</h3>
                            <p class="event-description">${description}</p>
                            <div class="event-meta">
                                <span class="event-meta-item">
                                    <i class="fas fa-calendar-alt"></i> Event date: ${eventDate}
                                </span>
                                <span class="event-meta-item">
                                    <i class="fas fa-clock"></i> Last date of Reg: ${submission}
                                </span>
                            </div>
                            <button type="button" class="btn-event" onclick="openEventRegisterModal(${eventId}, '${encodeURIComponent(event.title || '')}')">
                                Register Now <i class="fas fa-arrow-right"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
                            
        appendRegisterModal();
        applyCardAnimations();
    } catch (error) {
        console.error('Unable to load events:', error);
        const reason = error?.data?.message || error?.message || 'Unable to load activities from backend.';
        grid.innerHTML = `<p style="text-align:center;color:#b42318;padding:20px;">${escapeHtml(reason)}</p>`;
    }
});

// Function to format date from YYYY-MM-DD to DD-MM-YYYY
function formatDate(dateString) {
    if (!dateString || dateString === '-' || dateString === 'MOD') {
        return dateString || '-';
    }
    
    try {
        // If date is already in DD-MM-YYYY format, return as is
        if (/^\d{2}-\d{2}-\d{4}$/.test(dateString)) {
            return dateString;
        }
        
        // Parse YYYY-MM-DD format
        const parts = dateString.split('-');
        if (parts.length === 3) {
            const year = parts[0];
            const month = parts[1];
            const day = parts[2];
            
            // Validate if it's a valid date
            if (year.length === 4 && month.length === 2 && day.length === 2) {
                return `${day}-${month}-${year}`;
            }
        }
        
        // If format doesn't match, try creating a Date object
        const date = new Date(dateString);
        if (!isNaN(date.getTime())) {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}-${month}-${year}`;
        }
        
        // Return original if all parsing fails
        return dateString;
    } catch (error) {
        console.warn('Error formatting date:', dateString, error);
        return dateString;
    }
}

function applyCardAnimations() {
    const cards = document.querySelectorAll('.event-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('animate__animated', 'animate__fadeInUp');
    });
}

function resolveEventImage(value) {
    const raw = String(value || '').trim();
    if (!raw) {
        return 'logos/main_logo.jpeg';
    }

    if (/^https?:\/\//i.test(raw)) {
        return raw;
    }

    if (raw.startsWith('/')) {
        return `https://backend.vnias.org${raw}`;
    }

    if (raw.startsWith('storage/')) {
        return `https://backend.vnias.org/${raw}`;
    }

    return raw;
}

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
    const title = decodeURIComponent(titleEncoded || '');

    const nanotechnology =
      "International Training Workshop on Nanotechnology Applications in Modern Sciences";

    if (
      title === nanotechnology ||
      "International Training Workshop on Nanotechnology Applications in Modern Sciences"
    ) {
      window.open("https://forms.gle/qzCEzxVpErbyCfsU8", "_blank");
      return;
    }
    
    const modal = document.getElementById('eventRegisterModal');
    document.getElementById('eventIdField').value = eventId;
    document.getElementById('eventRegisterTitle').textContent = `Event Registration - ${title}`;
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