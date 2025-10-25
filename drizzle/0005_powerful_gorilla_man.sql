CREATE TABLE `pecasProcessuais` (
	`id` varchar(64) NOT NULL,
	`titulo` text NOT NULL,
	`tipo` enum('peticao_inicial','contestacao','recurso','peticao_intermediaria','memoriais','agravo','apelacao','embargos','outro') NOT NULL,
	`conteudo` text NOT NULL,
	`processoId` varchar(64),
	`clienteId` varchar(64),
	`numeroProcesso` varchar(100),
	`status` enum('rascunho','revisao','finalizado','enviado') NOT NULL DEFAULT 'rascunho',
	`versao` varchar(10) DEFAULT '1',
	`geradoPorIA` enum('sim','nao') DEFAULT 'nao',
	`promptIA` text,
	`jurisprudencias` text,
	`tags` text,
	`createdBy` varchar(64) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `pecasProcessuais_id` PRIMARY KEY(`id`)
);
