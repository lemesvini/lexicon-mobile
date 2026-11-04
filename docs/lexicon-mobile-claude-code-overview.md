# Lexicon Mobile — guia de conteúdo para o app

Como o app do aluno (Expo / React Native) lê e desenha cada coisa que o Studio
(lexicon-web) produz: lições, materiais, apresentações, homeworks e practices.
Use este guia **sempre que for escrever ou revisar conteúdo** que vai aparecer
no app, junto com `lexicon-web/docs/lesson-json.md` (o schema dos blocos — se os
dois discordarem sobre o shape de um bloco, `lexicon-web/src/lib/lessons.ts`
vence).

Os números de caracteres abaixo foram calculados a partir das fontes e larguras
reais do código num iPhone de 390 pt de largura (iPhone 14/15/16). Num aparelho
de 375 pt cabem ~4% menos caracteres por linha. Caprasimo (`font-display`) tem
avanço médio de ~0,62 × o tamanho da fonte; Montserrat bold ~0,6 ×, regular ~0,55 ×.

---

## 0. Referência rápida — limites de caracteres

| Onde aparece | Campo | Fonte / regra | Ideal | Máximo antes de quebrar mal |
|---|---|---|---|---|
| Hero da página da aula | nome da lição (título sem o `[Lesson X]`) | Caprasimo 48 px, ~11 car./linha | **≤ 22** (2 linhas) | ~33 (3 linhas) |
| Card "Current lesson" (Today) | nome da lição | Caprasimo 34 px, ~15 car./linha | ≤ 30 (2 linhas) | ~45 |
| Banner da unit no Path | `unit` e título do checkpoint | Caprasimo 30 px, **1 linha, trunca** | **≤ 16** | 17 |
| Topo do viewer (material, slides, homework) | `slide.stage` / `label` do exercício | Caprasimo 24 px, ~15 car./linha, **máx. 2 linhas, trunca** | **≤ 15** (1 linha) | 28 |
| Lista "Check it out" | `slide.stage` | Montserrat bold 16 px, ~25 car./linha | ≤ 25 | livre (quebra) |
| Lista "Check it out" | `slide.goal` (visível ao aluno!) | Montserrat 14 px | ≤ 60 | ~90 |
| Hero da página da aula | can-do (`can_do` do plano ou `minorCanDo`) | Montserrat semibold 20 px, ~30 car./linha | ≤ 90 (3 linhas) | ~130 |
| Bloco `title` (capa) | cada linha de `title` | tamanho calculado pela linha mais longa | **≤ 10–12 por linha**, 2–3 linhas | linha de 20 car. cai para 24 px |
| Bloco `title` | `eyebrow` | 14 px semibold ao lado do wordmark | ≤ 25 | ~50 (2 linhas) |
| Bloco `can-do` | `text` | Montserrat 20 px, ~25 car./linha | ≤ 100 | ~150 |
| Speaking (frente) | `prompt` (PT) | Montserrat bold 40 px, ~12 car./linha | **≤ 24** | ~36 |
| Speaking (verso) | `answer` (EN) | Caprasimo 40 px, ~12 car./linha | **≤ 24** (1–5 palavras) | ~36 |
| Speaking (verso) | `example` | 18 px | ≤ 70 | ~110 |
| Writing | `prompt` (PT) | Montserrat bold 24 px, ~22 car./linha | ≤ 50 | ~80 |
| Listening / Writing | frase a montar | chips de palavras | **4–10 palavras** | ~14 palavras |
| Reading | `title` | Caprasimo 36 px; **1 linha** no cabeçalho das perguntas | **≤ 24** | ~30 |
| Reading | `blurb` (PT) | 16 px | ≤ 80 (uma frase) | ~120 |
| Reading | `questions[].prompt` | Montserrat bold 24 px, ~22 car./linha | ≤ 70 | ~110 |
| Reading | `questions[].options[]` | botão com letra | ≤ 50 | ~90 |
| Homework | `finish-sentence.sentence` | 24 px palavra a palavra, ~24 car./linha | ≤ 40 | ~60 |
| Homework | `finish-sentence.options[]` | chips | **≤ 15 cada** (1–3 palavras) | ~22 |
| Homework | `choose-description.text` | 17 px (mono 15 px), ~35 car./linha | 150–300 | ~450 |
| Homework | `choose-description.options[]` (PT) | botão com letra | ≤ 70 | ~110 |
| Homework | `find-mistake.sentence` | um chip por palavra | ≤ 10 palavras | ~14 palavras |
| Homework | `long-answer.question` | Montserrat semibold 20 px | ≤ 100 | ~150 |
| Homework | `document.context` (vira a dica no topo da 1ª página) | 15 px | ≤ 160 | ~250 |

---

## 1. O que é o app

App do **aluno** da Lexicon English (escola de inglês para brasileiros).
O professor e o Studio vivem no lexicon-web; o app só lê o que foi publicado
para o aluno e escreve três coisas: respostas de homework, resultados de
practice e notas de contexto.

- Expo SDK 57, Expo Router (rotas em `src/app/`), NativeWind (Tailwind), Reanimated,
  Supabase. Tipos por feature em `src/features/<feature>/types/`, um por arquivo.
- Todo o texto de interface é **em português**; o conteúdo de inglês vem do Studio.
- Fontes: **Caprasimo** (display, títulos) e **Montserrat** 400/500/600/700
  (texto). Montserrat está embutida **sem itálico** — `*itálico*` pode sair reto.
- Cores: tokens de `src/global.css` (espelho de `lexicon-web/src/index.css`) e
  `src/theme/colors.ts`. Claro e escuro seguem o sistema. Verde de marca
  `#61B495` (jade), `#14352A` (forest), `#DFF2EA` (mist), `#F6F0EB` (sand),
  `#0E1412` (ink). Erro/falta é sempre **terracota** (`#b0584c`), nunca vermelho.
- Toda leitura vem de **views já filtradas para o aluno logado** (`student_*`).
  Nada no app filtra por usuário.

### Abas e rotas

| Aba | Rota | O que mostra |
|---|---|---|
| **Today** | `(tabs)/today` | Card "Current lesson" (próxima aula do plano, com os passos) + "Sua semana" (aulas e homeworks da semana). Sino de notificações. |
| **Path** | `(tabs)/lessons` | A trilha do módulo, estilo Duolingo: nós por lição, banners por unit, anel de progresso. |
| **Practice** | `(tabs)/practice` | 4 cards de skill (Listening, Speaking, Reading, Writing) com contagem do que está devido + "From your lessons" (homeworks). |
| **Me** | `(tabs)/me` | Perfil, card de progresso (frequência, checkpoints, relatórios por unit), My context, notificações, conta. |

Telas fora das abas (sem tab bar): `lesson/[lessonId]` (página da aula, push),
e como **modal**: `steps/[lessonId]` (material), `slides/[lessonId]`
(apresentação), `assignment/[homeworkId]` (homework), `speaking`, `listening`,
`reading`, `writing`.

---

## 2. A lição: título, unit, tipo e posição

### 2.1 Título

O título da lição segue o formato **`[Label] Nome`**:

```
[Lesson Eight] Polite Requests        → label "Lesson Eight", nome "Polite Requests"
[Lesson Nineteen: Conversation] Talk about Plans
[Lesson Twenty-Four] Checkpoint — Schedule and Reschedule
```

`splitTitle` (`src/lib/lesson-title.ts`) separa os dois. O **label** aparece como
eyebrow (hero da aula, card Today, lista de homeworks); o **nome** é o título
grande. Sem colchetes, label = null e o título inteiro é o nome. O label é só
exibição: o tipo da aula vem da coluna `lesson_type`, nunca do texto.

- Nome curto rende muito melhor: no hero são ~11 caracteres por linha em 48 px.
  "Nice to meet you!" (17) = 2 linhas; "Let's talk about that Stupid Song" (33) = 3.
- Escreva números do label por extenso, como os existentes: "Lesson Twenty-One".

### 2.2 Tipo (`lesson_type`)

| Tipo | No Path | Numeração |
|---|---|---|
| `lesson` | nó verde com o número | conta |
| `checkpoint` | nó no verde mais escuro com o número | conta |
| `conversation` | nó com ícone de balões, sem número | **não conta** |

Lessons e checkpoints são numerados em sequência pelo módulo (1, 2, 3…);
conversation pula a contagem. O número do nó é calculado pelo app, não lido
do label — mantenha os dois coerentes.

### 2.3 Unit

- Lições consecutivas com o **mesmo texto exato** em `unit` formam um bloco com
  um banner no Path. Um espaço ou maiúscula diferente cria uma unit nova.
- O banner tem **uma linha** em Caprasimo 30 px: cabem ~17 caracteres. "Unit One"
  cabe; "B1 Conversation - Europe Trip" (29) é truncado com reticências.
- **O título da unit vem do checkpoint**: se o nome de um checkpoint casa com
  `/checkpoint\s*[—–-]\s*(.+)$/i`, o que vem depois do traço vira o título do
  banner (com "Unit One" pequeno em cima). Ex.: `[Lesson Six] Checkpoint - Make a
  friend` → banner "Make a friend". `Unit One Checkpoint` não nomeia nada.
  Esse título também tem ~17 caracteres de espaço.

### 2.4 Ordem e "aula atual"

- Com turma: a sequência é o plano da turma (`student_class_plan.position`).
  Sem turma: `student_syllabus.course_order` do módulo.
- A aula atual é **a seguinte à última aula dada** (com alguém presente) que
  está na sequência. Ela ganha o balão "Continuar" e o anel de passos.
- No Today, a "próxima aula" é a primeira do plano com data ≥ hoje.

### 2.5 Campos do plano que o app mostra

- `can_do` (do plano) ou `minorCanDo` (do material): frase em destaque no hero da
  aula. ≤ 90 caracteres para caber em 3 linhas.
- `grammar_focus`: vira o subtítulo do card Today — "Usando To Be e Articles ·
  Unit One". Use nomes curtos de gramática (2–3 itens).
- `scheduled_on` / `starts_at` / primeiro nome do teacher: datas e "com Vinicius".

---

## 3. Os passos de uma aula (o anel e a página da aula)

Uma aula tem **dois tipos de passo**, mostrados em lugares diferentes.

### 3.1 Passos de progresso (anel no Path, card Today, topo da página da aula)

Sempre nesta ordem:

1. **A aula ao vivo** — "Class with Teacher <Nome>". Estados: assistida ✓,
   faltou ✗ (terracota), dada sem marcação, agendada (data), "Data a definir".
2. **Cada homework da lição**, na ordem de `listHomework`: por lição e depois
   **pelo `title` do homework em ordem alfabética** (`localeCompare`).

O nome do passo vem do `homework_type`, não do título:

| `homework_type` | Nome do passo | Marcador quando feito |
|---|---|---|
| `activities` | "Activities" | ✓ verde |
| `now-you-can` | "Now you can" | **moeda dourada com estrela** |

Consequências para quem cria conteúdo:

- **Dê títulos que, em ordem alfabética, coloquem o Activities antes do Now you
  can** (ex.: "Activities — Lesson 8" e "Now you can — Lesson 8"). O título
  aparece em "Sua semana" no Today.
- Uma lição só ganha a **estrela dourada** no Path quando tem um homework
  `now-you-can` e **todos** os passos estão feitos (aula assistida + todos os
  homeworks entregues). Conversation normalmente não tem Now you can.
- Padrão real: lição = 1 `activities` (~9–10 exercícios) + 1 `now-you-can`
  (1 exercício, normalmente `long-answer`).
- O "passo atual" é o primeiro vazio ou parcial; o botão do Today diz
  "Continuar · etapa 2 de 3".

### 3.2 Passos do material ("Check it out")

Na página da aula, abaixo dos passos de progresso, a seção **"Check it out"**
lista **um passo por slide do material**, na ordem do documento:

- número do passo + **`slide.stage`** em negrito + **`slide.goal`** embaixo.
- Tocar abre o viewer do material já naquele slide.
- Slide sem `stage` vira "Etapa N".

> **Atenção:** `slide.goal` é "nota para o teacher" no Studio, mas **o app
> mostra o goal do material para o aluno**. No material, escreva goals curtos
> voltados ao aluno ("Aprenda a convidar e recusar") ou deixe vazio. Nunca
> deixe instruções de professor ali.

### 3.3 Ordem recomendada dos slides (padrões reais do banco)

**Lesson (Book One, `B1Lx`)** — a mais estruturada:

```
Title > Minor Can Do > [gancho: Meet Alex / What Is Coming] > Vocabulary >
[2–4 slides de gramática] > Examples > Drills > [tarefa: The Interview /
Find a Slot] > Now you can try > Now you can   (ou "Can do Proof")
```

**Conversation (`B1LxC`)**:

```
Title > Remembering Last Class (ou Warm-Up) > Today > Drills / Quick Fire: … >
[1–3 slides de input] > Model … > [atividade principal / minigame] >
[Report Back / Check] > Now you can   (ou "Can do Proof")
```

**Checkpoint**:

```
Title > Lesson One Recap > … > Lesson Five Recap > Can Do Checkpoint > Now you can
```

**Lições avançadas (`LWL`, `ETB1`)**: `Title` > gancho temático > `Today` >
slides de gramática com títulos descritivos > tarefa > `Now you can` /
`Two Minutes, …`.

Regras que o app impõe:

- O **primeiro slide** é a capa: um bloco `title` sozinho.
- O **último slide** é o fechamento: um bloco `can-do` sozinho (stage "Now you
  can").
- **Stage ≤ 15 caracteres** para ficar numa linha no topo do viewer; acima de
  ~28 é truncado. Exemplos reais que truncam: "Interview Me About Something You
  Don't Get" (42), "Set a Meeting Time — Conflicting Calendars" (42). Bons:
  "Vocabulary", "Drills", "Examples", "Minor Can Do", "Who, Which, Where".
- **Não deixe slides vazios ou sem stage** no material: o viewer do material
  não os remove (mostra uma página vazia "Etapa N"). O viewer da apresentação
  remove slides sem blocos.
- Um slide = uma ideia. No celular cada slide é uma página que rola para baixo,
  então dá para ter mais conteúdo que no projetor, mas 3–5 blocos é o teto
  confortável.

---

## 4. Viewers de slides (material, apresentação, homework)

Os três usam o mesmo esqueleto (`SlidePager` + `SlideProgress`):

- Modal em tela cheia. No topo: **anel de progresso** com o número da página,
  o **título da página** (Caprasimo 24 px, até 2 linhas) e o botão fechar.
- Páginas lado a lado, uma por tela, deslizando na horizontal; **cada página
  rola na vertical** sozinha (`gap-6`, `px-4`).
- Barra inferior nativa: **Voltar** / **Seguir** (no fim: "Concluir" no
  material, "Fechar" na apresentação, "Entregar"/"Concluir" no homework).
- Haptics: toque leve ao navegar, "select" ao deslizar, sucesso ao concluir.

| Viewer | Fonte | Título da página | Progresso do anel |
|---|---|---|---|
| Material (`steps/[lessonId]`) | `student_lessons.document` | `slide.stage` ou "Etapa N" | posição / total |
| Apresentação (`slides/[lessonId]`) | `student_presentations.document` (cópia da turma ou a lição) | `slide.stage` ou "Slide N" | posição / total |
| Homework (`assignment/[homeworkId]`) | `student_homework.document` | `label` do exercício, ou "Questão N", ou "Leitura" | **respondidas / total** |

A apresentação só aparece (ícone de tela no header da aula) quando existe uma
publicada para o aluno.

### 4.1 Como o celular difere do projetor

O app ignora tudo que é de layout de palco. Escreva pensando que **todo slide
vira uma coluna de blocos de cima para baixo**:

- `slide.layout: "row"`, `align`, `justify`, `hideStage`, `hideBrand`,
  `duration`, `teacherNotes`: **ignorados** (teacherNotes nunca chegam ao aluno).
- `container`: sempre coluna, seja qual for `direction`. Só `gap`
  (`sm`/`md`/`lg`) e `align: "center"` têm efeito.
- Blocos full-bleed (`title`, `can-do`, `image` wallpaper, `embed` fill) são
  desenhados **inline**, como cards, na ordem em que aparecem.
- `title` com `color: "clear"` vira **forest** (não há wallpaper por trás).
- Blocos `audience: "teacher"` são removidos, inclusive dentro de containers.

### 4.2 Blocos — como cada um aparece no app

Todos os blocos com `label` mostram uma linha pequena em CAIXA ALTA verde
acima; todos com `note` mostram uma nota em itálico com fio à esquerda abaixo.

| Bloco | Como aparece | Dicas para o celular |
|---|---|---|
| `title` | Card retrato (proporção 5:6) na cor de marca, eyebrow + wordmark "lexicon ENGLISH" em cima, título enorme embaixo, subtitle em 16 px. O tamanho do título = min(largura ÷ (0,62 × linha mais longa), 64 px). | Quebre o título com `\n` em linhas de **≤ 10–12 caracteres**. Linha de 8 car. ≈ 61 px; 12 car. ≈ 40 px; 20 car. ≈ 24 px (fica pequeno). Cores: `jade` (padrão), `forest`, `mist`, `clear`. |
| `can-do` | Card sand sobre a cor de fundo: eyebrow, "Now you can" (fixo), o `text`, o selo, "Thank you · See you next class" (fixo). Empilhado. | `text` ≤ 100 caracteres. Não escreva "Now you can" no texto. Cor padrão `forest`. |
| `text` | Parágrafo 17 px / 27 px de entrelinha. Markdown inline. | No celular cabem ~38 car./linha; parágrafos de até ~5 linhas leem bem. |
| `list` | Marcador em coluna fixa: número em círculo, bolinha verde ou checkbox. `cards: true` = cada item num card verde-claro; com `\n`, a 1ª linha vira título (18 px semibold) e o resto o corpo. | `style` obrigatório. Itens ≤ 2 linhas; com cards, título ≤ 30 car. |
| `callout` | Caixa colorida com o emoji num anel de 40 px, título 18 px semibold e corpo 16 px. | Cores `blue_bg` (padrão), `green_bg` (verde da marca), `yellow_bg`, `gray_bg`, `red_bg`. Um emoji só em `icon`. `\n` no corpo vira lista de exemplos. |
| `table` | **Até 2 colunas dividem a largura** (~16 car./linha por célula). **3+ colunas viram 150 px cada e rolam na horizontal** dentro da tabela. Cabeçalho em CAIXA ALTA pequena. | Para o celular prefira **2 colunas** (EN × PT). Mesmo número de linhas em todas. Células curtas. |
| `dialog` | Chat: o 1º falante à esquerda (cinza), o 2º à direita (verde), alternando depois. Nome do falante só quando ele começa a falar. Balões até 85% da largura. | Falas curtas (≤ 80 car.). `___` é só texto. |
| `email` | Janela do Mail: semáforos, linhas To/Cc/Subject/From (só as preenchidas), corpo em markdown de bloco 16 px. | `theme`: `light` (padrão), `dark`, `mist`, `forest`. Parágrafos separados por linha em branco. |
| `post` | Card de rede social: avatar 44 px (ou silhueta), nome e @, corpo em markdown, foto 4:3. | `theme` igual ao email. `avatarPath`/`imagePath` só de upload real. |
| `image` | Largura total, na proporção da própria imagem (16:9 até carregar), cantos 16 px, legenda centralizada em itálico. | `path` só de upload real no bucket `lesson-images`. |
| `embed` | **O app não tem web view**: YouTube vira thumbnail com play; X/Instagram/TikTok vira card "Ver post no X"; outras páginas viram card com título e domínio. Tudo abre no navegador interno. | Preencha `title` (aparece no card de página). Sem url/path/html válido: "Conteúdo indisponível." |
| `container` | Coluna com gap. | Não serve para lado a lado no celular. |
| `minigame` | **Placeholder**: "Aqui há um jogo que acontece na aula, com a turma." | Evite no material; acompanhe com um `text` ou `list` que explique o jogo, se for relevante para o aluno. |
| Exercícios (`finish-sentence` etc.) | No **material** caem no mesmo placeholder do minigame (errado!). Na **apresentação** são interativos, sem correção e sem salvar. No **homework**, ver §5. | Nunca ponha exercícios no material. |

### 4.3 Markdown

- **Inline** (`text.body`, itens de `list`, `callout.body`, células de `table`,
  falas de `dialog`, `caption`, `finish-sentence.sentence`, `long-answer.question`):
  `**negrito**`, `*itálico*`, `` `código` ``, `~~riscado~~`. Não aninha.
  Quebras de linha são mantidas.
- **Bloco** (`email.body`, `post.body`, `choose-description.text`): parágrafos
  (linha em branco), `#`/`##`/`###`, listas `-`/`*`/`+` e `1.`, mais o inline.
- Sem links, imagens, blockquotes, tabelas em markdown ou listas aninhadas.
- Itálico pode sair reto (Montserrat sem face itálica): não dependa dele para
  sentido; use negrito.

---

## 5. Homework

### 5.1 Estrutura

```json
{
  "context": "Instruções gerais curtas, em português.",
  "slides": [
    { "blocks": [ { "type": "finish-sentence", "id": "uuid", … }, … ] }
  ]
}
```

- `homework_type`: `activities` ou `now-you-can` (define o passo, §3.1).
- **Os slides são achatados**: cada bloco vira **uma página** do viewer. Não
  importa em quantos slides você dividir.
- Exercício **com `id`** = questão respondível, numerada (Questão 1, 2…).
  Exercício sem `id` = só leitura. Bloco de prosa (text, email, table…) =
  página "Leitura" **separada** — ele não fica junto da questão seguinte. Se o
  aluno precisa ler algo para responder, coloque o texto **dentro** do
  exercício (`choose-description.text`) ou em `context`.
- `context` vira uma **dica (lâmpada) no topo da primeira página**. ≤ 160 car.
- `label` do exercício vira o **título da página** no topo (até 2 linhas, ~15
  car./linha). Sem label, "Questão N". Ex.: "Present Simple", "Wh- Questions".
  Cada exercício também mostra um ícone + instrução fixa em PT ("Complete a
  frase", "Escolha a descrição certa", "Encontre a palavra errada", "Responda
  com suas palavras") — não repita isso no label.
- Padrão real: Activities com **9–10 questões**; Now you can com **1** (long-answer).
- Ao final, depois de entregue, há uma página "Resultado" com a nota (0–10, em
  formato "8,5"), "X de Y questões certas" (só as automáticas) e o comentário
  do teacher. Notas por questão (`block_notes`) aparecem abaixo da questão.

### 5.2 Comportamento

- Respostas salvam sozinhas 800 ms depois da última mudança (nuvem pisca no anel).
- O anel mede **respondidas / total**, não a posição.
- "Entregar" na última página confirma, avisando quantas estão em branco;
  depois de entregue nada muda. O servidor corrige o que é automático; a chave
  de resposta só chega ao app depois da correção.
- Estados do botão de opção: idle, escolhido (verde), correto (verde forte ✓),
  incorreto (terracota ✗). Botões "chunky" com profundidade, entram com fade
  escalonado de 30 ms.

### 5.3 Cada exercício no celular

**`finish-sentence`** — frase num card, palavra a palavra em 24 px, com a lacuna
como um retângulo tracejado de no mínimo 96 px; as opções são chips abaixo. A
opção tocada **pula para a lacuna** e deixa o contorno no lugar.
- A lacuna é o primeiro `___` (3+ underscores). Só uma por frase.
- **4 opções**, cada uma **≤ 15 caracteres** (1–3 palavras), para caberem 2–3
  chips por linha.
- Frase ≤ 40 car. ideal (média real 27, máx. 50).

**`choose-description`** — o texto num card com faixa verde à esquerda (17 px;
`font: "mono"` usa 15 px monoespaçado para email/chat), depois as opções com
letras A, B, C.
- **3 opções em português**, ≤ 70 car. cada.
- Texto em inglês, 150–300 car. (média real 258, máx. 364).

**`find-mistake`** — cada palavra é um chip; o aluno toca na errada.
- `answer` = índice na frase dividida por espaços (pontuação vai junto da palavra).
- ≤ 10 palavras: cada palavra é um botão, frase longa vira parede de chips.
- Sem markdown.

**`long-answer`** — pergunta em 20 px semibold, `hint` em 14 px, caixa de texto
de 160 px que acende em verde e conta palavras ("12 palavras").
- Pergunta ≤ 100 car.; `hint` diz o tamanho esperado ("3–5 frases").
- Corrigido à mão pelo teacher.

---

## 6. Practice

Atividades que o aluno faz sozinho entre as aulas, na aba Practice. Criadas no
Studio (aba Practice), arquivadas por **módulo** e **skill**, ordenadas por
`position`. Cada atividade é um deck de cards em `practice_activities.document`.

### 6.1 Regras comuns às 4 skills

- **`id` de cada card é permanente** (gerado pelo Studio). O progresso do aluno
  é guardado por `activity_id + card_id`; trocar o id zera o progresso.
- **`lessonId`**: o card só aparece depois que a turma do aluno **teve essa
  aula** (alguém marcado presente). Sem `lessonId`, aparece sempre.
- Só cards de atividades **publicadas** e **completas** chegam ao aluno (ver
  cada skill). Card incompleto é salvo mas nunca mostrado.
- Ordem dos cards: `position` da atividade → atividade → posição do card.

### 6.2 Repetição espaçada (Leitner, decidida no servidor)

`review_practice_card` (lexicon-web 0031). Caixas 0–6 com intervalos
`[0, 1, 2, 4, 8, 16, 32]` dias:

| Resultado | Caixa | Volta em |
|---|---|---|
| `forgot` | 0 | hoje (e mais uma vez no fim da mesma sessão, exceto reading) |
| `almost` | max(caixa, 1) | amanhã |
| `remembered` | caixa + 1 (máx. 6) | intervalo da nova caixa: 1, 2, 4, 8, 16, 32 dias |

**Sessão**: primeiro os cards devidos (mais atrasados primeiro), depois os
novos na ordem do curso. **12 cards por sessão** (speaking, listening,
writing); **2 textos** por sessão no reading. Terminar uma sessão cancela o
lembrete diário das 19h daquele dia. O card da skill na aba Practice mostra
"12 cartões", "3 frases", "Em dia".

### 6.3 Speaking — "Como se diz"

```json
{ "cards": [ { "id": "…", "prompt": "Sala de reunião", "answer": "Meeting room",
  "example": "Could you tell me where the meeting room is?", "lessonId": "B1L19" } ] }
```

- **Frente**: "COMO SE DIZ" + `prompt` em PT, Montserrat bold 40 px, centralizado
  (~12 car./linha). **Verso**: "EM INGLÊS" + `answer` em Caprasimo 40 px +
  `example` em 18 px + "Você disse: …".
- O aluno toca no microfone e fala; o reconhecimento do próprio aparelho
  (en-US, 3 alternativas) compara com `answer`:
  - normaliza: minúsculas, sem pontuação, contrações expandidas ("I'm" = "I am",
    "can't" = "can not", "'s" = "is"), números **até 20** viram palavras;
  - alinha as palavras em ordem (subsequência comum); palavra fora de ordem não conta;
  - **≥ 90% → Lembrei**, **≥ 60% → Quase**, abaixo → **Não lembrei**.
  - Palavras não ouvidas ficam sublinhadas em terracota no verso.
- Sem microfone/reconhecimento, o aluno vira o card e se avalia (Não lembrei /
  Quase / Lembrei). "Não sei" vira como não lembrado.
- Completo = `prompt` e `answer` preenchidos.

**Como escrever bons cards de speaking**
- `prompt` e `answer` **≤ 24 caracteres** (1–5 palavras). Média real: 13 / 12.
  Mais que ~36 estoura o card, que não rola.
- Evite no `answer`: números acima de 20 (o reconhecedor devolve "21" e a
  comparação não casa com "twenty-one"), nomes próprios incomuns, siglas,
  homófonos ambíguos isolados ("two/too", "write/right"), e respostas que
  dependem de pontuação.
- Uma única forma correta: se houver duas formas naturais, a frente deve
  forçar uma ("Sala de reunião (formal)").
- `example` ≤ 70 car., uma frase natural usando o `answer`.

### 6.4 Listening — ouça e monte a frase

```json
{ "voiceId": "…", "cards": [ { "id": "…", "text": "Could you send me the agenda?",
  "translation": "Você pode me mandar a pauta?", "lessonId": "…",
  "audioPath": "…", "audioText": "…", "distractors": ["sent", "for"] } ] }
```

- O áudio toca sozinho ao abrir o card; botão grande (velocidade normal) e
  botão com caracol (0,65×). O aluno monta a frase tocando chips de palavras
  sobre duas linhas pautadas e toca "Verificar". Painel de feedback sobe de
  baixo com "Correto!" / "Quase!" / "Não foi dessa vez", a resposta certa e a
  `translation`.
- **Banco de palavras**: as palavras da frase (divididas por espaço, pontuação
  das pontas removida, maiúsculas mantidas no chip) + **todas** as
  `distractors` que não estão na frase. Sem distractors, o app pega **3**
  palavras de outras frases do aluno (ou de uma lista básica). Embaralhado.
- **Correção**: ignora maiúsculas e pontuação. Igual = Acertei; senão
  sobreposição em ordem ≥ 75% = Quase; abaixo = Errei. Palavras a mais custam
  tanto quanto as que faltam.
- O áudio é gerado no Studio (ElevenLabs). Completo = `text` + `audioPath`.
  `audioPath` nunca se inventa.

**Como escrever bons cards de listening/writing**
- **4–10 palavras** por frase (média real ~22 car.). Mais que ~14 palavras vira
  um banco enorme e cansativo.
- Cada token separado por espaço vira um chip: "I'm" é um chip, "follow-up" é
  um chip. Palavra repetida na frase = dois chips iguais.
- **2–4 distractors**, plausíveis e da mesma família (forma verbal errada,
  preposição vizinha: "sent", "for", "at"). Todas entram no banco.
- Evite frases com duas ordens corretas ("Yesterday I went" / "I went
  yesterday"): só a ordem escrita é aceita.
- Uma lista `English | Português` alimenta listening e writing ao mesmo tempo
  no Studio.

### 6.5 Writing — traduza montando as palavras

```json
{ "cards": [ { "id": "…", "prompt": "Você pode me mandar a pauta?",
  "answer": "Could you send me the agenda?", "lessonId": "…", "distractors": [] } ] }
```

- Igual ao listening, sem áudio: o card mostra "EM PORTUGUÊS" + `prompt` em
  Montserrat bold 24 px (~22 car./linha) e o título da lição. O aluno monta o
  `answer` em inglês.
- Completo = `prompt` + `answer`. Mesmas regras de frase e distractors do §6.4.

### 6.6 Reading — leia e responda

```json
{ "cards": [ { "id": "…", "title": "A Day at the Office", "level": "A2",
  "blurb": "Um dia comum de trabalho em Londres.", "lessonId": "…",
  "paragraphs": ["…", "…"],
  "questions": [ { "id": "…", "prompt": "Where does Ana work?",
                   "options": ["In a bank", "In a school", "At home"], "answer": 0 } ] } ] }
```

- **Passo 1, o texto**: "LEITURA" + chip do nível + `title` em Caprasimo 36 px
  + `blurb` + os parágrafos num card (18 px, entrelinha 32). Botão "Responder 5
  perguntas".
- **Depois, uma pergunta por tela**: cabeçalho com o título do texto (**1
  linha, trunca**) e "Pergunta 2 de 5", o `prompt` em 24 px bold, "Reler o
  texto" (abre o texto menor) e as opções A–E. "Verificar" marca na hora.
- O texto inteiro é **um card** para a repetição espaçada: todas certas =
  Tudo certo; ≥ 60% = Quase; menos = Revisar. Um texto errado não volta na
  mesma sessão.
- Pergunta válida: `prompt`, **2–5 opções** não vazias, `answer` apontando para
  uma delas (opções vazias são descartadas e o índice acompanha). Texto sem
  nenhuma pergunta válida não aparece. Completo = `title` + ≥ 1 parágrafo + ≥ 1
  pergunta.

**Como escrever bons textos de reading**
- `title` em inglês **≤ 24 car.** (cabe no cabeçalho das perguntas).
- `level`: A1, A2, B1, B2, C1.
- `blurb`: uma frase em PT, ≤ 80 car.
- 2–5 parágrafos (cada item do array é um parágrafo; separados no Studio por
  linha em branco), ~120–220 palavras no total para A1–B1.
- **~5 perguntas** (média real 5), 3–4 opções curtas (≤ 50 car.), uma só certa,
  respondíveis pelo texto. Prompt ≤ 70 car.

---

## 7. Today, Path e Me — o que depende do conteúdo

- **Today › Current lesson**: label à direita do eyebrow "CURRENT LESSON", nome
  em Caprasimo 34 px, "Usando <grammarFocus> · <unit>", os passos (aula +
  homeworks) lado a lado com rótulos "Aula", "Activities", "Now you can", e o
  botão "Continuar · etapa N de M" / "Ver aula".
- **Today › Sua semana**: aulas da semana (Agendada / Hoje / Realizada) e os
  homeworks das aulas já dadas + o da última aula da semana anterior, com o
  `title` do homework e "3/9" ou "Nota 8,5".
- **Path**: nós de 80 px (atual 96 px) numa onda senoidal, trilha coberta em
  verde-claro, chip de data ao lado (data planejada, dia assistido ou "faltou"
  em terracota), banner fixo da unit no topo enquanto rola.
- **Practice › From your lessons**: homeworks das aulas já dadas, pendentes
  primeiro ("A fazer", "Continuar", "Enviada · aguardando correção"); sem
  pendências, as 3 últimas notas. O prazo é a data da próxima aula.
- **Me**: frequência (presente ÷ marcadas, faltas justificadas fora),
  checkpoints passados / total do módulo, relatórios de unit do teacher (nota
  do teste e observações). "My context" mostra as respostas do onboarding e as
  notas que o aluno adicionou (título ≤ 120, corpo ≤ 2000 car., só anexa).
- **Notificações**: do servidor (`homework_graded`, `unit_report`,
  `class_reminder` uma hora antes da aula) e o lembrete local de prática às 19h
  (4 mensagens que alternam, cancelado no dia em que o aluno pratica).

---

## 8. Checklist antes de entregar conteúdo para o app

**Lição / material**
- [ ] Título no formato `[Lesson X] Nome`, nome ≤ 22–30 car.
- [ ] `unit` idêntica nas lições da mesma unit, ≤ 16 car.; checkpoint nomeado
      "Checkpoint — <Nome curto ≤ 16>".
- [ ] `minorCanDo` ≤ 90 car.
- [ ] Slide 1 = só `title` (linhas ≤ 12 car.); último slide = só `can-do`.
- [ ] Todo slide com `stage` ≤ 15 car. (máx. 28) e com pelo menos um bloco.
- [ ] `goal` dos slides do material curto e escrito para o aluno, ou vazio.
- [ ] Tabelas com 2 colunas; nenhum exercício no material; minigame
      acompanhado de explicação ou fora do material.
- [ ] Cores: `title`/`can-do` em `jade|forest|mist|clear`; `callout` em `*_bg`;
      `email`/`post` com `theme`, não `color`.

**Homework**
- [ ] Títulos dos homeworks em ordem alfabética = ordem desejada dos passos.
- [ ] Activities ~9–10 questões; Now you can com 1 `long-answer`.
- [ ] Todo exercício com `id` UUID único e permanente; `answer` 0-based no range.
- [ ] Texto necessário para responder dentro do próprio exercício, não num
      bloco de prosa solto.
- [ ] `finish-sentence`: um `___`, 4 opções ≤ 15 car.; `choose-description`: 3
      opções em PT; `find-mistake`: ≤ 10 palavras, índice recontado.

**Practice**
- [ ] `id` estável por card; `lessonId` da lição de onde o conteúdo vem.
- [ ] Speaking: `prompt`/`answer` ≤ 24 car., sem números > 20 no `answer`.
- [ ] Listening/Writing: 4–10 palavras, ordem única, 2–4 distractors.
- [ ] Reading: título ≤ 24 car., nível, blurb em PT, ~5 perguntas com 2–5
      opções e uma resposta.
- [ ] JSON válido em UTF-8 sem BOM.
