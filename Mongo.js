const { MongoClient } = require('mongodb');

// URL de conexão do MongoDB
const url = 'mongodb://127.0.0.1:27017';

// Nome do banco de dados e coleções que serão criadas;
const dbName = 'Banco';
const collectionName1 = 'Agências';
const collectionName2 = 'Clientes';
const collectionName3 = 'Contas';
const collectionName4 = 'Transações';

// Função para executar o exemplo
async function criarBanco() {

  const client = new MongoClient(url); //Criamos o cliente do MongoDB

  try {
    await client.connect(); //Conecta com o MongoDB
    console.log('Conectado ao servidor MongoDB');

    const db = client.db(dbName); //Acessa o banco de dados (Banco)

    // Chama as funções de criar coleções, que são equivalentes as tabelas nos bancos de dados relacionais;
    await criarColecao(db, collectionName1);
    await criarColecao(db, collectionName2);
    await criarColecao(db, collectionName3);
    await criarColecao(db, collectionName4);

    // Adicionando informações nas coleções criadas anteriormente
    await addAgencia(db, novaAgencia);
    await addConta(db, novaConta);
    await addCliente(db, novoCliente);
    await addConta(db, novaConta2);
    await addConta(db, novaConta3);
    await addCliente(db, novoCliente2);
    await addTransacao(db, novaTransacao);


    // Listando o conteúdo de cada coleção
    await list(db, collectionName1);
    await list(db, collectionName2);
    await list(db, collectionName3);
    await list(db, collectionName4);

    // Realizando uma busca por uma informação na coleção
    await search(db, collectionName2, 'cpf', "123.456.789-10");


  } catch (error) {

    console.error('Erro:', error); //Caso dê erro na abertura da conexão ele printa o erro
  
  } finally {

    await client.close(); //Por fim fecha a conexão
    console.log('Conexão fechada');
  }
}

async function criarColecao(db, collectionName) { //Função que cria coleções no banco de dados, recebe o banco e o nome da coleção como parâmetros

  const collections = await db.collections();
  
  if (!collections.map(c => c.collectionName).includes(collectionName)) { //Verifica se aquela coleção já existe
    
    await db.createCollection(collectionName); // Cria a coleção
    console.log(`Coleção ${collectionName} criada.`);

  } else {
    console.log(`Coleção ${collectionName} já existe.`);
  
  }

}

async function addDB(db, json, collectionName) { //Função genérica que insere uma informação no banco, recebendo o nome da coleção como parâmetro
  
  const collection = db.collection(collectionName); //Acessa a coleção passada

  const inserirResultado = await collection.insertOne(json); //Insere o dado na coleção
  console.log(`Novo elemento inserido na coleção ${collectionName}:`, inserirResultado.insertedId);
}

async function addAgencia(db, json) { //Função especifica para inserir na coleção Agencia
  await addDB(db, json, 'Agências');
}

async function addCliente(db, json) { //Função especifica para inserir na coleção Cliente
  await addDB(db, json, 'Clientes');
}

async function addConta(db, json) { //Função especifica para inserir na coleção Conta
  await addDB(db, json, 'Contas');
}

async function addTransacao(db, json) { //Função especifica para inserir na coleção Transação
  await addDB(db, json, 'Transações');
}

async function search(db, collectionName, key, val) { //Função que busca alguma informação baseada na chave e no valor dentro de uma coleção, equivalente a buscar uma linha em um banco relacional, tendo como base a coluna e o valor;
  
  const collection = db.collection(collectionName);

  let obj = {};
  obj[key] = val;

  const query = await collection.find(obj).toArray();
  console.log(`Resultados da busca na coleção ${collectionName} por ${key}:`, query);
}

async function list(db, collectionName) { //Função que busca por todas as informações contidas em uma coleção do banco
  const collection = db.collection(collectionName);

  const query = await collection.find({}).toArray();
  console.log(`Todos os elementos da coleção ${collectionName}:`, query);
}

const novoCliente = {
  nome: 'João da Silva',
  cpf: "123.456.789-10",
  dataDeNascimento: '01/01/1980',
  endereco: 'Rua ABC, 123',
  telefone: '123456789'
};

const novaAgencia = {
  codAgencia: 1,
  nome: 'Agência Central',
  endereco: 'Av. XYZ, 456',
  dataDeCriacao: '01/01/2000'
};

const novaConta = {
  codConta: 1,
  codAgencia: 1,
  cpfTitular: '123.456.789-10',
  saldo: 1000,
  tipoConta: 'Corrente'
};

const novaTransacao = {
  tipoTransacao: 'Transferência',
  codContaOrigem: 1,
  codContaDestino: 2,
  valor: 100
};

const novoCliente2 = {
  nome: 'Malu',
  cpf: "124.457.789-10",
  dataDeNascimento: '01/01/1990',
  endereco: 'Rua ABC, 123',
  telefone: '123456788'
};

const novaConta2 = {
  codConta: 2,
  codAgencia: 1,
  cpfTitular: '124.457.789-10',
  saldo: 1000,
  tipoConta: 'Poupança'
};

const novaConta3 = {
  codConta: 3,
  codAgencia: 1,
  cpfTitular: '124.457.789-10',
  saldo: 10000,
  tipoConta: 'Corrente'
};

// Executando o exemplo
criarBanco();