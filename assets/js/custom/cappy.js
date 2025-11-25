/* ============================================
   CAPPY STUDIOS - Custom JavaScript
   Ripple Effects, Hero Slider, Interactions
   ============================================ */

(function() {
    'use strict';

    // ============================================
    // RIPPLE EFFECT ON MOUSE MOVE
    // ============================================
    
    class RippleEffect {
        constructor() {
            this.canvas = document.getElementById('ripple-canvas');
            if (!this.canvas) return;
            
            this.ctx = this.canvas.getContext('2d');
            this.ripples = [];
            this.mouse = { x: 0, y: 0 };
            this.lastMouse = { x: 0, y: 0 };
            this.isMoving = false;
            this.moveTimeout = null;
            
            this.resize();
            this.bindEvents();
            this.animate();
        }
        
        resize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }
        
        bindEvents() {
            window.addEventListener('resize', () => this.resize());
            
            document.addEventListener('mousemove', (e) => {
                this.mouse.x = e.clientX;
                this.mouse.y = e.clientY;
                
                // Check if mouse moved significantly
                const dx = this.mouse.x - this.lastMouse.x;
                const dy = this.mouse.y - this.lastMouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance > 30) {
                    // Check if hovering over interactive element
                    const target = document.elementFromPoint(e.clientX, e.clientY);
                    const isInteractive = target && (
                        target.closest('.glass-card') ||
                        target.closest('.game-card') ||
                        target.closest('button') ||
                        target.closest('a') ||
                        target.closest('input')
                    );
                    
                    if (!isInteractive) {
                        this.createRipple(this.mouse.x, this.mouse.y);
                    }
                    
                    this.lastMouse.x = this.mouse.x;
                    this.lastMouse.y = this.mouse.y;
                }
            });
        }
        
        createRipple(x, y) {
            this.ripples.push({
                x: x,
                y: y,
                radius: 0,
                maxRadius: 80 + Math.random() * 40,
                opacity: 0.3,
                speed: 2 + Math.random()
            });
            
            // Limit ripples for performance
            if (this.ripples.length > 10) {
                this.ripples.shift();
            }
        }
        
        animate() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.ripples.forEach((ripple, index) => {
                ripple.radius += ripple.speed;
                ripple.opacity -= 0.008;
                
                if (ripple.opacity <= 0) {
                    this.ripples.splice(index, 1);
                    return;
                }
                
                // Draw ripple with gradient
                const gradient = this.ctx.createRadialGradient(
                    ripple.x, ripple.y, 0,
                    ripple.x, ripple.y, ripple.radius
                );
                
                gradient.addColorStop(0, `rgba(147, 51, 234, 0)`);
                gradient.addColorStop(0.5, `rgba(147, 51, 234, ${ripple.opacity * 0.5})`);
                gradient.addColorStop(1, `rgba(236, 72, 153, ${ripple.opacity})`);
                
                this.ctx.beginPath();
                this.ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
                this.ctx.strokeStyle = gradient;
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
            });
            
            requestAnimationFrame(() => this.animate());
        }
    }

    // ============================================
    // HERO BACKGROUND SLIDER
    // ============================================
    
    class HeroSlider {
        constructor() {
            this.slider = document.querySelector('.hero-slider');
            if (!this.slider) return;
            
            this.slides = this.slider.querySelectorAll('.slide');
            this.currentIndex = 0;
            this.interval = 5000; // 5 seconds per slide
            
            if (this.slides.length > 0) {
                this.slides[0].classList.add('active');
                this.startAutoPlay();
            }
        }
        
        startAutoPlay() {
            setInterval(() => {
                this.nextSlide();
            }, this.interval);
        }
        
        nextSlide() {
            this.slides[this.currentIndex].classList.remove('active');
            this.currentIndex = (this.currentIndex + 1) % this.slides.length;
            this.slides[this.currentIndex].classList.add('active');
        }
    }

    // ============================================
    // SMOOTH SCROLL ENHANCEMENT
    // ============================================
    
    class SmoothScroll {
        constructor() {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', (e) => {
                    const href = anchor.getAttribute('href');
                    if (href === '#') return;
                    
                    const target = document.querySelector(href);
                    if (target) {
                        e.preventDefault();
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            });
        }
    }

    // ============================================
    // SCROLL ANIMATIONS
    // ============================================
    
    class ScrollAnimations {
        constructor() {
            this.elements = document.querySelectorAll('.glass-card, .game-card, .skill-item');
            this.observer = new IntersectionObserver(
                (entries) => this.handleIntersect(entries),
                { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
            );
            
            this.elements.forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                this.observer.observe(el);
            });
        }
        
        handleIntersect(entries) {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                    
                    this.observer.unobserve(entry.target);
                }
            });
        }
    }

    // ============================================
    // PAGE LOADER
    // ============================================
    
    class PageLoader {
        constructor() {
            this.loader = document.querySelector('.page-loader');
            if (!this.loader) return;
            
            window.addEventListener('load', () => {
                setTimeout(() => {
                    this.loader.classList.add('hidden');
                }, 500);
            });
        }
    }

    // ============================================
    // MAGNETIC BUTTONS
    // ============================================
    
    class MagneticButtons {
        constructor() {
            this.buttons = document.querySelectorAll('.btn, .button');
            
            this.buttons.forEach(btn => {
                btn.addEventListener('mousemove', (e) => this.handleMove(e, btn));
                btn.addEventListener('mouseleave', (e) => this.handleLeave(e, btn));
            });
        }
        
        handleMove(e, btn) {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        }
        
        handleLeave(e, btn) {
            btn.style.transform = 'translate(0, 0)';
        }
    }

    // ============================================
    // PARTNERS CAROUSEL
    // ============================================
    
    class PartnersCarousel {
        constructor() {
            const track = document.querySelector('.partners-track');
            if (!track) return;
            
            // Clone items for infinite scroll
            const items = track.innerHTML;
            track.innerHTML = items + items;
        }
    }

    // ============================================
    // NAVBAR SCROLL EFFECT
    // ============================================
    
    class NavbarScroll {
        constructor() {
            this.header = document.getElementById('header');
            if (!this.header) return;
            
            window.addEventListener('scroll', () => this.handleScroll());
        }
        
        handleScroll() {
            if (window.scrollY > 100) {
                this.header.classList.remove('alt');
            } else {
                this.header.classList.add('alt');
            }
        }
    }

    // ============================================
    // TYPING EFFECT FOR TAGLINE
    // ============================================
    
    class TypingEffect {
        constructor(element, text, speed = 50) {
            this.element = element;
            if (!this.element) return;
            
            this.text = text || this.element.textContent;
            this.speed = speed;
            this.element.textContent = '';
            this.index = 0;
            
            this.type();
        }
        
        type() {
            if (this.index < this.text.length) {
                this.element.textContent += this.text.charAt(this.index);
                this.index++;
                setTimeout(() => this.type(), this.speed);
            }
        }
    }

    // ============================================
    // INITIALIZE ALL
    // ============================================
    
    document.addEventListener('DOMContentLoaded', () => {
        new PageLoader();
        new RippleEffect();
        new HeroSlider();
        new SmoothScroll();
        new ScrollAnimations();
        new MagneticButtons();
        new PartnersCarousel();
        new NavbarScroll();
        
        // Initialize typing effect on tagline
        const tagline = document.querySelector('.tagline');
        if (tagline) {
            new TypingEffect(tagline);
        }
    });

})();
