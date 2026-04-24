export const INVOICE_STATUS = Object.freeze({
  draft: {
    value: "draft" as const,
    description: "Invoice is being prepared and has not been sent",
    terminal: false,
  },
  sent: {
    value: "sent" as const,
    description: "Invoice has been sent to the customer",
    terminal: false,
  },
  viewed: {
    value: "viewed" as const,
    description: "Customer has opened and viewed the invoice",
    terminal: false,
  },
  paid: {
    value: "paid" as const,
    description: "Invoice has been paid in full",
    terminal: true,
  },
  void: {
    value: "void" as const,
    description: "Invoice has been cancelled and is no longer valid",
    terminal: true,
  },
} as const);

export type InvoiceStatus = keyof typeof INVOICE_STATUS;
