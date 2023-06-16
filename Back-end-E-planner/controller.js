//importando express
const express = require('express');

//importando cors
const cors = require('cors');

//importando rotas externas
const routerUsuario = require('./routes/usuario')
const routerOrcamento = require('./routes/orcamento')
const routerCategoria = require('./routes/categoria')
const routerGastoRealizado = require('./routes/gastoRealizado')
const routerGastoAgendado = require('./routes/gastoAgendado')

//config
const app = express();
app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());


//colocando rotas em uso 
app.use('/usuario', routerUsuario)
app.use('/orcamento', routerOrcamento)
app.use('/categoria', routerCategoria)
app.use('/gastoRealizado', routerGastoRealizado)
app.use('/gastoAgendado', routerGastoAgendado)

//porta
let porta = process.env.PORT || 3000;

app.listen(porta, (req, res)=>{
    console.log('Servidor rodando');
});