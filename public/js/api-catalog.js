let apiData = null;
let currentToken = localStorage.getItem('jwt_token') || '';

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
  await loadAPIData();
  initializeEventListeners();
  updateTokenStatus();
  renderModules();
  renderAllAPIs();
});

// Load API data from JSON
async function loadAPIData() {
  try {
    const response = await fetch('./data/api-catalog.json');
    apiData = await response.json();
  } catch (error) {
    showToast('Failed to load API data', 'error');
    console.error('Error loading API data:', error);
  }
}

// Initialize all event listeners
function initializeEventListeners() {
  // Search functionality
  document.getElementById('search-input').addEventListener('input', handleSearch);

  // Token management
  document.getElementById('manage-token-btn').addEventListener('click', openTokenModal);
  document.getElementById('save-token-btn').addEventListener('click', saveToken);
  document.getElementById('clear-token-btn').addEventListener('click', clearToken);

  // Modal close buttons
  document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
      });
    });
  });

  // Close modals on outside click
  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
      e.target.style.display = 'none';
    }
  });

  // Theme toggle
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
}

// Render module navigation
function renderModules() {
  const modulesList = document.getElementById('modules-list');
  modulesList.innerHTML = '';

  apiData.modules.forEach((module, index) => {
    const moduleItem = document.createElement('div');
    moduleItem.className = 'module-item';
    moduleItem.innerHTML = `
      <i class="fas ${module.icon}"></i>
      <span>${module.name}</span>
      <span class="api-count">${module.apis.length}</span>
    `;
    moduleItem.addEventListener('click', () => scrollToModule(module.name));
    modulesList.appendChild(moduleItem);
  });

  updateStats();
}

// Update statistics
function updateStats() {
  const totalModules = apiData.modules.length;
  const totalAPIs = apiData.modules.reduce((sum, module) => sum + module.apis.length, 0);

  document.getElementById('total-modules').textContent = totalModules;
  document.getElementById('total-apis').textContent = totalAPIs;
}

// Render all API cards
function renderAllAPIs(searchTerm = '') {
  const apiCardsContainer = document.getElementById('api-cards');
  apiCardsContainer.innerHTML = '';

  apiData.modules.forEach(module => {
    const filteredAPIs = searchTerm
      ? module.apis.filter(api =>
          api.endpoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
          api.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          module.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : module.apis;

    if (filteredAPIs.length > 0) {
      const moduleSection = document.createElement('div');
      moduleSection.className = 'module-section';
      moduleSection.id = `module-${module.name.replace(/\s+/g, '-').toLowerCase()}`;

      const moduleHeader = document.createElement('div');
      moduleHeader.className = 'module-header';
      moduleHeader.innerHTML = `
        <h2>
          <i class="fas ${module.icon}"></i>
          ${module.name}
        </h2>
        <span class="module-count">${filteredAPIs.length} APIs</span>
      `;
      moduleSection.appendChild(moduleHeader);

      filteredAPIs.forEach(api => {
        const apiCard = createAPICard(api, module);
        moduleSection.appendChild(apiCard);
      });

      apiCardsContainer.appendChild(moduleSection);
    }
  });

  if (apiCardsContainer.innerHTML === '') {
    apiCardsContainer.innerHTML = '<div class="no-results">No APIs found matching your search</div>';
  }
}

// Create individual API card
function createAPICard(api, module) {
  const card = document.createElement('div');
  card.className = 'api-card';

  const roleClass = api.role.toLowerCase();
  const methodClass = api.method.toLowerCase();
  const cardId = `card-${api.endpoint.replace(/[^a-zA-Z0-9]/g, '-')}`;

  const hasRequestBody = api.requestBody && Object.keys(api.requestBody).length > 0;
  const hasResponse = api.responseExample && Object.keys(api.responseExample).length > 0;

  // Create unique IDs for copy buttons
  const requestCopyId = `req-${cardId}`;
  const responseCopyId = `res-${cardId}`;

  card.innerHTML = `
    <div class="api-header">
      <div class="api-title">
        <span class="api-endpoint">${api.endpoint}</span>
      </div>
      <div style="display: flex; gap: 0.5rem; align-items: center;">
        <span class="method-badge ${methodClass}">${api.method}</span>
        <span class="role-badge ${roleClass}">${api.role}</span>
      </div>
    </div>

    <p class="api-description">${api.description}</p>

    <div class="api-details">
      <button class="btn btn-secondary" onclick="copyEndpoint('${api.endpoint}')">
        <i class="fas fa-copy"></i> Copy URL
      </button>
      ${(hasRequestBody || hasResponse) ? `
        <button class="btn btn-secondary" onclick="toggleExamples('${cardId}')">
          <i class="fas fa-code"></i> View Examples
        </button>
      ` : ''}
      <button class="btn btn-primary" onclick="openTestModal('${module.name}', '${api.method}', '${api.endpoint}', '${api.role}')">
        <i class="fas fa-play"></i> Test API
      </button>
    </div>

    ${(hasRequestBody || hasResponse) ? `
    <div class="collapsible-content" id="${cardId}">
      ${hasRequestBody ? `
        <div class="code-block">
          <div class="code-header">
            <span>Request Body</span>
            <button class="btn-copy" id="${requestCopyId}">
              <i class="fas fa-copy"></i> Copy
            </button>
          </div>
          <pre><code id="${requestCopyId}-data">${JSON.stringify(api.requestBody, null, 2)}</code></pre>
        </div>
      ` : ''}

      ${hasResponse ? `
        <div class="code-block">
          <div class="code-header">
            <span>Response Example</span>
            <button class="btn-copy" id="${responseCopyId}">
              <i class="fas fa-copy"></i> Copy
            </button>
          </div>
          <pre><code id="${responseCopyId}-data">${JSON.stringify(api.responseExample, null, 2)}</code></pre>
        </div>
      ` : ''}
    </div>
    ` : ''}
  `;

  // Add event listeners for copy buttons after card is created
  setTimeout(() => {
    if (hasRequestBody) {
      const reqBtn = document.getElementById(requestCopyId);
      if (reqBtn) {
        reqBtn.addEventListener('click', () => {
          const data = document.getElementById(`${requestCopyId}-data`).textContent;
          copyToClipboard(data);
        });
      }
    }
    if (hasResponse) {
      const resBtn = document.getElementById(responseCopyId);
      if (resBtn) {
        resBtn.addEventListener('click', () => {
          const data = document.getElementById(`${responseCopyId}-data`).textContent;
          copyToClipboard(data);
        });
      }
    }
  }, 0);

  return card;
}

// Toggle collapsible examples
function toggleExamples(cardId) {
  const content = document.getElementById(cardId);
  if (content) {
    content.classList.toggle('active');
  }
}

// Search functionality
function handleSearch(e) {
  const searchTerm = e.target.value;
  renderAllAPIs(searchTerm);
}

// Scroll to specific module
function scrollToModule(moduleName) {
  const moduleId = `module-${moduleName.replace(/\s+/g, '-').toLowerCase()}`;
  const element = document.getElementById(moduleId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// Token management
function openTokenModal() {
  document.getElementById('token-modal').style.display = 'flex';
  document.getElementById('token-input').value = currentToken;
}

function saveToken() {
  const tokenInput = document.getElementById('token-input').value.trim();
  currentToken = tokenInput;
  localStorage.setItem('jwt_token', currentToken);
  updateTokenStatus();
  document.getElementById('token-modal').style.display = 'none';
  showToast('Token saved successfully', 'success');
}

function clearToken() {
  currentToken = '';
  localStorage.removeItem('jwt_token');
  document.getElementById('token-input').value = '';
  updateTokenStatus();
  showToast('Token cleared', 'info');
}

function updateTokenStatus() {
  const statusElement = document.getElementById('token-status');
  if (currentToken) {
    statusElement.innerHTML = '<i class="fas fa-check-circle"></i> <span>Token Set</span>';
    statusElement.style.color = '#10b981';
  } else {
    statusElement.innerHTML = '<i class="fas fa-exclamation-circle"></i> <span>No Token</span>';
    statusElement.style.color = '#ef4444';
  }
}

// API Testing Modal
function openTestModal(moduleName, method, endpoint, role) {
  const modal = document.getElementById('test-modal');
  modal.style.display = 'flex';

  document.getElementById('test-method').textContent = method;
  document.getElementById('test-method').className = `method-badge ${method.toLowerCase()}`;
  document.getElementById('test-endpoint').value = endpoint;
  document.getElementById('test-role').textContent = role;
  document.getElementById('test-role').className = `role-badge ${role.toLowerCase()}`;

  // Find API data
  const module = apiData.modules.find(m => m.name === moduleName);
  const api = module.apis.find(a => a.endpoint === endpoint && a.method === method);

  // Set request body
  const requestBodyTextarea = document.getElementById('request-body');
  if (api.requestBody && Object.keys(api.requestBody).length > 0) {
    requestBodyTextarea.value = JSON.stringify(api.requestBody, null, 2);
    requestBodyTextarea.disabled = false;
  } else {
    requestBodyTextarea.value = '// No request body required for this endpoint';
    requestBodyTextarea.disabled = true;
  }

  // Clear previous response
  document.getElementById('response-output').textContent = '// Response will appear here after sending the request';
  document.getElementById('response-status').textContent = '';

  // Switch to request tab
  switchTab('request');

  // Store current API data
  modal.dataset.method = method;
  modal.dataset.requiresBody = (api.requestBody && Object.keys(api.requestBody).length > 0) ? 'true' : 'false';
}

// Execute API Test
async function executeTest() {
  const modal = document.getElementById('test-modal');
  const method = modal.dataset.method;
  const endpoint = document.getElementById('test-endpoint').value.trim();
  const requiresBody = modal.dataset.requiresBody === 'true';

  const responseOutput = document.getElementById('response-output');
  const responseStatus = document.getElementById('response-status');

  // Validate endpoint
  if (!endpoint || !endpoint.startsWith('/')) {
    showToast('Please enter a valid endpoint starting with /', 'error');
    return;
  }

  // Validate token for protected routes
  if (!currentToken && !endpoint.includes('/register') && !endpoint.includes('/login')) {
    showToast('Please set JWT token first', 'error');
    switchTab('request');
    return;
  }

  try {
    responseOutput.textContent = '// Loading...';
    responseStatus.textContent = '';

    const url = apiData.baseUrl + endpoint;
    const options = {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    // Add token if available
    if (currentToken) {
      options.headers['Authorization'] = `Bearer ${currentToken}`;
    }

    // Add body for POST/PUT/PATCH requests
    if (requiresBody && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      const requestBody = document.getElementById('request-body').value;
      try {
        JSON.parse(requestBody); // Validate JSON
        options.body = requestBody;
      } catch (e) {
        showToast('Invalid JSON in request body', 'error');
        responseOutput.textContent = '// Error: Invalid JSON format\n// Please check your request body syntax';
        switchTab('response');
        return;
      }
    }

    const response = await fetch(url, options);
    const data = await response.json();

    // Switch to response tab
    switchTab('response');

    // Display response
    responseStatus.textContent = `Status: ${response.status} ${response.statusText}`;
    responseStatus.style.background = response.ok ? 'var(--success)' : 'var(--danger)';
    responseStatus.style.color = 'white';
    responseOutput.textContent = JSON.stringify(data, null, 2);

    if (response.ok) {
      showToast('Request successful', 'success');

      // Auto-save token if this was a login request
      if (endpoint.includes('/login') && data.token) {
        currentToken = data.token;
        localStorage.setItem('jwt_token', currentToken);
        updateTokenStatus();
        showToast('Token auto-saved from login response', 'success');
      }
    } else {
      showToast(`Request failed: ${response.status}`, 'error');
    }

  } catch (error) {
    switchTab('response');
    responseStatus.textContent = 'Status: Network Error';
    responseStatus.style.background = 'var(--danger)';
    responseStatus.style.color = 'white';
    responseOutput.textContent = `// Error: ${error.message}\n\n// Make sure your server is running at ${apiData.baseUrl}`;
    showToast('Network error occurred', 'error');
    console.error('Test error:', error);
  }
}

// Tab switching in test modal
function switchTab(tab) {
  const requestTab = document.getElementById('request-tab');
  const responseTab = document.getElementById('response-tab');
  const requestContent = document.getElementById('request-content');
  const responseContent = document.getElementById('response-content');

  if (tab === 'request') {
    requestTab.classList.add('active');
    responseTab.classList.remove('active');
    requestContent.style.display = 'block';
    responseContent.style.display = 'none';
  } else {
    responseTab.classList.add('active');
    requestTab.classList.remove('active');
    responseContent.style.display = 'block';
    requestContent.style.display = 'none';
  }
}

// Copy functions
function copyEndpoint(endpoint) {
  const fullUrl = apiData.baseUrl + endpoint;
  copyToClipboard(fullUrl);
  showToast('URL copied to clipboard', 'success');
}

function copyToClipboard(text) {
  const parsedText = typeof text === 'string' ? text : JSON.stringify(text, null, 2);
  navigator.clipboard.writeText(parsedText).then(() => {
    showToast('Copied to clipboard', 'success');
  }).catch(err => {
    console.error('Copy failed:', err);
    showToast('Failed to copy', 'error');
  });
}

// Toast notifications
function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  const toastIcon = document.getElementById('toast-icon');

  // Set icon based on type
  const icons = {
    success: 'fa-check-circle',
    error: 'fa-exclamation-circle',
    info: 'fa-info-circle',
    warning: 'fa-exclamation-triangle'
  };

  toastIcon.className = `fas ${icons[type] || icons.info}`;
  toastMessage.textContent = message;
  toast.className = `toast show ${type}`;

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Theme toggle
function toggleTheme() {
  const root = document.documentElement;
  const currentBg = getComputedStyle(root).getPropertyValue('--bg-primary').trim();

  if (currentBg === 'rgb(15, 23, 42)' || currentBg === '#0f172a') {
    // Switch to light theme
    root.style.setProperty('--bg-primary', '#ffffff');
    root.style.setProperty('--bg-secondary', '#f8fafc');
    root.style.setProperty('--bg-tertiary', '#f1f5f9');
    root.style.setProperty('--text-primary', '#1e293b');
    root.style.setProperty('--text-secondary', '#475569');
    root.style.setProperty('--border-color', '#e2e8f0');
    showToast('Light theme activated', 'info');
  } else {
    // Switch to dark theme
    root.style.setProperty('--bg-primary', '#0f172a');
    root.style.setProperty('--bg-secondary', '#1e293b');
    root.style.setProperty('--bg-tertiary', '#334155');
    root.style.setProperty('--text-primary', '#f1f5f9');
    root.style.setProperty('--text-secondary', '#cbd5e1');
    root.style.setProperty('--border-color', '#334155');
    showToast('Dark theme activated', 'info');
  }
}