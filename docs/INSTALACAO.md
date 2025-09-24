# Guia de Instalação - Sistema de Envio em Massa

## 📋 Pré-requisitos

- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Acesso à internet (para Google Sheets e webhook)
- Servidor web (opcional, para produção)

## 🚀 Instalação Local

### 1. Download dos Arquivos
```bash
# Clone ou baixe os arquivos para uma pasta local
# Exemplo: C:\projetos\envio-massa\
```

### 2. Configuração Inicial
1. Abra o arquivo `config/config.json`
2. Configure o `sheetId` do Google Sheets
3. Configure a `sheetUrl` da planilha
4. Configure o endpoint do webhook

### 3. Executar Localmente
```bash
# Opção 1: Abrir diretamente no navegador
# Clique duplo no arquivo index.html

# Opção 2: Servidor local (recomendado)
# Python 3
python -m http.server 8000

# Node.js
npx http-server

# PHP
php -S localhost:8000
```

### 4. Acessar o Sistema
Abra o navegador e acesse:
- `http://localhost:8000` (se usando servidor)
- Ou abra diretamente o `index.html`

## 🌐 Instalação em Servidor

### 1. Upload dos Arquivos
```bash
# Faça upload de toda a pasta envio-massa para o servidor
# Exemplo: /var/www/html/envio-massa/
```

### 2. Configuração do Servidor
```apache
# Apache .htaccess
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.html [QSA,L]
```

### 3. Configuração de CORS (se necessário)
```javascript
// Adicione headers CORS se necessário
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
```

## ⚙️ Configuração do Google Sheets

### 1. Criar Planilha
1. Acesse [Google Sheets](https://sheets.google.com)
2. Crie uma nova planilha
3. Configure as colunas necessárias (ex: Nome, Telefone, Email)

### 2. Obter ID da Planilha
```
# O ID está na URL da planilha:
# https://docs.google.com/spreadsheets/d/ID_AQUI/edit
```

### 3. Configurar Permissões
- Compartilhe a planilha com o email do serviço
- Defina permissões de "Editor" ou "Visualizador"

## 🔧 Configuração do Webhook

### 1. Endpoint do Webhook
Configure o endpoint que receberá as mensagens:

```javascript
// Exemplo de endpoint
app.post('/api/send-webhook', (req, res) => {
    const { message, sheetId, metadata } = req.body;
    
    // Processar mensagem
    console.log('Mensagem recebida:', message);
    
    res.json({ success: true });
});
```

### 2. Estrutura dos Dados
```json
{
    "message": "Conteúdo da mensagem em HTML",
    "sheetId": "ID_da_planilha",
    "sheetUrl": "URL_da_planilha",
    "metadata": {
        "timestamp": "2024-01-01T00:00:00.000Z",
        "charCount": 150
    }
}
```

## 🧪 Teste da Instalação

### 1. Teste Básico
1. Abra o sistema no navegador
2. Verifique se a interface carrega corretamente
3. Teste o editor de texto
4. Teste o botão de upload

### 2. Teste de Integração
1. Configure uma planilha de teste
2. Teste a abertura da planilha
3. Teste o envio do webhook
4. Verifique os logs do servidor

## 🐛 Solução de Problemas

### Problema: Planilha não abre
- Verifique se o `sheetId` está correto
- Verifique se a planilha está compartilhada
- Verifique se a URL está acessível

### Problema: Webhook não funciona
- Verifique se o endpoint está configurado
- Verifique se o servidor está rodando
- Verifique os logs do navegador (F12)

### Problema: Estilos não carregam
- Verifique se o caminho dos arquivos CSS está correto
- Verifique se o servidor está servindo os arquivos estáticos

## 📞 Suporte

Para problemas de instalação:
1. Verifique este guia
2. Consulte os logs do navegador
3. Teste em diferentes navegadores
4. Verifique a conectividade de rede
