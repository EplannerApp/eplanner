drop database if exists eplanner;

create database eplanner;

use eplanner;

 

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL
);

 


CREATE TABLE orcamentos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  valor DECIMAL(10, 2),
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  usuarioId INT,
  FOREIGN KEY (usuarioId) REFERENCES usuarios(id) ON UPDATE CASCADE ON DELETE CASCADE
);

 

CREATE TABLE categorias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255),
  descricao VARCHAR(255),
  valor DECIMAL(10, 2),
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  orcamentoId INT,
  FOREIGN KEY (orcamentoId) REFERENCES orcamentos(id) ON UPDATE CASCADE ON DELETE CASCADE
);

 

CREATE TABLE gastosRealizados (
  id INT AUTO_INCREMENT PRIMARY KEY,
  descricao VARCHAR(255),
  valor DECIMAL(10, 2),
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  categoriaId INT,
  FOREIGN KEY (categoriaId) REFERENCES categorias(id) ON UPDATE CASCADE ON DELETE CASCADE
);

 

CREATE TABLE gastosAgendados (
  id INT AUTO_INCREMENT PRIMARY KEY,
  descricao VARCHAR(255) NOT NULL,
  valor DECIMAL(10, 2),
  dataGasto DATE,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  categoriaId INT,
  FOREIGN KEY (categoriaId) REFERENCES categorias(id) ON UPDATE CASCADE ON DELETE CASCADE
);


-- Inserir o usuário
INSERT INTO usuarios (nome, email, senha, createdAt, updatedAt)
VALUES ('Usuário', 'usuario@example.com', 'senha123', NOW(), NOW());

-- Obter o ID do usuário recém-inserido
SET @usuarioId = LAST_INSERT_ID();

-- Inserir o orçamento relacionado ao usuário
INSERT INTO orcamentos (valor, createdAt, updatedAt, usuarioId)
VALUES (12000.00, NOW(), NOW(), @usuarioId);


-- Inserir as categorias
INSERT INTO categorias (nome, descricao, valor, createdAt, updatedAt, orcamentoId)
VALUES ('Alimentação', 'Despesas com alimentos e refeições', 2000.00, NOW(), NOW(), 1);

INSERT INTO categorias (nome, descricao, valor, createdAt, updatedAt, orcamentoId)
VALUES ('Transporte', 'Gastos com transporte e deslocamentos', 1000.00, NOW(), NOW(), 1);

INSERT INTO categorias (nome, descricao, valor, createdAt, updatedAt, orcamentoId)
VALUES ('Lazer', 'Despesas relacionadas a atividades de lazer', 1500.00, NOW(), NOW(), 1);

INSERT INTO categorias (nome, descricao, valor, createdAt, updatedAt, orcamentoId)
VALUES ('Moradia', 'Custos com habitação e moradia', 4000.00, NOW(), NOW(), 1);

INSERT INTO categorias (nome, descricao, valor, createdAt, updatedAt, orcamentoId)
VALUES ('Saúde', 'Gastos relacionados a cuidados de saúde', 1000.00, NOW(), NOW(), 1);



-- Inserir gastos realizados na categoria "Alimentação"
INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Restaurante', 50.00, '2023-06-16', '2023-06-16', 1);

INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Supermercado', 80.00, '2023-06-16', '2023-06-16', 1);

INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Lanchonete', 20.00, '2023-06-16', '2023-06-16', 1);

-- Inserir gastos realizados na categoria "Transporte"
INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Gasolina', 40.00, '2023-06-16', '2023-06-16', 2);

INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Uber', 25.00, '2023-06-16', '2023-06-16', 2);

INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Ônibus', 10.00, '2023-06-16', '2023-06-16', 2);

-- Inserir gastos realizados na categoria "Lazer"
INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Cinema', 30.00, '2023-06-16', '2023-06-16', 3);

INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Parque de diversões', 50.00, '2023-06-16', '2023-06-16', 3);

INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Teatro', 40.00, '2023-06-16', '2023-06-16', 3);

-- Inserir gastos realizados na categoria "Moradia"
INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Aluguel', 800.00, '2023-06-16', '2023-06-16', 4);

INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Contas de água', 50.00, '2023-06-16', '2023-06-16', 4);

INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Contas de energia', 70.00, '2023-06-16', '2023-06-16', 4);

-- Inserir gastos realizados na categoria "Saúde"
INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Consulta médica', 100.00, '2023-06-16', '2023-06-16', 5);

INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Medicamentos', 50.00, '2023-06-16', '2023-06-16', 5);

INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Plano de saúde', 150.00, '2023-06-16', '2023-06-16', 5);


-- Inserir gastos realizados na categoria "Alimentação"
INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Restaurante', 60.00, '2023-05-16', '2023-05-16', 1);

INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Supermercado', 90.00, '2023-05-16', '2023-05-16', 1);

INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Lanchonete', 30.00, '2023-05-16', '2023-05-16', 1);

-- Inserir gastos realizados na categoria "Transporte"
INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Gasolina', 50.00, '2023-05-16', '2023-05-16', 2);

INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Uber', 30.00, '2023-05-16', '2023-05-16', 2);

INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Ônibus', 15.00, '2023-05-16', '2023-05-16', 2);

-- Inserir gastos realizados na categoria "Lazer"
INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Cinema', 40.00, '2023-05-16', '2023-05-16', 3);

INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Parque de diversões', 60.00, '2023-05-16', '2023-05-16', 3);

INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Teatro', 50.00, '2023-05-16', '2023-05-16', 3);

-- Inserir gastos realizados na categoria "Moradia"
INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Aluguel', 900.00, '2023-05-16', '2023-05-16', 4);

INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Contas de água', 60.00, '2023-05-16', '2023-05-16', 4);

INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Contas de energia', 80.00, '2023-05-16', '2023-05-16', 4);

-- Inserir gastos realizados na categoria "Saúde"
INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Consulta médica', 120.00, '2023-05-16', '2023-05-16', 5);

INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Medicamentos', 60.00, '2023-05-16', '2023-05-16', 5);

INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Plano de saúde', 180.00, '2023-05-16', '2023-05-16', 5);


-- Inserir gastos realizados na categoria "Alimentação" - Mês 4
INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Restaurante', 70.00, '2023-04-16', '2023-04-16', 1);

INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Supermercado', 100.00, '2023-04-16', '2023-04-16', 1);

INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Lanchonete', 40.00, '2023-04-16', '2023-04-16', 1);

-- Inserir gastos realizados na categoria "Transporte" - Mês 4
INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Gasolina', 60.00, '2023-04-16', '2023-04-16', 2);

INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Uber', 40.00, '2023-04-16', '2023-04-16', 2);

INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Ônibus', 20.00, '2023-04-16', '2023-04-16', 2);

-- Inserir gastos realizados na categoria "Lazer" - Mês 4
INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Cinema', 50.00, '2023-04-16', '2023-04-16', 3);

INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Parque de diversões', 70.00, '2023-04-16', '2023-04-16', 3);

INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Teatro', 60.00, '2023-04-16', '2023-04-16', 3);

-- Inserir gastos realizados na categoria "Moradia" - Mês 4
INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Aluguel', 1000.00, '2023-04-16', '2023-04-16', 4);

INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Contas de água', 70.00, '2023-04-16', '2023-04-16', 4);

INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Contas de energia', 90.00, '2023-04-16', '2023-04-16', 4);

-- Inserir gastos realizados na categoria "Saúde" - Mês 4
INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Consulta médica', 140.00, '2023-04-16', '2023-04-16', 5);

INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Medicamentos', 70.00, '2023-04-16', '2023-04-16', 5);

INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Plano de saúde', 210.00, '2023-04-16', '2023-04-16', 5);

-- Inserir gastos realizados na categoria "Alimentação" - Mês 3
INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Restaurante', 80.00, '2023-03-16', '2023-03-16', 1);

INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Supermercado', 110.00, '2023-03-16', '2023-03-16', 1);

INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Lanchonete', 50.00, '2023-03-16', '2023-03-16', 1);

-- Inserir gastos realizados na categoria "Transporte" - Mês 3
INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Gasolina', 70.00, '2023-03-16', '2023-03-16', 2);

INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Uber', 50.00, '2023-03-16', '2023-03-16', 2);

INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Ônibus', 25.00, '2023-03-16', '2023-03-16', 2);

-- Inserir gastos realizados na categoria "Lazer" - Mês 3
INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Cinema', 60.00, '2023-03-16', '2023-03-16', 3);

INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Parque de diversões', 80.00, '2023-03-16', '2023-03-16', 3);

INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Teatro', 70.00, '2023-03-16', '2023-03-16', 3);

-- Inserir gastos realizados na categoria "Moradia" - Mês 3
INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Aluguel', 1100.00, '2023-03-16', '2023-03-16', 4);

INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Contas de água', 80.00, '2023-03-16', '2023-03-16', 4);

INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Contas de energia', 100.00, '2023-03-16', '2023-03-16', 4);

-- Inserir gastos realizados na categoria "Saúde" - Mês 3
INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Consulta médica', 160.00, '2023-03-16', '2023-03-16', 5);

INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Medicamentos', 80.00, '2023-03-16', '2023-03-16', 5);

INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Plano de saúde', 240.00, '2023-03-16', '2023-03-16', 5);

-- Inserir gastos realizados na categoria "Alimentação" - Mês 2
INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Restaurante', 90.00, '2023-02-16', '2023-02-16', 1);

INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Supermercado', 120.00, '2023-02-16', '2023-02-16', 1);

INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Lanchonete', 60.00, '2023-02-16', '2023-02-16', 1);

-- Inserir gastos realizados na categoria "Transporte" - Mês 2
INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Gasolina', 80.00, '2023-02-16', '2023-02-16', 2);

INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Uber', 60.00, '2023-02-16', '2023-02-16', 2);

INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Ônibus', 30.00, '2023-02-16', '2023-02-16', 2);

-- Inserir gastos realizados na categoria "Lazer" - Mês 2
INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Cinema', 70.00, '2023-02-16', '2023-02-16', 3);

INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Parque de diversões', 90.00, '2023-02-16', '2023-02-16', 3);

INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Teatro', 80.00, '2023-02-16', '2023-02-16', 3);

-- Inserir gastos realizados na categoria "Moradia" - Mês 2
INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Aluguel', 1200.00, '2023-02-16', '2023-02-16', 4);

INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Contas de água', 90.00, '2023-02-16', '2023-02-16', 4);

INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Contas de energia', 110.00, '2023-02-16', '2023-02-16', 4);

-- Inserir gastos realizados na categoria "Saúde" - Mês 2
INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Consulta médica', 180.00, '2023-02-16', '2023-02-16', 5);

INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Medicamentos', 90.00, '2023-02-16', '2023-02-16', 5);

INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Plano de saúde', 270.00, '2023-02-16', '2023-02-16', 5);

-- Inserir gastos realizados na categoria "Alimentação" - Mês 1
INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Restaurante', 100.00, '2023-01-16', '2023-01-16', 1);

INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Supermercado', 130.00, '2023-01-16', '2023-01-16', 1);

INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Lanchonete', 70.00, '2023-01-16', '2023-01-16', 1);

-- Inserir gastos realizados na categoria "Transporte" - Mês 1
INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Gasolina', 90.00, '2023-01-16', '2023-01-16', 2);

INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Uber', 70.00, '2023-01-16', '2023-01-16', 2);

INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Ônibus', 35.00, '2023-01-16', '2023-01-16', 2);

-- Inserir gastos realizados na categoria "Lazer" - Mês 1
INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Cinema', 80.00, '2023-01-16', '2023-01-16', 3);

INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Parque de diversões', 100.00, '2023-01-16', '2023-01-16', 3);

INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Teatro', 90.00, '2023-01-16', '2023-01-16', 3);

-- Inserir gastos realizados na categoria "Moradia" - Mês 1
INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Aluguel', 1300.00, '2023-01-16', '2023-01-16', 4);

INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Contas de água', 100.00, '2023-01-16', '2023-01-16', 4);

INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Contas de energia', 120.00, '2023-01-16', '2023-01-16', 4);

-- Inserir gastos realizados na categoria "Saúde" - Mês 1
INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Consulta médica', 200.00, '2023-01-16', '2023-01-16', 5);

INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Medicamentos', 100.00, '2023-01-16', '2023-01-16', 5);

INSERT INTO gastosRealizados (descricao, valor, createdAt, updatedAt, categoriaId)
VALUES ('Plano de saúde', 300.00, '2023-01-16', '2023-01-16', 5);


-- Inserir gastos agendados na categoria "Alimentação"
INSERT INTO gastosAgendados (descricao, valor, dataGasto, createdAt, updatedAt, categoriaId)
VALUES ('Restaurante', 80.00, '2023-06-30', '2023-06-16', '2023-06-16', 1);

INSERT INTO gastosAgendados (descricao, valor, dataGasto, createdAt, updatedAt, categoriaId)
VALUES ('Supermercado', 100.00, '2023-07-05', '2023-06-16', '2023-06-16', 1);

-- Inserir gastos agendados na categoria "Transporte"
INSERT INTO gastosAgendados (descricao, valor, dataGasto, createdAt, updatedAt, categoriaId)
VALUES ('Gasolina', 70.00, '2023-06-16', '2023-06-16', '2023-06-16', 2);

INSERT INTO gastosAgendados (descricao, valor, dataGasto, createdAt, updatedAt, categoriaId)
VALUES ('Transporte público', 50.00, '2023-06-18', '2023-06-16', '2023-06-16', 2);

-- Inserir gastos agendados na categoria "Lazer"
INSERT INTO gastosAgendados (descricao, valor, dataGasto, createdAt, updatedAt, categoriaId)
VALUES ('Cinema adiado', 60.00, '2023-06-28', '2023-06-16', '2023-06-16', 3);

-- Inserir gastos agendados na categoria "Moradia"
INSERT INTO gastosAgendados (descricao, valor, dataGasto, createdAt, updatedAt, categoriaId)
VALUES ('Aluguel', 1000.00, '2023-07-01', '2023-06-16', '2023-06-16', 4);

INSERT INTO gastosAgendados (descricao, valor, dataGasto, createdAt, updatedAt, categoriaId)
VALUES ('Contas de água', 80.00, '2023-06-15', '2023-06-16', '2023-06-16', 4);

-- Inserir gastos agendados na categoria "Saúde"
INSERT INTO gastosAgendados (descricao, valor, dataGasto, createdAt, updatedAt, categoriaId)
VALUES ('Consulta médica', 120.00, '2023-06-17', '2023-06-16', '2023-06-16', 5);

INSERT INTO gastosAgendados (descricao, valor, dataGasto, createdAt, updatedAt, categoriaId)
VALUES ('Medicamentos', 60.00, '2023-07-04', '2023-06-16', '2023-06-16', 5);

