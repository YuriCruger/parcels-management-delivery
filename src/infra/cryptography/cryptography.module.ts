import { HashGenerator } from "@/domain/delivery-management/application/cryptography/hash-generator";
import { Module } from "@nestjs/common";
import { BcryptHasher } from "./bcrypt-hasher";
import { Encrypter } from "@/domain/delivery-management/application/cryptography/encrypter";
import { JwtEncrypter } from "./jwt-encrypter";
import { HashComparer } from "@/domain/delivery-management/application/cryptography/hash-comparer";

@Module({
  providers: [
    {
      provide: Encrypter,
      useClass: JwtEncrypter,
    },
    {
      provide: HashComparer,
      useClass: BcryptHasher,
    },
    {
      provide: HashGenerator,
      useClass: BcryptHasher,
    },
  ],
  exports: [Encrypter, HashComparer, HashGenerator],
})
export class CryptoGraphyModule {}
