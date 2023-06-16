const express = require("express");

//tonando express executável
const app = express()

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

//configurando express para trabalhar com json
app.use(express.json());

//importando router para utilização de rotas em arquivos separados
const router = express.Router()

//importando models
const categoria = require('../models/categorias')
const gastoRealizado = require('../models/gastosRealizados')
const gastoAgendado = require("../models/gastosAgendados");

//rota com função de listar categorias para seleção no formulário de gasto
router.post('/listar/categotias', async (req, res) => {

    let id = req.body.usuarioId

    // console.log(id)
    await categoria.findAll({ where: { orcamentoId: id } }).then((response) => {
        console.log(response)
        res.send(response)
    })

})

//rota com função de adicionar gasto
router.post('/adicionar', async (req, res) => {

    let categoriaId = req.body.categoriaId;

    let mes = req.body.mes;
    let ano = req.body.ano;

    //calcula a soma dos valores dos gastos realizados do mês da categoria selecionada
    await gastoRealizado.sum('gastosrealizados.valor', {
        include: {
            model: categoria,
            where: { id: categoriaId }
        },
        where: {
            createdAt: {
                [Op.gte]: new Date(ano, mes - 1, 1), // data inicial do mês
                [Op.lt]: new Date(ano, mes, 1), // data inicial do próximo mês
            }
        }
    }).then((gastosRealizados) => {

        //calcula a soma dos valores dos gastos agendados do mês da categoria selecionada
        gastoAgendado.sum('gastosagendados.valor', {
            include: {
                model: categoria,
                where: { id: categoriaId }
            },
            where: {
                dataGasto: {
                    [Op.gte]: new Date(ano, mes - 1, 1), // data inicial do mês
                    [Op.lt]: new Date(ano, mes, 1), // data inicial do próximo mês
                }
            }
        }).then((gastosAgendados) => {

            //realiza a soma dos dois resultados
            let soma = gastosAgendados + gastosRealizados

            categoria.findByPk(categoriaId).then((categoria) => {

                //realiza operação para obter o valor disponível na categoria para a criação de um novo gasto
                let disponivelCat = categoria.valor - soma;

                let erros = [];

                if (disponivelCat < req.body.valor) {
                    erros.push("O valor do gasto deve ser menor que o valor disponível da categoria");
                }

                if (!req.body.valor || req.body.valor == null || !req.body.descricao || req.body.descricao == null) {
                    erros.push("Preencha todos os campos");
                }

                if (erros.length > 0) {
                    res.send({ erros: erros });
                } else {
                    // Inserindo o gasto realizado no banco de dados
                    gastoRealizado.create({
                        descricao: req.body.descricao,
                        valor: req.body.valor,
                        categoriaId: req.body.categoriaId
                    }).then(() => {
                        res.send(JSON.stringify("success"));
                    });
                }
            })
        });
    });
});


//rota com função de listar gastos através no mês de registro
router.post('/listar', async (req, res) => {

    let id = req.body.usuarioId

    let mes = req.body.mes
    let ano = req.body.ano

    //seleciona os gastos do mês atual, juntamente com suas categorias
    await gastoRealizado.findAll({
        order: [['id', 'DESC']],
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
    }).then((response) => {

        res.send(JSON.stringify(response))
        console.log(response)
    })
})


// router.post('/editar', async (req, res) => {

// })

router.get('/deletar/:id', async (req, res) => {
    await gastoRealizado.destroy({ where: { id: req.params.id } })
    res.send(JSON.stringify('success'))
})

module.exports = router