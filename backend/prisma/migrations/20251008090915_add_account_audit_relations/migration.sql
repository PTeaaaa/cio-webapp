-- AddForeignKey
ALTER TABLE "public"."accounts" ADD CONSTRAINT "accounts_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "public"."accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."accounts" ADD CONSTRAINT "accounts_modifiedBy_fkey" FOREIGN KEY ("modifiedBy") REFERENCES "public"."accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
