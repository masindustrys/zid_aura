/**
 * Zid Aura Theme - Main JavaScript
 * Handles all interactive functionality and theme features
 */

class ZidAuraTheme {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initMobileMenu();
        this.initSearch();
        this.initCarousels();
        this.initProductCards();
        this.initCartDrawer();
        this.initQuickView();
        this.initLazyLoading();
        this.initDarkMode();
        this.initA11y();
        
        // Initialize after DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupTheme();
            });
        } else {
            this.setupTheme();
        }
    }

    setupEventListeners() {
        // Global click handler for delegated events
        document.addEventListener('click', (e) => {
            if (e.target.closest('.mobile-menu-toggle')) {
                this.toggleMobileMenu();
            }
            
            if (e.target.closest('.mobile-nav-close')) {
                this.closeMobileMenu();
            }
            
            if (e.target.closest('.mobile-submenu-toggle')) {
                this.toggleMobileSubmenu(e.target.closest('.mobile-nav-item'));
            }
            
            if (e.target.closest('.quick-view-btn')) {
                e.preventDefault();
                this.openQuickView(e.target.closest('.quick-view-btn'));
            }
            
            if (e.target.closest('.wishlist-btn')) {
                e.preventDefault();
                this.toggleWishlist(e.target.closest('.wishlist-btn'));
            }
            
            if (e.target.closest('.compare-btn')) {
                e.preventDefault();
                this.toggleCompare(e.target.closest('.compare-btn'));
            }
            
            if (e.target.closest('#cart-toggle')) {
                e.preventDefault();
                this.toggleCartDrawer();
            }
        });

        // Handle window resize
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));

        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }

    setupTheme() {
        this.updateCartCount();
        this.initProductVariants();
        this.initNewsletterForm();
        
        // Announce theme ready
        document.dispatchEvent(new CustomEvent('theme:ready'));
    }

    // Mobile Menu Functions
    initMobileMenu() {
        this.mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
        this.mobileNav = document.getElementById('mobile-nav');
        
        if (this.mobileMenuOverlay) {
            this.mobileMenuOverlay.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        }
    }

    toggleMobileMenu() {
        const isOpen = this.mobileNav?.classList.contains('active');
        
        if (isOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    openMobileMenu() {
        if (this.mobileNav && this.mobileMenuOverlay) {
            this.mobileNav.classList.add('active');
            this.mobileMenuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Focus first focusable element
            const firstFocusable = this.mobileNav.querySelector('a, button, input, select, textarea');
            if (firstFocusable) {
                firstFocusable.focus();
            }
        }
    }

    closeMobileMenu() {
        if (this.mobileNav && this.mobileMenuOverlay) {
            this.mobileNav.classList.remove('active');
            this.mobileMenuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    toggleMobileSubmenu(item) {
        if (!item) return;
        
        const isActive = item.classList.contains('active');
        
        // Close all other submenus
        document.querySelectorAll('.mobile-nav-item.active').forEach(activeItem => {
            if (activeItem !== item) {
                activeItem.classList.remove('active');
            }
        });
        
        // Toggle current submenu
        item.classList.toggle('active', !isActive);
    }

    // Search Functions
    initSearch() {
        const searchInput = document.querySelector('.search-input');
        const searchSuggestions = document.getElementById('search-suggestions');
        
        if (searchInput && searchSuggestions) {
            searchInput.addEventListener('input', this.debounce((e) => {
                this.handleSearchInput(e.target.value, searchSuggestions);
            }, 300));
            
            searchInput.addEventListener('focus', () => {
                if (searchInput.value.trim()) {
                    searchSuggestions.style.display = 'block';
                }
            });
            
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.header-search')) {
                    searchSuggestions.style.display = 'none';
                }
            });
        }
    }

    async handleSearchInput(query, suggestionsContainer) {
        if (query.length < 2) {
            suggestionsContainer.style.display = 'none';
            return;
        }

        try {
            const response = await fetch(`/search/suggest.json?q=${encodeURIComponent(query)}&resources[type]=product&resources[limit]=5`);
            const data = await response.json();
            
            this.displaySearchSuggestions(data.resources.results.products, suggestionsContainer);
        } catch (error) {
            console.error('Search error:', error);
        }
    }

    displaySearchSuggestions(products, container) {
        if (!products || products.length === 0) {
            container.style.display = 'none';
            return;
        }

        const suggestionsHTML = products.map(product => `
            <a href="${product.url}" class="search-suggestion">
                <img src="${product.featured_image}" alt="${product.title}" width="40" height="40">
                <div class="suggestion-content">
                    <div class="suggestion-title">${product.title}</div>
                    <div class="suggestion-price">${this.formatMoney(product.price)}</div>
                </div>
            </a>
        `).join('');

        container.innerHTML = suggestionsHTML;
        container.style.display = 'block';
    }

    // Carousel Functions
    initCarousels() {
        document.querySelectorAll('[data-carousel]').forEach(carousel => {
            this.setupCarousel(carousel);
        });
    }

    setupCarousel(carousel) {
        const track = carousel.querySelector('.products-carousel-track');
        const prevBtn = carousel.querySelector('.carousel-prev');
        const nextBtn = carousel.querySelector('.carousel-next');
        const slides = carousel.querySelectorAll('.carousel-slide');
        
        if (!track || !slides.length) return;

        let currentIndex = 0;
        const slideWidth = slides[0].offsetWidth + 24; // Include gap
        const visibleSlides = Math.floor(carousel.offsetWidth / slideWidth);
        const maxIndex = Math.max(0, slides.length - visibleSlides);

        const updateCarousel = () => {
            const translateX = currentIndex * slideWidth * -1;
            track.style.transform = `translateX(${translateX}px)`;
            
            if (prevBtn) prevBtn.disabled = currentIndex === 0;
            if (nextBtn) nextBtn.disabled = currentIndex >= maxIndex;
        };

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (currentIndex > 0) {
                    currentIndex--;
                    updateCarousel();
                }
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (currentIndex < maxIndex) {
                    currentIndex++;
                    updateCarousel();
                }
            });
        }

        updateCarousel();
    }

    // Product Card Functions
    initProductCards() {
        document.querySelectorAll('.product-form').forEach(form => {
            form.addEventListener('submit', (e) => {
                this.handleAddToCart(e);
            });
        });

        document.querySelectorAll('.variant-select').forEach(select => {
            select.addEventListener('change', (e) => {
                this.handleVariantChange(e.target);
            });
        });
    }

    async handleAddToCart(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const button = form.querySelector('.add-to-cart-btn');
        
        if (!button) return;

        const originalText = button.textContent;
        button.disabled = true;
        button.textContent = window.theme?.translations?.adding || 'Adding...';

        try {
            const response = await fetch('/cart/add.js', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                this.updateCartCount();
                this.showCartSuccess(data);
                
                // Open cart drawer if enabled
                if (window.theme?.settings?.cartType === 'drawer') {
                    this.openCartDrawer();
                }
            } else {
                throw new Error('Failed to add to cart');
            }
        } catch (error) {
            console.error('Add to cart error:', error);
            this.showCartError();
        } finally {
            button.disabled = false;
            button.textContent = originalText;
        }
    }

    handleVariantChange(select) {
        const form = select.closest('.product-form');
        if (!form) return;

        const formData = new FormData(form);
        const variantId = this.getSelectedVariantId(form);
        
        if (variantId) {
            form.querySelector('input[name="id"]').value = variantId;
            this.updateProductPrice(form, variantId);
        }
    }

    getSelectedVariantId(form) {
        // This would need to be customized based on your variant selection logic
        // For now, return the current value
        return form.querySelector('input[name="id"]')?.value;
    }

    updateProductPrice(form, variantId) {
        // Update price display based on selected variant
        // Implementation depends on how variant data is available
    }

    // Cart Functions
    initCartDrawer() {
        this.cartDrawer = document.getElementById('cart-drawer');
        
        if (this.cartDrawer) {
            this.cartDrawer.addEventListener('click', (e) => {
                if (e.target === this.cartDrawer) {
                    this.closeCartDrawer();
                }
            });
        }
    }

    toggleCartDrawer() {
        const isOpen = this.cartDrawer?.classList.contains('active');
        
        if (isOpen) {
            this.closeCartDrawer();
        } else {
            this.openCartDrawer();
        }
    }

    async openCartDrawer() {
        if (!this.cartDrawer) return;

        try {
            const response = await fetch('/cart.js');
            const cartData = await response.json();
            
            this.renderCartDrawer(cartData);
            this.cartDrawer.classList.add('active');
            document.body.style.overflow = 'hidden';
        } catch (error) {
            console.error('Cart drawer error:', error);
        }
    }

    closeCartDrawer() {
        if (this.cartDrawer) {
            this.cartDrawer.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    renderCartDrawer(cartData) {
        // Render cart drawer content
        // This would need to be implemented based on your cart structure
    }

    async updateCartCount() {
        try {
            const response = await fetch('/cart.js');
            const cartData = await response.json();
            
            document.querySelectorAll('.cart-count').forEach(el => {
                el.textContent = cartData.item_count;
            });
            
            document.querySelectorAll('.cart-total').forEach(el => {
                el.textContent = this.formatMoney(cartData.total_price);
            });
        } catch (error) {
            console.error('Cart update error:', error);
        }
    }

    // Quick View Functions
    initQuickView() {
        this.quickViewModal = document.getElementById('quick-view-modal');
        
        if (this.quickViewModal) {
            this.quickViewModal.addEventListener('click', (e) => {
                if (e.target === this.quickViewModal) {
                    this.closeQuickView();
                }
            });
        }
    }

    async openQuickView(button) {
        if (!this.quickViewModal) return;

        const productUrl = button.dataset.productUrl;
        if (!productUrl) return;

        try {
            const response = await fetch(`${productUrl}?view=quick`);
            const html = await response.text();
            
            this.quickViewModal.innerHTML = html;
            this.quickViewModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Reinitialize product form in quick view
            this.initProductCards();
        } catch (error) {
            console.error('Quick view error:', error);
        }
    }

    closeQuickView() {
        if (this.quickViewModal) {
            this.quickViewModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // Wishlist Functions
    toggleWishlist(button) {
        const productId = button.dataset.productId;
        if (!productId) return;

        const isActive = button.classList.contains('active');
        
        if (isActive) {
            this.removeFromWishlist(productId, button);
        } else {
            this.addToWishlist(productId, button);
        }
    }

    addToWishlist(productId, button) {
        // Implement wishlist add logic
        button.classList.add('active');
        this.updateWishlistCount(1);
        this.showNotification('Added to wishlist');
    }

    removeFromWishlist(productId, button) {
        // Implement wishlist remove logic
        button.classList.remove('active');
        this.updateWishlistCount(-1);
        this.showNotification('Removed from wishlist');
    }

    updateWishlistCount(change) {
        document.querySelectorAll('.wishlist-count').forEach(el => {
            const current = parseInt(el.textContent) || 0;
            el.textContent = Math.max(0, current + change);
        });
    }

    // Compare Functions
    toggleCompare(button) {
        const productId = button.dataset.productId;
        if (!productId) return;

        const isActive = button.classList.contains('active');
        
        if (isActive) {
            this.removeFromCompare(productId, button);
        } else {
            this.addToCompare(productId, button);
        }
    }

    addToCompare(productId, button) {
        // Implement compare add logic
        button.classList.add('active');
        this.updateCompareCount(1);
        this.showNotification('Added to compare');
    }

    removeFromCompare(productId, button) {
        // Implement compare remove logic
        button.classList.remove('active');
        this.updateCompareCount(-1);
        this.showNotification('Removed from compare');
    }

    updateCompareCount(change) {
        document.querySelectorAll('.compare-count').forEach(el => {
            const current = parseInt(el.textContent) || 0;
            el.textContent = Math.max(0, current + change);
        });
    }

    // Lazy Loading
    initLazyLoading() {
        if (!window.theme?.settings?.lazyLoad) return;

        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.dataset.src;
                    
                    if (src) {
                        img.src = src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Dark Mode
    initDarkMode() {
        const darkModeToggle = document.querySelector('[data-dark-mode-toggle]');
        
        if (darkModeToggle) {
            darkModeToggle.addEventListener('click', () => {
                this.toggleDarkMode();
            });
        }

        // Check for saved preference or system preference
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
            this.enableDarkMode();
        }
    }

    toggleDarkMode() {
        const isDark = document.body.dataset.theme === 'dark';
        
        if (isDark) {
            this.disableDarkMode();
        } else {
            this.enableDarkMode();
        }
    }

    enableDarkMode() {
        document.body.dataset.theme = 'dark';
        localStorage.setItem('theme', 'dark');
    }

    disableDarkMode() {
        document.body.dataset.theme = 'light';
        localStorage.setItem('theme', 'light');
    }

    // Accessibility
    initA11y() {
        // Handle focus management for dropdowns
        document.querySelectorAll('.nav-item').forEach(item => {
            const link = item.querySelector('.nav-link');
            const dropdown = item.querySelector('.dropdown-menu');
            
            if (link && dropdown) {
                link.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        const firstLink = dropdown.querySelector('a');
                        if (firstLink) firstLink.focus();
                    }
                });
            }
        });

        // Announce dynamic content changes
        this.createLiveRegion();
    }

    createLiveRegion() {
        if (document.getElementById('live-region')) return;

        const liveRegion = document.createElement('div');
        liveRegion.id = 'live-region';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.style.position = 'absolute';
        liveRegion.style.left = '-10000px';
        liveRegion.style.width = '1px';
        liveRegion.style.height = '1px';
        liveRegion.style.overflow = 'hidden';
        
        document.body.appendChild(liveRegion);
    }

    announceToScreenReader(message) {
        const liveRegion = document.getElementById('live-region');
        if (liveRegion) {
            liveRegion.textContent = message;
        }
    }

    // Newsletter
    initNewsletterForm() {
        const newsletterForm = document.querySelector('.newsletter-form');
        
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                this.handleNewsletterSubmit(e);
            });
        }
    }

    async handleNewsletterSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');
        
        if (submitBtn) {
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Subscribing...';
            
            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData
                });
                
                if (response.ok) {
                    this.showNotification('Successfully subscribed to newsletter!');
                    form.reset();
                } else {
                    throw new Error('Subscription failed');
                }
            } catch (error) {
                console.error('Newsletter error:', error);
                this.showNotification('Failed to subscribe. Please try again.', 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        }
    }

    // Utility Functions
    debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    }

    formatMoney(cents) {
        const amount = cents / 100;
        return new Intl.NumberFormat(window.theme?.shop?.locale || 'en-US', {
            style: 'currency',
            currency: window.theme?.shop?.currency || 'USD'
        }).format(amount);
    }

    showNotification(message, type = 'success') {
        // Create and show notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
        
        this.announceToScreenReader(message);
    }

    showCartSuccess(data) {
        this.showNotification(`Added ${data.product_title} to cart`);
    }

    showCartError() {
        this.showNotification('Failed to add item to cart', 'error');
    }

    closeAllModals() {
        this.closeMobileMenu();
        this.closeCartDrawer();
        this.closeQuickView();
    }

    handleResize() {
        // Reinitialize carousels on resize
        this.initCarousels();
    }

    // Product Variants
    initProductVariants() {
        document.querySelectorAll('[data-product-form]').forEach(form => {
            this.setupProductVariants(form);
        });
    }

    setupProductVariants(form) {
        const selects = form.querySelectorAll('.variant-select');
        
        selects.forEach(select => {
            select.addEventListener('change', () => {
                this.updateSelectedVariant(form);
            });
        });
        
        // Initialize with current selection
        this.updateSelectedVariant(form);
    }

    updateSelectedVariant(form) {
        const selects = form.querySelectorAll('.variant-select');
        const selectedOptions = Array.from(selects).map(select => select.value);
        
        // Find matching variant (this would need product variant data)
        // For now, just update the hidden input with current value
        const hiddenInput = form.querySelector('input[name="id"]');
        if (hiddenInput && selectedOptions.length > 0) {
            // Update variant ID based on selected options
            // This requires product variant data to be available
        }
    }
}

// Initialize theme when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.zidAuraTheme = new ZidAuraTheme();
    });
} else {
    window.zidAuraTheme = new ZidAuraTheme();
}