# Publicação nas lojas

O que falta para enviar o Lexicon à revisão, na ordem em que precisa acontecer.

## URLs para preencher nas lojas

| Campo | URL |
| --- | --- |
| Política de privacidade | https://lexicon-english.com/privacy |
| Termos de uso (EULA) | https://lexicon-english.com/terms |
| Suporte | https://lexicon-english.com (o WhatsApp está na página) |
| Exclusão de conta (Google Play) | https://lexicon-english.com/privacy#delete-account |

## 1. Antes de qualquer build

1. Pedir a um advogado que revise a política e os termos, principalmente as bases legais, a parte de menores e o ECA Digital (Lei 15.211/2025). O texto foi escrito a partir do que o código faz, mas não é parecer jurídico.
2. Aplicar `0037_account_deletion.sql` no banco.
3. Só depois rodar `supabase functions deploy delete-account`. Nessa ordem: sem a migration, a cascata apaga os pagamentos do aluno.
4. Publicar o lexicon-web e abrir as URLs acima em uma janela anônima.
5. Testar a exclusão de ponta a ponta com um aluno descartável, conferindo que ele some do painel e que um pagamento dele continua no total recebido.

## 2. Conta de demonstração

A revisão precisa de login (guideline 2.1), e o app não tem cadastro.

- Criar um aluno de demonstração pelo painel, fora de turmas reais.
- Entrar uma vez e trocar a senha temporária, senão o revisor cai na tela obrigatória de troca de senha.
- Deixar conteúdo visível: módulo com aulas, uma tarefa, cartões de prática e um relatório.
- Se o revisor testar a exclusão, a conta deixa de existir. Recriar antes de reenviar.

## 3. App Store Connect

- **Categoria:** Educação. Não usar a categoria Kids, nem texto que sugira que o público principal são crianças (5.1.4).
- **Classificação etária:** responder o questionário. O app não tem chat, conteúdo gerado entre alunos, compras nem anúncios.
- **Preço:** gratuito, sem compras no app.
- **Capturas de tela:** só iPhone, porque o app não é publicado para iPad.
- **Criptografia:** já declarada no `app.config.ts`.
- **`eas.json`:** adicionar `ascAppId` em `submit.production.ios` depois de criar o app.

### Notas para o revisor

> Lexicon is the study app for students of Lexicon English School, a language school in Brazil. Accounts are created by the school when a student enrolls, so the app has no sign-up. Please use the demo account provided. Tuition is agreed with the school outside the app, and the app sells nothing. To delete the account: Me tab > Excluir conta. The deletion is immediate.

### Privacidade do app

Rastreamento: **não**. Todos os itens abaixo têm finalidade **App Functionality**, estão **ligados à identidade** e não são usados para rastrear.

| Tipo de dado | Item | O que é |
| --- | --- | --- |
| Contact Info | Name, Email Address, Phone Number | Cadastro |
| User Content | Other User Content | Respostas de tarefas e My context |
| Identifiers | User ID, Device ID | Conta e token de notificação |
| Usage Data | Product Interaction | Progresso, aulas e práticas |

Áudio não entra: o Lexicon não recebe gravação nem transcrição. Dados financeiros também não, porque ficam no painel da escola e não passam pelo app. Não há SDK de análise, anúncios ou diagnóstico.

## 4. Riscos conhecidos na revisão

- **Tela de permissões:** `(modals)/permissions.tsx` tem "Agora não" e o X, que saem sem mostrar o pedido do sistema. A Apple costuma rejeitar telas prévias que permitem pular o pedido (5.1.1). Se isso acontecer, o ajuste é trocar a saída por "Continuar" e seguir para o pedido do sistema.
- **Público restrito:** o app só serve a alunos da escola. Se a Apple questionar, a alternativa é a distribuição não listada (Unlisted App Distribution).

## 5. Pendências que não bloqueiam o envio

- **IA:** `suggest-advanced-context` está fora da política porque não está em uso, mas continua publicada. Ela envia nome, My context, relatórios e respostas à Anthropic. Antes de voltar a usá-la, é preciso atualizar a política e pedir permissão explícita aos alunos (5.1.2(i)).
- **Avatares:** o bucket `student-avatars` é público, e há alunos menores. Quem tiver o link consegue abrir a foto.
- **ECA Digital:** a Apple oferece a API Declared Age Range no Brasil. Vale confirmar com o advogado se um app fechado, com contas criadas pela escola, precisa de algo além do que já existe.
- **Google Play:** o formulário Data safety pede as mesmas informações da tabela acima.
