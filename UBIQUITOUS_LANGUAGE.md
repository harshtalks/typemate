# Ubiquitous Language

> **Typemate** — a programmatic invoice platform. Think Resend, but for invoices.
> Engineers, domain experts, and product decisions should use the terms below consistently
> across code, PRs, conversations, and documentation.

---

## Actors

| Term | Definition | Aliases to avoid |
|------|-----------|-----------------|
| **User** | An authenticated identity in the system, identified by email | Account, login |
| **Member** | A **User** who belongs to a **Workspace**, carrying a **Role** | Participant, collaborator |
| **Owner** | A **Member** with the highest **Role**; full control over the **Workspace** | Admin (Owner ≠ Admin) |
| **Admin** | A **Member** who can manage **Projects**, **Templates**, and other **Members** but cannot delete the **Workspace** | Manager, moderator |
| **Developer** | A **Member** who can generate **Invoices** but cannot mutate **Projects**, **Templates**, or manage **Members** | Viewer, engineer |
| **Customer** | A real-world entity (person or business) that receives **Invoices**; scoped to a **Workspace** | Client, recipient, contact |

---

## Workspace & Structure

| Term | Definition | Aliases to avoid |
|------|-----------|-----------------|
| **Workspace** | The top-level tenant boundary; owns **Members**, **Projects**, **Customers**, and **API Keys** | Organisation, team, account |
| **Project** | A named grouping inside a **Workspace** representing a single client or product; owns **Templates** and **Invoices** | App, environment, client |
| **Project Config** | Immutable-after-use settings on a **Project**: `invoicePrefix`, `currency`, `timezone`, `slug` | Settings (use only for the editable subset) |

---

## Templates

| Term | Definition | Aliases to avoid |
|------|-----------|-----------------|
| **Template** | A named, slug-identified blueprint for an **Invoice** inside a **Project** | Draft, blueprint, schema |
| **Template Version** | An immutable snapshot of a **Template** at a specific semver; either `draft` or `published` | Revision, iteration |
| **Content** | The TipTap document stored on a **Template Version**, containing `{{variable}}` placeholders | Body, markup, HTML |
| **Variable Schema** | The auto-discovered array of typed variables extracted from a **Template Version**'s **Content** | JSON schema, field list |
| **Variable** | A single placeholder in a **Template** with a `name`, `type`, `required` flag, and optional `description` | Field, param, token |
| **Published Version** | A **Template Version** that can be used to generate **Invoices**; cannot be edited | Active version, live version |
| **Draft Version** | A **Template Version** under active editing; cannot generate **Invoices** | WIP, staging version |

### Template Version Bump Rules

| Change type | Semver bump |
|-------------|-------------|
| Any schema change (add / remove / rename / retype a **Variable**) | **Major** |
| Content-only change (wording, layout, no schema change) | **Minor** |
| Description or metadata correction only | **Patch** |

---

## Invoices

| Term | Definition | Aliases to avoid |
|------|-----------|-----------------|
| **Invoice** | A generated document produced by injecting **Variable** values into a **Published Template Version** | Bill, receipt, document |
| **Human ID** | A sequential, human-readable identifier on an **Invoice** (e.g. `HLTH-042`); unique per **Workspace** | Invoice number, ref |
| **Invoice Data** | The map of **Variable** names to concrete values provided at generation time | Payload, inputs, context |
| **Snapshot** | The rendered, immutable copy of the **Invoice** document stored at generation time | Rendered output, HTML |

### Invoice Status Lifecycle

```
draft → sent → viewed → paid   (terminal)
                      ↘ void   (terminal)
```

| Status | Meaning | Terminal? |
|--------|---------|-----------|
| `draft` | Being prepared; not yet sent | No |
| `sent` | Delivered to the **Customer** | No |
| `viewed` | **Customer** has opened the **Invoice** | No |
| `paid` | **Invoice** settled in full | **Yes** |
| `void` | **Invoice** cancelled; no longer valid | **Yes** |

---

## API Access

| Term | Definition | Aliases to avoid |
|------|-----------|-----------------|
| **API Key** | A workspace-scoped credential used to generate **Invoices** programmatically | Token, secret, credential |
| **Key Hash** | The stored SHA-256 hash of the raw **API Key** value; never stored in plaintext | — |
| **Key Prefix** | The first ~12 characters of the raw key displayed in the dashboard for identification | — |

---

## Permission Matrix

All permissions are **Workspace-scoped**. There is no per-**Project** access control.

| Action | Owner | Admin | Developer |
|--------|:-----:|:-----:|:---------:|
| Create Workspace | ✅ | ❌ | ❌ |
| Delete Workspace | ✅ | ❌ | ❌ |
| Invite Members | ✅ | ✅ | ❌ |
| Remove Members | ✅ | ✅ | ❌ |
| Create / Edit / Delete Project | ✅ | ✅ | ❌ |
| View Projects | ✅ | ✅ | ✅ |
| Create / Edit Template | ✅ | ✅ | ❌ |
| Publish Template Version | ✅ | ✅ | ❌ |
| View Templates | ✅ | ✅ | ✅ |
| Generate Invoice | ✅ | ✅ | ✅ |
| Void Invoice | ✅ | ✅ | ❌ |
| Create / Delete API Key | ✅ | ✅ | ❌ |
| View API Keys | ✅ | ✅ | ❌ |

### Enforcement Layers

- **Server** — `auth.api.hasPermission()` called in every mutating server function
- **UI** — `checkRolePermission()` used to hide buttons/actions from lower-privilege roles (cosmetic; server is authoritative)

---

## Relationships

- A **Workspace** has many **Members**, **Projects**, **Customers**, and **API Keys**
- A **Member** belongs to exactly one **Workspace** and carries exactly one **Role**
- A **Project** belongs to exactly one **Workspace** and has one **Project Config**
- A **Template** belongs to exactly one **Project**
- A **Template Version** belongs to exactly one **Template**; versions are immutable once **Published**
- An **Invoice** belongs to one **Project**, one **Published Template Version**, and one **Customer**
- A **Customer** belongs to one **Workspace** (not scoped to a **Project**)
- An **API Key** belongs to one **Workspace**

---

## Flagged Ambiguities

- **"Organisation" vs "Workspace"** — the database table is named `organization` (better-auth convention) but the product term is **Workspace**. In code use `organization`; in product copy, UI, and conversation use **Workspace**.
- **"Template" vs "Template Version"** — a **Template** is the named container; a **Template Version** is the versioned snapshot. Never say "template version 2" when you mean "the v2 snapshot" — say "**Template Version** 2.0.0 of the Billing **Template**".
- **"Schema"** — overloaded. Use **Variable Schema** when referring to the discovered variable list on a **Template Version**. Use "database schema" when referring to Drizzle table definitions. Never use "schema" alone.
- **"Settings"** — used loosely. Use **Project Config** for the fixed project-level fields (`invoicePrefix`, `currency`, `timezone`). Reserve "settings" only for the editable subset exposed in the project Settings tab.
- **"Invoice number" vs "Human ID"** — the sequential customer-facing identifier is called **Human ID** in code. In UI copy it may be labelled "Invoice #" but in engineering discussions always say **Human ID**.

---

## Example Dialogue

> **New engineer:** "When a **Developer** hits the API with an **API Key**, can they change a **Template**?"

> **Domain expert:** "No. **Developers** can only generate **Invoices**. Mutating a **Template** requires **Admin** or **Owner** role. The **API Key** itself is workspace-scoped and carries the workspace's permission context."

> **New engineer:** "So if I want to update the billing template's layout without breaking existing invoices, what's the flow?"

> **Domain expert:** "Create a new **Draft Template Version** under the same **Template**. Edit the **Content**. If you only change wording — no **Variable** additions or removals — that's a **Minor** bump. Once you **Publish** it, new **Invoices** reference that version. Old **Invoices** keep their **Snapshot** unchanged."

> **New engineer:** "What if I add a new required **Variable** to the schema?"

> **Domain expert:** "That's a **Major** bump — any schema change is. The previous **Published Version** stays intact. Any integration calling the old version ID keeps working. The caller must explicitly opt into the new version and pass the new **Variable** value."

> **New engineer:** "Can a **Developer** void an **Invoice** they generated?"

> **Domain expert:** "No. Voiding is **Admin** and **Owner** only. A **Developer** can generate and that's it — void is a financial action that requires elevated trust."
