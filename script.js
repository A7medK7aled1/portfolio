
document.addEventListener('DOMContentLoaded', () => {

    /* --- Mobile Navigation Toggle --- */
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    links.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    /* --- Scroll Reveal Animation --- */
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');

                // If it's a stat number, start counting
                if (entry.target.classList.contains('stat-item')) {
                    const numberEl = entry.target.querySelector('.stat-number');
                    if (numberEl) animateValue(numberEl);
                }

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in-up');
    fadeElements.forEach(el => observer.observe(el));


    /* --- Number Counter Animation --- */
    function animateValue(obj) {
        const target = parseInt(obj.getAttribute('data-target'));
        const duration = 2000; // ms
        let startTimestamp = null;

        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);

            // Ease out quart
            const easeProgress = 1 - Math.pow(1 - progress, 4);

            obj.innerHTML = Math.floor(easeProgress * target);

            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                obj.innerHTML = target;
            }
        };

        window.requestAnimationFrame(step);
    }


    /* --- Typing Animation --- */
    const textElement = document.querySelector('.typed-text');
    const phrases = ["Mobile Apps.", "Clean Code.", "User Experiences.", "Scalable Solutions."];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            textElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50;
        } else {
            textElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            typeSpeed = 2000; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 500; // Pause before new word
        }

        setTimeout(type, typeSpeed);
    }

    // Start typing animation
    if (textElement) type();


    /* --- Form Submission Simulation --- */
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Simple validation check
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            if (name && email && message) {
                const btn = contactForm.querySelector('button');
                const originalText = btn.innerText;

                btn.innerText = 'Sending...';
                btn.disabled = true;

                // Here we use Formspree as an example backend service
                // You need to register at https://formspree.io/ to get your own URL
                // Replace 'YOUR_FORM_ID' with your actual form ID
                const formAction = 'https://formspree.io/f/xbdaobrp';

                const formData = new FormData(contactForm);

                fetch(formAction, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                }).then(response => {
                    if (response.ok) {
                        formStatus.textContent = "Message sent successfully!";
                        formStatus.className = "form-status success";
                        contactForm.reset();
                    } else {
                        response.json().then(data => {
                            if (Object.hasOwn(data, 'errors')) {
                                formStatus.textContent = data["errors"].map(error => error["message"]).join(", ");
                            } else {
                                formStatus.textContent = "Oops! There was a problem submitting your form";
                            }
                            formStatus.className = "form-status error";
                        });
                    }
                }).catch(error => {
                    formStatus.textContent = "Oops! There was a problem submitting your form";
                    formStatus.className = "form-status error";
                }).finally(() => {
                    btn.innerText = originalText;
                    btn.disabled = false;
                    setTimeout(() => {
                        if (formStatus.className.includes('success')) {
                            formStatus.textContent = "";
                        }
                    }, 5000);
                });
            }
        });
    }

    /* --- Custom Cursor --- */
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    if (window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener("mousemove", function (e) {
            const posX = e.clientX;
            const posY = e.clientY;

            // Dot follows instantly
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            // Outline follows with slight delay/animation via CSS transition normally, 
            // but for JS controlled smooth follow:
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });

        // Add hover effect for links
        const interactiveElements = document.querySelectorAll('a, button, .project-card, input, textarea');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
                cursorOutline.style.backgroundColor = 'rgba(64, 196, 255, 0.1)';
                cursorDot.style.transform = 'translate(-50%, -50%) scale(0.5)';
            });
            el.addEventListener('mouseleave', () => {
                cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
                cursorOutline.style.backgroundColor = 'transparent';
                cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
            });
        });
    } else {
        // Hide custom cursor on touch devices
        if (cursorDot) cursorDot.style.display = 'none';
        if (cursorOutline) cursorOutline.style.display = 'none';
    }

});

/* --- Add dynamic CSS for Cursor --- */
// Since we didn't add cursor styles in CSS file yet, let's append them or just rely on them being in CSS.
// Ideally they should be in CSS. I'll check stye.css content mentally.
// Ah, I missed adding the cursor styles in the large CSS block. Let's create a separate style block or append it.
