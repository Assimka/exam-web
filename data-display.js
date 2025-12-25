// Данные для отображения (в реальном проекте будут приходить с сервера)
let allData = [
    { id: 1, name: "Иванов Иван Иванович", email: "ivanov@example.com", role: "Администратор", date: "2024-01-15", status: "active", phone: "+7 (999) 123-45-67", department: "IT" },
    { id: 2, name: "Петрова Анна Сергеевна", email: "petrova@example.com", role: "Менеджер", date: "2024-01-20", status: "active", phone: "+7 (999) 234-56-78", department: "Продажи" },
    { id: 3, name: "Сидоров Алексей Петрович", email: "sidorov@example.com", role: "Аналитик", date: "2024-02-01", status: "active", phone: "+7 (999) 345-67-89", department: "Аналитика" },
    { id: 4, name: "Козлова Мария Владимировна", email: "kozlova@example.com", role: "Разработчик", date: "2024-02-10", status: "pending", phone: "+7 (999) 456-78-90", department: "IT" },
    { id: 5, name: "Николаев Дмитрий Олегович", email: "nikolaev@example.com", role: "Тестировщик", date: "2024-02-12", status: "active", phone: "+7 (999) 567-89-01", department: "QA" },
    { id: 6, name: "Федорова Екатерина Игоревна", email: "fedorova@example.com", role: "Дизайнер", date: "2024-02-15", status: "inactive", phone: "+7 (999) 678-90-12", department: "Дизайн" },
    { id: 7, name: "Григорьев Павел Александрович", email: "grigoriev@example.com", role: "Менеджер", date: "2024-02-18", status: "active", phone: "+7 (999) 789-01-23", department: "Маркетинг" },
    { id: 8, name: "Алексеева Ольга Викторовна", email: "alekseeva@example.com", role: "Бухгалтер", date: "2024-02-20", status: "pending", phone: "+7 (999) 890-12-34", department: "Финансы" },
    { id: 9, name: "Волков Сергей Николаевич", email: "volkov@example.com", role: "Администратор", date: "2024-02-22", status: "active", phone: "+7 (999) 901-23-45", department: "Администрирование" },
    { id: 10, name: "Тихонова Ирина Дмитриевна", email: "tikhonova@example.com", role: "Контент-менеджер", date: "2024-02-25", status: "active", phone: "+7 (999) 012-34-56", department: "Контент" }
];

let currentView = 'table';
let currentPage = 1;
const itemsPerPage = 5;
let filteredData = [...allData];
let currentSort = { column: 'id', direction: 'asc' };

// Инициализация страницы
document.addEventListener('DOMContentLoaded', function() {
    updateUserInfo();
    renderData();
    updateSummary();
    setupPagination();
    updateLastUpdateTime();
    
    // Симуляция обновления данных каждые 30 секунд
    setInterval(updateLastUpdateTime, 30000);
});

// Обновление информации о пользователе
function updateUserInfo() {
    const user = localStorage.getItem('currentUser');
    if (user) {
        document.getElementById('currentUser').textContent = JSON.parse(user).name;
    }
}

// Переключение между таблицей и карточками
function switchView(view) {
    currentView = view;
    
    // Обновляем активные кнопки
    document.querySelectorAll('.view-toggle button').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Показываем/скрываем соответствующий вид
    if (view === 'table') {
        document.getElementById('tableView').classList.remove('hidden');
        document.getElementById('cardsView').classList.add('hidden');
    } else {
        document.getElementById('tableView').classList.add('hidden');
        document.getElementById('cardsView').classList.remove('hidden');
    }
    
    renderData();
}

// Отрисовка данных в зависимости от текущего вида
function renderData() {
    if (currentView === 'table') {
        renderTableView();
    } else {
        renderCardsView();
    }
    setupPagination();
}

// Отрисовка таблицы
function renderTableView() {
    const tableBody = document.getElementById('tableBody');
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = filteredData.slice(startIndex, endIndex);
    
    let html = '';
    
    pageData.forEach(item => {
        html += `
            <tr>
                <td>${item.id}</td>
                <td><strong>${item.name}</strong></td>
                <td>${item.email}</td>
                <td>${item.role}</td>
                <td>${formatDate(item.date)}</td>
                <td><span class="status status-${item.status}">${getStatusText(item.status)}</span></td>
                <td class="actions">
                    <button class="btn-view" onclick="viewDetails(${item.id})" title="Просмотр">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-edit" onclick="editItem(${item.id})" title="Редактировать">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete" onclick="deleteItem(${item.id})" title="Удалить">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
    
    tableBody.innerHTML = html;
}

// Отрисовка карточек
function renderCardsView() {
    const cardsContainer = document.getElementById('cardsContainer');
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = filteredData.slice(startIndex, endIndex);
    
    let html = '';
    
    pageData.forEach(item => {
        html += `
            <div class="data-card">
                <h3>${item.name}</h3>
                <p><i class="fas fa-envelope"></i> ${item.email}</p>
                <p><i class="fas fa-briefcase"></i> ${item.role} • ${item.department}</p>
                <p><i class="fas fa-phone"></i> ${item.phone}</p>
                <p><i class="fas fa-calendar"></i> Дата регистрации: ${formatDate(item.date)}</p>
                <p><span class="status status-${item.status}">${getStatusText(item.status)}</span></p>
                <div class="actions" style="margin-top: 15px;">
                    <button class="btn-view" onclick="viewDetails(${item.id})">
                        <i class="fas fa-eye"></i> Подробнее
                    </button>
                    <button class="btn-edit" onclick="editItem(${item.id})">
                        <i class="fas fa-edit"></i> Изменить
                    </button>
                </div>
            </div>
        `;
    });
    
    cardsContainer.innerHTML = html;
}

// Фильтрация данных
function filterData() {
    const searchText = document.getElementById('searchInput').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    
    filteredData = allData.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchText) || 
                             item.email.toLowerCase().includes(searchText) ||
                             item.role.toLowerCase().includes(searchText);
        
        const matchesStatus = !statusFilter || item.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });
    
    currentPage = 1;
    renderData();
    updateSummary();
}

// Сортировка данных
function sortData() {
    const sortValue = document.getElementById('sortSelect').value;
    
    switch(sortValue) {
        case 'name-asc':
            filteredData.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            filteredData.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case 'date-new':
            filteredData.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        case 'date-old':
            filteredData.sort((a, b) => new Date(a.date) - new Date(b.date));
            break;
    }
    
    renderData();
}

// Сортировка по колонке таблицы
function sortByColumn(column) {
    if (currentSort.column === column) {
        currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
        currentSort.column = column;
        currentSort.direction = 'asc';
    }
    
    filteredData.sort((a, b) => {
        if (a[column] < b[column]) return currentSort.direction === 'asc' ? -1 : 1;
        if (a[column] > b[column]) return currentSort.direction === 'asc' ? 1 : -1;
        return 0;
    });
    
    renderData();
}

// Сброс фильтров
function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('statusFilter').value = '';
    document.getElementById('sortSelect').value = 'name-asc';
    
    filteredData = [...allData];
    currentPage = 1;
    renderData();
    updateSummary();
}

// Настройка пагинации
function setupPagination() {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const pagination = document.getElementById('pagination');
    
    let html = '';
    
    if (totalPages > 1) {
        // Кнопка "Назад"
        html += `<button onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
                    <i class="fas fa-chevron-left"></i>
                 </button>`;
        
        // Номера страниц
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                html += `<button onclick="changePage(${i})" class="${i === currentPage ? 'active' : ''}">${i}</button>`;
            } else if (i === currentPage - 2 || i === currentPage + 2) {
                html += `<span>...</span>`;
            }
        }
        
        // Кнопка "Вперед"
        html += `<button onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
                    <i class="fas fa-chevron-right"></i>
                 </button>`;
    }
    
    pagination.innerHTML = html;
}

// Смена страницы
function changePage(page) {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    
    if (page >= 1 && page <= totalPages && page !== currentPage) {
        currentPage = page;
        renderData();
    }
}

// Обновление сводной информации
function updateSummary() {
    const total = filteredData.length;
    const active = filteredData.filter(item => item.status === 'active').length;
    const pending = filteredData.filter(item => item.status === 'pending').length;
    
    document.getElementById('totalRecords').textContent = total;
    document.getElementById('activeRecords').textContent = active;
    document.getElementById('pendingRecords').textContent = pending;
}

// Экспорт данных
function exportData(format) {
    let dataToExport;
    
    if (format === 'csv') {
        // Создание CSV
        const headers = ['ID', 'ФИО', 'Email', 'Роль', 'Дата', 'Статус', 'Телефон', 'Отдел'];
        const rows = filteredData.map(item => [
            item.id,
            item.name,
            item.email,
            item.role,
            item.date,
            getStatusText(item.status),
            item.phone,
            item.department
        ]);
        
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');
        
        downloadFile(csvContent, 'data.csv', 'text/csv');
        
    } else if (format === 'json') {
        // Создание JSON
        dataToExport = JSON.stringify(filteredData, null, 2);
        downloadFile(dataToExport, 'data.json', 'application/json');
    }
    
    alert(`Данные экспортированы в формате ${format.toUpperCase()}`);
}

// Печать данных
function printData() {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>Печать данных</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                h1 { color: #333; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
                th { background-color: #f2f2f2; }
                .print-date { margin-bottom: 20px; color: #666; }
            </style>
        </head>
        <body>
            <h1>Данные системы</h1>
            <p class="print-date">Сформировано: ${new Date().toLocaleString('ru-RU')}</p>
            <table>
                <tr>
                    <th>ID</th><th>ФИО</th><th>Email</th><th>Роль</th><th>Дата</th><th>Статус</th>
                </tr>
                ${filteredData.map(item => `
                    <tr>
                        <td>${item.id}</td>
                        <td>${item.name}</td>
                        <td>${item.email}</td>
                        <td>${item.role}</td>
                        <td>${formatDate(item.date)}</td>
                        <td>${getStatusText(item.status)}</td>
                    </tr>
                `).join('')}
            </table>
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// Вспомогательные функции
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
}

function getStatusText(status) {
    const statusMap = {
        'active': 'Активный',
        'inactive': 'Неактивный',
        'pending': 'На проверке'
    };
    return statusMap[status] || status;
}

function updateLastUpdateTime() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    document.getElementById('lastUpdate').textContent = now.toLocaleDateString('ru-RU', options);
}

function downloadFile(content, fileName, contentType) {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Функции действий
function viewDetails(id) {
    const item = allData.find(item => item.id === id);
    if (item) {
        alert(`Детальная информация:\n\nФИО: ${item.name}\nEmail: ${item.email}\nРоль: ${item.role}\nДата: ${formatDate(item.date)}\nСтатус: ${getStatusText(item.status)}\nТелефон: ${item.phone}\nОтдел: ${item.department}`);
    }
}

function editItem(id) {
    alert(`Редактирование записи #${id}\n\nВ реальном проекте здесь будет форма редактирования.`);
    // В реальном проекте: window.location.href = `edit.html?id=${id}`;
}

function deleteItem(id) {
    if (confirm(`Вы уверены, что хотите удалить запись #${id}?`)) {
        allData = allData.filter(item => item.id !== id);
        filterData(); // Перефильтруем данные
        alert('Запись удалена!');
    }
}

// Симуляция обновления данных (для демонстрации)
function simulateDataUpdate() {
    // Добавляем новую запись
    const newId = Math.max(...allData.map(item => item.id)) + 1;
    const names = ['Новоселов Артем', 'Кириллова Светлана', 'Морозов Владимир'];
    const roles = ['Аналитик', 'Разработчик', 'Тестировщик'];
    
    const newItem = {
        id: newId,
        name: names[Math.floor(Math.random() * names.length)],
        email: `user${newId}@example.com`,
        role: roles[Math.floor(Math.random() * roles.length)],
        date: new Date().toISOString().split('T')[0],
        status: 'pending',
        phone: '+7 (999) 999-99-99',
        department: 'Новый отдел'
    };
    
    allData.unshift(newItem);
    filterData();
    alert('Данные обновлены! Добавлена новая запись.');
}