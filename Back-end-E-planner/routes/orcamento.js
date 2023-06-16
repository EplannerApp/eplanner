//importando express
const express = require("express")

//tonando express executável
const app = express()

//importações do sequelize para requisições adicionais
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

//configurando express para trabalhar com json
app.use(express.json());

//importando router para utilização de rotas em arquivos separados
const router = express.Router()

//importando models a serem utilizadas
const usuario = require('../models/usuarios')
const orcamento = require('../models/orcamentos')
const gastoRealizado = require('../models/gastosRealizados')
const gastoAgendado = require('../models/gastosAgendados')
const categoria = require('../models/categorias');

//rota com função de adicionar orçamento
router.post('/adicionar', async (req, res) => {

    let id = req.body.usuarioId

    await usuario.findByPk(id, { include: [{ all: true }] }).then((response) => {

        //verifica se usuário ja possui orçamento
        if (response.orcamentos) {
            res.send(JSON.stringify('Usuário ja possui orçamento'))
        } else {
            orcamento.create({
                usuarioId: req.body.usuarioId, //cria o registro no banco de dados
                valor: req.body.valor
            })

            res.send(JSON.stringify('success')) //resposta a ser enviada
        }
    }).catch((error) => {
        res.send(JSON.stringify('error'))
        console.log(error)
    })


})

//rota com função de listar orçamento, juntamente com a soma dos valores dos gastos do mês
router.post('/listar', async (req, res) => {

    let id = req.body.usuarioId

    //seleciona o orçamento pertencente ao usuário logado
    await usuario.findByPk(id, { include: { model: orcamento } }).then((usuario) => {

        //captura o orçamento
        let orcamento = usuario.orcamento
        // console.log(orcamento)


        let mes = req.body.mes
        let ano = req.body.ano

        //seleciona a soma de todos os gastos realizados durante determiado mês
        gastoRealizado.sum('gastosrealizados.valor', {
            include: {
                model: categoria,
                where: { orcamentoId: id }
            },
            where: {
                createdAt: {
                    [Op.gte]: new Date(ano, mes - 1, 1), // data inicial do mês
                    [Op.lt]: new Date(ano, mes, 1), // data inicial do próximo mês
                }
            }
        }).then((gastosRealizados) => {

            //seleciona a soma de todos os gastos agendados durante determiado mês
            gastoAgendado.sum('gastosagendados.valor', {
                include: {
                    model: categoria,
                    where: { orcamentoId: id }
                },
                where: {
                    dataGasto: {
                        [Op.gte]: new Date(ano, mes - 1, 1), // data inicial do mês
                        [Op.lt]: new Date(ano, mes, 1), // data inicial do próximo mês
                    }
                }
            }).then((gastosAgendados) => {

                    //realiza operação de soma, para capturar o 
                    //valor total de gastos (realizados e agendados) de determinado mês
                    let gastos = gastosRealizados + gastosAgendados

                    //devole para o front um objeto com a soma dos gastos e valor total se seu orçamento
                    let response = { orcamento, gastos }
                    res.send(JSON.stringify(response))
                    console.log(JSON.stringify(response))
                }).catch((error) => {
                    res.send(JSON.stringify(error))      // tratamento de erro para evitar que a aplicação caia
                    console.log(error)
                })
        })
    })

})


//rota com função de editar orçamento
router.post('/editar', async (req, res) => {

    let id = req.body.usuarioId
    let valor = req.body.valor

    //selecionar categoria para validação
    categoria.sum('valor', { where: { orcamentoId: id } }).then((somaCats) => {

        let erros = []

        if (valor < somaCats) {
            erros.push("o valor de suas categorias ultrapassa a renda selecionada!")
        }

        if (erros.length > 0) {
            res.send({ erros: erros })
        } else {
            
            //após validação, editar orçamento
            orcamento.update(
                { valor },
                { where: { id } }
            ).then(() => {
                res.send(JSON.stringify('success'))
            }).catch((error) => {
                res.send(JSON.stringify('error'))
                console.log(error)
            })
        }
    })



})

//rota com função de deletar orçamento
// router.get('/deletar/:id', async (req, res) => {
//     orcamento.destroy({ where: { id: req.params.id } })
//     res.send('renda deletada')
// })

module.exports = router