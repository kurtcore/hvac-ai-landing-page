// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// CTA button click handlers
const ctaButtons = document.querySelectorAll('.cta-button, .cta-button-large');
ctaButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Replace this with your actual booking/demo scheduling logic
        alert('Demo booking form would open here. Integrate with Calendly, HubSpot, or your preferred scheduling tool.');

        // Example: Open Calendly or redirect to booking page
        // window.open('https://calendly.com/your-link', '_blank');
        // window.location.href = '/book-demo';
    });
});

// Scroll animations (fade in elements as they come into view)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections for animation
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// Add fade-in class style
const style = document.createElement('style');
style.textContent = `
    .fade-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

// Navbar scroll effect
let lastScroll = 0;
const nav = document.querySelector('.nav');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        nav.style.background = 'rgba(15, 23, 42, 0.95)';
        nav.style.backdropFilter = 'blur(10px)';
        nav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
        nav.style.background = 'transparent';
        nav.style.backdropFilter = 'none';
        nav.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
});

// Track CTA clicks (integrate with your analytics)
function trackCTAClick(location) {
    console.log(`CTA clicked from: ${location}`);

    // Example: Send to Google Analytics
    // gtag('event', 'cta_click', {
    //     'event_category': 'engagement',
    //     'event_label': location
    // });

    // Example: Send to Facebook Pixel
    // fbq('track', 'Lead', {
    //     content_name: location
    // });
}

// Add tracking to all CTA buttons
document.querySelectorAll('.cta-button').forEach((btn, index) => {
    btn.addEventListener('click', () => trackCTAClick(`nav-cta-${index + 1}`));
});

document.querySelectorAll('.cta-button-large').forEach((btn, index) => {
    btn.addEventListener('click', () => trackCTAClick(`section-cta-${index + 1}`));
});

// ROI Calculator Functionality
function calculateROI() {
    const monthlyCalls = parseInt(document.getElementById('monthly-calls').value) || 0;
    const avgJobValue = parseInt(document.getElementById('avg-job-value').value) || 0;
    const missedRate = parseInt(document.getElementById('missed-rate').value) || 0;

    const missedCallsMonthly = monthlyCalls * (missedRate / 100);
    const monthlyLoss = missedCallsMonthly * avgJobValue;
    const annualLoss = monthlyLoss * 12;
    const recoveryRate = 0.8; // 80% recovery rate from our solution
    const recoveredAnnual = annualLoss * recoveryRate;
    const investment = 5997; // Annual investment
    const roiMultiple = recoveredAnnual > 0 ? (recoveredAnnual / investment).toFixed(1) : 0;

    // Update DOM with formatted values
    document.getElementById('monthly-loss').textContent = '$' + monthlyLoss.toLocaleString();
    document.getElementById('annual-loss').textContent = '$' + annualLoss.toLocaleString();
    document.getElementById('recovered-annual').textContent = '$' + recoveredAnnual.toLocaleString();
    document.getElementById('roi-multiple').textContent = roiMultiple + '×';

    // Add highlight effect when values change
    const resultsElements = ['monthly-loss', 'annual-loss', 'recovered-annual', 'roi-multiple'];
    resultsElements.forEach(id => {
        const element = document.getElementById(id).parentElement;
        element.style.transform = 'scale(1.05)';
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 200);
    });
}

// Initialize calculator when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    const calculatorInputs = ['monthly-calls', 'avg-job-value', 'missed-rate'];
    calculatorInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', calculateROI);
        }
    });
    // Run initial calculation with default values
    calculateROI();
});
