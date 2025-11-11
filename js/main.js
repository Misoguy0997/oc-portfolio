// js/main.js 파일 맨 위에 추가
const SUPABASE_URL = 'https://yayvkafolgscdoaelgyg.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlheXZrYWZvbGdzY2RvYWVsZ3lnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4Njg3MTMsImV4cCI6MjA3ODQ0NDcxM30.OZOWP78fDGRrCV_yWBnQMGryLgyCbpdNbl-01aAL5fs';
const API_ENDPOINT = `${SUPABASE_URL}/rest/v1/characters`; // 'characters' 테이블 주소

// ==================== 
// Global State
// ====================

let characters = [];
let currentEditId = null;
let currentImageBase64 = null;

// ==================== 
// API Functions
// ====================

async function fetchCharacters() {
    try {
        showLoading();
        // 1. 주소 변경 및 정렬 파라미터 추가
        const response = await fetch(`${API_ENDPOINT}?select=*&order=createdAt.desc`, {
            headers: {
                'apikey': SUPABASE_KEY, // 2. API 키 헤더에 추가
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });
        const data = await response.json();
        characters = data || []; // 3. Supabase는 data.data가 아닌 data에 바로 배열을 줍니다.
        return characters;
    } catch (error) {
        // ... (기존과 동일)
    } finally {
        hideLoading();
    }
}

async function createCharacter(characterData) {
    try {
        showLoading();
        const response = await fetch(API_ENDPOINT, { // 1. 주소 변경
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_KEY, // 2. API 키 헤더에 추가
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Prefer': 'return=minimal' // 3. (Supabase) 생성 후 데이터를 다시 안 받아오게 설정
            },
            body: JSON.stringify(characterData)
        });

        if (response.ok) {
            showNotification('Character created successfully!', 'success');
            return await response.json(); // 원본과 거의 동일
        } else {
            throw new Error('Failed to create character');
        }
    } catch (error) {
        // ... (기존과 동일)
    } finally {
        hideLoading();
    }
}

// main.js 파일의 이 함수를 교체하세요
async function updateCharacter(id, characterData) {
    try {
        showLoading();
        // 1. URL과 Method를 Supabase에 맞게 수정 (PATCH 사용)
        const response = await fetch(`${API_ENDPOINT}?id=eq.${id}`, {
            method: 'PATCH', // PUT 대신 PATCH 사용
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_KEY, // 2. API 키 헤더 추가
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify(characterData)
        });
        
        if (response.ok) {
            showNotification('Character updated successfully!', 'success');
            return await response.json();
        } else {
            throw new Error('Failed to update character');
        }
    } catch (error) {
        console.error('Error updating character:', error);
        showNotification('Failed to update character', 'error');
        throw error;
    } finally {
        hideLoading();
    }
}

async function deleteCharacter(id) {
    try {
        showLoading();
        
        // 1. URL을 Supabase 쿼리 형식으로 변경합니다.
        //    (id가 일치하는 row를 지정합니다)
        const response = await fetch(`${API_ENDPOINT}?id=eq.${id}`, {
            method: 'DELETE',
            headers: {
                // 2. 인증을 위한 API 키를 헤더에 추가합니다.
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });
        
        // 3. Supabase는 성공 시 204 (No Content)를 반환하므로
        //    기존 로직(response.ok || response.status === 204)이 그대로 잘 작동합니다.
        if (response.ok || response.status === 204) {
            showNotification('Character deleted successfully!', 'success');
            return true;
        } else {
            throw new Error('Failed to delete character');
        }
    } catch (error) {
        console.error('Error deleting character:', error);
        showNotification('Failed to delete character', 'error');
        throw error;
    } finally {
        hideLoading();
    }
}

// ==================== 
// UI Rendering Functions
// ====================

function renderCharacterGallery() {
    const grid = document.getElementById('character-grid');
    
    if (characters.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 4rem 2rem; color: var(--text-secondary);">
                <i class="fas fa-users" style="font-size: 4rem; margin-bottom: 1rem; opacity: 0.3;"></i>
                <h3>No characters yet</h3>
                <p>Start by adding your first character in the Management section below</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = characters.map(char => {
        const excerpt = char.description ? 
            char.description.split('\n')[0].substring(0, 150) + '...' : 
            'No description available';
        
        return `
            <div class="character-card" onclick="openCharacterModal('${char.id}')">
                <div class="character-card-image">
                    ${char.imageUrl ? 
                        `<img src="${char.imageUrl}" alt="${char.name}">` :
                        `<i class="fas fa-user placeholder-icon"></i>`
                    }
                </div>
                <div class="character-card-content">
                    <h3 class="character-card-title">${char.name}</h3>
                    <p class="character-card-excerpt">${excerpt}</p>
                </div>
            </div>
        `;
    }).join('');
}

function renderAdminGrid() {
    const grid = document.getElementById('admin-grid');
    
    if (characters.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: var(--text-secondary);">
                <p>No characters to manage yet. Click "Add New Character" to get started!</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = characters.map(char => `
        <div class="admin-card">
            <div class="admin-card-header">
                <div class="admin-card-thumbnail">
                    ${char.imageUrl ? 
                        `<img src="${char.imageUrl}" alt="${char.name}">` :
                        `<i class="fas fa-user"></i>`
                    }
                </div>
                <div>
                    <h3 class="admin-card-title">${char.name}</h3>
                </div>
            </div>
            <div class="admin-card-actions">
                <button class="btn btn-secondary btn-sm" onclick="openEditModal('${char.id}')">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-danger btn-sm" onclick="confirmDelete('${char.id}', '${char.name}')">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join('');
}

// ==================== 
// Modal Functions
// ====================

function openCharacterModal(characterId) {
    const character = characters.find(c => c.id == characterId);
    if (!character) return;
    
    const modal = document.getElementById('character-modal');
    const nameEl = document.getElementById('modal-character-name');
    const descEl = document.getElementById('modal-character-description');
    const imageEl = document.getElementById('modal-character-image');
    
    nameEl.textContent = character.name;
    descEl.textContent = character.description || 'No description available';
    
    if (character.imageUrl) {
        imageEl.src = character.imageUrl;
        imageEl.alt = character.name;
    } else {
        imageEl.src = '';
        imageEl.alt = 'No image';
    }
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCharacterModal() {
    const modal = document.getElementById('character-modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function openEditModal(characterId = null) {
    currentEditId = characterId;
    currentImageBase64 = null;
    
    const modal = document.getElementById('edit-modal');
    const title = document.getElementById('edit-modal-title');
    const form = document.getElementById('character-form');
    const nameInput = document.getElementById('character-name');
    const descInput = document.getElementById('character-description');
    const imageUrlInput = document.getElementById('character-image-url');
    const imagePreview = document.getElementById('image-preview');
    const previewImage = document.getElementById('preview-image');
    const fileNameSpan = document.getElementById('file-name');
    
    // Reset form
    form.reset();
    imagePreview.classList.remove('active');
    fileNameSpan.textContent = 'No file chosen';
    
    if (characterId) {
        // Edit mode
        const character = characters.find(c => c.id === characterId);
        if (character) {
            title.textContent = 'Edit Character';
            nameInput.value = character.name;
            descInput.value = character.description || '';
            imageUrlInput.value = character.imageUrl || '';
            
            if (character.imageUrl) {
                previewImage.src = character.imageUrl;
                imagePreview.classList.add('active');
                currentImageBase64 = character.imageUrl;
            }
        }
    } else {
        // Add mode
        title.textContent = 'Add New Character';
    }
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeEditModal() {
    const modal = document.getElementById('edit-modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    currentEditId = null;
    currentImageBase64 = null;
}

// ==================== 
// Image Upload Functions
// ====================

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        showNotification('Image size must be less than 5MB', 'error');
        return;
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
        showNotification('Please select a valid image file', 'error');
        return;
    }
    
    const fileNameSpan = document.getElementById('file-name');
    fileNameSpan.textContent = file.name;
    
    // Convert to base64
    const reader = new FileReader();
    reader.onload = function(e) {
        const base64String = e.target.result;
        currentImageBase64 = base64String;
        
        // Show preview
        const previewImage = document.getElementById('preview-image');
        const imagePreview = document.getElementById('image-preview');
        previewImage.src = base64String;
        imagePreview.classList.add('active');
        
        document.getElementById('character-image-url').value = base64String;
    };
    reader.readAsDataURL(file);
}

// ==================== 
// Form Submission
// ====================

async function handleFormSubmit(event) {
    event.preventDefault();
    
    const name = document.getElementById('character-name').value.trim();
    const description = document.getElementById('character-description').value.trim();
    const imageUrl = currentImageBase64 || document.getElementById('character-image-url').value || '';
    
    if (!name || !description) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    const characterData = {
        name,
        description,
        imageUrl,
        createdAt: new Date().toISOString()
    };
    
    try {
        if (currentEditId) {
            // Update existing character
            await updateCharacter(currentEditId, characterData);
        } else {
            // Create new character
            await createCharacter(characterData);
        }
        
        closeEditModal();
        await loadAndRenderAll();
    } catch (error) {
        console.error('Error submitting form:', error);
    }
}

// ==================== 
// Delete Functions
// ====================

function confirmDelete(characterId, characterName) {
    if (confirm(`Are you sure you want to delete "${characterName}"? This action cannot be undone.`)) {
        handleDelete(characterId);
    }
}

async function handleDelete(characterId) {
    try {
        await deleteCharacter(characterId);
        await loadAndRenderAll();
    } catch (error) {
        console.error('Error deleting character:', error);
    }
}

// ==================== 
// Utility Functions
// ====================

function showLoading() {
    document.getElementById('loading').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

async function loadAndRenderAll() {
    await fetchCharacters();
    renderCharacterGallery();
    renderAdminGrid();
}

// ==================== 
// Smooth Scrolling
// ====================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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

// ==================== 
// Event Listeners
// ====================

function initEventListeners() {
    // Character modal
    document.getElementById('close-modal').addEventListener('click', closeCharacterModal);
    document.getElementById('character-modal').addEventListener('click', function(e) {
        if (e.target === this) closeCharacterModal();
    });
    
    // Edit modal
    document.getElementById('close-edit-modal').addEventListener('click', closeEditModal);
    document.getElementById('cancel-edit').addEventListener('click', closeEditModal);
    document.getElementById('edit-modal').addEventListener('click', function(e) {
        if (e.target === this) closeEditModal();
    });
    
    // Add character button
    document.getElementById('add-character-btn').addEventListener('click', () => openEditModal());
    
    // Form submission
    document.getElementById('character-form').addEventListener('submit', handleFormSubmit);
    
    // Image upload
    document.getElementById('upload-btn').addEventListener('click', function() {
        document.getElementById('character-image').click();
    });
    document.getElementById('character-image').addEventListener('change', handleImageUpload);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeCharacterModal();
            closeEditModal();
        }
    });
}

// ==================== 
// Initialization
// ====================

document.addEventListener('DOMContentLoaded', async function() {
    console.log('Initializing Character Portfolio...');
    
    // Add CSS animations for notifications
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
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
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Initialize
    initEventListeners();
    initSmoothScroll();
    await loadAndRenderAll();
    
    console.log('Character Portfolio initialized successfully!');
});
