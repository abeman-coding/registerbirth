// Birth Registration System - Complete JavaScript

// Global variables
let records = [];
let currentYear = new Date().getFullYear();
let currentPage = 1;
const recordsPerPage = 10;

// Initialize the system when page loads
document.addEventListener('DOMContentLoaded', function() {
    init();
});

function init() {
    loadFromStorage();
    populateYearSelect();
    updateDashboard();
    loadRecords();
    setupEventListeners();
    console.log('System initialized with', records.length, 'records');
}

// Load data from localStorage
function loadFromStorage() {
    const saved = localStorage.getItem('birthRecords');
    records = saved ? JSON.parse(saved) : [];
    
    // Add some sample data if no records exist
    if (records.length === 0) {
        addSampleData();
    }
}

// Add sample data for demonstration
function addSampleData() {
    const sampleRecords = [
        {
            id: 'BR' + Date.now() + '1',
            childName: 'John Smith',
            gender: 'Male',
            birthDate: '2023-05-15',
            birthTime: '14:30',
            birthPlace: 'City Hospital',
            birthWeight: '3.5',
            motherName: 'Mary Smith',
            fatherName: 'Robert Smith',
            address: '123 Main St, City',
            phone: '555-0101',
            email: 'smith@email.com',
            registrationDate: new Date().toISOString(),
            year: 2023
        },
        {
            id: 'BR' + Date.now() + '2',
            childName: 'Emma Johnson',
            gender: 'Female',
            birthDate: '2022-08-20',
            birthTime: '09:45',
            birthPlace: 'General Hospital',
            birthWeight: '3.2',
            motherName: 'Sarah Johnson',
            fatherName: 'Michael Johnson',
            address: '456 Oak Ave, Town',
            phone: '555-0102',
            email: 'johnson@email.com',
            registrationDate: new Date().toISOString(),
            year: 2022
        },
        {
            id: 'BR' + Date.now() + '3',
            childName: 'David Brown',
            gender: 'Male',
            birthDate: '2024-01-10',
            birthTime: '22:15',
            birthPlace: 'Memorial Hospital',
            birthWeight: '3.8',
            motherName: 'Lisa Brown',
            fatherName: 'James Brown',
            address: '789 Pine Rd, Village',
            phone: '555-0103',
            email: 'brown@email.com',
            registrationDate: new Date().toISOString(),
            year: 2024
        }
    ];
    
    records = sampleRecords;
    saveToStorage();
}

// Save data to localStorage
function saveToStorage() {
    localStorage.setItem('birthRecords', JSON.stringify(records));
    console.log('Records saved to storage');
}

// Populate year select dropdowns
function populateYearSelect() {
    const yearSelect = document.getElementById('yearSelect');
    const filterYear = document.getElementById('filterYear');
    const currentYear = new Date().getFullYear();
    
    if (!yearSelect || !filterYear) return;
    
    yearSelect.innerHTML = '';
    filterYear.innerHTML = '<option value="all">All Years</option>';
    
    for (let year = currentYear; year >= 2000; year--) {
        // Year navigator
        const option1 = document.createElement('option');
        option1.value = year;
        option1.textContent = year;
        yearSelect.appendChild(option1);
        
        // Filter dropdown
        const option2 = document.createElement('option');
        option2.value = year;
        option2.textContent = year;
        filterYear.appendChild(option2);
    }
    
    yearSelect.value = currentYear;
}

// Switch between sections
function switchSection(sectionId) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    const section = document.getElementById(sectionId);
    if (section) section.classList.add('active');
    
    document.querySelectorAll('.nav li').forEach(li => li.classList.remove('active'));
    const activeLink = document.querySelector(`.nav a[onclick="switchSection('${sectionId}')"]`);
    if (activeLink) activeLink.parentElement.classList.add('active');
    
    if (sectionId === 'dashboard') updateDashboard();
    if (sectionId === 'records') loadRecords();
    if (sectionId === 'search') clearSearch();
}

// Change year in navigator
function changeYear(direction) {
    const select = document.getElementById('yearSelect');
    if (!select) return;
    
    let newYear = parseInt(select.value) + direction;
    const currentYear = new Date().getFullYear();
    
    if (newYear >= 2000 && newYear <= currentYear) {
        select.value = newYear;
        updateYear(newYear);
    }
}

// Update year
function updateYear(year) {
    currentYear = parseInt(year);
    updateDashboard();
}

// Register new birth - MAIN FUNCTION
function registerBirth(event) {
    event.preventDefault();
    console.log('Registering new birth...');
    
    // Get form values
    const childName = document.getElementById('childName')?.value;
    const gender = document.getElementById('gender')?.value;
    const birthDate = document.getElementById('birthDate')?.value;
    const birthTime = document.getElementById('birthTime')?.value;
    const birthPlace = document.getElementById('birthPlace')?.value;
    const birthWeight = document.getElementById('birthWeight')?.value;
    const motherName = document.getElementById('motherName')?.value;
    const fatherName = document.getElementById('fatherName')?.value;
    const address = document.getElementById('address')?.value;
    const phone = document.getElementById('phone')?.value;
    const email = document.getElementById('email')?.value;

    // Validate required fields
    if (!childName || !gender || !birthDate || !birthPlace || !motherName || !fatherName || !address) {
        showToast('Please fill all required fields', 'error');
        return;
    }

    // Create record object
    const record = {
        id: 'BR' + Date.now() + Math.random().toString(36).substr(2, 5),
        childName: childName,
        gender: gender,
        birthDate: birthDate,
        birthTime: birthTime || '',
        birthPlace: birthPlace,
        birthWeight: birthWeight || '',
        motherName: motherName,
        fatherName: fatherName,
        address: address,
        phone: phone || '',
        email: email || '',
        registrationDate: new Date().toISOString(),
        year: new Date(birthDate).getFullYear()
    };

    // Add to records array
    records.push(record);
    
    // Save to localStorage
    saveToStorage();
    
    // Show success message
    showToast('Birth registered successfully!');
    console.log('Record added:', record);
    
    // Reset form
    document.getElementById('birthForm').reset();
    
    // Update displays
    updateDashboard();
    loadRecords();
    
    // Switch to records section
    setTimeout(() => {
        switchSection('records');
    }, 1000);
}

// Reset registration form
function resetForm() {
    document.getElementById('birthForm').reset();
    showToast('Form cleared');
}

// Load records with filters
function loadRecords() {
    const filterYear = document.getElementById('filterYear');
    const filterGender = document.getElementById('filterGender');
    const recordsBody = document.getElementById('recordsBody');
    const pageInfo = document.getElementById('pageInfo');
    const prevPage = document.getElementById('prevPage');
    const nextPage = document.getElementById('nextPage');
    
    if (!filterYear || !filterGender || !recordsBody) return;
    
    const yearFilter = filterYear.value;
    const genderFilter = filterGender.value;
    
    let filtered = [...records];
    
    // Apply year filter
    if (yearFilter !== 'all') {
        filtered = filtered.filter(r => r.year === parseInt(yearFilter));
    }
    
    // Apply gender filter
    if (genderFilter !== 'all') {
        filtered = filtered.filter(r => r.gender === genderFilter);
    }
    
    // Calculate pagination
    const totalPages = Math.ceil(filtered.length / recordsPerPage) || 1;
    if (currentPage > totalPages) currentPage = totalPages;
    
    const start = (currentPage - 1) * recordsPerPage;
    const paginated = filtered.slice(start, start + recordsPerPage);
    
    // Update pagination controls
    if (pageInfo) pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    if (prevPage) prevPage.disabled = currentPage === 1;
    if (nextPage) nextPage.disabled = currentPage === totalPages;
    
    // Render table
    recordsBody.innerHTML = '';
    
    if (paginated.length === 0) {
        recordsBody.innerHTML = '<tr><td colspan="8" class="no-data">No records found</td></tr>';
        return;
    }
    
    paginated.forEach(record => {
        const row = recordsBody.insertRow();
        row.innerHTML = `
            <td>${record.id.substring(0, 8)}...</td>
            <td>${record.childName}</td>
            <td><i class="fas fa-${record.gender === 'Male' ? 'mars' : record.gender === 'Female' ? 'venus' : 'genderless'}"></i> ${record.gender}</td>
            <td>${formatDate(record.birthDate)}</td>
            <td>${record.birthPlace.substring(0, 15)}${record.birthPlace.length > 15 ? '...' : ''}</td>
            <td>${record.motherName}</td>
            <td>${record.fatherName}</td>
            <td>
                <button class="action-btn view-btn" onclick="viewRecord('${record.id}')"><i class="fas fa-eye"></i></button>
                <button class="action-btn edit-btn" onclick="editRecord('${record.id}')"><i class="fas fa-edit"></i></button>
                <button class="action-btn delete-btn" onclick="deleteRecord('${record.id}')"><i class="fas fa-trash"></i></button>
            </td>
        `;
    });
}

// Change page
function changePage(direction) {
    currentPage += direction;
    if (currentPage < 1) currentPage = 1;
    loadRecords();
}

// View record details
function viewRecord(id) {
    const record = records.find(r => r.id === id);
    if (!record) {
        showToast('Record not found', 'error');
        return;
    }
    
    const modal = document.getElementById('recordModal');
    const modalBody = document.getElementById('modalBody');
    
    if (!modal || !modalBody) return;
    
    modalBody.innerHTML = `
        <div class="record-detail">
            <div class="detail-row"><span class="detail-label">Record ID:</span><span class="detail-value">${record.id}</span></div>
            <div class="detail-row"><span class="detail-label">Child Name:</span><span class="detail-value">${record.childName}</span></div>
            <div class="detail-row"><span class="detail-label">Gender:</span><span class="detail-value">${record.gender}</span></div>
            <div class="detail-row"><span class="detail-label">Birth Date:</span><span class="detail-value">${formatDate(record.birthDate)} ${record.birthTime || ''}</span></div>
            <div class="detail-row"><span class="detail-label">Birth Place:</span><span class="detail-value">${record.birthPlace}</span></div>
            <div class="detail-row"><span class="detail-label">Birth Weight:</span><span class="detail-value">${record.birthWeight ? record.birthWeight + ' kg' : 'Not recorded'}</span></div>
            <div class="detail-row"><span class="detail-label">Mother:</span><span class="detail-value">${record.motherName}</span></div>
            <div class="detail-row"><span class="detail-label">Father:</span><span class="detail-value">${record.fatherName}</span></div>
            <div class="detail-row"><span class="detail-label">Address:</span><span class="detail-value">${record.address}</span></div>
            <div class="detail-row"><span class="detail-label">Contact:</span><span class="detail-value">${record.phone || 'Not provided'} ${record.email ? ' | ' + record.email : ''}</span></div>
            <div class="detail-row"><span class="detail-label">Registered:</span><span class="detail-value">${new Date(record.registrationDate).toLocaleString()}</span></div>
        </div>
    `;
    
    modal.style.display = 'block';
}

// Edit record
function editRecord(id) {
    const record = records.find(r => r.id === id);
    if (!record) {
        showToast('Record not found', 'error');
        return;
    }
    
    // Fill form with record data
    document.getElementById('childName').value = record.childName;
    document.getElementById('gender').value = record.gender;
    document.getElementById('birthDate').value = record.birthDate;
    document.getElementById('birthTime').value = record.birthTime || '';
    document.getElementById('birthPlace').value = record.birthPlace;
    document.getElementById('birthWeight').value = record.birthWeight || '';
    document.getElementById('motherName').value = record.motherName;
    document.getElementById('fatherName').value = record.fatherName;
    document.getElementById('address').value = record.address;
    document.getElementById('phone').value = record.phone || '';
    document.getElementById('email').value = record.email || '';
    
    // Remove old record
    records = records.filter(r => r.id !== id);
    saveToStorage();
    
    // Switch to registration form
    switchSection('register');
    showToast('You can now edit the record and resubmit');
}

// Delete record
function deleteRecord(id) {
    if (confirm('Are you sure you want to delete this record?')) {
        records = records.filter(r => r.id !== id);
        saveToStorage();
        showToast('Record deleted successfully');
        loadRecords();
        updateDashboard();
    }
}

// Search records
function searchRecords() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    
    if (!searchInput || !searchResults) return;
    
    const searchTerm = searchInput.value.toLowerCase();
    
    if (searchTerm.length < 2) {
        searchResults.innerHTML = '';
        return;
    }
    
    const filtered = records.filter(record => 
        record.childName.toLowerCase().includes(searchTerm) ||
        record.id.toLowerCase().includes(searchTerm) ||
        record.motherName.toLowerCase().includes(searchTerm) ||
        record.fatherName.toLowerCase().includes(searchTerm)
    );
    
    if (filtered.length === 0) {
        searchResults.innerHTML = '<div class="no-data">No matching records found</div>';
        return;
    }
    
    searchResults.innerHTML = filtered.map(record => `
        <div class="result-item" onclick="viewRecord('${record.id}')">
            <strong>${record.childName}</strong> - ${formatDate(record.birthDate)}<br>
            <small>Mother: ${record.motherName} | Father: ${record.fatherName}</small>
            <br><small>ID: ${record.id}</small>
        </div>
    `).join('');
}

// Clear search
function clearSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    
    if (searchInput) searchInput.value = '';
    if (searchResults) searchResults.innerHTML = '';
}

// Update dashboard statistics
function updateDashboard() {
    const totalRecords = document.getElementById('totalRecords');
    const thisYearCount = document.getElementById('thisYearCount');
    const genderRatio = document.getElementById('genderRatio');
    const monthlyAvg = document.getElementById('monthlyAvg');
    
    if (!totalRecords || !thisYearCount || !genderRatio || !monthlyAvg) return;
    
    // Total records
    totalRecords.textContent = records.length;
    
    // This year count
    const currentYear = new Date().getFullYear();
    const yearCount = records.filter(r => r.year === currentYear).length;
    thisYearCount.textContent = yearCount;
    
    // Gender ratio
    const males = records.filter(r => r.gender === 'Male').length;
    const females = records.filter(r => r.gender === 'Female').length;
    genderRatio.textContent = `${males}/${females}`;
    
    // Monthly average
    const monthlyAverage = records.length > 0 ? (records.length / 12).toFixed(1) : 0;
    monthlyAvg.textContent = monthlyAverage;
}

// Format date for display
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.className = 'toast ' + type;
    toast.style.display = 'block';
    
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

// Close modal
function closeModal() {
    const modal = document.getElementById('recordModal');
    if (modal) modal.style.display = 'none';
}

// Export records to CSV
function exportRecords() {
    const filterYear = document.getElementById('filterYear');
    const filterGender = document.getElementById('filterGender');
    
    if (!filterYear || !filterGender) return;
    
    const yearFilter = filterYear.value;
    const genderFilter = filterGender.value;
    
    let filtered = [...records];
    
    if (yearFilter !== 'all') {
        filtered = filtered.filter(r => r.year === parseInt(yearFilter));
    }
    
    if (genderFilter !== 'all') {
        filtered = filtered.filter(r => r.gender === genderFilter);
    }
    
    if (filtered.length === 0) {
        showToast('No records to export', 'error');
        return;
    }
    
    const csv = convertToCSV(filtered);
    downloadCSV(csv, 'birth_records.csv');
    showToast('Records exported successfully');
}

// Convert to CSV
function convertToCSV(data) {
    const headers = ['ID', 'Child Name', 'Gender', 'Birth Date', 'Birth Time', 'Birth Place', 'Birth Weight', 'Mother', 'Father', 'Address', 'Phone', 'Email', 'Registration Date'];
    
    const rows = data.map(record => [
        record.id,
        record.childName,
        record.gender,
        record.birthDate,
        record.birthTime || '',
        record.birthPlace,
        record.birthWeight || '',
        record.motherName,
        record.fatherName,
        record.address,
        record.phone || '',
        record.email || '',
        record.registrationDate
    ]);
    
    return [headers, ...rows].map(row => row.map(cell => 
        typeof cell === 'string' && cell.includes(',') ? `"${cell}"` : cell
    ).join(',')).join('\n');
}

// Download CSV
function downloadCSV(csv, filename) {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// Setup additional event listeners
function setupEventListeners() {
    // Close modal when clicking outside
    window.onclick = function(event) {
        const modal = document.getElementById('recordModal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
    
    // Add keyboard shortcut for search (Ctrl+K)
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            switchSection('search');
            document.getElementById('searchInput')?.focus();
        }
    });
    
    console.log('Event listeners setup complete');
}

// Make functions globally available
window.switchSection = switchSection;
window.changeYear = changeYear;
window.updateYear = updateYear;
window.registerBirth = registerBirth;
window.resetForm = resetForm;
window.loadRecords = loadRecords;
window.changePage = changePage;
window.viewRecord = viewRecord;
window.editRecord = editRecord;
window.deleteRecord = deleteRecord;
window.searchRecords = searchRecords;
window.clearSearch = clearSearch;
window.closeModal = closeModal;
window.exportRecords = exportRecords;
