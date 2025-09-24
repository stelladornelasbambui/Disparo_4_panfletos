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
let state = {
    isSending: false
};

// ================== INIT ==================
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    updateCharCount();
});

function initializeEventListeners() {
    elements.textEditor.addEventListener('input', updateCharCount);
    elements.clearBtn.addEventListener('click', clearEditor);
    elements.sendBtn.addEventListener('click', sendWebhook);

    // 👉 Botão para abrir planilha
    elements.uploadBtn.addEventListener('click', () => {
        window.open(CONFIG.sheetUrl, '_blank');
        showToast('Sucesso', 'Abrindo planilha do Google Sheets...', 'success');
    });

    // 👉 Detectar teclas para formatação rápida
    elements.textEditor.addEventListener('keydown', handleFormatting);
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
    if (e.ctrlKey) { // Ctrl + tecla
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

    const apiUrl = "https://webhook.fiqon.app/webhook/9fd68837-4f32-4ee3-a756-418a87beadc9/79c39a2c-225f-4143-9ca4-0d70fa92ee12";

    try {
        // 1️⃣ Envia o texto (uma vez só)
        if (message) {
            const textPayload = {
                message: message,
                timestamp: Date.now()
            };

            const textRes = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(textPayload)
            });

            console.log("Resposta envio texto:", await textRes.text());
            showToast('Sucesso', 'Texto enviado com sucesso!', 'success');
        }

        // 2️⃣ Cria array de imagens e envia uma a uma
        if (_selectedImageFiles.length > 0) {
            let images = [];

            // Faz upload das imagens para ImgBB e guarda as URLs no array
            for (let file of _selectedImageFiles) {
                const imageUrl = await uploadToImgbb(file);
                console.log("URL gerada no ImgBB:", imageUrl);
                images.push(imageUrl);
            }

            // Envia cada imagem separadamente
            for (let i = 0; i < images.length; i++) {
                const imagePayload = {
                    timestamp: Date.now(),
                    media: {
                        url: images[i],
                        filename: `figura${i + 1}.png`
                    }
                };

                const imgRes = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(imagePayload)
                });

                const resText = await imgRes.text();
                console.log("Resposta envio imagem:", resText);

                if (!imgRes.ok) {
                    throw new Error(`Erro HTTP ${imgRes.status} ao enviar imagem: ${resText}`);
                }
            }

            showToast('Sucesso', `${images.length} imagem(ns) enviada(s)!`, 'success');
        }

    } catch (error) {
        console.error('Erro ao acionar webhook:', error);
        showToast('Erro', 'Falha ao acionar webhook', 'error');
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

let _selectedImageFiles = [];
const imageInputEl = document.getElementById('imageInput'); // precisa estar com multiple no HTML
const imagePreviewEl = document.getElementById('imagePreview');
const previewImgEl = document.getElementById('previewImg');

if (imageInputEl) {
    imageInputEl.addEventListener('change', handleImagesSelectedForImgBB);
}

function handleImagesSelectedForImgBB(e) {
    const files = e.target.files;
    if (!files || files.length === 0) {
        _selectedImageFiles = [];
        if (imagePreviewEl) { imagePreviewEl.style.display = 'none'; previewImgEl.src = ''; }
        return;
    }

    _selectedImageFiles = Array.from(files);

    // Preview da primeira imagem
    const reader = new FileReader();
    reader.onload = (ev) => {
        if (previewImgEl) { previewImgEl.src = ev.target.result; imagePreviewEl.style.display = 'block'; }
    };
    reader.readAsDataURL(_selectedImageFiles[0]);
}

async function uploadToImgbb(file) {
    const base64 = await fileToBase64(file);
    const commaIndex = base64.indexOf(',');
    const pureBase64 = commaIndex >= 0 ? base64.slice(commaIndex + 1) : base64;

    const form = new FormData();
    form.append('key', IMGBB_KEY);
    form.append('image', pureBase64);
    form.append('name', file.name.replace(/\.[^/.]+$/, ""));

    const res = await fetch('https://api.imgbb.com/1/upload', {
        method: 'POST',
        body: form
    });

    const json = await res.json();
    if (!res.ok || !json || !json.data) {
        throw new Error('Falha upload imgbb: ' + (JSON.stringify(json) || res.statusText));
    }

    return json.data.display_url || json.data.url || json.data.thumb.url;
}

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const fr = new FileReader();
        fr.onload = () => resolve(fr.result);
        fr.onerror = reject;
        fr.readAsDataURL(file);
    });
}
