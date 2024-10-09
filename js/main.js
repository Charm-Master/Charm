function changeTheme() {
    const theme = document.getElementById('themeSelect').value;
    document.body.className = theme + '-mode';
}
