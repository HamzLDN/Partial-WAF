const input = document.getElementById('filter-input');
const table = document.getElementById('ipi-table');

input.addEventListener('input', () => {
const query = input.value.toLowerCase();
const rows = table.querySelectorAll('tbody tr');

rows.forEach(row => {
        const rowText = row.textContent.toLowerCase();
        row.style.display = rowText.includes(query) ? '' : 'none';
    });
});