# Backend do Juruena - Explicação Simples

> **Para quem é:** qualquer pessoa (dev frontend, QA, novo membro de time) que precisa entender como o backend funciona, sem se perder em jargão técnico.
>
> **Para que serve:** dar uma visão aérea de tudo, com exemplos reais. Se quiser detalhe técnico, veja [DOC.md](./DOC.md).

---

## Índice

1. [O que o backend faz](#1-o-que-o-backend-faz)
2. [As pastas - cada uma faz UMA coisa](#2-as-pastas--cada-uma-faz-uma-coisa)
3. [O caminho de um pedido](#3-o-caminho-de-um-pedido)
4. [Login em 2 frases](#4-login-em-2-frases)
5. [Testes em 1 frase](#5-testes-em-1-frase)
6. [Por que organizei assim](#6-por-que-organizei-assim)

---

## 1. O que o backend faz

O backend é o cara dos bastidores. O front pede, ele executa. Cadastrar, logar, listar, favoritar, deletar - é tudo ele.

O front **nunca** toca no banco direto. Ele fala com o back, e o back conversa com o banco.

---

## 2. As pastas - cada uma faz UMA coisa

Pensa nas pastas como setores de uma empresa. Cada uma tem uma função clara, e você sabe exatamente onde procurar quando precisa mexer.

### `config` - o manual de instruções

Aqui tá escrito: código **200** é sucesso, **400** é dado errado, **401** é "não logado", **403** é "sem permissão", **404** é "não achei", **409** é "já existe", **500** é "quebrou". Também tem as mensagens padrão e como conectar no banco.

Quando o código precisa dizer "deu certo" ou "deu erro X", ele chama daqui. Padronizado num lugar só.

### `models` - a ficha de cadastro de cada coisa guardada

- **User**: nome, email, senha, papel
- **Place**: nome, imagem, categoria, localização
- **Favorite**: ligação entre user e place

Aqui define o que é obrigatório, o que é único, qual o tamanho limite. É a régua dos dados.

### `routes` - o mapa de endereços

Exemplo real: dentro do arquivo de rotas de lugares tem uma linha que diz - _"quando alguém fizer POST na URL `/api/places`, passa primeiro pelo porteiro de autenticação, depois pelo porteiro de admin, depois pelo conferente de dados, e só então chama o controlador de criar lugar"_.

É a recepcionista que olha o crachá e encaminha pro setor certo, já dizendo quais porteiros o visitante precisa passar antes.

### `controllers` - o cérebro que resolve de verdade

A recepcionista só encaminha - quem executa o trabalho é ele.

Exemplos:

- **"listar lugares"** → vai no banco, busca todos, devolve
- **"criar lugar"** → verifica se já existe com o mesmo identificador (se sim, responde **409 conflito**), senão salva (**201 criado**)

É onde a regra de negócio acontece.

### `middlewares` - os porteiros no caminho

Cada um confere uma coisa específica antes do pedido chegar no cérebro. Pensa num aeroporto com vários checkpoints:

- **Porteiro 1 (segurança)**: "essa origem é permitida? esse IP tá abusando?" - se barra, responde direto e o pedido morre ali
- **Porteiro 2 (autenticação)**: "veio token? válido? expirou? usuário ainda existe?" - se não, **401**
- **Porteiro 3 (admin)**: "é admin?" - se não, **403**
- **Porteiro 4 (validação)**: "dados completos? formato certo?" - se não, **400**
- **Porteiro 5 (log)**: registra tudo no arquivo de log
- **Porteiro 6 (erro)**: último da fila, captura qualquer explosão em qualquer ponto

Cada porteiro confere **só uma coisa**. Se mudar a regra de "quem é admin", mexe num porteiro só, e afeta todas as rotas que passam por ele automaticamente.

### `validators` - os conferentes dos dados

Cada campo tem regra escrita: nome entre 2 e 30 letras, email formato válido, senha ≥ 8. Se veio errado, o porteiro da validação barra com **400**.

Fica separado do controller pra não poluir a lógica de negócio com regra de formulário.

### `errors` - os cartões de erro prontos

Cada tipo de erro tem seu cartão com nome e código HTTP já definido. Em vez de espalhar `if` de erro pelo código, lança o cartão certo e o handler central captura.

Tipo um catálogo: "aqui o cartão do 401, aqui o do 404, aqui o do 409".

### `utils` - as ferramentas pequenas

Funções soltas que não dependem de nada externo: criptografar senha, gerar token, comparar senha. Testáveis isoladamente, sem precisar de banco.

### `tests` - o simulador

Mesma divisão das pastas de cima, mas testando cada parte.

**Exemplos unitários:**

- Criptografar "abc123" duas vezes precisa dar resultados **diferentes** (senão o hash não é seguro)
- Validador com email `"invalido"` precisa recusar
- Validador com senha de 3 letras precisa recusar

**Exemplos de integração:**

- Usuário A tentando deletar favorito do B → **404**, favorito do B intacto
- Deletar um lugar → todos os favoritos dele somem juntos (sem dados órfãos)
- Dois usuários diferentes favoritando o mesmo lugar → os dois coexistem

---

## 3. O caminho de um pedido

Exemplo: front manda **"criar lugar novo"** (`POST /api/places`).

```
Front → Back
   ↓
1. Porteiro de segurança
   ├─ origem permitida? NÃO → 403 morre aqui
   ├─ passou do limite de requisições? SIM → 429 morre aqui
   └─ tudo ok → passa
   ↓
2. Entende o corpo
   └─ JSON malformado? SIM → 400 "JSON inválido" morre aqui
   ↓
3. Porteiro de log
   └─ anota "chegou POST /api/places" (sempre passa, só registra)
   ↓
4. Recepcionista (router)
   └─ "POST em /api/places? chama o controller de criar lugar"
   ↓
5. Porteiro de autenticação
   ├─ sem token → 401 morre aqui
   ├─ token inválido → 401 morre aqui
   ├─ usuário não existe mais → 401 morre aqui
   └─ tudo ok → injeta quem é o usuário e passa
   ↓
6. Porteiro de admin
   ├─ usuário é comum → 403 morre aqui
   └─ é admin → passa
   ↓
7. Conferente (validator)
   ├─ faltou campo? → 400 com mensagem clara, morre aqui
   ├─ tag inválida? → 400, morre aqui
   └─ tudo ok → passa
   ↓
8. Cérebro (controller)
   ├─ já existe lugar com esse slug? SIM → 409 morre aqui
   └─ não existe → salva no banco
   ↓
9. Responde: 201 Created + o lugar criado
```

**Regra de ouro do fluxo:** cada etapa **só decide se passa ou barra**. Se barra, responde na hora com o código HTTP certo, e o pedido **morre ali** - não segue adiante. Se passa, entrega pro próximo. Nunca pula etapa, nunca volta pra trás.

E se estourar erro em qualquer ponto, o **último porteiro da fila** (o handler de erro) captura tudo, padroniza no formato `{ "mensagem": "explicação" }`, e devolve o código HTTP adequado. O front sempre recebe a mesma estrutura de resposta, seja sucesso ou erro.

---

## 4. Login em 2 frases

Quando o cara se cadastra, a senha vira um **hash** (embaralhado irreversível) antes de guardar. No login, o servidor gera um **token** - um crachá assinado que vale 7 dias. Nas próximas requisições, ele manda o crachá no cabeçalho, o servidor confere e libera.

Tem duas checagens: **autenticado** (tem crachá válido?) e **autorizado** (tem permissão pra essa ação específica?). Autenticado mas não-admin tentando deletar lugar? **403** - tem crachá mas não tem permissão.

---

## 5. Testes em 1 frase

111 testes automatizados. Cada um verifica um comportamento específico. Roda em 15 segundos. Se eu mexer em qualquer coisa e algo quebrar, o teste me avisa na hora - antes de chegar no front.

---

## 6. Por que organizei assim

### 1. Mudança vira cirurgia, não reforma

Se eu quiser mudar como valido um campo, mexo num arquivo só. Se quiser mudar o formato de erro, o handler central cobre todos os endpoints de uma vez. Se quiser trocar a regra de "quem é admin", mexo num porteiro só, e afeta todas as 10 rotas automaticamente.

Sem essa separação, uma mudança simples obrigaria a mexer em 5 arquivos diferentes, com risco de quebrar coisa que não devia.

### 2. Testes ficam rápidos e cirúrgicos

111 testes rodam em 15 segundos porque cada camada é testável isoladamente. Se a criptografia quebrar, o teste unitário dela falha em milissegundos - nem preciso subir o banco. Se o fluxo HTTP quebrar, o teste de integração aponta exatamente qual endpoint, qual status e qual mensagem veio diferente do esperado.

Sem essa divisão, eu só teria testes gigantes de integração, lentos e difíceis de debugar.

### 3. Onboarding de outro dev leva 10 minutos

Se amanhã outra pessoa entrar no projeto, ela abre a pasta e entende a arquitetura só pelos nomes. Vê `middlewares`, sabe que ali são os filtros. Vê `controllers`, sabe que ali é a lógica. Vê `validators`, sabe que ali são as regras de campo.

Não precisa ler 500 linhas de um arquivo gigante pra entender. Isso é o que separa código amador de código profissional.

### 4. Defesa em profundidade - segurança em camadas

A autorização não é um `if` solto no meio do controller - é um porteiro separado que roda em toda rota que precisa. Se um dia eu esquecer de aplicar em alguma rota nova, o padrão do projeto me obriga a colocar.

Além disso, o banco tem constraint próprio (índice único de favorito por usuário), então mesmo se o código falhar, o banco impede duplicata. Não é uma única linha de defesa - são três ou quatro camadas protegendo o mesmo dado.

### 5. O padrão escala quando o projeto cresce

Hoje são 10 endpoints. Se amanhã forem 50, a estrutura continua igual: cada rota nova entra no arquivo de rotas, cada controller novo entra no barrel de controllers, cada teste novo segue o mesmo padrão.

O custo de adicionar feature nova não aumenta - ele fica linear. Isso é o que eu chamo de código que envelhece bem.

### Fechamento

O ponto não é que essa arquitetura seja a única certa. É que cada decisão aqui tem uma consequência concreta no dia a dia: mudar uma coisa não quebra outra, testar é rápido, e qualquer pessoa consegue ler o projeto.

Pra um projeto que vai ser integrado com frontend, evoluído e revisado, isso é o que importa.

---

**Pronto.** Esse é o backend explicado numa conversa de 3 minutos, sem jargão, com exemplos reais.
