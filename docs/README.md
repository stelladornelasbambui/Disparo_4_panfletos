# Sistema de Envio em Massa

## 📋 Visão Geral

Sistema web para envio de mensagens em massa através de webhook, integrado com Google Sheets para gerenciamento de contatos.

## 🚀 Funcionalidades

- **Upload de Planilhas**: Suporte para arquivos Excel (.xlsx, .xls)
- **Editor de Texto**: Editor rico com formatação (negrito, itálico, sublinhado)
- **Emojis**: Seleção de emojis integrada
- **Contador de Caracteres**: Limite de 2000 caracteres por mensagem
- **Integração Google Sheets**: Abertura automática da planilha de contatos
- **Webhook**: Envio de mensagens via API

## 📁 Estrutura de Arquivos

```
envio-massa/
├── assets/
│   ├── script.js      # Lógica JavaScript da aplicação
│   └── styles.css     # Estilos CSS
├── config/
│   ├── config.json    # Configurações da aplicação
│   └── README.md      # Documentação de configuração
├── docs/
│   └── README.md      # Esta documentação
└── index.html         # Página principal
```

## 🛠️ Como Usar

1. **Abrir o Sistema**: Abra o arquivo `index.html` no navegador
2. **Carregar Planilha**: Clique em "Inserir dados" para abrir a planilha do Google Sheets
3. **Editar Mensagem**: Use o editor para criar sua mensagem
4. **Enviar**: Clique em "Enviar Webhook" para disparar as mensagens

## ⚙️ Configuração

### Google Sheets
- Edite o `sheetId` e `sheetUrl` no arquivo `config/config.json`
- A planilha deve conter os dados dos contatos

### Webhook
- Configure o endpoint no arquivo de configuração
- O sistema enviará POST com os dados da mensagem

## 🎨 Personalização

### Cores e Tema
Edite as variáveis CSS no arquivo `assets/styles.css`:

```css
:root {
    --primary-color: #2563eb;
    --background-dark: #0f172a;
    /* ... outras variáveis */
}
```

### Emojis
Adicione ou remova emojis no arquivo `config/config.json`:

```json
"emojis": ["😀", "😍", "🎯", "✅", "❌", "🚀"]
```

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:
- Desktop
- Tablet
- Mobile

## 🔧 Desenvolvimento

### Tecnologias Utilizadas
- HTML5
- CSS3 (Grid, Flexbox)
- JavaScript (ES6+)
- Google Sheets API

### Estrutura do Código
- **Modular**: Código organizado em funções específicas
- **Configurável**: Configurações centralizadas
- **Responsivo**: Design adaptativo
- **Acessível**: Suporte a navegação por teclado

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique a documentação de configuração
2. Consulte os logs do navegador (F12)
3. Verifique a conectividade com o Google Sheets
