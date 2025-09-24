# 📤 Sistema de Envio em Massa

Sistema web moderno para envio de mensagens em massa através de webhook, integrado com Google Sheets.

## 🚀 Início Rápido

1. **Abrir o Sistema**: Abra o arquivo `index.html` no navegador
2. **Configurar**: Edite `config/config.json` com suas configurações
3. **Usar**: Carregue planilha, edite mensagem e envie!

## 📁 Estrutura

```
envio-massa/
├── 📄 index.html          # Página principal
├── 📁 assets/             # Recursos (CSS, JS)
│   ├── styles.css         # Estilos da aplicação
│   └── script.js          # Lógica JavaScript
├── 📁 config/             # Configurações
│   ├── config.json        # Configurações principais
│   └── README.md          # Guia de configuração
└── 📁 docs/               # Documentação
    ├── README.md          # Documentação completa
    └── INSTALACAO.md      # Guia de instalação
```

## ⚡ Funcionalidades

- ✅ **Upload de Planilhas** - Suporte para Excel (.xlsx, .xls)
- ✅ **Editor Rico** - Formatação de texto (negrito, itálico, sublinhado)
- ✅ **Emojis** - Seleção integrada de emojis
- ✅ **Contador de Caracteres** - Limite configurável
- ✅ **Google Sheets** - Integração automática
- ✅ **Webhook** - Envio via API
- ✅ **Responsivo** - Funciona em desktop e mobile

## 🛠️ Configuração

### 1. Google Sheets
```json
{
  "googleSheets": {
    "sheetId": "SEU_SHEET_ID_AQUI",
    "sheetUrl": "SUA_URL_AQUI"
  }
}
```

### 2. Webhook
```json
{
  "webhook": {
    "endpoint": "/api/send-webhook",
    "method": "POST"
  }
}
```

## 📖 Documentação

- **[Guia Completo](docs/README.md)** - Documentação detalhada
- **[Instalação](docs/INSTALACAO.md)** - Guia de instalação
- **[Configuração](config/README.md)** - Guia de configuração

## 🎨 Personalização

### Cores
Edite as variáveis CSS em `assets/styles.css`:

```css
:root {
    --primary-color: #2563eb;
    --background-dark: #0f172a;
}
```

### Configurações
Modifique `config/config.json` para ajustar:
- Limite de caracteres
- Emojis disponíveis
- Configurações do webhook
- Configurações do Google Sheets

## 🔧 Desenvolvimento

### Tecnologias
- **HTML5** - Estrutura
- **CSS3** - Estilos (Grid, Flexbox)
- **JavaScript ES6+** - Lógica
- **Google Sheets API** - Integração

### Estrutura do Código
- **Modular** - Funções organizadas
- **Configurável** - Configurações centralizadas
- **Responsivo** - Design adaptativo
- **Acessível** - Suporte a teclado

## 📱 Compatibilidade

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

## 🐛 Suporte

1. Verifique a documentação
2. Consulte os logs do navegador (F12)
3. Verifique a conectividade
4. Teste as configurações

## 📄 Licença

Sistema desenvolvido para uso interno da clínica.

---

**Versão**: 1.0.0  
**Última atualização**: Setembro 2024
