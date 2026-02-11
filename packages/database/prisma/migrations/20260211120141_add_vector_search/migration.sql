-- CreateExtension
CREATE EXTENSION IF NOT EXISTS vector;

-- AlterTable
ALTER TABLE "Candidate" ADD COLUMN     "embedding" vector(384);

-- AlterTable
ALTER TABLE "JobDescription" ADD COLUMN     "embedding" vector(384);
