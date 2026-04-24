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

export type OrganizationId = GenerateStringBrand<"organizationId">;
export const OrganizationId = GenerateStringBrand<"organizationId">();

export type MemberId = GenerateStringBrand<"memberId">;
export const MemberId = GenerateStringBrand<"memberId">();

export type InvitationId = GenerateStringBrand<"invitationId">;
export const InvitationId = GenerateStringBrand<"invitationId">();

export type ProjectId = GenerateStringBrand<"projectId">;
export const ProjectId = GenerateStringBrand<"projectId">();

export type CustomerId = GenerateStringBrand<"customerId">;
export const CustomerId = GenerateStringBrand<"customerId">();

export type ApiKeyId = GenerateStringBrand<"apiKeyId">;
export const ApiKeyId = GenerateStringBrand<"apiKeyId">();

export type TemplateId = GenerateStringBrand<"templateId">;
export const TemplateId = GenerateStringBrand<"templateId">();

export type TemplateVersionId = GenerateStringBrand<"templateVersionId">;
export const TemplateVersionId = GenerateStringBrand<"templateVersionId">();

export type InvoiceId = GenerateStringBrand<"invoiceId">;
export const InvoiceId = GenerateStringBrand<"invoiceId">();

export type InvoiceHumanId = GenerateStringBrand<"invoiceHumanId">;
export const InvoiceHumanId = GenerateStringBrand<"invoiceHumanId">();
