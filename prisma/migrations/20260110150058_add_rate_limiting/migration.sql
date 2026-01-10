-- AlterTable
ALTER TABLE `activitylog` ADD COLUMN `provider` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `RateLimit` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `action` VARCHAR(191) NOT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `RateLimit_userId_action_timestamp_idx`(`userId`, `action`, `timestamp`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ApiUsage` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `action` VARCHAR(191) NOT NULL,
    `provider` VARCHAR(191) NOT NULL,
    `wordCount` INTEGER NOT NULL,
    `success` BOOLEAN NOT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ApiUsage_userId_action_timestamp_idx`(`userId`, `action`, `timestamp`),
    INDEX `ApiUsage_provider_timestamp_idx`(`provider`, `timestamp`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `ActivityLog_provider_createdAt_idx` ON `ActivityLog`(`provider`, `createdAt`);

-- AddForeignKey
ALTER TABLE `RateLimit` ADD CONSTRAINT `RateLimit_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApiUsage` ADD CONSTRAINT `ApiUsage_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
