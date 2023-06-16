//importando express
const express = require("express")

//tonando express executável
const app = express()

//configurando express para trabalhar com json
app.use(express.json());

//importações do sequelize para requisições adicionais
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

//importando router para utilização de rotas em arquivos separados
const router = express.Router()

//importando models
const categoria = require('../models/categorias')
const orcamento = require('../models/orcamentos')
const gastoRealizado = require('../models/gastosRealizados')
const gastoAgendado = require('../models/gastosAgendados')

//rota com função de listar orçamento disponível para criação de categoria
router.post('/disponivelCat', async (req, res) => {
    try {
        let usuarioId = req.body.usuarioId;
    
        //seleciona o orçamento
        await orcamento.findOne({ where: { usuarioId } }).then((renda) => {
    
            //procura todas as categorias que pertencem ao orçamento selecionado
            categoria.findAll({ where: { orcamentoId: renda.id } }).then((categorias) => {
    
                //verifica se não existem categorias encontradas 
                if (categorias == '' || !categorias) {

                    //envia somente o valor da renda
                    let response = renda.valor;
                    res.send(JSON.stringify(response));
                    console.log(response);
                }
                else {
                    //soma todos os valores da categoria
                    categoria.sum('valor', { where: { orcamentoId: renda.id } }).then((somaCats) => {

                        //envia para o front o orçamento - a soma das categorias
                        let response = renda.valor - somaCats;

                        console.log(response);
                        res.send(JSON.stringify(response));
                    });
                }
            });
        });
    } catch {
        res.send(JSON.stringify('error'));
    }
    
})


//rota com função de adicionar categoria
router.post('/adicionar', async (req, res) => {

    try {

        //armazena o valor disponível para a criação de categorias
        let rendaDisponivel = req.body.rendaDisponivel

        // verificar se o valor da categoria ultrapassa o orçamento e a renda disponível
        let erros = []

        if (rendaDisponivel < req.body.valor) {
            erros.push("O valor da categoria deve ser menor que o valor disponível")
        }

        if (!req.body.valor || req.body.valor == null || !req.body.nome || req.body.nome == null) {
            erros.push("Preencha os campos obrigatórios")
        }

        if (erros.length > 0) {
            res.send({ erros: erros })
        } else {
            //caso não ultrapasse, criar categoria
            await categoria.create({
                orcamentoId: req.body.usuarioId,
                nome: req.body.nome,
                descricao: req.body.descricao,
                valor: req.body.valor,
            })
            res.send(JSON.stringify("success"))
        }
    } catch {
        res.send(JSON.stringify('error'))
    }
})

//rota com função de listar todas as categorias pertencentes a um usuário, 
//juntamente com o total de gastos naquele mês
router.post('/listar', async (req, res) => {

    //recebe os valores do usuárioId, mês e ano do corpo da requisição
    const usuarioId = req.body.usuarioId;
    const mes = req.body.mes;
    const ano = req.body.ano;

    //procura todas as categorias com base nos critérios definidos
    await categoria.findAll({
        order:[['id', 'DESC']],
        where: { orcamentoId: usuarioId }, // Filtra pelo orcamentoId igual ao usuárioId

        //filtra somente os gastos do mês
        include: [
            {
                model: gastoRealizado,
                attributes: [],
                where: {
                    createdAt: {
                        [Op.gte]: new Date(ano, mes - 1, 1),
                        [Op.lt]: new Date(ano, mes, 1),
                    }
                },
                required: false // Permite incluir categorias sem gastos realizados
            },
            //filtra somente os gastos do mês
            {
                model: gastoAgendado,
                attributes: [],
                where: {
                    dataGasto: {
                        [Op.gte]: new Date(ano, mes - 1, 1),
                        [Op.lt]: new Date(ano, mes, 1),
                    }
                },
                required: false
            }
        ],
        attributes: [
            'id',
            'nome',
            'valor',
            'descricao',
            'orcamentoId',
            //subconsulta para obter o valor total de gastos realizados para cada categoria no mês e ano fornecidos
            [Sequelize.literal(`(
                SELECT SUM(valor)
                FROM gastosrealizados
                WHERE categoriaId = categorias.id
                  AND MONTH(createdAt) = ${mes}
                  AND YEAR(createdAt) = ${ano}
            )`), 'valorTotalGastos'],
            //subconsulta para obter o valor total de gastos agendados para cada categoria no mês e ano fornecidos
            [Sequelize.literal(`(
                SELECT SUM(valor)
                FROM gastosagendados
                WHERE categoriaId = categorias.id
                  AND MONTH(dataGasto) = ${mes}
                  AND YEAR(dataGasto) = ${ano}
            )`), 'valorTotalGastosAgendados']
        ]
    }).then((response) => {
        console.log(response);
        res.send(response);
    });
});

//rota com função de listar dados da categoria no formulário de edição
router.get('/editar/:id', async (req, res) => {
    try {
        let response = await categoria.findByPk(req.params.id)
        res.send(response)
    } catch {
        res.send(JSON.stringify('error'))
    }
})

// rota com função de editar a categoria
router.post('/editar', async (req, res) => {



    //armazena o valor disponível para a criação de categorias
    let rendaDisponivel = req.body.rendaDisponivel

    // verificar se o valor da categoria ultrapassa o orçamento e a renda disponível
    let erros = []

    if (rendaDisponivel < req.body.valor) {
        erros.push("O valor da categoria deve ser menor que o valor disponível")
    }

    if (!req.body.valor || req.body.valor == null || !req.body.nome || req.body.nome == null) {
        erros.push("Preencha os campos obrigatórios")
    }

    if (erros.length > 0) {
        res.send({ erros: erros })
    } else {

        let id = req.body.categoriaId;
        let nome = req.body.nome;
        let descricao = req.body.descricao;
        let valor = req.body.valor;

        //editando categoria
        await categoria.update(
            { nome, descricao, valor },
            { where: { id } }
        ).then(() => {
            res.send(JSON.stringify("success"));
        }).catch((error) => {
            console.error(error);
            res.status(500).send("error");
        });
    }
});

//rota com função de excluir categoria
router.get('/deletar/:id', async (req, res) => {
    await categoria.destroy({ where: { id: req.params.id } }).then(() => {
        res.send(JSON.stringify("success"))
    })

})

//rota com função de listar a soma dos gastos dos últimos 6 meses individualmente, 
//os quais pertencem a uma categoria
router.post('/gastosMeses', async (req, res) => {

    const id = req.body.id;
    const mes = req.body.mes;
    const ano = req.body.ano;

    // Verifica se o id está vazio (caso o usuário não selecione uma categoria)
    if (id == ''){
        let response = ['error']
        res.send(response)
    } else{
        
        //procura a categoria selecionada juntamente com todos os seus gastos realizados
        await categoria.findByPk(id, {
            include: [{
                model: gastoRealizado,
                attributes: [],
                where: {
                    createdAt: {
                        [Op.gte]: new Date(ano, mes - 1, 1),
                        [Op.lt]: new Date(ano, mes, 1),
                    }
                },
                required: false // permite incluir categorias sem gastos
            }],
            //subconsulta para obter o valor total de gastos realizados 
            //para a categoria nos últimos 6 meses, e os separando em um campo específico no objeto
            attributes: [
                'id',
                'nome',
                'valor',
                'descricao',
                'orcamentoId',
                [Sequelize.literal(`(
                  SELECT SUM(valor)
                  FROM gastosrealizados
                  WHERE categoriaId = categorias.id
                    AND MONTH(createdAt) = ${mes - 5}
                    AND YEAR(createdAt) = ${ano}
                ) `), 'mes6'],
                [Sequelize.literal(`(
                  SELECT SUM(valor)
                  FROM gastosrealizados
                  WHERE categoriaId = categorias.id
                    AND MONTH(createdAt) = ${mes - 4}
                    AND YEAR(createdAt) = ${ano}
                ) `), 'mes5'],
                [Sequelize.literal(`(
                  SELECT SUM(valor)
                  FROM gastosrealizados
                  WHERE categoriaId = categorias.id
                    AND MONTH(createdAt) = ${mes - 3}
                    AND YEAR(createdAt) = ${ano}
                ) `), 'mes4'],
                [Sequelize.literal(`(
                  SELECT SUM(valor)
                  FROM gastosrealizados
                  WHERE categoriaId = categorias.id
                    AND MONTH(createdAt) = ${mes - 2}
                    AND YEAR(createdAt) = ${ano}
                ) `), 'mes3'],
                [Sequelize.literal(`(
                  SELECT SUM(valor)
                  FROM gastosrealizados
                  WHERE categoriaId = categorias.id
                    AND MONTH(createdAt) = ${mes - 1}
                    AND YEAR(createdAt) = ${ano}
                ) `), 'mes2'],
                [Sequelize.literal(`(
                  SELECT SUM(valor)
                  FROM gastosrealizados
                  WHERE categoriaId = categorias.id
                    AND MONTH(createdAt) = ${mes}
                    AND YEAR(createdAt) = ${ano}
                ) `), 'mes1']
            ]
        }).then((response) => {
            console.log(response);
            res.send(response);
        });
    }

});

//função que seleciona a soma dos gastos de dois meses selecionados pelo usuário, 
//os quais pertencem a uma categoria
router.post('/gastosComparar', async (req, res) => {

    const id = req.body.id;

    const mes1 = req.body.mes1;
    const ano1 = req.body.ano1;

    const mes2 = req.body.mes2;
    const ano2 = req.body.ano2;

    // console.log(mes1, ano1, mes2, ano2)

    // Verifica se o id está vazio (caso o usuário não selecione uma categoria)
    if (id == ''){
        let response = ['error']
        res.send(response)
    } else{

        // Procura a categoria com base no id fornecido e realiza duas consultas para as duas comparações
        await categoria.findByPk(id, {
            include: [
                {
                    model: gastoRealizado,
                    attributes: [],
                    where: {
                        createdAt: {
                            [Op.gte]: new Date(ano1, mes1 - 1, 1),
                            [Op.lt]: new Date(ano1, mes1, 1),
                        }
                    },
                    required: false // permite incluir categorias sem gastos
                },
                {
                    model: gastoRealizado,
                    attributes: [],
                    where: {
                        createdAt: {
                            [Op.gte]: new Date(ano2, mes2 - 1, 1),
                            [Op.lt]: new Date(ano2, mes2, 1),
                        }
                    },
                    required: false
                }
            ],
            attributes: [
                'id',
                'nome',
                'valor',
                'descricao',
                'orcamentoId',
                //subconsulta para obter o valor total de gastos realizados para a categoria no primeiro mês
                [Sequelize.literal(`(
                SELECT SUM(valor)
                FROM gastosrealizados
                WHERE categoriaId = categorias.id
                  AND MONTH(createdAt) = ${mes1}
                  AND YEAR(createdAt) = ${ano1}
              )`), 'valorTotalGastos1'],
              //subconsulta para obter o valor total de gastos realizados para a categoria no segundo mês
                [Sequelize.literal(`(
                SELECT SUM(valor)
                FROM gastosrealizados
                WHERE categoriaId = categorias.id
                  AND MONTH(createdAt) = ${mes2}
                  AND YEAR(createdAt) = ${ano2}
              )`), 'valorTotalGastos2']
            ]
        }).then((response) => {
            // console.log(response);
            res.send(response);
        })

    }

    
})


module.exports = router