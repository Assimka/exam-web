

// Проверка авторизации и обновление навигации
function updateNavigation() {
    const auth = firebase.auth();
    const authNav = document.getElementById('auth-nav');
    const adminNav = document.getElementById('admin-nav');
    
    if (authNav && adminNav) {
        auth.onAuthStateChanged((user) => {
            if (user) {
                authNav.style.display = 'none';
                adminNav.style.display = 'block';
                localStorage.setItem('userLoggedIn', 'true');
            } else {
                authNav.style.display = 'block';
                adminNav.style.display = 'none';
                localStorage.removeItem('userLoggedIn');
            }
        });
    }
}





// Валидация форм
function validateForm(formData, rules) {
    const errors = {};
    
    for (const field in rules) {
        const value = formData[field];
        const rule = rules[field];
        
        if (rule.required && !value) {
            errors[field] = 'Это поле обязательно для заполнения';
        }
        
        if (rule.email && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            errors[field] = 'Введите корректный email';
        }
        
        if (rule.minLength && value && value.length < rule.minLength) {
            errors[field] = `Минимальная длина: ${rule.minLength} символов`;
        }
        
        if (rule.pattern && value && !rule.pattern.test(value)) {
            errors[field] = rule.message || 'Неверный формат';
        }
    }
    
    return errors;
}

// Показать сообщение об ошибке
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorDiv = field.nextElementSibling;
    
    if (errorDiv && errorDiv.classList.contains('error-message')) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        field.classList.add('error');
    }
}

// Очистить ошибки
function clearErrors() {
    document.querySelectorAll('.error-message').forEach(el => {
        el.style.display = 'none';
    });
    document.querySelectorAll('.error').forEach(el => {
        el.classList.remove('error');
    });
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация Firebase
    if (typeof firebase !== 'undefined') {
        initFirebase();
        updateNavigation();
    }
    
    // Мобильное меню
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Закрытие меню при клике на ссылку
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
    
    // Валидация форм
    const forms = document.querySelectorAll('form[data-validate]');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {};
            const inputs = this.querySelectorAll('input, select, textarea');
            
            inputs.forEach(input => {
                formData[input.name] = input.value;
            });
            
            // Простая валидация
            let isValid = true;
            inputs.forEach(input => {
                if (input.hasAttribute('required') && !input.value.trim()) {
                    isValid = false;
                    input.classList.add('error');
                } else {
                    input.classList.remove('error');
                }
            });
            
            if (isValid) {
                // Отправка формы
                this.submit();
            }
        });
    });
    
    // Анимация при скролле
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
});

