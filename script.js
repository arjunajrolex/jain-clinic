// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ===== ACTIVE NAV LINK HIGHLIGHT =====
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');

function updateActiveNav() {
  const scrollY = window.scrollY + 150;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    if (scrollY >= top && scrollY < top + height) {
      navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === '#' + id) {
          item.classList.add('active');
        }
      });
    }
  });
}
window.addEventListener('scroll', updateActiveNav);
updateActiveNav();

// ===== SCROLL REVEAL ANIMATIONS =====
function initReveal() {
  const revealTargets = document.querySelectorAll(
    '.service-card, .contact-card, .about-content, .about-image, .hero-content, .hero-visual, .feature, .cta-container, .section-header'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 60);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealTargets.forEach(el => observer.observe(el));
}
initReveal();

// ===== SMOOTH COUNTER ANIMATION =====
function animateCounters() {
  const counters = document.querySelectorAll('.stat-num');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const text = el.textContent;
        const match = text.match(/(\d+)/);
        if (match) {
          const target = parseInt(match[1]);
          const suffix = text.replace(match[1], '');
          let current = 0;
          const step = Math.ceil(target / 40);
          const timer = setInterval(() => {
            current += step;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            el.textContent = current + suffix;
          }, 30);
        }
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => observer.observe(c));
}
animateCounters();

// ===== CHATBOT =====
(function () {
  const chatbot = document.getElementById('chatbot');
  const chatToggle = document.getElementById('chatToggle');
  const chatClose = document.getElementById('chatClose');
  const chatBody = document.getElementById('chatBody');
  const chatInput = document.getElementById('chatInput');
  const chatSend = document.getElementById('chatSend');
  const quickReplies = document.querySelectorAll('.quick-btn');
  let isOpen = false;
  let greeted = false;

  // Knowledge base
  const responses = [
    {
      keywords: ['hello', 'hi', 'hey', 'namaste', 'good morning', 'good evening', 'good afternoon'],
      reply: "Hello! 👋 Welcome to Jain Clinic. I'm here to help you with information about our dental services, timings, location, and appointments. How can I assist you?"
    },
    {
      keywords: ['service', 'treatment', 'what do you offer', 'what you do', 'procedures'],
      reply: "We offer a wide range of dental services:\n\n🚑 Emergency Care\n📷 X-Ray\n✨ Cosmetic Procedures\n🩺 Check-ups\n👑 Veneers & Crowns\n💎 Teeth Whitening\n🦷 Extractions\n🪥 Teeth Cleaning\n💠 Teeth Reshaping\n🔩 Dental Implants\n🌉 Dentures & Bridges\n🔗 Bonding\n🛡️ Fillings & Sealants\n🥊 Mouth Guards\n🔬 Root Canals\n\nWould you like to know more about any specific treatment?"
    },
    {
      keywords: ['time', 'timing', 'hour', 'open', 'close', 'schedule', 'when', 'working hour'],
      reply: "🕐 Our clinic hours are:\n\n📅 Monday to Sunday\n⏰ 9:00 AM – 8:00 PM\n\nWe're open 7 days a week for your convenience!"
    },
    {
      keywords: ['where', 'location', 'address', 'direction', 'map', 'find you', 'situated'],
      reply: "📍 We're located at:\n\nGandhi Path Rd,\nIndustrial Area 1st Phase, HS1,\njaipur, Rajasthan 302034\n\n🗺️ You can find us on Google Maps for easy directions!"
    },
    {
      keywords: ['appointment', 'book', 'visit', 'come', 'schedule visit', 'consultation'],
      reply: "📞 To book an appointment, you can:\n\n1️⃣ Call us at +91 XXXXXXXXXX\n2️⃣ Message us on WhatsApp\n3️⃣ Visit us directly at the clinic\n\nOur team will schedule a convenient time for you. We're open Mon–Sun, 9 AM to 8 PM!"
    },
    {
      keywords: ['doctor', 'dr', 'dentist', 'who', '*', 'jain'],
      reply: "👨‍⚕️ Dr. * Jain is the lead dentist at Jain Clinic. With over 15 years of experience, he specializes in comprehensive dental care — from routine check-ups to advanced procedures like dental implants and cosmetic dentistry.\n\nYou're in expert hands! 😊"
    },
    {
      keywords: ['implant'],
      reply: "🔩 Dental Implants are one of our specialties! They provide a permanent, natural-feeling replacement for missing teeth using titanium implants. Dr. * Jain has extensive experience in implant procedures.\n\nWould you like to book a consultation?"
    },
    {
      keywords: ['whitening', 'white', 'brighten'],
      reply: "💎 Our professional teeth whitening treatments can brighten your smile several shades in just one visit! We use safe, clinically-proven methods for lasting results.\n\nBook a session to see the difference!"
    },
    {
      keywords: ['root canal', 'rct'],
      reply: "🔬 Don't worry — root canals at Jain Clinic are virtually pain-free! Dr. * Jain uses modern techniques to save infected teeth and relieve pain quickly.\n\nIf you're experiencing tooth pain, please visit us soon."
    },
    {
      keywords: ['cost', 'price', 'fee', 'charge', 'expensive', 'affordable', 'how much'],
      reply: "💰 At Jain Clinic, we believe quality dental care should be affordable. Our pricing is competitive and transparent.\n\nFor specific treatment costs, please call us at +91 XXXXXXXXXX or visit for a consultation. We'll provide a detailed estimate after examination."
    },
    {
      keywords: ['emergency', 'urgent', 'pain', 'broken', 'bleeding', 'swelling'],
      reply: "🚑 For dental emergencies, please visit us immediately during clinic hours (9 AM – 8 PM, every day) or call +91 XXXXXXXXXX.\n\nWe prioritize emergency cases and will attend to you as quickly as possible. Don't delay — we're here to help!"
    },
    {
      keywords: ['thank', 'thanks', 'dhanyavaad', 'shukriya'],
      reply: "You're welcome! 😊 We're always happy to help. If you have any more questions, feel free to ask. We look forward to seeing you at Jain Clinic! 🦷"
    },
    {
      keywords: ['bye', 'goodbye', 'see you'],
      reply: "Goodbye! 👋 Take care of your smile, and don't forget your regular check-ups. See you at Jain Clinic! 😊"
    }
  ];

  const fallback = "I'm not sure I understand. You can ask me about:\n\n• Our dental services\n• Clinic timings\n• Location & directions\n• Booking an appointment\n• Doctor information\n• Treatment costs\n\nOr tap one of the quick reply buttons below! 😊";

  function addMessage(text, type) {
    const msg = document.createElement('div');
    msg.className = 'chat-msg ' + type;
    msg.textContent = text;
    // Preserve newlines
    msg.innerHTML = text.replace(/\n/g, '<br>');
    chatBody.appendChild(msg);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function showTyping() {
    const typing = document.createElement('div');
    typing.className = 'typing-indicator';
    typing.id = 'typingIndicator';
    typing.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';
    chatBody.appendChild(typing);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function removeTyping() {
    const el = document.getElementById('typingIndicator');
    if (el) el.remove();
  }

  function getBotReply(input) {
    const lower = input.toLowerCase();
    for (const r of responses) {
      if (r.keywords.some(k => lower.includes(k))) {
        return r.reply;
      }
    }
    return fallback;
  }

  function handleSend() {
    const text = chatInput.value.trim();
    if (!text) return;
    addMessage(text, 'user');
    chatInput.value = '';
    showTyping();
    const delay = 600 + Math.random() * 800;
    setTimeout(() => {
      removeTyping();
      addMessage(getBotReply(text), 'bot');
    }, delay);
  }

  // Toggle chat
  chatToggle.addEventListener('click', () => {
    isOpen = !isOpen;
    chatbot.classList.toggle('open', isOpen);
    if (isOpen && !greeted) {
      greeted = true;
      setTimeout(() => {
        addMessage("Hi there! 👋 I'm the Jain Clinic assistant. How can I help you today?", 'bot');
      }, 400);
    }
    if (isOpen) chatInput.focus();
  });

  chatClose.addEventListener('click', () => {
    isOpen = false;
    chatbot.classList.remove('open');
  });

  // Send on click / Enter
  chatSend.addEventListener('click', handleSend);
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleSend();
  });

  // Quick replies
  quickReplies.forEach(btn => {
    btn.addEventListener('click', () => {
      const msg = btn.getAttribute('data-msg');
      chatInput.value = msg;
      handleSend();
    });
  });
})();
