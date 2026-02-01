// Drawer functions
function openDrawer() {
  document.getElementById("drawer").style.left = "0";
  document.body.style.overflow = "hidden";
}

function closeDrawer() {
  document.getElementById("drawer").style.left = "-320px";
  document.body.style.overflow = "auto";
}

// Smooth scrolling with offset
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');
    
    if (targetId === '#') return;
    
    e.preventDefault();
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
      // Close drawer on mobile
      if (window.innerWidth <= 768) {
        closeDrawer();
      }
      
      // Smooth scroll
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: 'smooth'
      });
      
      // Update active menu
      updateActiveMenu(targetId);
    }
  });
});

// Update active menu
function updateActiveMenu(targetId) {
  document.querySelectorAll('.menu a, .drawer a').forEach(item => {
    item.classList.remove('active');
  });
  
  document.querySelectorAll(`.menu a[href="${targetId}"], .drawer a[href="${targetId}"]`).forEach(item => {
    item.classList.add('active');
  });
}

// Initialize Particles.js
function initParticles() {
  if (typeof particlesJS !== 'undefined') {
    particlesJS('particles', {
      particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: "#2ecc71" },
        shape: { type: "circle" },
        opacity: { value: 0.5, random: true },
        size: { value: 3, random: true },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#2ecc71",
          opacity: 0.2,
          width: 1
        },
        move: {
          enable: true,
          speed: 2,
          direction: "none",
          random: true,
          straight: false,
          out_mode: "out",
          bounce: false
        }
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: { enable: true, mode: "repulse" },
          onclick: { enable: true, mode: "push" }
        }
      }
    });
  }
}

// Initialize Map
function initMap() {
  const map = L.map('map').setView([40.7128, -74.0060], 13);
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 18
  }).addTo(map);
  
  // Custom green marker
  const greenIcon = L.divIcon({
    html: '<i class="fas fa-map-marker-alt" style="color:#2ecc71; font-size: 50px; text-shadow: 0 3px 6px rgba(0,0,0,0.3);"></i>',
    iconSize: [50, 50],
    className: 'custom-marker'
  });
  
  const marker = L.marker([40.7128, -74.0060], { icon: greenIcon }).addTo(map);
  marker.bindPopup(`
    <div style="text-align: center;">
      <h3 style="color: #2ecc71; margin: 0 0 10px 0;">VitaNova Sciences</h3>
      <p style="margin: 0; color: #666;">Science Park, Research District<br>New York, NY 10001</p>
      <button onclick="window.location.href='#contact'" style="background: #2ecc71; color: white; border: none; padding: 8px 16px; border-radius: 5px; margin-top: 10px; cursor: pointer;">Get Directions</button>
    </div>
  `).openPopup();
}

// Animate on scroll
function animateOnScroll() {
  const elements = document.querySelectorAll('.animate-on-scroll');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  });
  
  elements.forEach(el => observer.observe(el));
}

// Magnetic button effect
function initMagneticButtons() {
  const buttons = document.querySelectorAll('.btn-magnetic');
  
  buttons.forEach(btn => {
    btn.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const deltaX = (x - centerX) / centerX;
      const deltaY = (y - centerY) / centerY;
      
      this.style.transform = `translate(${deltaX * 10}px, ${deltaY * 10}px)`;
    });
    
    btn.addEventListener('mouseleave', function() {
      this.style.transform = 'translate(0, 0)';
    });
  });
}

// Form submission
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(this);
      const data = Object.fromEntries(formData);
      
      // Show success message
      const submitBtn = this.querySelector('.submit-btn');
      const originalText = submitBtn.innerHTML;
      
      submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
      submitBtn.style.background = '#27ae60';
      
      // Reset after 3 seconds
      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.style.background = '';
        form.reset();
      }, 3000);
      
      console.log('Form submitted:', data);
    });
  }
}

// Parallax effect
function initParallax() {
  window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.parallax-bg');
    
    if (parallax) {
      parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
    
    // Update active menu on scroll
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        updateActiveMenu(`#${sectionId}`);
      }
    });
  });
}

// Close drawer when clicking outside
document.addEventListener('click', function(event) {
  const drawer = document.getElementById('drawer');
  const menuIcon = document.querySelector('.menu-icon');
  
  if (window.innerWidth <= 768 && drawer && drawer.style.left === '0px') {
    if (!drawer.contains(event.target) && event.target !== menuIcon) {
      closeDrawer();
    }
  }
});

// Close drawer on ESC
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeDrawer();
  }
});

// Image fallbacks
const images = document.querySelectorAll('img[onerror]');
images.forEach(img => {
  img.addEventListener('error', function() {
    if (this.src.includes('logo')) {
      this.src = 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
    }
  });
});

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', function() {
  // Initialize components
  if (document.getElementById('map')) {
    initMap();
  }
  
  if (document.getElementById('particles')) {
    initParticles();
  }
  
  // Initialize animations and effects
  animateOnScroll();
  initMagneticButtons();
  initContactForm();
  initParallax();
  
  // Add loading animation
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 100);
  
  // Add hover effect to cards
  document.querySelectorAll('.mission-card, .event-card-small').forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });
});