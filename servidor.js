// Pacotes  necessários
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const { render } = require('ejs');
const MongoClient = require("mongodb").MongoClient;

const uri = `mongodb+srv://kaykypires:essasenha@cluster0.4kilg7i.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true });

var app = express();
app.use(express.static('./public'));
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(80, () => {
  console.log('server started');
});

app.get('/', (req, res) => {
  res.redirect("/listar_usuarios");
});

/////////////////////////////////////////////////////////////////////////
// Usuários

app.post("/cadastrar_usuario", function(req, resp) {

  // realiza conexão com banco de dados
  client.connect((err) => {
    // salva dados no banco
    client.db("exemplo_bd").collection("usuarios").insertOne(
      { db_titulo: req.body.titulo, db_resumo: req.body.resumo, db_conteudo: req.body.conteudo }, function (err) {
      if (err) {
        resp.render('resposta_usuario', {resposta: "Erro ao cadastrar POST!"})
      }else {
        resp.render('resposta_usuario', {resposta: "POST cadastrado!"})        
      };
    });
  });

});


app.post("/logar_usuario", function(req, resp) {

  // realiza conexão com banco de dados
  client.connect((err) => {
    // busca um usuário no banco de dados
    client.db("exemplo_bd").collection("usuarios").find(
      {db_login: req.body.login, db_senha: req.body.senha }).toArray(function(err, items) {
        console.log(items);
        if (items.length == 0) {
          resp.render('resposta_usuario', {resposta: "Usuário/senha não encontrado!"})
        }else if (err) {
          resp.render('resposta_usuario', {resposta: "Erro ao logar usuário!"})
        }else {
          resp.render('resposta_usuario', {resposta: "Usuário logado com sucesso!"})        
        };
      });
  });  

});


app.get("/listar_usuarios", function(req, resp) {

  client.connect((err) => {
    // busca todos os usuarios no banco de dados
    client
      .db("exemplo_bd")
      .collection("usuarios")
      .find().toArray(function(err, items) {
        // renderiza a resposta para o navegador
        resp.render("lista_usuarios", { usuarios: items });
      });
  });  

});


app.post("/atualizar_usuario", function(req, resp) {

 // realiza conexão com banco de dados
  client.connect((err) => {
    // atualiza senha do usuário
    client.db("exemplo_bd").collection("usuarios").updateOne(
        { db_login: req.body.login, db_senha: req.body.senha }, 
        { $set: {db_senha: req.body.novasenha} }, function (err, result) {
          console.log(result);
          if (result.modifiedCount == 0) {
            resp.render('resposta_usuario', {resposta: "Usuário/senha não encontrado!"})
          }else if (err) {
            resp.render('resposta_usuario', {resposta: "Erro ao atualizar usuário!"})
          }else {
            resp.render('resposta_usuario', {resposta: "Usuário atualizado com sucesso!"})        
          };
    });
  });

});


app.post("/remover_usuario", function(req, resp) {

 // realiza conexão com banco de dados
  client.connect((err) => {

    // remove do usuário
    client.db("exemplo_bd").collection("usuarios").deleteOne(
      { db_login: req.body.login, db_senha: req.body.senha } , function (err, result) {
        console.log(result);
        if (result.deletedCount == 0) {
          resp.render('resposta_usuario', {resposta: "Usuário/senha não encontrado!"})
        }else if (err) {
          resp.render('resposta_usuario', {resposta: "Erro ao remover usuário!"})
        }else {
          resp.render('resposta_usuario', {resposta: "Usuário removido com sucesso!"})        
        };
      });
    });
});
