// DOM Elements
const hamburger = document.querySelector(".hamburger")
const navMenu = document.querySelector(".nav-menu")
const navLinks = document.querySelectorAll(".nav-menu a")
const menuOverlay = document.getElementById("menuOverlay")

// Mobile Navigation Toggle
hamburger?.addEventListener("click", (e) => {
  e.stopPropagation() // Evitar que el clic se propague
  toggleMenu()
})

// Función para alternar el menú
function toggleMenu() {
  hamburger.classList.toggle("active")
  navMenu.classList.toggle("active")
  menuOverlay.classList.toggle("active")

  // Bloquear/desbloquear scroll del body cuando el menú está abierto
  if (navMenu.classList.contains("active")) {
    document.body.style.overflow = "hidden"
  } else {
    document.body.style.overflow = ""
  }
}

// Cerrar menú al hacer clic en un enlace
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    closeMenu()
  })
})

// Cerrar menú al hacer clic en el overlay
menuOverlay?.addEventListener("click", () => {
  closeMenu()
})

// Función para cerrar el menú
function closeMenu() {
  hamburger?.classList.remove("active")
  navMenu?.classList.remove("active")
  menuOverlay?.classList.remove("active")
  document.body.style.overflow = ""
}

// Cerrar menú al presionar la tecla Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && navMenu?.classList.contains("active")) {
    closeMenu()
  }
})

// Smooth Scrolling Function
function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId)
  if (element) {
    const headerHeight = document.querySelector(".navbar")?.offsetHeight || 0
    const elementPosition = element.offsetTop - headerHeight - 20

    window.scrollTo({
      top: elementPosition,
      behavior: "smooth",
    })
  }
}

// Add click event listeners to navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const targetId = this.getAttribute("href").substring(1)
    scrollToSection(targetId)
  })
})

// Header scroll effect
let lastScrollTop = 0
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar")
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop

  if (navbar) {
    if (scrollTop > 100) {
      navbar.style.background = "rgba(255, 255, 255, 0.95)"
      navbar.style.backdropFilter = "blur(10px)"
      navbar.style.boxShadow = "0 2px 20px rgba(0,0,0,0.1)"
    } else {
      navbar.style.background = "#ffffff"
      navbar.style.backdropFilter = "none"
      navbar.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)"
    }
  }

  lastScrollTop = scrollTop
})

// FAQ Toggle Function
function toggleFAQ(element) {
  const faqItem = element.parentElement
  const answer = faqItem.querySelector(".faq-answer")
  const isActive = faqItem.classList.contains("active")

  // Close all FAQ items
  document.querySelectorAll(".faq-item").forEach((item) => {
    item.classList.remove("active")
    const itemAnswer = item.querySelector(".faq-answer")
    if (itemAnswer) {
      itemAnswer.classList.remove("active")
    }
  })

  // Toggle current FAQ item
  if (!isActive) {
    faqItem.classList.add("active")
    if (answer) {
      answer.classList.add("active")
    }
  }
}

// Cotizador Form Handler
document.getElementById("cotizadorForm")?.addEventListener("submit", function (e) {
  e.preventDefault()

  const formData = new FormData(this)
  const data = Object.fromEntries(formData)

  // Calculate basic price (this is just a demo calculation)
  const peso = Number.parseFloat(data.peso) || 0
  const valor = Number.parseFloat(data.valor) || 0
  let precioBase = peso * 5 // S/ 5 per kg base price

  if (data["tipoEnvio"] === "express") {
    precioBase *= 1.5
  } else if (data["tipoEnvio"] === "internacional") {
    precioBase *= 3
  }

  // Update price display
  const precioElement = document.querySelector(".precio-valor")
  if (precioElement) {
    precioElement.textContent = `S/ ${precioBase.toFixed(2)}`
  }

  // Create WhatsApp message
  const whatsappMessage = `🚚 *COTIZACIÓN JML EXPRESS*

📍 *Recojo:*
• Departamento: ${data.departamento}
• Provincia: ${data.provincia}
• Distrito: ${data.distrito}

📍 *Entrega:*
• Departamento: ${data["dest-departamento"]}
• Provincia: ${data["dest-provincia"]}
• Distrito: ${data["dest-distrito"]}

📦 *Detalles del envío:*
• Contenido: ${data.contenido}
• Peso: ${data.peso} kg
• Valor declarado: S/ ${data.valor}
• Tipo de envío: ${data.tipoEnvio}

💰 *Precio estimado: S/ ${precioBase.toFixed(2)}*

¡Hola! Me gustaría confirmar esta cotización y coordinar el recojo. ¿Podrían ayudarme?`

  const encodedMessage = encodeURIComponent(whatsappMessage)
  const whatsappURL = `https://wa.me/51989007968?text=${encodedMessage}`

  window.open(whatsappURL, "_blank")
  showNotification("¡Cotización enviada! Te redirigimos a WhatsApp.", "success")
})

// Contact Form Handler
document.getElementById("contactForm")?.addEventListener("submit", function (e) {
  e.preventDefault()

  const formData = new FormData(this)
  const data = Object.fromEntries(formData)

  const whatsappMessage = `📞 *CONTACTO JML EXPRESS*

👤 *Datos del cliente:*
• Nombre: ${data.nombre}
• Email: ${data.email}
• Teléfono: ${data.telefono}
• Servicio de interés: ${data.servicio}

💬 *Mensaje:*
${data.mensaje}

¡Hola! Me gustaría obtener más información sobre sus servicios. ¿Podrían contactarme?`

  const encodedMessage = encodeURIComponent(whatsappMessage)
  const whatsappURL = `https://wa.me/51989007968?text=${encodedMessage}`

  window.open(whatsappURL, "_blank")
  showNotification("¡Mensaje enviado! Te redirigimos a WhatsApp.", "success")

  // Reset form
  this.reset()
})

// Tracking Form Handler
document.querySelector(".tracking-form")?.addEventListener("submit", function (e) {
  e.preventDefault()

  const trackingCode = this.querySelector("input").value.trim()

  if (!trackingCode) {
    showNotification("Por favor ingresa un código de seguimiento válido.", "error")
    return
  }

  const whatsappMessage = `📦 *RASTREO DE ENVÍO - JML EXPRESS*

🔍 *Código de seguimiento:* ${trackingCode}

¡Hola! Me gustaría conocer el estado actual de mi envío. ¿Podrían proporcionarme la información de rastreo?`

  const encodedMessage = encodeURIComponent(whatsappMessage)
  const whatsappURL = `https://wa.me/51989007968?text=${encodedMessage}`

  window.open(whatsappURL, "_blank")
  showNotification("¡Consulta de rastreo enviada!", "success")
})

// Map Modal Functions
function openMapModal() {
  const modal = document.getElementById("mapModal")
  if (modal) {
    modal.style.display = "block"
    document.body.style.overflow = "hidden"

    // Add animation class
    setTimeout(() => {
      modal.classList.add("show")
    }, 10)
  }
}

function closeMapModal() {
  const modal = document.getElementById("mapModal")
  if (modal) {
    modal.classList.remove("show")
    setTimeout(() => {
      modal.style.display = "none"
      document.body.style.overflow = "auto"
    }, 300)
  }
}

// Close modal when clicking outside
window.addEventListener("click", (event) => {
  const modal = document.getElementById("mapModal")
  if (event.target === modal) {
    closeMapModal()
  }
})

// Close modal with Escape key
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMapModal()
  }
})

// Notification System
function showNotification(message, type = "info") {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll(".notification")
  existingNotifications.forEach((notification) => notification.remove())

  // Create notification element
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`

  const colors = {
    success: "#4CAF50",
    error: "#f44336",
    warning: "#ff9800",
    info: "#2196F3",
  }

  notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `

  // Add styles
  notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${colors[type] || colors.info};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
        word-wrap: break-word;
        font-family: 'Roboto', sans-serif;
    `

  // Add to document
  document.body.appendChild(notification)

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.style.animation = "slideOutRight 0.3s ease"
      setTimeout(() => notification.remove(), 300)
    }
  }, 5000)
}

// Form validation
function validateForm(form) {
  const requiredFields = form.querySelectorAll("[required]")
  let isValid = true

  requiredFields.forEach((field) => {
    if (!field.value.trim()) {
      field.style.borderColor = "#f44336"
      isValid = false
    } else {
      field.style.borderColor = "#e1e5e9"
    }
  })

  return isValid
}

// Add form validation to all forms
document.querySelectorAll("form").forEach((form) => {
  form.addEventListener("submit", function (e) {
    if (!validateForm(this)) {
      e.preventDefault()
      showNotification("Por favor completa todos los campos requeridos.", "error")
    }
  })
})

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animate")

      // Add staggered animation for grid items
      if (
        entry.target.classList.contains("cliente-item") ||
        entry.target.classList.contains("servicio-item") ||
        entry.target.classList.contains("step")
      ) {
        const siblings = Array.from(entry.target.parentElement.children)
        const index = siblings.indexOf(entry.target)
        entry.target.style.animationDelay = `${index * 0.1}s`
      }
    }
  })
}, observerOptions)

// Observe elements for animation
document.addEventListener("DOMContentLoaded", () => {
  const animatedElements = document.querySelectorAll(`
        .cliente-item,
        .servicio-item,
        .step,
        .faq-item,
        .info-item,
        .ubicacion-item
    `)

  animatedElements.forEach((el) => {
    observer.observe(el)
  })
})

// Price calculator for cotizador
function updatePrice() {
  const peso = Number.parseFloat(document.getElementById("peso")?.value) || 0
  const tipoEnvio = document.getElementById("tipoEnvio")?.value || "standard"

  let precioBase = peso * 5 // Base price per kg

  switch (tipoEnvio) {
    case "express":
      precioBase *= 1.5
      break
    case "internacional":
      precioBase *= 3
      break
    default:
      precioBase *= 1
  }

  const precioElement = document.querySelector(".precio-valor")
  if (precioElement) {
    precioElement.textContent = `S/ ${precioBase.toFixed(2)}`
  }
}

// Add event listeners for price calculation
document.getElementById("peso")?.addEventListener("input", updatePrice)
document.getElementById("tipoEnvio")?.addEventListener("change", updatePrice)

// Tab functionality for cotizador
document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", function () {
    // Remove active class from all tabs
    document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"))

    // Add active class to clicked tab
    this.classList.add("active")

    // Here you could add logic to show/hide different form sections
    // based on the selected tab
  })
})

// Loading states for buttons
function addLoadingState(button) {
  const originalText = button.textContent
  button.textContent = "Enviando..."
  button.disabled = true
  button.style.opacity = "0.7"

  setTimeout(() => {
    button.textContent = originalText
    button.disabled = false
    button.style.opacity = "1"
  }, 2000)
}

// Add loading states to form submit buttons
document.querySelectorAll("form").forEach((form) => {
  form.addEventListener("submit", function (e) {
    const submitButton = this.querySelector('button[type="submit"]')
    if (submitButton && validateForm(this)) {
      addLoadingState(submitButton)
    }
  })
})

// Lazy loading for images
if ("IntersectionObserver" in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target
        if (img.dataset.src) {
          img.src = img.dataset.src
          img.classList.remove("lazy")
          imageObserver.unobserve(img)
        }
      }
    })
  })

  document.querySelectorAll("img[data-src]").forEach((img) => {
    imageObserver.observe(img)
  })
}

// Add CSS animations dynamically
const style = document.createElement("style")
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background-color 0.2s ease;
    }
    
    .notification-close:hover {
        background-color: rgba(255, 255, 255, 0.2);
    }
    
    .animate {
        animation: fadeInUp 0.6s ease forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .modal.show {
        animation: fadeIn 0.3s ease;
    }
    
    .modal.show .modal-content {
        animation: slideIn 0.3s ease;
    }
`

document.head.appendChild(style)

// Initialize page
document.addEventListener("DOMContentLoaded", () => {
  console.log("JML EXPRESS website loaded successfully!")

  // Initialize price calculator
  updatePrice()

  // Add smooth scroll behavior to all internal links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })

  // Show welcome message
  setTimeout(() => {
    showNotification("¡Bienvenido a JML EXPRESS! Tu socio confiable en courier internacional.", "info")
  }, 2000)
})

// Performance monitoring
window.addEventListener("load", () => {
  if ("performance" in window) {
    const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart
    console.log(`Page loaded in ${loadTime}ms`)
  }
})

// Error handling
window.addEventListener("error", (e) => {
  console.error("JavaScript error:", e.error)
})

// Service Worker registration (for PWA capabilities)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registered: ", registration)
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError)
      })
  })
}

// Service Modal Data
const serviceData = {
  "courier-express": {
    title: "COURIER EXPRESS",
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description:
      "Nuestro servicio de Courier Express garantiza la entrega rápida y segura de tus paquetes en 24-48 horas dentro de Lima y principales ciudades del país. Ideal para documentos importantes y paquetes urgentes.",
    features: [
      "Entrega en 24-48 horas",
      "Seguimiento en tiempo real",
      "Recojo gratuito en Lima",
      "Seguro incluido hasta $500",
      "Confirmación de entrega",
      "Atención 24/7",
    ],
    benefits: ["Urgente", "Seguro", "Confiable", "Rápido"],
  },
  "courier-internacional": {
    title: "COURIER INTERNACIONAL",
    image: "https://images.unsplash.com/photo-1553413077-190dd305871c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description:
      "Conectamos Perú con más de 50 países alrededor del mundo. Nuestro servicio internacional cuenta con seguimiento completo y gestión aduanera para que tus envíos lleguen sin complicaciones.",
    features: [
      "Envíos a más de 50 países",
      "Gestión aduanera incluida",
      "Seguimiento internacional",
      "Tiempos de entrega competitivos",
      "Asesoría en documentación",
      "Seguro internacional",
    ],
    benefits: ["Global", "Aduanas", "Seguimiento", "Asesoría"],
  },
  "carga-pesada": {
    title: "CARGA PESADA",
    image:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description:
      "Especialistas en transporte de mercancías de gran volumen y peso. Contamos con la flota y experiencia necesaria para manejar cargas especiales con total seguridad y eficiencia.",
    features: [
      "Transporte terrestre, aéreo y marítimo",
      "Manejo de cargas especiales",
      "Embalaje profesional",
      "Seguro de carga completo",
      "Logística puerta a puerta",
      "Consolidación de cargas",
    ],
    benefits: ["Multimodal", "Especializado", "Seguro", "Eficiente"],
  },
  almacenaje: {
    title: "ALMACENAJE",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description:
      "Servicios de almacenamiento temporal y distribución en nuestras modernas instalaciones. Perfecto para empresas que necesitan optimizar su cadena de suministro y reducir costos logísticos.",
    features: [
      "Almacenes climatizados",
      "Sistema de inventario digital",
      "Distribución programada",
      "Seguridad 24/7",
      "Manejo de inventarios",
      "Reportes en tiempo real",
    ],
    benefits: ["Climatizado", "Seguro", "Digital", "Flexible"],
  },
}

// Service Modal Functions
function openServiceModal(serviceType) {
  const modal = document.getElementById("serviceModal")
  const data = serviceData[serviceType]

  if (!data || !modal) return

  // Update modal content
  document.getElementById("modalTitle").textContent = data.title
  document.getElementById("modalImage").src = data.image
  document.getElementById("modalDescription").textContent = data.description

  // Update features
  const featuresContainer = document.getElementById("modalFeatures")
  featuresContainer.innerHTML = `
    <h4>Características del Servicio:</h4>
    <div class="feature-list">
      ${data.features
        .map(
          (feature) => `
        <div class="feature-item">
          <i class="fas fa-check-circle"></i>
          <span>${feature}</span>
        </div>
      `,
        )
        .join("")}
    </div>
  `

  // Update benefits
  const benefitsContainer = document.getElementById("modalBenefits")
  benefitsContainer.innerHTML = `
    <h4>Beneficios:</h4>
    <div class="benefit-tags">
      ${data.benefits
        .map(
          (benefit) => `
        <span class="benefit-tag">${benefit}</span>
      `,
        )
        .join("")}
    </div>
  `

  // Show modal
  modal.style.display = "block"
  document.body.style.overflow = "hidden"

  // Add animation
  setTimeout(() => {
    modal.classList.add("show")
  }, 10)

  // Adjust modal position for better visibility
  adjustModalPosition()
}

function closeServiceModal() {
  const modal = document.getElementById("serviceModal")
  if (modal) {
    modal.classList.remove("show")
    setTimeout(() => {
      modal.style.display = "none"
      document.body.style.overflow = "auto"
    }, 300)
  }
}

// Function to adjust modal position based on viewport
function adjustModalPosition() {
  const modalContent = document.querySelector(".service-modal-content")
  if (!modalContent) return

  // Get viewport dimensions
  const viewportHeight = window.innerHeight
  const modalHeight = modalContent.offsetHeight

  // If modal is taller than viewport, adjust styles
  if (modalHeight > viewportHeight - 40) {
    modalContent.style.height = "calc(100vh - 40px)"
    document.querySelector(".modal-body").style.maxHeight = "calc(100vh - 180px)"
  } else {
    modalContent.style.height = "auto"
  }
}

// Handle window resize for responsive modal
window.addEventListener("resize", () => {
  if (document.getElementById("serviceModal").style.display === "block") {
    adjustModalPosition()
  }
})

// Service card click handlers
document.addEventListener("DOMContentLoaded", () => {
  // Add click event listeners to service cards
  document.querySelectorAll(".service-card").forEach((card) => {
    card.addEventListener("click", () => {
      const serviceType = card.getAttribute("data-service")
      openServiceModal(serviceType)
    })
  })

  // Modal close button
  document.getElementById("modalClose")?.addEventListener("click", closeServiceModal)

  // Close modal when clicking outside
  document.getElementById("serviceModal")?.addEventListener("click", (e) => {
    if (e.target.id === "serviceModal") {
      closeServiceModal()
    }
  })

  // Close modal with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeServiceModal()
    }
  })

  // Prevent scrolling issues on mobile
  document.querySelectorAll(".modal-body").forEach((modalBody) => {
    modalBody.addEventListener(
      "touchstart",
      function (e) {
        if (this.scrollTop === 0 && e.touches[0].clientY > 0) {
          e.preventDefault()
        }
        if (this.scrollHeight === this.scrollTop + this.offsetHeight && e.touches[0].clientY < 0) {
          e.preventDefault()
        }
      },
      false,
    )
  })
})

// WhatsApp function for service modal
function openWhatsApp() {
  const modalTitle = document.getElementById("modalTitle").textContent
  const whatsappMessage = `🚚 *INFORMACIÓN DE SERVICIO - JML EXPRESS*

📋 *Servicio de interés:* ${modalTitle}

¡Hola! Me gustaría obtener más información sobre este servicio. ¿Podrían ayudarme con los detalles y tarifas?

¡Gracias!`

  const encodedMessage = encodeURIComponent(whatsappMessage)
  const whatsappURL = `https://wa.me/51989007968?text=${encodedMessage}`

  window.open(whatsappURL, "_blank")
  showNotification("¡Consulta enviada! Te redirigimos a WhatsApp.", "success")
}

// Scroll to contact function
function scrollToContact() {
  closeServiceModal()
  setTimeout(() => {
    scrollToSection("cotizar")
  }, 300)
}
