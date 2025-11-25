// REST API Tester - Main UI Logic

// DOM Elements
const httpMethod = document.getElementById('httpMethod');
const urlInput = document.getElementById('urlInput');
const sendBtn = document.getElementById('sendBtn');
const headersToggle = document.getElementById('headersToggle');
const headersContent = document.getElementById('headersContent');
const headersContainer = document.getElementById('headersContainer');
const addHeaderBtn = document.getElementById('addHeaderBtn');
const bodyToggle = document.getElementById('bodyToggle');
const bodyContent = document.getElementById('bodyContent');
const bodyTypeRadios = document.querySelectorAll('input[name="bodyType"]');
const bodyInputContainer = document.getElementById('bodyInputContainer');
const bodyInput = document.getElementById('bodyInput');
const formDataContainer = document.getElementById('formDataContainer');
const formDataFields = document.getElementById('formDataFields');
const addFormFieldBtn = document.getElementById('addFormFieldBtn');
const responseStatus = document.getElementById('responseStatus');
const responseTime = document.getElementById('responseTime');
const responseLoader = document.getElementById('responseLoader');
const responseError = document.getElementById('responseError');
const responseBody = document.getElementById('responseBody');
const responseContent = document.getElementById('responseContent');
const savedEndpointsList = document.getElementById('savedEndpointsList');
const saveEndpointBtn = document.getElementById('saveEndpointBtn');
const saveModal = document.getElementById('saveModal');
const endpointNameInput = document.getElementById('endpointName');
const cancelSaveBtn = document.getElementById('cancelSaveBtn');
const confirmSaveBtn = document.getElementById('confirmSaveBtn');

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  loadSavedEndpoints();
  setupEventListeners();
});

// Setup all event listeners
function setupEventListeners() {
  // Toggle sections
  headersToggle.addEventListener('click', () => toggleSection(headersToggle, headersContent));
  bodyToggle.addEventListener('click', () => toggleSection(bodyToggle, bodyContent));

  // Add header row
  addHeaderBtn.addEventListener('click', addHeaderRow);

  // Add form data field
  addFormFieldBtn.addEventListener('click', addFormDataRow);

  // Body type change
  bodyTypeRadios.forEach(radio => {
    radio.addEventListener('change', handleBodyTypeChange);
  });

  // Send request
  sendBtn.addEventListener('click', sendRequest);

  // Enter key on URL input
  urlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendRequest();
    }
  });

  // Save endpoint modal
  saveEndpointBtn.addEventListener('click', openSaveModal);
  cancelSaveBtn.addEventListener('click', closeSaveModal);
  confirmSaveBtn.addEventListener('click', saveEndpoint);

  // Initial header row remove button
  setupRemoveButtons();
}

// Toggle collapsible section
function toggleSection(toggle, content) {
  const icon = toggle.querySelector('.toggle-icon');
  icon.classList.toggle('collapsed');
  content.classList.toggle('collapsed');
}

// Add new header row
function addHeaderRow() {
  const row = document.createElement('div');
  row.className = 'header-row';
  row.innerHTML = `
    <input type="text" class="header-key" placeholder="Header name">
    <input type="text" class="header-value" placeholder="Header value">
    <button class="btn btn-remove" title="Remove header">×</button>
  `;
  headersContainer.appendChild(row);
  setupRemoveButtons();
}

// Add new form data row
function addFormDataRow() {
  const row = document.createElement('div');
  row.className = 'form-data-row';
  row.innerHTML = `
    <input type="text" class="form-key" placeholder="Key">
    <input type="text" class="form-value" placeholder="Value">
    <button class="btn btn-remove" title="Remove field">×</button>
  `;
  formDataFields.appendChild(row);
  setupRemoveButtons();
}

// Setup remove buttons for headers and form data
function setupRemoveButtons() {
  document.querySelectorAll('.btn-remove').forEach(btn => {
    btn.onclick = function() {
      const row = this.parentElement;
      const container = row.parentElement;
      // Keep at least one row
      if (container.children.length > 1) {
        row.remove();
      } else {
        // Clear the inputs instead of removing
        row.querySelectorAll('input').forEach(input => input.value = '');
      }
    };
  });
}

// Handle body type change
function handleBodyTypeChange(e) {
  const type = e.target.value;
  bodyInputContainer.classList.add('hidden');
  formDataContainer.classList.add('hidden');

  if (type === 'json') {
    bodyInputContainer.classList.remove('hidden');
    bodyInput.placeholder = '{\n  "key": "value"\n}';
  } else if (type === 'form') {
    formDataContainer.classList.remove('hidden');
  }
}

// Get headers from the form
function getHeaders() {
  const headers = {};
  document.querySelectorAll('.header-row').forEach(row => {
    const key = row.querySelector('.header-key').value.trim();
    const value = row.querySelector('.header-value').value.trim();
    if (key && value) {
      headers[key] = value;
    }
  });
  return headers;
}

// Get body content based on type
function getBody() {
  const bodyType = document.querySelector('input[name="bodyType"]:checked').value;

  if (bodyType === 'none') {
    return null;
  }

  if (bodyType === 'json') {
    const jsonBody = bodyInput.value.trim();
    return jsonBody || null;
  }

  if (bodyType === 'form') {
    const formData = new URLSearchParams();
    document.querySelectorAll('.form-data-row').forEach(row => {
      const key = row.querySelector('.form-key').value.trim();
      const value = row.querySelector('.form-value').value.trim();
      if (key) {
        formData.append(key, value);
      }
    });
    return formData.toString() || null;
  }

  return null;
}

// Get content type based on body type
function getContentType() {
  const bodyType = document.querySelector('input[name="bodyType"]:checked').value;
  if (bodyType === 'json') {
    return 'application/json';
  }
  if (bodyType === 'form') {
    return 'application/x-www-form-urlencoded';
  }
  return null;
}

// Send the HTTP request
async function sendRequest() {
  const url = urlInput.value.trim();

  if (!url) {
    showError('Please enter a URL');
    return;
  }

  // Validate URL
  try {
    new URL(url);
  } catch (e) {
    showError('Please enter a valid URL');
    return;
  }

  // Show loader
  responseLoader.classList.remove('hidden');
  responseError.classList.add('hidden');
  responseStatus.classList.add('hidden');
  responseTime.classList.add('hidden');
  responseContent.textContent = '';
  sendBtn.disabled = true;

  const method = httpMethod.value;
  const headers = getHeaders();
  const body = getBody();
  const contentType = getContentType();

  if (contentType) {
    headers['Content-Type'] = contentType;
  }

  const options = {
    method,
    headers
  };

  // Only add body for methods that support it
  if (['POST', 'PUT', 'PATCH'].includes(method) && body) {
    options.body = body;
  }

  const startTime = performance.now();

  try {
    const response = await fetch(url, options);
    const endTime = performance.now();
    const duration = Math.round(endTime - startTime);

    // Hide loader
    responseLoader.classList.add('hidden');
    sendBtn.disabled = false;

    // Show status
    showStatus(response.status, response.statusText);
    showResponseTime(duration);

    // Get response body
    const contentType = response.headers.get('content-type');
    let responseText;

    if (contentType && contentType.includes('application/json')) {
      const json = await response.json();
      responseText = formatJSON(json);
    } else {
      responseText = await response.text();
    }

    responseContent.innerHTML = responseText;
    responseBody.classList.remove('hidden');

  } catch (error) {
    // Hide loader
    responseLoader.classList.add('hidden');
    sendBtn.disabled = false;

    showError(`Request failed: ${error.message}`);
  }
}

// Show status badge
function showStatus(status, statusText) {
  responseStatus.textContent = `${status} ${statusText}`;
  responseStatus.classList.remove('hidden', 'success', 'redirect', 'client-error', 'server-error');

  if (status >= 200 && status < 300) {
    responseStatus.classList.add('success');
  } else if (status >= 300 && status < 400) {
    responseStatus.classList.add('redirect');
  } else if (status >= 400 && status < 500) {
    responseStatus.classList.add('client-error');
  } else if (status >= 500) {
    responseStatus.classList.add('server-error');
  }
}

// Show response time
function showResponseTime(duration) {
  responseTime.textContent = `${duration}ms`;
  responseTime.classList.remove('hidden');
}

// Show error message
function showError(message) {
  responseError.textContent = message;
  responseError.classList.remove('hidden');
  responseLoader.classList.add('hidden');
}

// Format JSON with syntax highlighting
function formatJSON(json) {
  const jsonString = JSON.stringify(json, null, 2);
  return jsonString
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?)/g, (match) => {
      let cls = 'json-string';
      if (/:$/.test(match)) {
        cls = 'json-key';
      }
      return `<span class="${cls}">${match}</span>`;
    })
    .replace(/\b(true|false)\b/g, '<span class="json-boolean">$1</span>')
    .replace(/\bnull\b/g, '<span class="json-null">null</span>')
    .replace(/\b(-?\d+\.?\d*)\b/g, '<span class="json-number">$1</span>');
}

// Load saved endpoints from Chrome storage
function loadSavedEndpoints() {
  if (typeof chrome !== 'undefined' && chrome.storage) {
    chrome.storage.local.get(['savedEndpoints'], (result) => {
      const endpoints = result.savedEndpoints || [];
      renderSavedEndpoints(endpoints);
    });
  }
}

// Render saved endpoints list
function renderSavedEndpoints(endpoints) {
  savedEndpointsList.innerHTML = '';

  if (endpoints.length === 0) {
    savedEndpointsList.innerHTML = '<span style="color: #666; font-size: 0.85rem;">No saved endpoints</span>';
    return;
  }

  endpoints.forEach((endpoint, index) => {
    const item = document.createElement('div');
    item.className = 'endpoint-item';
    item.innerHTML = `
      <span class="method-badge method-${endpoint.method}">${endpoint.method}</span>
      <span class="endpoint-name">${endpoint.name}</span>
      <button class="delete-endpoint" data-index="${index}" title="Delete endpoint">×</button>
    `;

    // Load endpoint on click (except delete button)
    item.addEventListener('click', (e) => {
      if (!e.target.classList.contains('delete-endpoint')) {
        loadEndpoint(endpoint);
      }
    });

    // Delete endpoint
    item.querySelector('.delete-endpoint').addEventListener('click', (e) => {
      e.stopPropagation();
      deleteEndpoint(index);
    });

    savedEndpointsList.appendChild(item);
  });
}

// Load endpoint into the form
function loadEndpoint(endpoint) {
  httpMethod.value = endpoint.method;
  urlInput.value = endpoint.url;

  // Load headers
  headersContainer.innerHTML = '';
  if (endpoint.headers && Object.keys(endpoint.headers).length > 0) {
    Object.entries(endpoint.headers).forEach(([key, value]) => {
      const row = document.createElement('div');
      row.className = 'header-row';
      row.innerHTML = `
        <input type="text" class="header-key" placeholder="Header name" value="${escapeHtml(key)}">
        <input type="text" class="header-value" placeholder="Header value" value="${escapeHtml(value)}">
        <button class="btn btn-remove" title="Remove header">×</button>
      `;
      headersContainer.appendChild(row);
    });
  } else {
    addHeaderRow();
  }

  // Load body type and content
  const bodyType = endpoint.bodyType || 'none';
  document.querySelector(`input[name="bodyType"][value="${bodyType}"]`).checked = true;

  bodyInputContainer.classList.add('hidden');
  formDataContainer.classList.add('hidden');

  if (bodyType === 'json') {
    bodyInputContainer.classList.remove('hidden');
    bodyInput.value = endpoint.body || '';
  } else if (bodyType === 'form') {
    formDataContainer.classList.remove('hidden');
    formDataFields.innerHTML = '';
    if (endpoint.formData && endpoint.formData.length > 0) {
      endpoint.formData.forEach(({ key, value }) => {
        const row = document.createElement('div');
        row.className = 'form-data-row';
        row.innerHTML = `
          <input type="text" class="form-key" placeholder="Key" value="${escapeHtml(key)}">
          <input type="text" class="form-value" placeholder="Value" value="${escapeHtml(value)}">
          <button class="btn btn-remove" title="Remove field">×</button>
        `;
        formDataFields.appendChild(row);
      });
    } else {
      addFormDataRow();
    }
  }

  setupRemoveButtons();
}

// Open save modal
function openSaveModal() {
  const url = urlInput.value.trim();
  if (!url) {
    showError('Please enter a URL first');
    return;
  }
  endpointNameInput.value = '';
  saveModal.classList.remove('hidden');
  endpointNameInput.focus();
}

// Close save modal
function closeSaveModal() {
  saveModal.classList.add('hidden');
}

// Save endpoint to Chrome storage
function saveEndpoint() {
  const name = endpointNameInput.value.trim();
  if (!name) {
    return;
  }

  const bodyType = document.querySelector('input[name="bodyType"]:checked').value;
  const formData = [];

  if (bodyType === 'form') {
    document.querySelectorAll('.form-data-row').forEach(row => {
      const key = row.querySelector('.form-key').value.trim();
      const value = row.querySelector('.form-value').value.trim();
      if (key) {
        formData.push({ key, value });
      }
    });
  }

  const endpoint = {
    name,
    method: httpMethod.value,
    url: urlInput.value.trim(),
    headers: getHeaders(),
    bodyType,
    body: bodyType === 'json' ? bodyInput.value : '',
    formData
  };

  if (typeof chrome !== 'undefined' && chrome.storage) {
    chrome.storage.local.get(['savedEndpoints'], (result) => {
      const endpoints = result.savedEndpoints || [];
      endpoints.push(endpoint);
      chrome.storage.local.set({ savedEndpoints: endpoints }, () => {
        renderSavedEndpoints(endpoints);
        closeSaveModal();
      });
    });
  }
}

// Delete endpoint from Chrome storage
function deleteEndpoint(index) {
  if (typeof chrome !== 'undefined' && chrome.storage) {
    chrome.storage.local.get(['savedEndpoints'], (result) => {
      const endpoints = result.savedEndpoints || [];
      endpoints.splice(index, 1);
      chrome.storage.local.set({ savedEndpoints: endpoints }, () => {
        renderSavedEndpoints(endpoints);
      });
    });
  }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
