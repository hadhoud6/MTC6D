// MARBRERIE TUNIS CARTHAGE - Complete JavaScript
// Enhanced with loading screen, navigation scroll, slideshow, and modals

// Global State
let currentState = {
    currentSlide: 0,
    currentProduct: 0,
    isTransitioning: false,
    language: 'fr'
};

// Hero Slideshow Data
const heroSlides = [
    {
        image: "1.jpg",
        title: "L'Élégance Intemporelle",
        subtitle: "Découvrez la qualité et le luxe de nos marbres, extraits et façonnés avec une passion qui traverse les âges."
    },
    {
        image: "2.jpg",
        title: "L'Art du Marbre Tunisien",
        subtitle: "Chaque pierre raconte une histoire millénaire, sculptée par la nature et sublimée par nos artisans."
    },
    {
        image: "3.jpg",
        title: "Excellence & Raffinement",
        subtitle: "Du sol au plafond, nos créations transforment vos espaces en œuvres d'art intemporelles."
    },
    {
        image: "4.jpg",
        title: "Luxe Authentique",
        subtitle: "Matériaux nobles, finitions impeccables, design sophistiqué pour des intérieurs d'exception."
    }
];

// Products Data
const products = [
    {
        id: 1,
        name: "Marbre Blanc Carrara",
        category: "Classique",
        description: "Le marbre blanc de Carrare est synonyme d'élégance pure. Ses veines grises délicates créent un contraste subtil parfait pour les cuisines et salles de bains luxueuses.",
        image: "https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=800&q=85",
        finish: "Poli brillant"
    },
    {
        id: 2,
        name: "Marbre Noir Marquina",
        category: "Contemporain",
        description: "D'un noir profond avec des veines blanches éclatantes, ce marbre espagnol apporte une touche dramatique et sophistiquée à tout espace moderne.",
        image: "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&q=85",
        finish: "Poli mat"
    },
    {
        id: 3,
        name: "Marbre Calacatta Gold",
        category: "Premium",
        description: "Avec ses veines dorées spectaculaires sur fond blanc crème, le Calacatta Gold est le choix ultime pour les projets les plus prestigieux.",
        image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=85",
        finish: "Poli brillant"
    },
    {
        id: 4,
        name: "Marbre Vert Guatemala",
        category: "Exotique",
        description: "Un marbre rare aux nuances vertes profondes et veines blanches, idéal pour créer des points focaux audacieux et naturels.",
        image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=85",
        finish: "Adouci"
    },
    {
        id: 5,
        name: "Marbre Emperador",
        category: "Chaleureux",
        description: "Tons bruns riches avec des veines blanches et dorées, ce marbre espagnol apporte chaleur et sophistication à tout intérieur.",
        image: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&q=85",
        finish: "Poli brillant"
    }
];

// Tool Categories Data
const toolCategories = [
    {
        id: "kitchen",
        name: "Cuisine",
        description: "Visualisez votre cuisine de rêve avec nos marbres premium",
        image: "https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=800&q=85",
        features: ["Plans de travail", "Crédences", "Îlots centraux"]
    },
    {
        id: "livingroom",
        name: "Salon",
        description: "Créez un espace de vie élégant et raffiné",
        image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=85",
        features: ["Revêtements muraux", "Cheminées", "Sols en marbre"]
    },
    {
        id: "table",
        name: "Tables & Mobilier",
        description: "Concevez des pièces uniques pour votre intérieur",
        image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&q=85",
        features: ["Tables à manger", "Tables basses", "Consoles"]
    }
];

// Client Logos Data
const clientLogos = [
    { name: "UIB", image: "uib.png" },
    { name: "BIAT", image: "biat.png" },
    { name: "Attijari Bank", image: "attijeri.png" },
    { name: "Bank de Tunisie", image: "Bank de Tunisie.jpg" }
];

// ========== LOADING SCREEN ========== //
// Enhanced Loading Screen with Scroll Fix
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    
    if (!loadingScreen) return;
    
    // Prevent scrolling and force top position
    document.body.classList.add('loading');
    window.scrollTo(0, 0);
    history.scrollRestoration = 'manual';
    
    let progress = 0;
    const totalSteps = 8;
    const stepDuration = 150;
    
    function updateProgress() {
        if (progress <= 100) {
            progressFill.style.width = `${progress}%`;
            progressText.textContent = `${Math.round(progress)}%`;
            updateLoadingText(progress);
            progress += 100 / totalSteps;
            setTimeout(updateProgress, stepDuration);
        } else {
            completeLoading();
        }
    }
    
    function updateLoadingText(progress) {
        const loadingText = document.querySelector('.loading-text');
        if (!loadingText) return;
        
        const texts = [
            { threshold: 0, text: "Initialisation du luxe..." },
            { threshold: 25, text: "Chargement des collections..." },
            { threshold: 50, text: "Préparation de l'élégance..." },
            { threshold: 75, text: "Finalisation du raffinement..." },
            { threshold: 90, text: "Presque terminé..." }
        ];
        
        const currentText = texts.reverse().find(item => progress >= item.threshold);
        if (currentText && loadingText.textContent !== currentText.text) {
            loadingText.style.opacity = '0';
            setTimeout(() => {
                loadingText.textContent = currentText.text;
                loadingText.style.opacity = '1';
            }, 200);
        }
    }
    
    function completeLoading() {
        // Ensure 100% progress
        progressFill.style.width = '100%';
        progressText.textContent = '100%';
        
        // Start fade out
        loadingScreen.classList.add('fade-out');
        
        setTimeout(() => {
            // Restore scrolling
            document.body.classList.remove('loading');
            history.scrollRestoration = 'auto';
            
            // Force scroll to top with multiple methods
            window.scrollTo(1, 1);
            document.documentElement.scrollTop = 1;
            document.body.scrollTop = 1;
            
            // Remove loading screen
            if (loadingScreen.parentNode) {
                loadingScreen.parentNode.removeChild(loadingScreen);
            }
            
            // Trigger post-loading actions
            triggerPostLoadingActions();
            
            console.log('✅ Loading complete - Page at top');
        }, 600);
    }
    
    // Start loading process
    setTimeout(updateProgress, 300);
}

function triggerPostLoadingActions() {
    // Trigger hero animations
    const heroTitle = document.getElementById('hero-title');
    const heroSubtitle = document.getElementById('hero-subtitle');
    
    if (heroTitle && heroSubtitle) {
        heroTitle.classList.add('animate-fade-in');
        heroSubtitle.classList.add('animate-fade-in-delay');
    }
    
    // Additional initialization if needed
    console.log('🚀 MARBRERIE TUNIS CARTHAGE - Ready for excellence');
}

// ========== NAVIGATION SCROLL EFFECT ========== //
function initNavigationScroll() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    function updateHeader() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
        ticking = false;
    }
    
    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', onScroll, { passive: true });
    
    window.addEventListener('resize', () => {
        if (window.scrollY <= 100) {
            header.classList.remove('scrolled');
            header.style.transform = 'translateY(0)';
        }
    });
}

function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navActions = document.querySelector('.nav-actions');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            if (navLinks) navLinks.classList.toggle('active');
            if (navActions) navActions.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });
    }
    
    const navLinksList = document.querySelectorAll('.nav-links a');
    navLinksList.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
            if (navLinks) navLinks.classList.remove('active');
            if (navActions) navActions.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// ========== HERO SLIDESHOW ========== //
function initHeroSlideshow() {
    const slidesContainer = document.getElementById("hero-slides");
    const indicatorsContainer = document.getElementById("slide-indicators");
    const titleElement = document.getElementById("hero-title");
    const subtitleElement = document.getElementById("hero-subtitle");

    if (!slidesContainer || !indicatorsContainer) return;

    // Create slides
    heroSlides.forEach((slide, index) => {
        const slideDiv = document.createElement("div");
        slideDiv.className = `hero-slide ${index === 0 ? "active" : ""}`;
        slideDiv.innerHTML = `
            <div class="hero-bg" style="background-image: url(${slide.image})"></div>
            <div class="hero-overlay"></div>
        `;
        slidesContainer.appendChild(slideDiv);

        // Create indicator
        const indicator = document.createElement("button");
        indicator.className = `indicator ${index === 0 ? "active" : ""}`;
        indicator.addEventListener("click", () => goToSlide(index));
        indicatorsContainer.appendChild(indicator);
    });

    // Set initial content
    updateHeroText();

    // Auto-advance slides
    setInterval(() => {
        currentState.currentSlide = (currentState.currentSlide + 1) % heroSlides.length;
        updateSlide();
    }, 5000);
}

function goToSlide(index) {
    currentState.currentSlide = index;
    updateSlide();
}

function updateSlide() {
    const slides = document.querySelectorAll(".hero-slide");
    const indicators = document.querySelectorAll(".indicator");

    slides.forEach((slide, index) => {
        slide.classList.toggle("active", index === currentState.currentSlide);
    });

    indicators.forEach((indicator, index) => {
        indicator.classList.toggle("active", index === currentState.currentSlide);
    });

    updateHeroText();
}

function updateHeroText() {
    const titleElement = document.getElementById("hero-title");
    const subtitleElement = document.getElementById("hero-subtitle");
    const currentSlideData = heroSlides[currentState.currentSlide];

    if (!titleElement || !subtitleElement) return;

    titleElement.style.animation = "none";
    subtitleElement.style.animation = "none";

    setTimeout(() => {
        titleElement.textContent = currentSlideData.title;
        subtitleElement.textContent = currentSlideData.subtitle;
        titleElement.style.animation = "fade-in 0.8s ease-out forwards";
        subtitleElement.style.animation = "fade-in-delay 0.8s ease-out 0.3s forwards";
    }, 50);
}

// ========== PRODUCT MODAL ========== //
function openProductModal() {
    document.getElementById("product-modal").style.display = "flex";
    updateProductCarousel();
}

function closeProductModal() {
    document.getElementById("product-modal").style.display = "none";
}

function updateProductCarousel() {
    const getProductIndex = (offset) => {
        return (currentState.currentProduct + offset + products.length) % products.length;
    }

    const productLeft = document.getElementById("product-left");
    const productCenter = document.getElementById("product-center");
    const productRight = document.getElementById("product-right");

    if (productLeft && productCenter && productRight) {
        productLeft.src = products[getProductIndex(-1)].image;
        productCenter.src = products[currentState.currentProduct].image;
        productRight.src = products[getProductIndex(1)].image;
    }

    const productCategory = document.getElementById("product-category");
    const productName = document.getElementById("product-name");
    const productDescription = document.getElementById("product-description");
    const productFinish = document.getElementById("product-finish");

    if (productCategory && productName && productDescription && productFinish) {
        productCategory.textContent = products[currentState.currentProduct].category;
        productName.textContent = products[currentState.currentProduct].name;
        productDescription.textContent = products[currentState.currentProduct].description;
        productFinish.innerHTML = `<span>Finition:</span> ${products[currentState.currentProduct].finish}`;
    }
}

function nextProduct() {
    if (currentState.isTransitioning) return;
    currentState.isTransitioning = true;

    const productInfo = document.getElementById("product-info");
    const centerItem = document.querySelector(".carousel-item.center");

    if (productInfo) productInfo.classList.add("hidden");
    if (centerItem) centerItem.classList.add("transitioning");

    setTimeout(() => {
        currentState.currentProduct = (currentState.currentProduct + 1) % products.length;
        updateProductCarousel();
        if (productInfo) productInfo.classList.remove("hidden");
        if (centerItem) centerItem.classList.remove("transitioning");
        currentState.isTransitioning = false;
    }, 500);
}

function prevProduct() {
    if (currentState.isTransitioning) return;
    currentState.isTransitioning = true;

    const productInfo = document.getElementById("product-info");
    const centerItem = document.querySelector(".carousel-item.center");

    if (productInfo) productInfo.classList.add("hidden");
    if (centerItem) centerItem.classList.add("transitioning");

    setTimeout(() => {
        currentState.currentProduct = (currentState.currentProduct - 1 + products.length) % products.length;
        updateProductCarousel();
        if (productInfo) productInfo.classList.remove("hidden");
        if (centerItem) centerItem.classList.remove("transitioning");
        currentState.isTransitioning = false;
    }, 500);
}

// ========== 3D TOOL MODAL ========== //
function openToolModal() {
    document.getElementById("tool-modal").style.display = "flex";
    renderToolsGrid();
}

function closeToolModal() {
    document.getElementById("tool-modal").style.display = "none";
}

function renderToolsGrid() {
    const toolsGrid = document.getElementById("tools-grid");
    if (!toolsGrid) return;

    toolsGrid.innerHTML = "";

    toolCategories.forEach((category, index) => {
        const toolCard = document.createElement("div");
        toolCard.className = "tool-card animate-slide-up";
        toolCard.style.animationDelay = `${index * 100}ms`;

        toolCard.innerHTML = `
            <div class="tool-image">
                <img src="${category.image}" alt="${category.name}">
                <div class="tool-overlay"></div>
                <div class="tool-info">
                    <h3>${category.name}</h3>
                </div>
            </div>
            <p class="tool-description">${category.description}</p>
            <ul class="tool-features">
                ${category.features.map(
                    (feature) => `
                    <li>
                        <span class="feature-dot"></span>
                        ${feature}
                    </li>
                    `
                ).join("")}
            </ul>
            <button class="button btn-tool">Visualiser en 3D</button>
        `;

        toolsGrid.appendChild(toolCard);
    });
}

// ========== TESTIMONIALS INFINITE SCROLL ========== //
function initInfiniteScroll() {
    const scrollContent = document.querySelector('.scroll-content');
    if (!scrollContent) return;

    const logosHTML = clientLogos.map(logo => `
        <div class="client-logo">
            <img src="${logo.image}" alt="${logo.name}" loading="lazy">
        </div>
    `).join('');

    scrollContent.innerHTML = logosHTML + logosHTML;

    scrollContent.style.animation = 'none';
    setTimeout(() => {
        scrollContent.style.animation = 'scroll-left 20s linear infinite';
    }, 10);
}

// ========== EVENT LISTENERS ========== //
function bindEventListeners() {
    // Product modal
    const openProductBtn = document.getElementById("open-product-modal");
    const closeProductBtn = document.getElementById("close-product-modal");
    const prevProductBtn = document.getElementById("prev-product");
    const nextProductBtn = document.getElementById("next-product");

    if (openProductBtn) openProductBtn.addEventListener("click", openProductModal);
    if (closeProductBtn) closeProductBtn.addEventListener("click", closeProductModal);
    if (prevProductBtn) prevProductBtn.addEventListener("click", prevProduct);
    if (nextProductBtn) nextProductBtn.addEventListener("click", nextProduct);

    // Tool modal
    const openToolBtn = document.getElementById("open-tool-modal");
    const closeToolBtn = document.getElementById("close-tool-modal");

    if (openToolBtn) openToolBtn.addEventListener("click", openToolModal);
    if (closeToolBtn) closeToolBtn.addEventListener("click", closeToolModal);

    // Close modals on overlay click
    const productModal = document.getElementById("product-modal");
    const toolModal = document.getElementById("tool-modal");

    if (productModal) {
        productModal.addEventListener("click", (e) => {
            if (e.target === productModal) closeProductModal();
        });
    }

    if (toolModal) {
        toolModal.addEventListener("click", (e) => {
            if (e.target === toolModal) closeToolModal();
        });
    }

    // Close modals on ESC key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeProductModal();
            closeToolModal();
        }
    });

    // Hero action buttons
    const discoverBtn = document.getElementById("discover-btn");
    const contactHeroBtn = document.getElementById("contact-hero-btn");

    if (discoverBtn) {
        discoverBtn.addEventListener("click", openProductModal);
    }

    if (contactHeroBtn) {
        contactHeroBtn.addEventListener("click", () => {
            const contactSection = document.getElementById("contact");
            if (contactSection) {
                const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
                const targetPosition = contactSection.offsetTop - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }

    // Catalog button
    const catalogBtn = document.getElementById("catalog-btn");
    if (catalogBtn) {
        catalogBtn.addEventListener("click", () => {
            showNotification("Téléchargement du catalogue en cours...", "info");
        });
    }
}

// ========== NOTIFICATION SYSTEM ========== //
function showNotification(message, type = "info") {
    // Create notification element
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    // Add styles if not already added
    if (!document.querySelector("#notification-styles")) {
        const styles = document.createElement("style");
        styles.id = "notification-styles";
        styles.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 2rem;
                background: white;
                padding: 1rem 1.5rem;
                border-radius: 12px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.15);
                z-index: 10000;
                transform: translateX(400px);
                transition: transform 0.3s ease;
                border-left: 4px solid #ffa500;
            }
            .notification-success { border-left-color: #10b981; }
            .notification-error { border-left-color: #ef4444; }
            .notification.show { transform: translateX(0); }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 1rem;
            }
            .notification-close {
                background: none;
                border: none;
                font-size: 1.2rem;
                cursor: pointer;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        `;
        document.head.appendChild(styles);
    }

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => notification.classList.add("show"), 100);

    // Auto remove after 5 seconds
    const autoRemove = setTimeout(() => {
        closeNotification(notification);
    }, 5000);

    // Close button
    const closeBtn = notification.querySelector(".notification-close");
    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            clearTimeout(autoRemove);
            closeNotification(notification);
        });
    }
}

function closeNotification(notification) {
    notification.classList.remove("show");
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// ========== SMOOTH SCROLLING ========== //
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ========== INITIALIZE EVERYTHING ========== //
function initApp() {
    console.log('🚀 Initializing MARBRERIE TUNIS CARTHAGE Website...');
    
    // Initialize all components
    initLoadingScreen();
    initNavigationScroll();
    initMobileMenu();
    initHeroSlideshow();
    initInfiniteScroll();
    initSmoothScrolling();
    bindEventListeners();
    
    console.log('✅ All components initialized successfully');
}

// Start the application when DOM is loaded
document.addEventListener("DOMContentLoaded", initApp);

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        // Page became visible again
        console.log('📱 Page is now visible');
    }
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initApp,
        currentState,
        heroSlides,
        products,
        toolCategories
    };
}