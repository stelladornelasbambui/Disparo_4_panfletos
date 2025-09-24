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
    toastContainer: document.getElementById('toastContainer'),
    imageInputs: [
        document.getElementById('imageInput1'),
        document.getElementById('imageInput2'),
        document.getElementById('imageInput3'),
        document.getElementById('imageInput4')
    ]
};

// ================== ESTADO ==================
let state = {
    isSending: false
};

let _imageFiles = [null, null, null, null]; // 4 variáveis para armazenar até 4 imagens

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

    // 👉 Inputs de imagens (4 variáveis fixas)
    elements.imageInputs.forEach((input, idx) => {
        if (input) input.addEventListener('change', (e) => handleImageSelectedForImgBB(e, idx));
    });
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

// ================== ENVIO ==================
async function sendWebhook() {
    if (state.isSending) return;

    const message = elements.textEditor.innerText.trim();
    if (!message && _imageFiles.every(f => !f)) {
        showToast('Aviso', 'Digite uma mensagem ou selecione imagens antes de enviar', 'warning');
        return;
    }

    state.isSending = true;
    elements.sendBtn.disabled = true;

    const apiUrl = "https://webhook.fiqon.app/webhook/9fd68837-4f32-4ee3-a756-418a87beadc9/79c39a2c-225f-4143-9ca4-0d70fa92ee12";

    try {
        // 1️⃣ Envia o texto
        if (message) {
            const textPayload = { message, timestamp: Date.now() };
            const res = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(textPayload)
            });
            console.log("Resposta texto:", await res.text());
            showToast('Sucesso', 'Texto enviado com sucesso!', 'success');
        }

        // 2️⃣ Envia as imagens (cada uma separada)
        for (let i = 0; i < _imageFiles.length; i++) {
            const file = _imageFiles[i];
            if (!file) continue;

            const imageUrl = await uploadToImgbb(file);
            const imagePayload = {
                timestamp: Date.now(),
                media: { url: imageUrl, filename: file.name }
            };

            const res = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(imagePayload)
            });
            console.log(`Resposta imagem ${i+1}:`, await res.text());
        }

        showToast('Sucesso', 'Todas as imagens foram enviadas!', 'success');
    } catch (err) {
        console.error("Erro envio:", err);
        showToast('Erro', 'Falha no envio', 'error');
    } finally {
        state.isSending = false;
        elements.sendBtn.disabled = false;
    }
}

// ================== UPLOAD PARA IMGBB ==================
const IMGBB_KEY = 'babc90a7ab9bddc78a89ebe1108ff464';

function handleImageSelectedForImgBB(e, idx) {
    const f = e.target.files && e.target.files[0];
    if (!f) {
        _imageFiles[idx] = null;
        return;
    }

    if (f.size > 8 * 1024 * 1024) {
        showToast('Aviso', 'Imagem muito grande. Máx 8MB.', 'warning');
        e.target.value = '';
        _imageFiles[idx] = null;
        return;
    }

    _imageFiles[idx] = f;
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
    if (!res.ok || !json.data) throw new Error('Falha upload ImgBB');

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
