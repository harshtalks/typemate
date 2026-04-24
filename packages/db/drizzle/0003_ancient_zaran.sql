CREATE TABLE `api_key` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` text NOT NULL,
	`name` text NOT NULL,
	`key_hash` text NOT NULL,
	`key_prefix` text NOT NULL,
	`created_at` integer NOT NULL,
	`last_used_at` integer,
	`expires_at` integer,
	`revoked_at` integer,
	FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `api_key_key_hash_unique` ON `api_key` (`key_hash`);--> statement-breakpoint
CREATE TABLE `customer` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` text NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`metadata` text,
	`created_at` integer NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `invoice` (
	`id` text PRIMARY KEY NOT NULL,
	`human_id` text NOT NULL,
	`project_id` text NOT NULL,
	`template_version_id` text NOT NULL,
	`customer_id` text NOT NULL,
	`status` text NOT NULL,
	`data` text NOT NULL,
	`snapshot` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer,
	`sent_at` integer,
	`paid_at` integer,
	`voided_at` integer,
	`due_at` integer,
	FOREIGN KEY (`project_id`) REFERENCES `project`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`template_version_id`) REFERENCES `template_version`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`customer_id`) REFERENCES `customer`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `invoice_human_id_unique` ON `invoice` (`human_id`);--> statement-breakpoint
CREATE TABLE `project` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` text NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`timezone` text DEFAULT 'UTC' NOT NULL,
	`invoice_prefix` text NOT NULL,
	`currency` text DEFAULT 'USD' NOT NULL,
	`invoice_sequence` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `project_org_slug_unique` ON `project` (`organization_id`,`slug`);--> statement-breakpoint
CREATE TABLE `template` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`project_id`) REFERENCES `project`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `template_project_slug_unique` ON `template` (`project_id`,`slug`);--> statement-breakpoint
CREATE TABLE `template_version` (
	`id` text PRIMARY KEY NOT NULL,
	`template_id` text NOT NULL,
	`version` text NOT NULL,
	`status` text NOT NULL,
	`content` text NOT NULL,
	`schema` text NOT NULL,
	`created_at` integer NOT NULL,
	`published_at` integer,
	FOREIGN KEY (`template_id`) REFERENCES `template`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `template_version_unique` ON `template_version` (`template_id`,`version`);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_invitation` (
	`id` text PRIMARY KEY NOT NULL,
	`inviter_id` text NOT NULL,
	`organization_id` text NOT NULL,
	`role` text NOT NULL,
	`status` text NOT NULL,
	`created_at` integer NOT NULL,
	`expires_at` integer NOT NULL,
	`email` text NOT NULL,
	FOREIGN KEY (`inviter_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_invitation`("id", "inviter_id", "organization_id", "role", "status", "created_at", "expires_at", "email") SELECT "id", "inviter_id", "organization_id", "role", "status", "created_at", "expires_at", "email" FROM `invitation`;--> statement-breakpoint
DROP TABLE `invitation`;--> statement-breakpoint
ALTER TABLE `__new_invitation` RENAME TO `invitation`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `organization` DROP COLUMN `metadata`;