CREATE TABLE `documentos` (
	`id` varchar(64) NOT NULL,
	`tipo` enum('procuracao','contrato','outro') NOT NULL,
	`numeroDocumento` varchar(100) NOT NULL,
	`status` enum('ativo','cancelado','arquivado') NOT NULL DEFAULT 'ativo',
	`dados` text NOT NULL,
	`pdfUrl` text,
	`createdBy` varchar(64),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `documentos_id` PRIMARY KEY(`id`),
	CONSTRAINT `documentos_numeroDocumento_unique` UNIQUE(`numeroDocumento`)
);
