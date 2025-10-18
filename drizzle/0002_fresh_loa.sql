ALTER TABLE `procuracoes` ADD `testemunha1Nome` varchar(255);--> statement-breakpoint
ALTER TABLE `procuracoes` ADD `testemunha1Cpf` varchar(14);--> statement-breakpoint
ALTER TABLE `procuracoes` ADD `testemunha1Rg` varchar(50);--> statement-breakpoint
ALTER TABLE `procuracoes` ADD `testemunha2Nome` varchar(255);--> statement-breakpoint
ALTER TABLE `procuracoes` ADD `testemunha2Cpf` varchar(14);--> statement-breakpoint
ALTER TABLE `procuracoes` ADD `testemunha2Rg` varchar(50);--> statement-breakpoint
ALTER TABLE `procuracoes` ADD `ipAddress` varchar(45);--> statement-breakpoint
ALTER TABLE `procuracoes` ADD `userAgent` text;--> statement-breakpoint
ALTER TABLE `procuracoes` ADD `geolocalizacao` varchar(255);