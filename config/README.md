# Configuração do Sistema de Envio em Massa

## Arquivos de Configuração

### config.json
Arquivo principal de configuração contendo:

- **app**: Informações básicas da aplicação
- **googleSheets**: Configurações da planilha do Google Sheets
- **webhook**: Configurações do endpoint de webhook
- **editor**: Configurações do editor de texto
- **upload**: Configurações de upload de arquivos

## Como Modificar

1. Edite o arquivo `config.json` conforme necessário
2. Reinicie a aplicação para aplicar as mudanças
3. Para mudanças no Google Sheets, atualize o `sheetId` e `sheetUrl`

## Estrutura de Pastas

```
envio-massa/
├── assets/          # Arquivos CSS e JavaScript
├── config/          # Arquivos de configuração
├── docs/           # Documentação
└── index.html      # Página principal
```
