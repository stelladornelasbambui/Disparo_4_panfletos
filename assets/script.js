// ================== CONFIG ==================
let CONFIG = {
    maxChars: 2000,
    sheetId: '1nT_ccRwFtEWiYvh5s4iyIDTgOj5heLnXSixropbGL8s',
    sheetUrl: 'https://docs.google.com/spreadsheets/d/1nT_ccRwFtEWiYvh5s4iyIDTgOj5heLnXSixropbGL8s/edit?gid=1933645899#gid=1933645899'
};

// ================== ELEMENTOS ==================
const elements = {
    textEditor: document.getElementById('textEditor'),
    charCount: document.getElementById('charCount'),
    clearBtn: document.getElementById('clearBtn'),
    sendBtn: document.getElementById('sendBtn'),
    uploadBtn: document.getElementById('uploadBtn'),
    toastContainer: document.getElementById('toastContainer')
};

// ================== ESTADO ==================
let state = { isSending: false };
let _selectedImageFiles = []; // array com as imagens selecionadas

// ================== INIT ==================
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    updateCharCount();
});

// ================== EVENTOS ==================
function initializeEventListeners() {
    elements.textEditor.addEventListener('input', updateCharCount);
    elements.clearBtn.addEventListener('click', clearEditor);
    elements.sendBtn.addEventListener('click', sendWebhook);

    elements.uploadBtn.addEventListener('click', () => {
        window.open(CONFIG.sheetUrl, '_blank');
        showToast('Sucesso', 'Abrindo planilha do Google Sheets...', 'success');
    });

    elements.textEditor.addEventListener('keydown', handleFormatting);

    const imageInputEl = document.getElementById('imageInput');
    if (imageInputEl) {
        imageInputEl.addEventListener('change', handleImagesSelectedForImgBB);
    }
}

// ================== EDITOR ==================
function updateCharCount() {
    const content = elements.textEditor.innerText || '';
    const count = content.length;
    elements.charCount.textContent = count;
    elements.sendBtn.disabled = count === 0 || count > CONFIG.maxChars;
}

function clearEditor() {
    elements.textEditor.innerHTML = '';
    updateCharCount();
    showToast('Sucesso', 'Editor limpo com sucesso', 'success');
}

// ================== FORMATAÇÃO ==================
function handleFormatting(e) {
    if (e.ctrlKey) {
        if (e.key.toLowerCase() === 'n') {
            document.execCommand('bold');
            e.preventDefault();
        } else if (e.key.toLowerCase() === 's') {
            document.execCommand('underline');
            e.preventDefault();
        } else if (e.key.toLowerCase() === 'i') {
            document.execCommand('italic');
            e.preventDefault();
        }
    }
}

// ================== ENVIO VIA WEBHOOK ==================
async function sendWebhook() {
    if (state.isSending) return;

    const message = elements.textEditor.innerText.trim();
    if (!message && _selectedImageFiles.length === 0) {
        showToast('Aviso', 'Digite uma mensagem ou selecione imagens antes de enviar', 'warning');
        return;
    }

    state.isSending = true;
    elements.sendBtn.disabled = true;

    const apiUrl = "https://webhook.fiqon.app/webhook/9ff6dd7e-cbc9-4514-ad04-182d4b2110fe/62b66d44-787e-4a18-a4d1-fe886afb16c0";

    try {
        // Faz upload das imagens (até 4)
        let images = { image1: null, image2: null, image3: null, image4: null };

        if (message) {
            showToast('Sucesso', 'Mensagem enviada com sucesso!', 'success');
        }

        for (let i = 0; i < Math.min(_selectedImageFiles.length, 4); i++) {
            const file = _selectedImageFiles[i];
            const url = await uploadToImgbb(file);
            images[`image${i+1}`] = url;

            // Aviso de cada imagem enviada
            showToast('Sucesso', `Imagem ${i+1} enviada com sucesso!`, 'success');
        }

        // Monta o payload final
        const payload = {
            message: message,
            timestamp: Date.now(),
            ...images
        };

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const text = await response.text();
        console.log("Resposta do Webhook:", text);

        if (!response.ok) {
            throw new Error(`Erro HTTP ${response.status} - ${text}`);
        }

        showToast('Finalizado', 'Texto e imagens processados com sucesso!', 'success');
    } catch (error) {
        console.error('Erro ao acionar webhook:', error);
        showToast('Erro', 'Falha ao enviar texto ou imagens', 'error');
    } finally {
        state.isSending = false;
        elements.sendBtn.disabled = false;
    }
}

// ================== HELPERS ==================
function showToast(title, message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : '⚠️';
    toast.innerHTML = `
        <div class="toast-icon">${icon}</div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">×</button>
    `;
    elements.toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
}

// ================== UPLOAD PARA IMGBB ==================
const IMGBB_KEY = 'babc90a7ab9bddc78a89ebe1108ff464';

function handleImagesSelectedForImgBB(e) {
    const files = e.target.files;
    if (!files || files.length === 0) {
        _selectedImageFiles = [];
        document.getElementById('imagePreview').style.display = 'none';
        return;
    }

    _selectedImageFiles = Array.from(files);

    // Previews no container
    const container = document.getElementById('previewContainer');
    container.innerHTML = "";
    _selectedImageFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = (ev) => {
            const img = document.createElement('img');
            img.src = ev.target.result;
            img.style.maxWidth = "120px";
            img.style.border = "1px solid #ddd";
            img.style.margin = "5px";
            container.appendChild(img);
        };
        reader.readAsDataURL(file);
    });

    document.getElementById('imagePreview').style.display = 'block';
}

async function uploadToImgbb(file) {
    const base64 = await fileToBase64(file);
    const pureBase64 = base64.split(',')[1];

    const form = new FormData();
    form.append('key', IMGBB_KEY);
    form.append('image', pureBase64);
    form.append('name', file.name.replace(/\.[^/.]+$/, ""));

    const res = await fetch('https://api.imgbb.com/1/upload', { method: 'POST', body: form });
    const json = await res.json();
    if (!res.ok || !json.data) {
        showToast('Erro', `Falha upload da imagem ${file.name}`, 'error');
        throw new Error('Falha upload ImgBB');
    }

    return json.data.display_url;
}

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const fr = new FileReader();
        fr.onload = () => resolve(fr.result);
        fr.onerror = reject;
        fr.readAsDataURL(file);
    });
}
