import { Brand } from "effect";

type GenerateStringBrand<T extends string> = string & Brand.Brand<T>;
const GenerateStringBrand = <T extends string>() =>
  Brand.nominal<GenerateStringBrand<T>>();

export const UserId = GenerateStringBrand<"userId">();
export type UserId = GenerateStringBrand<"userId">;

export type SessionId = GenerateStringBrand<"sessionId">;
export const SessionId = GenerateStringBrand<"sessionId">();

export type AccountId = GenerateStringBrand<"accountId">;
export const AccountId = GenerateStringBrand<"accountId">();

export type ProviderId = GenerateStringBrand<"providerId">;
export const ProviderId = GenerateStringBrand<"providerId">();

export type VerificationId = GenerateStringBrand<"verificationId">;
export const VerificationId = GenerateStringBrand<"verificationId">();

export type PasskeyId = GenerateStringBrand<"passkeyId">;
export const PasskeyId = GenerateStringBrand<"passkeyId">();

export type CredentialId = GenerateStringBrand<"credentialId">;
export const CredentialId = GenerateStringBrand<"credentialId">();
