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
const gastoRealizado = require('../models/gastosRealizados');
const gastoAgendado = require("../models/gastosAgendados");

//rota com função de adicionar gasto
router.post('/adicionar', async (req, res) => {

    let categoriaId = req.body.categoriaId

    let mes = req.body.mes
    let ano = req.body.ano

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
                let disponivelCat = categoria.valor - soma

                let erros = []

                if (disponivelCat < req.body.valor) {
                    erros.push("O valor do gasto deve ser menor que o valor disponível da categoria")
                }

                if (!req.body.valor || req.body.valor == null || !req.body.descricao || req.body.descricao == null) {
                    erros.push("Preencha todos os campos")
                }

                if (erros.length > 0) {
                    res.send({ erros: erros })
                } else {
                    //inserindo gasto
                    gastoAgendado.create({
                        descricao: req.body.descricao,
                        valor: req.body.valor,
                        dataGasto: req.body.dataGasto,
                        categoriaId: req.body.categoriaId
                    }).then(() => {
                        res.send(JSON.stringify("success"))
                    })
                }
            })
        })
    })
})

//rota com função de listar gasto agendado
router.post('/listar', async (req, res) => {

    let id = req.body.usuarioId

    await gastoAgendado.findAll({
        order: [['dataGasto']],
        include: {
            model: categoria,
            where: { orcamentoId: id }
        }
    }).then((response) => {

        res.send(response)
    })

})

//rota que confirma a efetuação do gasto
router.post('/confirmarGasto/:id', async (req, res) => {
    try {
        //seleciona o gasto
        const gastoAgendadoEncontrado = await gastoAgendado.findByPk(req.params.id);

        // cria um novo gasto realizado com os mesmos dados do gasto agendado
        const novoGastoRealizado = await gastoRealizado.create({
            descricao: gastoAgendadoEncontrado.descricao,
            valor: gastoAgendadoEncontrado.valor,
            categoriaId: gastoAgendadoEncontrado.categoriaId,
        });

        if (novoGastoRealizado) {
            // deleta o gasto agendado
            await gastoAgendadoEncontrado.destroy();
        }
        res.send(JSON.stringify("success"))
    } catch (error) {
        console.error(error);
        res.send(JSON.stringify('error'));
    }
});

//rota que exclui o agendamento do gasto
router.get('/excluir/:id', async (req, res) => {
    await gastoAgendado.destroy({ where: { id: req.params.id } })
    res.send(JSON.stringify("success"))
})

module.exports = router