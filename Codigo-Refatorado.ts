class Livro {
  constructor(
    public titulo: string,
    public autor: string,
    public isbn: string,
    public status: string = "DISPONIVEL"
  ) {}
}

interface TipoUsuario {
  getLimite(): number;
}

class Aluno implements TipoUsuario {
  getLimite(): number {
    return 3;
  }
}

class Professor implements TipoUsuario {
  getLimite(): number {
    return 10;
  }
}

class Funcionario implements TipoUsuario {
  getLimite(): number {
    return 5;
  }
}

class Usuario {
  public livrosEmprestados: number = 0;

  constructor(
    public nome: string,
    public email: string,
    public tipo: TipoUsuario
  ) {}
}

class Emprestimo {
  constructor(
    public livro: Livro,
    public usuario: Usuario,
    public dataEmprestimo: Date,
    public dataDevolucao: Date,
    public status: string = "ATIVO"
  ) {}

  calcularMulta(): number {
    const diasAtraso = Math.floor(
      (Date.now() - this.dataDevolucao.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diasAtraso > 0 ? diasAtraso * 2.5 : 0;
  }
}

class EmailService {
  enviar(dest: string, assunto: string, corpo: string): void {
    console.log(`[EMAIL] Para: ${dest} | Assunto: ${assunto}`);
  }
}

class LivroService {
  private livros: Livro[] = [];

  adicionarLivro(titulo: string, autor: string, isbn: string): Livro {
    const livro = new Livro(titulo, autor, isbn);
    this.livros.push(livro);
    return livro;
  }

  buscarPorIsbn(isbn: string): Livro | undefined {
    return this.livros.find(l => l.isbn === isbn);
  }

  listar(): Livro[] {
    return this.livros;
  }
}

class UsuarioService {
  private usuarios: Usuario[] = [];

  cadastrar(nome: string, email: string, tipo: TipoUsuario): Usuario {
    const usuario = new Usuario(nome, email, tipo);
    this.usuarios.push(usuario);
    return usuario;
  }

  buscarPorEmail(email: string): Usuario | undefined {
    return this.usuarios.find(u => u.email === email);
  }

  listar(): Usuario[] {
    return this.usuarios;
  }
}

class EmprestimoService {
  private emprestimos: Emprestimo[] = [];

  constructor(private emailService: EmailService) {}

  realizarEmprestimo(livro: Livro, usuario: Usuario): void {
    this.validarEmprestimo(livro, usuario);

    livro.status = "EMPRESTADO";
    usuario.livrosEmprestados++;

    const hoje = new Date();
    const devolucao = new Date();
    devolucao.setDate(hoje.getDate() + 14);

    const emprestimo = new Emprestimo(
      livro,
      usuario,
      hoje,
      devolucao
    );

    this.emprestimos.push(emprestimo);

    this.emailService.enviar(
      usuario.email,
      "Empréstimo realizado",
      `Você emprestou: ${livro.titulo}`
    );
  }

  private validarEmprestimo(livro: Livro, usuario: Usuario): void {
    if (livro.status !== "DISPONIVEL") {
      throw new Error("Livro indisponível");
    }

    if (usuario.livrosEmprestados >= usuario.tipo.getLimite()) {
      throw new Error("Limite de empréstimos atingido");
    }
  }

  listar(): Emprestimo[] {
    return this.emprestimos;
  }
}

class RelatorioService {
  gerarRelatorioLivros(livros: Livro[]): string {
    return livros
      .map(l => `${l.titulo} | ${l.autor} | ${l.status}`)
      .join("\n");
  }

  gerarRelatorioUsuarios(usuarios: Usuario[]): string {
    return usuarios
      .map(u => `${u.nome} | ${u.email} | Limite: ${u.tipo.getLimite()}`)
      .join("\n");
  }

  gerarRelatorioEmprestimos(emprestimos: Emprestimo[]): string {
    return emprestimos
      .map(e =>
        `${e.livro.titulo} | ${e.usuario.nome} | Devolução: ${e.dataDevolucao.toDateString()}`
      )
      .join("\n");
  }
}

const emailService = new EmailService();

const livroService = new LivroService();
const usuarioService = new UsuarioService();
const emprestimoService = new EmprestimoService(emailService);
const relatorioService = new RelatorioService();

const livro1 = livroService.adicionarLivro("Clean Code", "Robert C. Martin", "123");

const usuario1 = usuarioService.cadastrar(
  "Samuel",
  "samuel@email.com",
  new Aluno()
);

emprestimoService.realizarEmprestimo(livro1, usuario1);

console.log("\n📚 LIVROS:");
console.log(relatorioService.gerarRelatorioLivros(livroService.listar()));

console.log("\n👤 USUÁRIOS:");
console.log(relatorioService.gerarRelatorioUsuarios(usuarioService.listar()));

console.log("\n📦 EMPRÉSTIMOS:");
console.log(relatorioService.gerarRelatorioEmprestimos(emprestimoService.listar()));
