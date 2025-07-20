// Configurações globais
const ADMIN_PASSWORD = '15112024'; // Senha para acesso administrativo
let isAdminLoggedIn = false;
let currentDate = new Date();
let selectedDate = null;
let availableSlots = {}; // Estrutura: { 'YYYY-MM-DD': ['09:00', '10:00', ...] }

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Configurar navegação mobile
    setupMobileNavigation();
    
    // Configurar smooth scrolling
    setupSmoothScrolling();
    
    // Inicializar calendário
    initializeCalendar();
    
    // Configurar modal de login
    setupLoginModal();
    
    // Configurar painel administrativo
    setupAdminPanel();
    
    // Adicionar alguns horários de exemplo
    addSampleSlots();
    
    // Atualizar visualização do calendário
    updateCalendar();
}

// Navegação mobile
function setupMobileNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Fechar menu ao clicar em um link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// Smooth scrolling para links de navegação
function setupSmoothScrolling() {
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
}

// Inicializar calendário
function initializeCalendar() {
    const prevBtn = document.getElementById('prev-month');
    const nextBtn = document.getElementById('next-month');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            updateCalendar();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            updateCalendar();
        });
    }
}

// Atualizar visualização do calendário
function updateCalendar() {
    const monthElement = document.getElementById('current-month');
    const calendarGrid = document.getElementById('calendar-grid');
    
    if (!monthElement || !calendarGrid) return;
    
    // Atualizar título do mês
    const monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    
    monthElement.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    
    // Limpar grid
    calendarGrid.innerHTML = '';
    
    // Adicionar cabeçalhos dos dias da semana
    const dayHeaders = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    dayHeaders.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-day-header';
        dayHeader.textContent = day;
        dayHeader.style.cssText = `
            background: var(--primary-color);
            color: white;
            font-weight: 600;
            padding: 1rem;
            text-align: center;
        `;
        calendarGrid.appendChild(dayHeader);
    });
    
    // Calcular primeiro dia do mês e número de dias
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    // Gerar dias do calendário
    for (let i = 0; i < 42; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = date.getDate();
        
        const dateString = formatDate(date);
        
        // Verificar se é do mês atual
        if (date.getMonth() !== currentDate.getMonth()) {
            dayElement.classList.add('other-month');
        }
        
        // Verificar se tem horários disponíveis
        if (availableSlots[dateString] && availableSlots[dateString].length > 0) {
            dayElement.classList.add('has-slots');
        }
        
        // Verificar se é a data selecionada
        if (selectedDate && dateString === formatDate(selectedDate)) {
            dayElement.classList.add('selected');
        }
        
        // Adicionar evento de clique
        dayElement.addEventListener('click', () => {
            selectDate(date);
        });
        
        calendarGrid.appendChild(dayElement);
    }
}

// Selecionar data
function selectDate(date) {
    selectedDate = new Date(date);
    updateCalendar();
    updateTimeSlots();
}

// Atualizar horários disponíveis
function updateTimeSlots() {
    const timeSlotsContainer = document.getElementById('time-slots');
    if (!timeSlotsContainer) return;
    
    timeSlotsContainer.innerHTML = '';
    
    if (!selectedDate) {
        timeSlotsContainer.innerHTML = '<p class="no-slots">Selecione uma data para ver os horários disponíveis</p>';
        return;
    }
    
    const dateString = formatDate(selectedDate);
    const slots = availableSlots[dateString] || [];
    
    if (slots.length === 0) {
        timeSlotsContainer.innerHTML = '<p class="no-slots">Nenhum horário disponível para esta data</p>';
        return;
    }
    
    slots.forEach(time => {
        const slotElement = document.createElement('div');
        slotElement.className = 'time-slot';
        slotElement.textContent = time;
        
        slotElement.addEventListener('click', () => {
            if (!isAdminLoggedIn) {
                alert('Entre em contato para agendar este horário:\nWhatsApp: (11) (11) 93702-7706');
            }
        });
        
        timeSlotsContainer.appendChild(slotElement);
    });
}

// Configurar modal de login
function setupLoginModal() {
    const loginBtn = document.getElementById('admin-login-btn');
    const modal = document.getElementById('login-modal');
    const closeBtn = document.querySelector('.close');
    const loginForm = document.getElementById('login-form');
    
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            if (isAdminLoggedIn) {
                logout();
            } else {
                modal.style.display = 'block';
            }
        });
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
    
    if (modal) {
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
    
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const password = document.getElementById('admin-password').value;
            
            if (password === ADMIN_PASSWORD) {
                login();
                modal.style.display = 'none';
                document.getElementById('admin-password').value = '';
            } else {
                alert('Senha incorreta!');
            }
        });
    }
}

// Fazer login
function login() {
    isAdminLoggedIn = true;
    document.getElementById('admin-panel').style.display = 'block';
    document.getElementById('public-schedule').style.display = 'none';
    
    const loginBtn = document.getElementById('admin-login-btn');
    if (loginBtn) {
        loginBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i>';
        loginBtn.title = 'Sair';
    }
}

// Fazer logout
function logout() {
    isAdminLoggedIn = false;
    document.getElementById('admin-panel').style.display = 'none';
    document.getElementById('public-schedule').style.display = 'block';
    
    const loginBtn = document.getElementById('admin-login-btn');
    if (loginBtn) {
        loginBtn.innerHTML = '<i class="fas fa-cog"></i>';
        loginBtn.title = 'Login Administrativo';
    }
}

// Configurar painel administrativo
function setupAdminPanel() {
    const logoutBtn = document.getElementById('logout-btn');
    const addSlotBtn = document.getElementById('add-slot-btn');
    const removeSlotBtn = document.getElementById('remove-slot-btn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    if (addSlotBtn) {
        addSlotBtn.addEventListener('click', addTimeSlot);
    }
    
    if (removeSlotBtn) {
        removeSlotBtn.addEventListener('click', removeTimeSlot);
    }
}

// Adicionar horário
function addTimeSlot() {
    const dateInput = document.getElementById('slot-date');
    const timeInput = document.getElementById('slot-time');
    
    if (!dateInput.value || !timeInput.value) {
        alert('Por favor, preencha a data e o horário.');
        return;
    }
    
    const date = dateInput.value;
    const time = timeInput.value;
    
    if (!availableSlots[date]) {
        availableSlots[date] = [];
    }
    
    if (!availableSlots[date].includes(time)) {
        availableSlots[date].push(time);
        availableSlots[date].sort();
        
        // Salvar no localStorage
        saveSlots();
        
        // Atualizar visualização
        updateCalendar();
        updateTimeSlots();
        
        // Limpar campos
        dateInput.value = '';
        timeInput.value = '';
        
        alert('Horário adicionado com sucesso!');
    } else {
        alert('Este horário já existe para a data selecionada.');
    }
}

// Remover horário
function removeTimeSlot() {
    const dateInput = document.getElementById('slot-date');
    const timeInput = document.getElementById('slot-time');
    
    if (!dateInput.value || !timeInput.value) {
        alert('Por favor, preencha a data e o horário.');
        return;
    }
    
    const date = dateInput.value;
    const time = timeInput.value;
    
    if (availableSlots[date] && availableSlots[date].includes(time)) {
        availableSlots[date] = availableSlots[date].filter(t => t !== time);
        
        if (availableSlots[date].length === 0) {
            delete availableSlots[date];
        }
        
        // Salvar no localStorage
        saveSlots();
        
        // Atualizar visualização
        updateCalendar();
        updateTimeSlots();
        
        // Limpar campos
        dateInput.value = '';
        timeInput.value = '';
        
        alert('Horário removido com sucesso!');
    } else {
        alert('Horário não encontrado para a data selecionada.');
    }
}

// Salvar horários no localStorage
function saveSlots() {
    localStorage.setItem('nailDesignSlots', JSON.stringify(availableSlots));
}

// Carregar horários do localStorage
function loadSlots() {
    const saved = localStorage.getItem('nailDesignSlots');
    if (saved) {
        availableSlots = JSON.parse(saved);
    }
}

// Adicionar horários de exemplo
function addSampleSlots() {
    // Carregar horários salvos primeiro
    loadSlots();
    
    // Se não há horários salvos, adicionar exemplos
    if (Object.keys(availableSlots).length === 0) {
        const today = new Date();
        
        // Adicionar horários para os próximos 7 dias
        for (let i = 1; i <= 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            const dateString = formatDate(date);
            
            // Pular domingos
            if (date.getDay() !== 0) {
                availableSlots[dateString] = [
                    '09:00', '10:00', '11:00', 
                    '14:00', '15:00', '16:00', '17:00'
                ];
            }
        }
        
        saveSlots();
    }
}

// Formatar data para string YYYY-MM-DD
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Animações de scroll
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observar elementos que devem animar
    document.querySelectorAll('.service-card, .skill-item, .contact-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Configurar animações quando a página carregar
window.addEventListener('load', () => {
    setupScrollAnimations();
});

// Função para destacar link ativo na navegação
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Atualizar link ativo no scroll
window.addEventListener('scroll', updateActiveNavLink);

// Adicionar estilo para link ativo
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: var(--primary-color) !important;
    }
    
    .nav-link.active::after {
        width: 100% !important;
    }
`;
document.head.appendChild(style);

// Função para validar formulários (se necessário no futuro)
function validateForm(formData) {
    const errors = [];
    
    if (!formData.name || formData.name.trim().length < 2) {
        errors.push('Nome deve ter pelo menos 2 caracteres');
    }
    
    if (!formData.email || !isValidEmail(formData.email)) {
        errors.push('Email inválido');
    }
    
    if (!formData.phone || formData.phone.trim().length < 10) {
        errors.push('Telefone inválido');
    }
    
    return errors;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Função para mostrar notificações
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        border-radius: 10px;
        color: white;
        font-weight: 600;
        z-index: 3000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    switch (type) {
        case 'success':
            notification.style.background = 'var(--gradient-primary)';
            break;
        case 'error':
            notification.style.background = '#f44336';
            break;
        default:
            notification.style.background = 'var(--accent-color)';
    }
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover após 3 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Função para copiar texto para clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Copiado para a área de transferência!', 'success');
    }).catch(() => {
        showNotification('Erro ao copiar texto', 'error');
    });
}

// Adicionar funcionalidade de cópia aos contatos
document.addEventListener('DOMContentLoaded', () => {
    const contactItems = document.querySelectorAll('.contact-item p');
    contactItems.forEach(item => {
        item.style.cursor = 'pointer';
        item.title = 'Clique para copiar';
        
        item.addEventListener('click', () => {
            copyToClipboard(item.textContent);
        });
    });
});

// Função para lazy loading de imagens (se necessário)
function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Configurar PWA (Progressive Web App) básico
function setupPWA() {
    // Registrar service worker se disponível
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered: ', registration);
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }
}

// Função para detectar dispositivo móvel
function isMobile() {
    return window.innerWidth <= 768;
}

// Otimizações para dispositivos móveis
function setupMobileOptimizations() {
    if (isMobile()) {
        // Reduzir animações em dispositivos móveis
        document.documentElement.style.setProperty('--animation-duration', '0.3s');
        
        // Otimizar touch events
        document.addEventListener('touchstart', () => {}, { passive: true });
    }
}

// Inicializar otimizações quando a página carregar
window.addEventListener('load', () => {
    setupMobileOptimizations();
    setupLazyLoading();
    setupPWA();
});

// Debug: Função para mostrar informações do sistema (apenas em desenvolvimento)
function debugInfo() {
    console.log('Nail Design Site - Debug Info');
    console.log('Available Slots:', availableSlots);
    console.log('Current Date:', currentDate);
    console.log('Selected Date:', selectedDate);
    console.log('Admin Logged In:', isAdminLoggedIn);
    console.log('Mobile Device:', isMobile());
}

// Disponibilizar função de debug globalmente (apenas em desenvolvimento)
window.debugInfo = debugInfo;

