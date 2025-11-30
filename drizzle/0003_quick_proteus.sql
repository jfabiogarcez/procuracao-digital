CREATE TABLE `audit_log` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`acao` varchar(100) NOT NULL,
	`documentoId` varchar(64),
	`detalhes` text,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `audit_log_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `documentos` (
	`id` varchar(64) NOT NULL,
	`tipo` enum('procuracao','contrato','distrato','declaracao','recibo') NOT NULL,
	`numero` varchar(50) NOT NULL,
	`status` enum('rascunho','gerado','enviado','assinado') NOT NULL DEFAULT 'rascunho',
	`clienteNome` text NOT NULL,
	`clienteCpf` varchar(14) NOT NULL,
	`clienteRg` varchar(50),
	`clienteEndereco` text,
	`clienteTelefone` varchar(20),
	`clienteEmail` varchar(320),
	`conteudoJson` text NOT NULL,
	`assinaturaCliente` text,
	`fotoCliente` text,
	`dataAssinaturaCliente` timestamp,
	`ipCliente` varchar(45),
	`assinaturaAdvogado` text,
	`dataAssinaturaAdvogado` timestamp,
	`qrCode` text,
	`pdfUrl` text,
	`emailEnviado` enum('sim','nao') DEFAULT 'nao',
	`criadoPor` varchar(64) NOT NULL,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `documentos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `templates` (
	`id` varchar(64) NOT NULL,
	`tipoDocumento` enum('procuracao','contrato','distrato','declaracao','recibo') NOT NULL,
	`nome` varchar(255) NOT NULL,
	`conteudo` text NOT NULL,
	`versao` varchar(20) DEFAULT '1.0',
	`ativo` enum('sim','nao') DEFAULT 'sim',
	`padrao` enum('sim','nao') DEFAULT 'nao',
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `templates_id` PRIMARY KEY(`id`)
);
