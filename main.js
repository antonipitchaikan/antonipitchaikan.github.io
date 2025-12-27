/**
 * Antoni Pitchaikan Personal Website
 * Main JavaScript Module for SPA Functionality
 */

class AntoniWebsite {
    constructor() {
        this.currentPage = this.getCurrentPage();
        this.isAnimating = false;
        this.init();
    }

    init() {
        this.setupRouting();
        this.setupNavigation();
        this.setupScrollEffects();
        this.setupGlobalAnimations();
        this.setupLazyLoading();
        this.setupAccessibility();
        
        // Initialize page-specific functionality
        this.initPageSpecificFeatures();
    }

    getCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('projects.html')) return 'projects';
        if (path.includes('skills.html')) return 'skills';
        if (path.includes('contact.html')) return 'contact';
        return 'home';
    }

    setupRouting() {
        // Handle navigation clicks
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href]');
            if (link && this.isInternalLink(link.href)) {
                e.preventDefault();
                this.navigateTo(link.href);
            }
        });

        // Handle browser back/forward
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.page) {
                this.loadPage(e.state.page, false);
            }
        });
    }

    isInternalLink(href) {
        const url = new URL(href);
        return url.origin === window.location.origin;
    }

    async navigateTo(url) {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        const page = this.getPageFromUrl(url);
        
        // Update navigation state
        this.updateNavigation(page);
        
        // Smooth transition effect
        await this.transitionToPage(page);
        
        // Update history
        window.history.pushState({ page }, '', url);
        
        this.isAnimating = false;
    }

    getPageFromUrl(url) {
        const path = new URL(url).pathname;
        if (path.includes('projects.html')) return 'projects';
        if (path.includes('skills.html')) return 'skills';
        if (path.includes('contact.html')) return 'contact';
        return 'home';
    }

    updateNavigation(activePage) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (this.isPageActive(href, activePage)) {
                link.classList.add('active');
            }
        });
    }

    isPageActive(href, page) {
        if (page === 'home' && (href === 'index.html' || href === '/')) return true;
        if (page === 'projects' && href.includes('projects.html')) return true;
        if (page === 'skills' && href.includes('skills.html')) return true;
        if (page === 'contact' && href.includes('contact.html')) return true;
        return false;
    }

    async transitionToPage(page) {
        // Fade out current content
        await this.fadeOutContent();
        
        // Load new content
        await this.loadPageContent(page);
        
        // Fade in new content
        await this.fadeInContent();
    }

    fadeOutContent() {
        return new Promise(resolve => {
            const mainContent = document.querySelector('main') || document.body;
            anime({
                targets: mainContent,
                opacity: 0,
                duration: 300,
                easing: 'easeOutQuad',
                complete: resolve
            });
        });
    }

    fadeInContent() {
        return new Promise(resolve => {
            const mainContent = document.querySelector('main') || document.body;
            anime({
                targets: mainContent,
                opacity: 1,
                duration: 300,
                easing: 'easeInQuad',
                complete: resolve
            });
        });
    }

    async loadPageContent(page) {
        // This would typically fetch new content via AJAX
        // For now, we'll just update the current page state
        this.currentPage = page;
        this.initPageSpecificFeatures();
    }

    setupNavigation() {
        // Mobile menu toggle
        this.setupMobileMenu();
        
        // Smooth scroll for anchor links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (link) {
                e.preventDefault();
                this.smoothScrollTo(link.getAttribute('href'));
            }
        });
    }

    setupMobileMenu() {
        // Add mobile menu functionality if needed
        const nav = document.querySelector('.nav');
        if (nav) {
            // Mobile menu implementation would go here
        }
    }

    smoothScrollTo(target) {
        const element = document.querySelector(target);
        if (element) {
            const offsetTop = element.offsetTop - 80; // Account for fixed nav
            
            anime({
                targets: document.documentElement,
                scrollTop: offsetTop,
                duration: 800,
                easing: 'easeInOutQuad'
            });
        }
    }

    setupScrollEffects() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, observerOptions);

        // Observe all animatable elements
        const animatableElements = document.querySelectorAll(
            '.fade-in, .slide-in-left, .slide-in-right, .scale-in'
        );
        
        animatableElements.forEach(el => observer.observe(el));
    }

    animateElement(element) {
        const classes = element.classList;
        
        if (classes.contains('fade-in')) {
            anime({
                targets: element,
                opacity: [0, 1],
                translateY: [30, 0],
                duration: 800,
                easing: 'easeOutQuad'
            });
        } else if (classes.contains('slide-in-left')) {
            anime({
                targets: element,
                opacity: [0, 1],
                translateX: [-50, 0],
                duration: 800,
                easing: 'easeOutQuad'
            });
        } else if (classes.contains('slide-in-right')) {
            anime({
                targets: element,
                opacity: [0, 1],
                translateX: [50, 0],
                duration: 800,
                easing: 'easeOutQuad'
            });
        } else if (classes.contains('scale-in')) {
            anime({
                targets: element,
                opacity: [0, 1],
                scale: [0.8, 1],
                duration: 800,
                easing: 'back.out(1.7)'
            });
        }
    }

    setupGlobalAnimations() {
        // Magnetic cursor effect for buttons
        this.setupMagneticButtons();
        
        // Hover effects for cards
        this.setupCardHoverEffects();
        
        // Button click animations
        this.setupButtonAnimations();
    }

    setupMagneticButtons() {
        const magneticButtons = document.querySelectorAll('.cta-button, .submit-button');
        
        magneticButtons.forEach(button => {
            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                anime({
                    targets: button,
                    translateX: x * 0.1,
                    translateY: y * 0.1,
                    duration: 300,
                    easing: 'easeOutQuad'
                });
            });

            button.addEventListener('mouseleave', () => {
                anime({
                    targets: button,
                    translateX: 0,
                    translateY: 0,
                    duration: 300,
                    easing: 'easeOutQuad'
                });
            });
        });
    }

    setupCardHoverEffects() {
        const cards = document.querySelectorAll('.project-card, .timeline-card, .skill-category, .collaboration-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                anime({
                    targets: card,
                    translateY: -4,
                    scale: 1.02,
                    duration: 300,
                    easing: 'easeOutQuad'
                });
            });

            card.addEventListener('mouseleave', () => {
                anime({
                    targets: card,
                    translateY: 0,
                    scale: 1,
                    duration: 300,
                    easing: 'easeOutQuad'
                });
            });
        });
    }

    setupButtonAnimations() {
        const buttons = document.querySelectorAll('.btn, .nav-link, .social-link');
        
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                // Create ripple effect
                const ripple = document.createElement('span');
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    transform: scale(0);
                    pointer-events: none;
                `;
                
                button.style.position = 'relative';
                button.style.overflow = 'hidden';
                button.appendChild(ripple);
                
                anime({
                    targets: ripple,
                    scale: 2,
                    opacity: [1, 0],
                    duration: 600,
                    easing: 'easeOutQuad',
                    complete: () => ripple.remove()
                });
            });
        });
    }

    setupLazyLoading() {
        // Lazy load images
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    setupAccessibility() {
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // Close any open modals
                const activeModal = document.querySelector('.modal.active');
                if (activeModal) {
                    activeModal.classList.remove('active');
                }
            }
            
            // Tab navigation enhancement
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });

        // Reduced motion support
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.style.setProperty('--animation-duration', '0s');
        }
    }

    initPageSpecificFeatures() {
        switch (this.currentPage) {
            case 'home':
                this.initHomePage();
                break;
            case 'projects':
                this.initProjectsPage();
                break;
            case 'skills':
                this.initSkillsPage();
                break;
            case 'contact':
                this.initContactPage();
                break;
        }
    }

    initHomePage() {
        // Typewriter effect is handled in the HTML
        // Timeline animations are handled by ScrollTrigger
        console.log('Home page initialized');
    }

    initProjectsPage() {
        // Project modal functionality is handled in the HTML
        console.log('Projects page initialized');
    }

    initSkillsPage() {
        // Skills radar chart is handled in the HTML
        console.log('Skills page initialized');
    }

    initContactPage() {
        // Contact form is handled in the HTML
        console.log('Contact page initialized');
    }

    // Utility methods
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Initialize the website when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AntoniWebsite();
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AntoniWebsite;
}

// Global utility functions
window.AntoniWebsite = AntoniWebsite;