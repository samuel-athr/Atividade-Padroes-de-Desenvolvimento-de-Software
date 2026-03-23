# Atividade-Padroes-de-Desenvolvimento-de-Software
Atividade de identificação de Code Smells em código.
Integrantes: Samuel Arthur, José Bento e Gabriel Carneiro

```ts
class SistemaBiblioteca {
 private livros: string[][] = [];
 private usuarios: string[][] = [];
 private emprestimos: string[][] = [];

 adicionarLivro(titulo: string, autor: string, isbn: string): void {
  const livro: string[] = [titulo, autor, isbn, "DISPONIVEL", "0"];
  this.livros.push(livro);
  const msg = "Novo livro: " + titulo + " de " + autor;
  this.enviarEmail("admin@biblioteca.com", "Novo Livro", msg);
 }

 cadastrarUsuario(nome: string, email: string, tipo: string): void {
  this.usuarios.push([nome, email, tipo, "0"]);
  this.enviarEmail(email, "Bem-vindo", "Cadastro realizado com sucesso!");
 }

 realizarEmprestimo(isbn: string, emailUsuario: string): void {
  let livro: string[] | null = null;
  for (const l of this.livros) {
   if (l[2] === isbn) { livro = l; break; }
  }

  if (livro === null) { console.log("Livro não encontrado"); return; }
  if (livro[3] !== "DISPONIVEL") { console.log("Livro indisponível"); return; }

  let usuario: string[] | null = null;
  for (const u of this.usuarios) {
   if (u[1] === emailUsuario) { usuario = u; break; }
  }

  if (usuario === null) { console.log("Usuário não encontrado"); return; }

  const emprestados = parseInt(usuario[3]);
  let limite = 3;

  if (usuario[2] === "PROFESSOR") { limite = 10; }
  else if (usuario[2] === "FUNCIONARIO") { limite = 5; }

  if (emprestados >= limite) {
   console.log("Limite atingido");
   return;
  }

  livro[3] = "EMPRESTADO";
  usuario[3] = String(emprestados + 1);

  const hoje = new Date();
  const devolucao = new Date(hoje);
  devolucao.setDate(devolucao.getDate() + 14);

  this.emprestimos.push([
   isbn,
   emailUsuario,
   hoje.toISOString().split('T')[0],
   devolucao.toISOString().split('T')[0],
   "ATIVO"
  ]);

  this.enviarEmail(emailUsuario, "Empréstimo", "Você emprestou: " + livro[0]);
 }

 gerarRelatorio(tipo: string): string {
  let sb = "";

  if (tipo === "LIVROS") {
   sb += "=== RELATÓRIO DE LIVROS ===\n";
   for (const l of this.livros) {
    sb += l[0] + " | " + l[1] + " | " + l[3] + "\n";
   }
  } else if (tipo === "USUARIOS") {
   sb += "=== RELATÓRIO DE USUÁRIOS ===\n";
   for (const u of this.usuarios) {
    sb += u[0] + " | " + u[1] + " | Tipo: " + u[2] + "\n";
   }
  } else if (tipo === "EMPRESTIMOS") {
   sb += "=== RELATÓRIO DE EMPRÉSTIMOS ===\n";
   for (const e of this.emprestimos) {
    sb += "ISBN: " + e[0] + " | Usuário: " + e[1] + "\n";
   }
  }

  return sb;
 }

 calcularMulta(isbn: string, emailUsuario: string): number {
  for (const e of this.emprestimos) {
   if (e[0] === isbn && e[1] === emailUsuario && e[4] === "ATIVO") {
    const diasAtraso = Math.floor(
     (new Date().getTime() - new Date(e[3]).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diasAtraso > 0) return diasAtraso * 2.50;
   }
  }
  return 0;
 }

 private enviarEmail(dest: string, assunto: string, corpo: string): void {
  console.log("[EMAIL] Para: " + dest + " | Assunto: " + assunto);
 }
}
```
| # | Code Smell | Localização | Problema | Refatoração | Técnica |
|--|--|--|--|--|--|
| 1 | God Class | SistemaBiblioteca | Muitas responsabilidades | Separar em services | Extract Class |
| 2 | Primitive Obsession | Arrays string[][] | Dados sem estrutura | Criar classes | Replace Data Value |
| 3 | Long Method | realizarEmprestimo | Método grande | Dividir métodos | Extract Method |
| 4 | Switch | if/else | Difícil escalar | Polimorfismo | Replace Conditional |
| 5 | Feature Envy | calcularMulta | Usa dados externos | Mover método | Move Method |
