CREATE TABLE `reset` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`email` varchar(50) NOT NULL,
	`token` varchar(255) NOT NULL,
	CONSTRAINT `reset_id` PRIMARY KEY(`id`),
	CONSTRAINT `reset_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `token` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`token` text NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`expirted_at` timestamp,
	CONSTRAINT `token_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`email` varchar(255) NOT NULL,
	`tfa_secret` varchar(255) DEFAULT '',
	`password` text NOT NULL,
	CONSTRAINT `user_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_email_unique` UNIQUE(`email`)
);
