// Collaboration Page Specific Logic
document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('collaborationsContainer') || document.querySelector('.page-content .container');
    if (!container) return;

    if (!window.VitaNovaApi) {
        container.innerHTML = '<p style="text-align:center;color:#b42318;padding:20px;">API client not loaded. Please refresh the page.</p>';
        return;
    }

    try {
        const data = await window.VitaNovaApi.get('/collaborations');
        const items = data.collaborations || [];

        if (!items.length) {
            container.innerHTML = '<p style="text-align:center;color:#666;">No collaborations available right now.</p>';
            return;
        }

        container.innerHTML = items.map((item, index) => {
            const rep = item.representative_designation && item.representative_name
                ? `<p><strong>${escapeHtml(item.representative_designation)}:</strong> ${escapeHtml(item.representative_name)}</p>`
                : '';

            return `
                <div id="collab-${item.id}" class="detail-card animated">
                    <div class="detail-icon">
                        <img src="${escapeHtml(typeof resolveLogoUrl === 'function' ? resolveLogoUrl(item.logo_url) : item.logo_url)}" alt="${escapeHtml(item.organization_name)} Logo" class="detail-logo" onerror="this.src='logos/main_logo.jpeg'">
                    </div>
                    <div class="detail-info">
                        <h2>${escapeHtml(item.organization_name)}</h2>
                        <p class="subtitle">${escapeHtml(item.subtitle || '')}</p>
                        <div class="detail-text">
                            <p>${escapeHtml(item.description || '')}</p>
                            ${rep}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Collaboration load error:', error);
        const reason = error?.data?.message || error?.message || 'Unable to load collaborations from API.';
        container.innerHTML = `<p style="text-align:center;color:#b42318;padding:20px;">${escapeHtml(reason)}</p>`;
    }
});

function escapeHtml(value) {
    return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
