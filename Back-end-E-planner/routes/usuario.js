//importando express
const express = require("express")

//importando router
const router = express.Router()

//importando models
const usuario = require('../models/usuarios')

//rota com função de adicionar usuario
router.post('/adicionar', async (req, res) => {

    try {
        //validação
        let erros = []

        if (!req.body.nome || req.body.nome == null) {
            erros.push({ texto: "Todos os dados precisam ser preenchidos" })
        }

        if (erros.length > 0) {
            res.send({ erros: erros })
        } else {
            let response = await usuario.create({ //criando registro no banco de dados
                nome: req.body.nome,
                email: req.body.email,
                senha: req.body.senha
            })
            res.send(response)
        }

    } catch {
        res.send(JSON.stringify('error'))
    }
})

//rota com função de validar usuário (login)
router.post('/login', async (req, res) => {
    await usuario.findOne({
        where: { email: req.body.email, senha: req.body.senha } //verificando dados
    }).then((response) => {
        if (response === null) {
            res.send(JSON.stringify('error')) //caso não ache os dados 
        } else {
            res.send(response) //cado ache os dados
        }
    }).catch((error) => {
        res.send(JSON.stringify('error'))  //tratamento de erro para evitar que a aplicação caia
        console.log(error)
    })
})

//rota com função de listar usuário
router.get('/listar', async (req, res) => {

    let id = req.body.id

    await usuario.findByPk(id).then((response) => {
        res.send(response)
    }).catch((error) => {
        res.send(JSON.stringify('error'))
        console.log(error)
    })
})

module.exports = router