/**
 * Antoni Pitchaikan Personal Website
 * Multi-page Transition Manager
 */

class AntoniWebsite {
    constructor() {
        this.init();
    }

    init() {
        // 1. Page Entrance Animation (Fade In)
        this.animatePageEntrance();

        // 2. Setup Navigation Listeners
        this.setupNavigation();

        // 3. Setup Global Effects (Scroll triggers, etc.)
        this.setupGlobalEffects();

        // 4. Update Footer Year
        this.updateCopyrightYear();

        // 5. Initialize Page Specific Features
        this.initPageSpecificFeatures();
    }

    animatePageEntrance() {
        // Ensure body is visible (in case CSS hid it)
        document.body.style.visibility = 'visible';

        // Fade in animation using GSAP
        if (typeof gsap !== 'undefined') {
            gsap.fromTo("body",
                { opacity: 0 },
                { opacity: 1, duration: 0.8, ease: "power2.out", delay: 0.1 }
            );
        } else {
            document.body.style.opacity = 1;
        }
    }

    setupNavigation() {
        // Handle all link clicks for smooth transitions
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');

            // Ignore if not a link, or has target="_blank", or is a mailto/tel link
            if (!link || link.target === '_blank' ||
                link.getAttribute('href').startsWith('mailto:') ||
                link.getAttribute('href').startsWith('tel:')) return;

            const href = link.getAttribute('href');

            // Ignore empty links or hash links on the same page (unless special handling needed)
            if (!href || href === '#') return;

            // 1. Handle Anchor Links (Scroll on same page)
            if (href.startsWith('#')) {
                // If it's a hash link on the current page
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
                return;
            }

            // 2. Handle Internal Page Navigation (e.g., projects.html)
            // Check if it's a relative path or same domain
            if (this.isInternalLink(link.href)) {
                e.preventDefault();
                this.animatePageExit(href);
            }
        });
    }

    isInternalLink(url) {
        // Simple check if the link belongs to the same site
        return url.includes(window.location.origin) || !url.startsWith('http');
    }

    animatePageExit(url) {
        // Fade out animation before moving to next page
        if (typeof gsap !== 'undefined') {
            gsap.to("body", {
                opacity: 0,
                duration: 0.5,
                ease: "power2.in",
                onComplete: () => {
                    window.location.assign(url);
                }
            });
        } else {
            // Fallback if GSAP isn't loaded
            window.location.assign(url);
        }
    }

    setupGlobalEffects() {
        // Register GSAP ScrollTrigger if available
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        }
    }

    updateCopyrightYear() {
        const yearSpan = document.querySelector('.current-year');
        const currentYear = new Date().getFullYear();
        if (yearSpan) {
            yearSpan.textContent = currentYear;
        } else {
            // Fallback search in footer
            const footer = document.querySelector('footer p');
            if (footer && footer.innerHTML.includes('202')) {
                footer.innerHTML = footer.innerHTML.replace(/202\d/, currentYear);
            }
        }
    }

    initPageSpecificFeatures() {
        // Any specific initialization logic per page if needed
        // Since we are doing full page reloads, most logic is in the HTML's <script> blocks
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new AntoniWebsite();
});