CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  senha VARCHAR(100) NOT NULL,
  tipo VARCHAR(20) DEFAULT 'cliente'
);

CREATE TABLE IF NOT EXISTS produtos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  preco DECIMAL(10, 2) NOT NULL,
  descricao TEXT,
  categoria VARCHAR(50) NOT NULL,
  marca VARCHAR(50),
  estoque INT DEFAULT 10,
  imagem VARCHAR(500)
);

CREATE TABLE IF NOT EXISTS pedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  data DATETIME NOT NULL,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS itens_pedido (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id INT NOT NULL,
  produto_id INT NOT NULL,
  quantidade INT NOT NULL,
  preco DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
  FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE
);

-- 1. CADASTRO DE USUÁRIOS (3 Administradores e 2 Clientes para testes de serviço)
INSERT INTO usuarios (nome, email, senha, tipo) VALUES 
('Admin', 'admin@techstore.com', '123456', 'admin'),
('Admin Cleiton', 'admin.cleiton@techstore.com', '123456', 'admin'),
('Admin Leonardo', 'admin.leonardo@techstore.com', '123456', 'admin'),
('Cleiton Rodrigues', 'cleiton.rodrigues@gmail.com', '123456', 'cliente'),
('Leonardo Oliveira', 'leonardo.oliveira@gmail.com', '123456', 'cliente');

-- 2. CADASTRO DOS 10 REGISTROS MÍNIMOS OBRIGATÓRIOS (Hardware e Periféricos)
INSERT INTO produtos (nome, preco, descricao, categoria, marca, estoque, imagem) VALUES 
('Teclado Mecanico RGB', 249.90, 'Teclado mecânico switch azul com iluminação RGB.', 'teclado', 'Redragon', 15, 'https://i.postimg.cc/DZbkXdK0/TECLADO-REDRADON.jpg'),
('Mouse Gamer Pro X (superlight)', 179.90, 'Mouse óptico de alta precisão com ajuste de DPI.', 'mouse', 'Logitech', 20, 'https://i.postimg.cc/qvBPLdT0/MOUSE-LOGITECH.jpg'),
('Monitor Gamer 24" 144Hz', 899.00, 'Monitor Full HD com 1ms de resposta e FreeSync.', 'monitor', 'AOC', 8, 'https://i.postimg.cc/YShT5f03/MONITOR-AOC.jpg'),
('Placa-Mae B550M', 649.00, 'Placa-mãe Socket AM4 pronta para processadores Ryzen.', 'placa-mae', 'ASUS', 12, 'https://i.postimg.cc/7hMR3Ksp/PLACA-MAE-B550M.jpg'),
('Placa de Video RTX 4060', 1999.90, 'Placa gráfica com Ray Tracing e 8GB de memória GDDR6.', 'placa-video', 'MSI', 5, 'https://i.postimg.cc/fWx1QbWh/PLACA-DE-VIDEO.jpg'),
('Headset Gamer CloudX', 349.90, 'Headset com som surround isolamento acústico premium.', 'headset', 'HyperX', 10, 'https://i.postimg.cc/PrycNF81/HEADSET.jpg'),
('Mouse Sem Fio Ergonomico', 59.90, 'Mouse sem fio ideal para produtividade diária.', 'mouse', 'Multilaser', 50, 'https://i.postimg.cc/52kRSYg7/MOUSE-ERGONOMICO.jpg'),
('Teclado de Membrana', 119.00, 'Teclado silencioso resistente a respingos de água.', 'teclado', 'Corsair', 30, 'https://i.postimg.cc/0Q7Xvtsc/teclado-de-membrana.jpg'),
('Monitor UltraWide Odyssey 49P OL', 1149.00, 'Monitor proporcional 32:9, curvo perfeito para multitarefas.', 'monitor', 'Samsung', 6, 'https://i.postimg.cc/fyZ2RxWR/Monitor-Ultra-Wide-Odyssey.jpg'),
('Placa de Video GTX 1650', 799.00, 'Placa de entrada ideal para jogos casuais e eSports.', 'placa-video', 'Gigabyte', 14, 'https://i.postimg.cc/x8RsJcq5/PLACA-DE-VIDEO-1650.jpg');