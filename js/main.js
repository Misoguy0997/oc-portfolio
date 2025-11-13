// js/main.js 파일 맨 위에 추가
const SUPABASE_URL = 'https://yayvkafolgscdoaelgyg.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlheXZrYWZvbGdzY2RvYWVsZ3lnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4Njg3MTMsImV4cCI6MjA3ODQ0NDcxM30.OZOWP78fDGRrCV_yWBnQMGryLgyCbpdNbl-01aAL5fs';
// [수정] 변수 이름을 'supabaseClient' (또는 다른 이름)로 변경합니다.
// (참고: 오른쪽의 'supabase'는 CDN 스크립트가 제공하는 전역 객체입니다.)
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ==================== 
// Global State
// ====================

let characters = [];
let stories = [];
let currentEditId = null;
let currentStoryEditId = null;
let currentImageBase64 = null;

// ==================== 
// API Functions (supabase-js 버전으로 교체)
// ====================

async function fetchCharacters() {
    try {
        showLoading();
        const { data, error } = await supabaseClient
            .from('characters')
            .select('*')
            .order('createdAt', { ascending: false });

        if (error) throw error;
        characters = data || [];
        return characters;
    } catch (error) {
        console.error('Error fetching characters:', error);
        showNotification('Failed to load characters', 'error');
        return [];
    } finally {
        hideLoading();
    }
}

async function createCharacter(characterData) {
    try {
        showLoading();
        const { error } = await supabaseClient
            .from('characters')
            .insert(characterData);

        if (error) throw error;
        showNotification('Character created successfully!', 'success');
        return true;
    } catch (error) {
        console.error('Error creating character:', error.message);
        showNotification('Failed to create character. Check permissions.', 'error');
        throw error;
    } finally {
        hideLoading();
    }
}

async function updateCharacter(id, characterData) {
    try {
        showLoading();
        const { error } = await supabaseClient
            .from('characters')
            .update(characterData)
            .eq('id', id);

        if (error) throw error;
        showNotification('Character updated successfully!', 'success');
        return true;
    } catch (error) {
        console.error('Error updating character:', error.message);
        showNotification('Failed to update character. Check permissions.', 'error');
        throw error;
    } finally {
        hideLoading();
    }
}

async function deleteCharacter(id) {
    try {
        showLoading();
        const { error } = await supabaseClient
            .from('characters')
            .delete()
            .eq('id', id);

        if (error) throw error;
        showNotification('Character deleted successfully!', 'success');
        return true;
    } catch (error) {
        console.error('Error deleting character:', error.message);
        showNotification('Failed to delete character. Check permissions.', 'error');
        throw error;
    } finally {
        hideLoading();
    }
}

// [추가] Story API Functions

async function fetchStories() {
    try {
        showLoading();
        const { data, error } = await supabaseClient
            .from('stories') // 'characters' -> 'stories'
            .select('*')
            .order('createdAt', { ascending: false });

        if (error) throw error;
        stories = data || []; // 'characters' -> 'stories'
        return stories;
    } catch (error) {
        console.error('Error fetching stories:', error);
        showNotification('Failed to load stories', 'error');
        return [];
    } finally {
        hideLoading();
    }
}

async function createStory(storyData) {
    try {
        showLoading();
        const { error } = await supabaseClient
            .from('stories') // 'characters' -> 'stories'
            .insert(storyData);
        
        if (error) throw error;
        showNotification('Story created successfully!', 'success');
        return true;
    } catch (error) {
        console.error('Error creating story:', error.message);
        showNotification('Failed to create story. Check permissions.', 'error');
        throw error;
    } finally {
        hideLoading();
    }
}

async function updateStory(id, storyData) {
    try {
        showLoading();
        const { error } = await supabaseClient
            .from('stories') // 'characters' -> 'stories'
            .update(storyData)
            .eq('id', id);
        
        if (error) throw error;
        showNotification('Story updated successfully!', 'success');
        return true;
    } catch (error) {
        console.error('Error updating story:', error.message);
        showNotification('Failed to update story. Check permissions.', 'error');
        throw error;
    } finally {
        hideLoading();
    }
}

async function createStory(storyData) {
    try {
        showLoading();
        const { error } = await supabaseClient
            .from('stories') // 'characters' -> 'stories'
            .insert(storyData);
        
        if (error) throw error;
        showNotification('Story created successfully!', 'success');
        return true;
    } catch (error) {
        console.error('Error creating story:', error.message);
        showNotification('Failed to create story. Check permissions.', 'error');
        throw error;
    } finally {
        hideLoading();
    }
}

async function updateStory(id, storyData) {
    try {
        showLoading();
        const { error } = await supabaseClient
            .from('stories') // 'characters' -> 'stories'
            .update(storyData)
            .eq('id', id);
        
        if (error) throw error;
        showNotification('Story updated successfully!', 'success');
        return true;
    } catch (error) {
        console.error('Error updating story:', error.message);
        showNotification('Failed to update story. Check permissions.', 'error');
        throw error;
    } finally {
        hideLoading();
    }
}

async function deleteStory(id) {
    try {
        showLoading();
        const { error } = await supabaseClient
            .from('stories') // 'characters' -> 'stories'
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        showNotification('Story deleted successfully!', 'success');
        return true;
    } catch (error) {
        console.error('Error deleting story:', error.message);
        showNotification('Failed to delete story. Check permissions.', 'error');
        throw error;
    } finally {
        hideLoading();
    }
}

// ==================== 
// UI Rendering Functions
// ====================

// main.js의 renderCharacterGallery 함수를 이 코드로 교체하세요.

function renderCharacterGallery() {
    const grid = document.getElementById('character-grid');
    
    // 1. innerHTML 대신 grid를 비웁니다.
    grid.innerHTML = ''; 

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
    
    // 2. 각 캐릭터를 순회하며 DOM 요소를 직접 만듭니다.
    characters.forEach(char => {
        const excerpt = char.description ? 
            char.description.split('\n')[0].substring(0, 150) + '...' : 
            'No description available';
        
        // 3. 카드 요소 생성
        const card = document.createElement('div');
        card.className = 'character-card';
        
        // 4. onclick 속성 대신 addEventListener 사용
        //    이렇게 하면 char.id가 어떤 값이든 안전합니다.
        card.addEventListener('click', () => {
            openCharacterModal(char.id);
        });

        // 5. 카드 내부 HTML 설정
        card.innerHTML = `
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
        `;
        
        // 6. 완성된 카드를 grid에 추가
        grid.appendChild(card);
    });
}

// main.js의 renderAdminGrid 함수를 이 코드로 교체하세요.

function renderAdminGrid() {
    const grid = document.getElementById('admin-grid');
    
    // 1. innerHTML 대신 grid를 비웁니다.
    grid.innerHTML = ''; 

    if (characters.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: var(--text-secondary);">
                <p>No characters to manage yet. Click "Add New Character" to get started!</p>
            </div>
        `;
        return;
    }
    
    // 2. 각 캐릭터를 순회하며 DOM 요소를 직접 만듭니다.
    characters.forEach(char => {
        // 3. 어드민 카드 요소 생성
        const card = document.createElement('div');
        card.className = 'admin-card';

        // 4. 어드민 카드 내부 HTML 설정
        card.innerHTML = `
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
                <button class="btn btn-secondary btn-sm" id="edit-btn-${char.id}">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-danger btn-sm" id="delete-btn-${char.id}">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        `;
        
        // 5. 완성된 카드를 grid에 추가
        grid.appendChild(card);

        // 6. (가장 중요) ID로 버튼을 찾아서 addEventListener를 안전하게 연결합니다.
        const editButton = card.querySelector(`#edit-btn-${char.id}`);
        editButton.addEventListener('click', () => {
            openEditModal(char.id);
        });

        const deleteButton = card.querySelector(`#delete-btn-${char.id}`);
        deleteButton.addEventListener('click', () => {
            confirmDelete(char.id, char.name);
        });
    });
}

// [추가] Story Render Functions

function renderStoryGrid() {
    const grid = document.getElementById('story-grid');
    grid.innerHTML = ''; 

    if (stories.length === 0) {
        grid.innerHTML = `<div style="..."><p>No stories yet.</p></div>`; // 캐릭터 그리드와 유사하게 처리
        return;
    }
    
    stories.forEach(story => {
        const card = document.createElement('div');
        card.className = 'story-card';
        card.addEventListener('click', () => {
            openStoryModal(story.id);
        });

        card.innerHTML = `
            <h3 class="story-card-title">${story.title}</h3>
        `;
        grid.appendChild(card);
    });
}

function renderAdminStoryGrid() {
    const grid = document.getElementById('admin-story-grid');
    grid.innerHTML = ''; 

    if (stories.length === 0) {
        grid.innerHTML = `<div style="..."><p>No stories to manage yet.</p></div>`;
        return;
    }
    
    stories.forEach(story => {
        const card = document.createElement('div');
        card.className = 'admin-card';
        
        // 스토리 어드민 카드는 제목만 표시
        card.innerHTML = `
            <div class="admin-card-header">
                <div class="admin-card-thumbnail"><i class="fas fa-book"></i></div>
                <div>
                    <h3 class="admin-card-title">${story.title}</h3>
                </div>
            </div>
            <div class="admin-card-actions">
                <button class="btn btn-secondary btn-sm" id="edit-story-btn-${story.id}">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-danger btn-sm" id="delete-story-btn-${story.id}">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        `;
        
        grid.appendChild(card);

        // 이벤트 리스너 연결
        card.querySelector(`#edit-story-btn-${story.id}`).addEventListener('click', () => {
            openStoryEditModal(story.id);
        });
        card.querySelector(`#delete-story-btn-${story.id}`).addEventListener('click', () => {
            confirmStoryDelete(story.id, story.title);
        });
    });
}

// ==================== 
// Auth Functions (새로 추가)
// ====================

function closeLoginModal() {
    document.getElementById('login-modal').classList.remove('active');
    document.body.style.overflow = '';
}

async function handleLogin(event) {
    event.preventDefault();
    showLoading();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const errorMsg = document.getElementById('login-error-msg');

    try {
        const { error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) throw error;

        // 성공 시 모달 닫고 UI 갱신 (onAuthStateChange가 처리)
        closeLoginModal();
        errorMsg.style.display = 'none';
    } catch (error) {
        console.error('Login error:', error.message);
        errorMsg.textContent = 'Login failed: ' + error.message;
        errorMsg.style.display = 'block';
    } finally {
        hideLoading();
    }
}

async function handleLogout() {
    showLoading();
    await supabaseClient.auth.signOut();
    hideLoading();
    // UI 갱신 (onAuthStateChange가 처리)
}

// 이 함수가 로그인 상태에 따라 UI를 변경합니다.
function setupUIForUser(user) {
    if (user) {
        // 로그인 상태
        document.getElementById('nav-login-btn').style.display = 'none';
        document.getElementById('nav-logout-btn').style.display = 'block';
        document.getElementById('nav-manage-link').style.display = 'block';
        document.getElementById('admin').style.display = 'block'; // Admin 섹션 보이기
    } else {
        // 로그아웃 상태
        document.getElementById('nav-login-btn').style.display = 'block';
        document.getElementById('nav-logout-btn').style.display = 'none';
        document.getElementById('nav-manage-link').style.display = 'none';
        document.getElementById('admin').style.display = 'none'; // Admin 섹션 숨기기
    }
}

// ==================== 
// Modal Functions
// ====================

// main.js 파일의 openCharacterModal 함수를 이 코드로 교체하세요.

function openCharacterModal(characterId) {
    
    // --- 🕵️‍♂️ 디버깅을 위한 코드 ---
    console.log('--- 1. 모달 열기 시도 ---');
    console.log('클릭된 ID (타입:', typeof characterId, '):', characterId);
    console.log('현재 characters 배열:', characters);
    // --- 디버깅 종료 ---

    // DB에서 가져온 c.id와 클릭으로 넘어온 characterId를 비교
    const character = characters.find(c => c.id == characterId); // 느슨한 비교(==) 유지
    
    // --- 🕵️‍♂️ 디버깅을 위한 코드 ---
    console.log('찾은 캐릭터 객체:', character);
    // --- 디버깅 종료 ---

    if (!character) {
        console.error('--- 2. 캐릭터 찾기 실패! ---'); // <-- 실패 시 콘솔에 에러 표시
        return;
    }
    
    // 여기부터는 캐릭터를 찾았을 때 실행되는 코드
    console.log('--- 3. 캐릭터 찾기 성공! 모달을 엽니다. ---');
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

// main.js 파일의 openEditModal 함수 전체를 이 코드로 교체하세요.

function openEditModal(characterId = null) {
    currentEditId = characterId;
    currentImageBase64 = null;
    
    const modal = document.getElementById('edit-modal');
    const title = document.getElementById('edit-modal-title');
    const form = document.getElementById('character-form');
    const nameInput = document.getElementById('character-name');
    const descInput = document.getElementById('character-description');
    const imageUrlInput = document.getElementById('character-image-url');
    
    // [수정 1] imagePreview 변수 정의
    const imagePreview = document.getElementById('image-preview');
    const previewImage = document.getElementById('preview-image');
    const fileNameSpan = document.getElementById('file-name');
    
    // 폼 리셋
    form.reset();
    imagePreview.classList.remove('active');
    fileNameSpan.textContent = 'No file chosen';
    
    // [수정 2] 삭제되었던 if/else 로직 복원
    if (characterId) {
        // Edit mode
        // [수정 3] '==' (느슨한 비교) 사용
        const character = characters.find(c => c.id == characterId); 
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
        } else {
             // ID는 있지만 캐릭터를 못 찾은 경우 (혹은 버그)
             title.textContent = 'Add New Character';
        }
    } else {
        // Add mode
        title.textContent = 'Add New Character';
    }
    
    // [수정 4] 삭제되었던 모달 열기 코드 복원
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

// [추가] Story Modal Functions (Modal Functions 섹션에)

function openStoryModal(storyId) {
    const story = stories.find(s => s.id == storyId);
    if (!story) return;

    document.getElementById('story-modal-title').textContent = story.title;
    document.getElementById('story-modal-content').textContent = story.content;
    document.getElementById('story-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeStoryModal() {
    document.getElementById('story-modal').classList.remove('active');
    document.body.style.overflow = '';
}

function openStoryEditModal(storyId = null) {
    currentStoryEditId = storyId;
    const modal = document.getElementById('story-edit-modal');
    const title = document.getElementById('story-edit-modal-title');
    const form = document.getElementById('story-form');
    
    form.reset();
    
    if (storyId) {
        // Edit mode
        const story = stories.find(s => s.id == storyId);
        if (story) {
            title.textContent = 'Edit Story';
            document.getElementById('story-title').value = story.title;
            document.getElementById('story-content').value = story.content;
        }
    } else {
        // Add mode
        title.textContent = 'Add New Story';
    }
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeStoryEditModal() {
    document.getElementById('story-edit-modal').classList.remove('active');
    document.body.style.overflow = '';
    currentStoryEditId = null;
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

// main.js의 handleFormSubmit 함수를 이 코드로 교체하세요.

async function handleFormSubmit(event) {
    event.preventDefault();
    
    const name = document.getElementById('character-name').value.trim();
    const description = document.getElementById('character-description').value.trim();
    const imageUrl = currentImageBase64 || document.getElementById('character-image-url').value || '';
    
    if (!name || !description) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    try {
        if (currentEditId) {
            // --- [수정됨] UPDATE (수정) 로직 ---
            // 'createdAt'이 빠진 업데이트용 객체를 만듭니다.
            const updatedData = {
                name,
                description,
                imageUrl
                // (참고: Supabase는 'updated_at' 필드를 자동으로 갱신합니다)
            };
            await updateCharacter(currentEditId, updatedData);

        } else {
            // --- [기존] CREATE (생성) 로직 ---
            // 'createdAt'이 포함된 생성용 객체를 만듭니다.
            const characterData = {
                name,
                description,
                imageUrl,
                createdAt: new Date().toISOString()
            };
            await createCharacter(characterData);
        }
        
        closeEditModal();
        await loadAndRenderAll();
    } catch (error) {
        console.error('Error submitting form:', error);
    }
}

// [추가] Story Form Submission (Form Submission 섹션에)
async function handleStoryFormSubmit(event) {
    event.preventDefault();
    
    const title = document.getElementById('story-title').value.trim();
    const content = document.getElementById('story-content').value.trim();
    
    if (!title || !content) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    try {
        if (currentStoryEditId) {
            // Update
            const updatedData = { title, content };
            await updateStory(currentStoryEditId, updatedData);
        } else {
            // Create
            const storyData = { title, content };
            await createStory(storyData);
        }
        
        closeStoryEditModal();
        await loadAndRenderAll(); // 전체 새로고침
    } catch (error) {
        console.error('Error submitting story form:', error);
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

// [추가] Story Delete Functions (Delete Functions 섹션에)
function confirmStoryDelete(storyId, storyTitle) {
    if (confirm(`Are you sure you want to delete "${storyTitle}"?`)) {
        handleStoryDelete(storyId);
    }
}

async function handleStoryDelete(storyId) {
    try {
        await deleteStory(storyId);
        await loadAndRenderAll();
    } catch (error) {
        console.error('Error deleting story:', error);
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
    await fetchStories();
    renderCharacterGallery();
    renderStoryGrid();
    renderAdminGrid();
    renderAdminStoryGrid();
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
    // Login modal
    document.getElementById('nav-login-btn').addEventListener('click', () => {
    document.getElementById('login-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
    });
    
    document.getElementById('close-login-modal').addEventListener('click', closeLoginModal);
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('nav-logout-btn').addEventListener('click', handleLogout);
    
    // Character modal
    document.getElementById('close-modal').addEventListener('click', closeCharacterModal);
    document.getElementById('character-modal').addEventListener('click', function(e) {
        if (e.target === this) closeCharacterModal();
    });

    // Story modal
    document.getElementById('close-story-modal').addEventListener('click', closeStoryModal);
    document.getElementById('story-modal').addEventListener('click', function(e) {
        if (e.target === this) closeStoryModal();
    });
    
    // Edit modal
    document.getElementById('close-edit-modal').addEventListener('click', closeEditModal);
    document.getElementById('cancel-edit').addEventListener('click', closeEditModal);
    document.getElementById('edit-modal').addEventListener('click', function(e) {
        if (e.target === this) closeEditModal();
    });

    // Story Edit modal
    document.getElementById('close-story-edit-modal').addEventListener('click', closeStoryEditModal);
    document.getElementById('cancel-story-edit').addEventListener('click', closeStoryEditModal);
    document.getElementById('story-edit-modal').addEventListener('click', function(e) {
        if (e.target === this) closeStoryEditModal();
    });
    
    // Add character button
    document.getElementById('add-character-btn').addEventListener('click', () => openEditModal());

    // Add story button
    document.getElementById('add-story-btn').addEventListener('click', () => openStoryEditModal());
    
    // Form submission
    document.getElementById('character-form').addEventListener('submit', handleFormSubmit);

    // Story Form submission
    document.getElementById('story-form').addEventListener('submit', handleStoryFormSubmit);
    
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
            closeLoginModal();
            closeStoryModal();
            closeStoryEditModal();
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
    
    // (중요) 인증 상태가 변경될 때마다 UI를 갱신합니다.
    supabaseClient.auth.onAuthStateChange((event, session) => {
        // [수정] session이 null일 수 있으므로, user 객체를 안전하게 추출합니다.
        const user = session ? session.user : null;
        setupUIForUser(user);
    });
    
    await loadAndRenderAll();
    
    console.log('Character Portfolio initialized successfully!');
});
