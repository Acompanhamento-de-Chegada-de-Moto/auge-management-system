-- CreateEnum
CREATE TYPE "RegistrationStatus" AS ENUM ('PENDING', 'IN_REGISTRATION', 'REGISTERED', 'DELIVERED');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('LOGISTICS', 'BDC');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "salesperson" TEXT NOT NULL,
    "registrationStatus" "RegistrationStatus" NOT NULL,
    "billingDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "motorcycle_arrival" (
    "id" TEXT NOT NULL,
    "chassis" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "arrivalDate" TIMESTAMP(3) NOT NULL,
    "clientId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "motorcycle_arrival_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "motorcycle_arrival_chassis_key" ON "motorcycle_arrival"("chassis");

-- AddForeignKey
ALTER TABLE "motorcycle_arrival" ADD CONSTRAINT "motorcycle_arrival_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE SET NULL ON UPDATE CASCADE;
