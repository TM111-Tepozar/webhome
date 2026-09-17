let shortcuts = [];

function load() {
    let stored = localStorage.getItem('shortcuts');
    
    if (!stored) {
        const defaultShortcuts = [
            { name: 'YouTube', url: 'https://www.youtube.com/' },
            { name: 'YouTube Music', url: 'https://music.youtube.com/' },
            { name: 'Crunchyroll', url: 'https://www.crunchyroll.com/discover' },
            { name: 'Netflix', url: 'https://www.netflix.com/browse' },
            { name: 'SteamDB', url: 'https://steamdb.info/' },
            { name: 'ProtonDB', url: 'https://www.protondb.com/' },
            { name: 'Duck.ai', url: 'https://duck.ai/' },
            { name: 'Arch Wiki', url: 'https://wiki.archlinux.org/title/Main_page' }
        ];
        localStorage.setItem('shortcuts', JSON.stringify(defaultShortcuts));
        shortcuts = defaultShortcuts;
    } else {
        shortcuts = JSON.parse(stored);
    }
    
    display();
}

function display() {
    let html = '';
    for (let i = 0; i < shortcuts.length; i++) {
        try {
            let url = shortcuts[i].url;
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                url = 'https://' + url;
            }
            let domain = new URL(url).hostname;
            let iconUrl = 'https://www.google.com/s2/favicons?sz=64&domain=' + domain;
            html += '<a href="' + shortcuts[i].url + '" class="shortcut">';
            html += '<img src="' + iconUrl + '" alt="icon" class="shortcut-icon">';
            html += '<span class="shortcut-name">' + shortcuts[i].name + '</span>';
            html += '<button class="delete" onclick="remove(' + i + '); return false;">×</button>';
            html += '</a>';
        } catch (e) {
            console.error('Error processing shortcut:', e);
        }
    }
    document.getElementById('shortcut-grid').innerHTML = html;
}

function openModal() {
    document.getElementById('modal').classList.add('active');
}

function closeModal() {
    document.getElementById('modal').classList.remove('active');
    document.getElementById('shortcut-name').value = '';
    document.getElementById('shortcut-url').value = '';
}

function saveShortcut() {
    let name = document.getElementById('shortcut-name').value.trim();
    let url = document.getElementById('shortcut-url').value.trim();
    if (name && url) {
        shortcuts.push({name: name, url: url});
        localStorage.setItem('shortcuts', JSON.stringify(shortcuts));
        display();
        closeModal();
    } else {
        alert('Please fill in both fields');
    }
}

function remove(index) {
    if (confirm('Are you sure you want to delete this shortcut?')) {
        shortcuts.splice(index, 1);
        localStorage.setItem('shortcuts', JSON.stringify(shortcuts));
        display();
    }
    return false;
}

load();

///////////////

let modifierPressed = false;

document.addEventListener('keydown', (e) => {
    if (e.ctrlKey) {
        modifierPressed = true;
        document.querySelectorAll('.delete').forEach(btn => {
            btn.style.display = 'block';
        });
    }
});

document.addEventListener('keyup', (e) => {
    if (!e.ctrlKey) {
        modifierPressed = false;
        document.querySelectorAll('.delete').forEach(btn => {
            btn.style.display = 'none';
        });
    }
});

///////////////

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

function renderCalendar() {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    
    const adjustedFirstDay = (firstDay === 0) ? 6 : firstDay - 1;
    
    document.getElementById('calendar-month-year').textContent = 
        new Date(currentYear, currentMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    const calendarDaysDiv = document.getElementById('calendar-days');
    calendarDaysDiv.innerHTML = '';
    
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = adjustedFirstDay - 1; i >= 0; i--) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day other-month';
        dayDiv.textContent = daysInPrevMonth - i;
        calendarDaysDiv.appendChild(dayDiv);
    }
    
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day';
        dayDiv.textContent = day;
        
        if (today.getDate() === day && today.getMonth() === currentMonth && today.getFullYear() === currentYear) {
            dayDiv.classList.add('today');
        }
        
        calendarDaysDiv.appendChild(dayDiv);
    }
    
    const totalCells = calendarDaysDiv.children.length;
    const remainingCells = 42 - totalCells;
    for (let day = 1; day <= remainingCells; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day other-month';
        dayDiv.textContent = day;
        calendarDaysDiv.appendChild(dayDiv);
    }
}

function prevMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar();
}

function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar();
}

window.addEventListener('load', renderCalendar);

/////////////////////

function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    document.getElementById('clock').textContent = `${hours}:${minutes}:${seconds}`;
}

updateClock();
setInterval(updateClock, 1000);


