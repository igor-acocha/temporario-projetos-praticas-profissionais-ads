# 💡 Tech Start

### Plataforma de conexão entre estudantes de tecnologia e empresas

---

O projeto tem como objetivo disponibilizar uma plataforma que conecte estudantes da área de tecnologia com empresas que não possuam condições de contratar times de desenvolvimento ou consultorias especializadas.  
O sistema busca **aumentar a experiência prática dos estudantes**, **formar cases reais de mercado** e **oferecer soluções acessíveis** para as empresas contratantes.

---

## 👥 Equipe de Desenvolvimento

| Nome Completo |
|----------------|
| **Igor Francisco da Silva Acocha** |
| **João Vitor Pinheiro Tassi** |
| **Keren Gabriely de Assis Umbuzeiro** |
| **Milene Santos Pereira** |
| **Vitor Rodrigues Souza Lima** |

---

## 📂 Estrutura de Branches

O projeto está dividido nas seguintes branches principais:

- **tcc-backend** → Código do servidor
- **tcc-frontend** → Aplicação web

---

## ⚙️ Requisitos

Antes de começar, garanta que possui instaladas as seguintes ferramentas:

### 🔧 Backend
- Java 17+  
- Maven  
- MySQL Server  
- IntelliJ IDEA **(recomendado)**

### 💻 Frontend
- Node.js
- Visual Studio Code **(recomendado)**

---

## 🚀 Passo a Passo para Executar o Projeto

### 1️⃣ Clonar os repositórios

**Clonar o backend:**
```bash
    git clone -b tcc-backend https://github.com/igor-acocha/temporario-projetos-praticas-profissionais-ads.git
    cd temporario-projetos-praticas-profissionais-ads
```

**Clonar o Frontend:**
```bash
    git clone -b tcc-frontend https://github.com/igor-acocha/temporario-projetos-praticas-profissionais-ads.git
    cd temporario-projetos-praticas-profissionais-ads
```
---

# ⚙️ Configuração do Banco de Dados e Execução do Projeto

### 2️⃣ Configurar o Banco de Dados (MySQL)

1. Instale o **MySQL Server** e crie uma conexão de acordo com seus dados.
2. Dentro da branch tcc-backend há um script SQL com a estrutura necessária do banco.
Rode esse script no seu MySQL para criar as tabelas.
3. Anote o nome da conexão criada, usuário e senha configurados no seu MySQL — essas informações serão usadas no arquivo .env.

---

### 3️⃣ Configurar o Backend

1. Abra o projeto **tcc-backend** no **IntelliJ IDEA**.  
2. Mude o arquivo `.env` na raiz do projeto com o seguinte conteúdo (ajuste conforme o seu ambiente):
```env
    SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/{NOME_DA_CONEXÃO_CRIADA}
    SPRING_DATASOURCE_USERNAME={SEU_USERNAME}
    SPRING_DATASOURCE_PASSWORD={SUA_PASSWORD}
    SPRING_DATASOURCE_POOL_NAME={NOME_DA_CONEXÃO_CRIADA}
```
3. No IntelliJ, vá em:
```bash
    Run → Edit Configurations → Add New Configuration → Application
```

4. Configure a Main Class, selecionando o arquivo TccApplication.
5. Selecione o arquivo .env em Environment variables.
6. Salve e execute o projeto.

---

### 4️⃣ Configurar o Frontend
1. Abra o projeto **tcc-frontend** no **Visual Studio Code**.
2. No terminal, instale as dependências:
```bash
    npm install
```

3. Inicie a aplicação
```bash
    npm start
```

4. Acesse:
```bash
    localhost:4200
```

---

## 🏁 Conclusão

Este projeto foi desenvolvido como parte da disciplina **Práticas Profissionais**, do curso de **Análise e Desenvolvimento de Sistemas** da **Universidade Presbiteriana Mackenzie**, com o intuito de aplicar de forma prática os conhecimentos adquiridos durante o curso.
