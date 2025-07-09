// JS for U.S.K International

document.addEventListener('DOMContentLoaded', function () {
  const menuBtn = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  if (menuBtn && mobileMenu) {
    let menuOpen = false;
    menuBtn.addEventListener('click', () => {
      menuOpen = !menuOpen;
      menuBtn.classList.toggle('hamburger-open', menuOpen);
      menuBtn.setAttribute('aria-expanded', menuOpen);
      if (menuOpen) {
        mobileMenu.classList.add('mobile-menu-open');
        mobileMenu.classList.remove('mobile-menu-closed');
      } else {
        mobileMenu.classList.remove('mobile-menu-open');
        mobileMenu.classList.add('mobile-menu-closed');
      }
    });
    // Close menu when a link is clicked
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuOpen = false;
        menuBtn.classList.remove('hamburger-open');
        menuBtn.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.remove('mobile-menu-open');
        mobileMenu.classList.add('mobile-menu-closed');
      });
    });
    // Start with menu closed
    mobileMenu.classList.add('mobile-menu-closed');
    mobileMenu.classList.remove('mobile-menu-open');
  }

  // Portfolio Carousel
  const carousel = document.getElementById('portfolio-carousel');
  const prevBtn = document.getElementById('portfolio-prev');
  const nextBtn = document.getElementById('portfolio-next');
  if (carousel && prevBtn && nextBtn) {
    // Show/hide buttons based on screen size
    function updateButtons() {
      if (window.innerWidth >= 640) { // sm breakpoint
        prevBtn.classList.remove('hidden');
        nextBtn.classList.remove('hidden');
      } else {
        prevBtn.classList.add('hidden');
        nextBtn.classList.add('hidden');
      }
    }
    updateButtons();
    window.addEventListener('resize', updateButtons);
    // Scroll logic
    prevBtn.addEventListener('click', () => {
      carousel.scrollBy({ left: -carousel.offsetWidth, behavior: 'smooth' });
    });
    nextBtn.addEventListener('click', () => {
      carousel.scrollBy({ left: carousel.offsetWidth, behavior: 'smooth' });
    });
  }

  // Portfolio Lightbox
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxClose = document.getElementById('lightbox-close');
  if (carousel && lightboxModal && lightboxImg && lightboxTitle && lightboxClose) {
    carousel.querySelectorAll('[data-img]').forEach(card => {
      card.addEventListener('click', () => {
        lightboxImg.src = card.getAttribute('data-img');
        lightboxTitle.textContent = card.getAttribute('data-title');
        lightboxModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
      });
    });
    function closeLightbox() {
      lightboxModal.classList.add('hidden');
      lightboxImg.src = '';
      lightboxTitle.textContent = '';
      document.body.style.overflow = '';
    }
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (!lightboxModal.classList.contains('hidden') && (e.key === 'Escape' || e.key === 'Esc')) {
        closeLightbox();
      }
    });
  }

  // Testimonial Carousel
  const testimonialsCarousel = document.getElementById('testimonials-carousel');
  const testimonialsPrev = document.getElementById('testimonials-prev');
  const testimonialsNext = document.getElementById('testimonials-next');
  const testimonialsDots = document.getElementById('testimonials-dots');
  let testimonialIndex = 0;
  let testimonialTimer;
  if (testimonialsCarousel && testimonialsPrev && testimonialsNext && testimonialsDots) {
    const slides = testimonialsCarousel.children;
    const slideCount = slides.length;
    const slidesPerView = () => window.innerWidth >= 768 ? 2 : 1;
    // Dots
    function renderDots() {
      testimonialsDots.innerHTML = '';
      for (let i = 0; i < Math.ceil(slideCount / slidesPerView()); i++) {
        const dot = document.createElement('button');
        dot.className = 'w-3 h-3 rounded-full bg-gray-300 hover:bg-indigo-400 focus:bg-indigo-600 transition';
        if (i === testimonialIndex) dot.classList.add('bg-indigo-600');
        dot.addEventListener('click', () => goToSlide(i));
        testimonialsDots.appendChild(dot);
      }
    }
    function goToSlide(idx) {
      testimonialIndex = idx;
      const slideWidth = testimonialsCarousel.offsetWidth / slidesPerView();
      testimonialsCarousel.scrollTo({ left: slideWidth * testimonialIndex, behavior: 'smooth' });
      renderDots();
      resetTimer();
    }
    function nextSlide() {
      testimonialIndex = (testimonialIndex + 1) % Math.ceil(slideCount / slidesPerView());
      goToSlide(testimonialIndex);
    }
    function prevSlide() {
      testimonialIndex = (testimonialIndex - 1 + Math.ceil(slideCount / slidesPerView())) % Math.ceil(slideCount / slidesPerView());
      goToSlide(testimonialIndex);
    }
    function resetTimer() {
      clearInterval(testimonialTimer);
      testimonialTimer = setInterval(nextSlide, 5000);
    }
    testimonialsNext.addEventListener('click', nextSlide);
    testimonialsPrev.addEventListener('click', prevSlide);
    window.addEventListener('resize', () => {
      testimonialIndex = 0;
      goToSlide(0);
    });
    testimonialsCarousel.addEventListener('touchstart', handleTouchStart, false);
    testimonialsCarousel.addEventListener('touchmove', handleTouchMove, false);
    let xDown = null;
    function handleTouchStart(evt) {
      xDown = evt.touches[0].clientX;
    }
    function handleTouchMove(evt) {
      if (!xDown) return;
      let xUp = evt.touches[0].clientX;
      let xDiff = xDown - xUp;
      if (Math.abs(xDiff) > 30) {
        if (xDiff > 0) nextSlide();
        else prevSlide();
        xDown = null;
      }
    }
    goToSlide(0);
    resetTimer();
  }

  // Contact form success message
  const contactForm = document.getElementById('contact-form');
  const contactSuccess = document.getElementById('contact-success');
  if (contactForm && contactSuccess) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      contactSuccess.classList.remove('hidden');
      contactSuccess.classList.add('animate-fadeIn');
      contactForm.reset();
      setTimeout(() => {
        contactSuccess.classList.add('hidden');
        contactSuccess.classList.remove('animate-fadeIn');
      }, 4000);
    });
  }

  // Animated Counters
  function animateCounter(id, end, duration = 1500, suffix = '+') {
    const el = document.getElementById(id);
    if (!el) return;
    let start = 0;
    const step = Math.ceil(end / (duration / 16));
    function update() {
      start += step;
      if (start >= end) {
        el.textContent = end + (suffix || '');
      } else {
        el.textContent = start + (suffix || '');
        requestAnimationFrame(update);
      }
    }
    update();
  }
  const countersSection = document.getElementById('counters');
  let countersAnimated = false;
  if (countersSection) {
    const observer = new window.IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !countersAnimated) {
        animateCounter('counter-clients', 250);
        animateCounter('counter-projects', 180);
        animateCounter('counter-years', 10);
        animateCounter('counter-awards', 12);
        countersAnimated = true;
        observer.disconnect();
      }
    }, { threshold: 0.3 });
    observer.observe(countersSection);
  }

  // Parallax backgrounds
  function parallaxScroll() {
    if (window.innerWidth < 768) return; // Only on desktop
    document.querySelectorAll('.parallax-bg').forEach(img => {
      const rect = img.getBoundingClientRect();
      const speed = 0.3;
      img.style.transform = `translateY(${rect.top * speed}px)`;
    });
  }
  window.addEventListener('scroll', parallaxScroll);
  window.addEventListener('resize', parallaxScroll);
  parallaxScroll();

  // Swiper Hero Slider Init
  console.log('Checking for Swiper:', window.Swiper);
  if (window.Swiper) {
    console.log('Initializing Swiper...');
    new Swiper('.hero-swiper', {
      loop: true,
      effect: 'fade',
      autoplay: { delay: 4500, disableOnInteraction: false },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      fadeEffect: { crossFade: true },
    });
  } else {
    console.log('Swiper not found!');
  }

  // Mobile menu dropdowns
  function setupMobileDropdowns() {
    if (window.innerWidth >= 768) return; // Only on mobile
    document.querySelectorAll('#mobile-menu > li.relative').forEach(parent => {
      const link = parent.querySelector('a');
      link.addEventListener('click', function(e) {
        e.preventDefault();
        // Close other open dropdowns
        document.querySelectorAll('#mobile-menu > li.relative').forEach(li => {
          if (li !== parent) li.classList.remove('open');
        });
        parent.classList.toggle('open');
      });
    });
  }
  setupMobileDropdowns();
  window.addEventListener('resize', setupMobileDropdowns);

  // Support Chat Box Logic
  const chatToggle = document.getElementById('chat-toggle');
  const chatBox = document.getElementById('chat-box');
  const chatClose = document.getElementById('chat-close');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const chatMessages = document.getElementById('chat-messages');

  // --- Persistent Chat Storage ---
  const CHAT_STORAGE_KEY = 'usk_chat_messages';
  function saveChatMessages() {
    if (chatMessages) {
      const msgs = Array.from(chatMessages.children).map(div => ({
        text: div.textContent,
        self: div.classList.contains('self-end')
      }));
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(msgs));
    }
  }
  function loadChatMessages() {
    if (chatMessages) {
      chatMessages.innerHTML = '';
      const msgs = JSON.parse(localStorage.getItem(CHAT_STORAGE_KEY) || '[]');
      msgs.forEach(msg => {
        const div = document.createElement('div');
        div.className = (msg.self ? 'bg-indigo-100 rounded-lg px-3 py-2 self-end text-right' : 'bg-gray-100 rounded-lg px-3 py-2 self-start');
        div.textContent = msg.text;
        chatMessages.appendChild(div);
      });
      // Always show welcome if empty
      if (chatMessages.children.length === 0) {
        const welcome = document.createElement('div');
        welcome.className = 'bg-gray-100 rounded-lg px-3 py-2 self-start';
        welcome.textContent = 'Hi! 👋 How can we help you today?';
        chatMessages.appendChild(welcome);
      }
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }
  // --- Smarter Bot Replies ---
  function getBotReply(msg) {
    const m = msg.toLowerCase();
    if (/hello|hi|hey|namaste|good (morning|afternoon|evening)/.test(m)) return 'Hello! How can we assist you today?';
    if (/hours|timing|open|close|working/.test(m)) return 'We are available 10am–7pm, Monday to Saturday.';
    if (/contact|phone|email|address/.test(m)) return 'You can reach us at info@uskinterior.com or +91 99999 99999.';
    if (/service|offer|provide|do you/.test(m)) return 'We offer modular kitchens, living/bedroom/dining design, and full home interiors.';
    if (/price|cost|charge|rate/.test(m)) return 'Our pricing is transparent and project-based. Book a free consultation for a quote!';
    if (/thank|thanks|dhanyavad/.test(m)) return 'Youre welcome! If you have more questions, just ask.';
    if (/location|where|office/.test(m)) return 'We are based in India. 123, Main Street, Your City.';
    if (/consult|book|appointment/.test(m)) return 'You can book a free consultation via our website or contact us directly!';
    return 'Thank you! Our team will get back to you soon.';
  }

  if (chatToggle && chatBox && chatClose && chatForm && chatInput && chatMessages) {
    // Load previous chat
    loadChatMessages();
    // Open chat
    chatToggle.addEventListener('click', () => {
      chatBox.classList.toggle('hidden');
      if (!chatBox.classList.contains('hidden')) {
        chatInput.focus();
      }
    });
    // Close chat
    chatClose.addEventListener('click', () => {
      chatBox.classList.add('hidden');
    });
    // Send message
    chatForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const msg = chatInput.value.trim();
      if (msg) {
        const userMsg = document.createElement('div');
        userMsg.className = 'bg-indigo-100 rounded-lg px-3 py-2 self-end text-right';
        userMsg.textContent = msg;
        chatMessages.appendChild(userMsg);
        chatInput.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;
        saveChatMessages();
        // Smarter support reply
        setTimeout(() => {
          const botMsg = document.createElement('div');
          botMsg.className = 'bg-gray-100 rounded-lg px-3 py-2 self-start';
          botMsg.textContent = getBotReply(msg);
          chatMessages.appendChild(botMsg);
          chatMessages.scrollTop = chatMessages.scrollHeight;
          saveChatMessages();
        }, 900);
      }
    });
  }
}); 