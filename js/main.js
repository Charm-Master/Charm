document.addEventListener('DOMContentLoaded', () => {
    loadProjects(pythonProjects, 'python-projects-container');
    loadProjects(htmlProjects, 'html-projects-container');
    initTheme();
});

function showSection(sectionId) {
    const sections = document.querySelectorAll('main section');
    sections.forEach(section => {
        section.style.display = (section.id === sectionId) ? 'block' : 'none';
    });
}

function initTheme() {
    const themeSelect = document.getElementById('theme-select');
    const savedTheme = localStorage.getItem('selectedTheme') || 'light-mode';
    applyTheme(savedTheme);
    themeSelect.value = savedTheme;

    themeSelect.addEventListener('change', () => {
        const selectedTheme = themeSelect.value;
        applyTheme(selectedTheme);
        localStorage.setItem('selectedTheme', selectedTheme);
    });
}

function applyTheme(theme) {
    document.body.className = ''; // Reset existing classes
    document.body.classList.add(theme);
}
document.addEventListener('DOMContentLoaded', () => {
    loadProjects(pythonProjects, 'python-projects-container');
    loadProjects(htmlProjects, 'html-projects-container');
    initTheme();
});

function showSection(sectionId) {
    const sections = document.querySelectorAll('main section');
    sections.forEach(section => {
        section.style.display = (section.id === sectionId) ? 'block' : 'none';
    });
}

function initTheme() {
    const themeSelect = document.getElementById('theme-select');
    const savedTheme = localStorage.getItem('selectedTheme') || 'light-mode';
    applyTheme(savedTheme);
    themeSelect.value = savedTheme;

    themeSelect.addEventListener('change', () => {
        const selectedTheme = themeSelect.value;
        applyTheme(selectedTheme);
        localStorage.setItem('selectedTheme', selectedTheme);
    });
}

function applyTheme(theme) {
    document.body.className = '';
    document.body.classList.add(theme);
}
