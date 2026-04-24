import { useForm } from "@tanstack/react-form";
import { useParams } from "@tanstack/react-router";
import { PrefixedIDs } from "@typemate/db/ids";
import { Branded } from "@typemate/types";
import { Button } from "@typemate/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@typemate/ui/components/dialog";
import { Field, FieldError } from "@typemate/ui/components/field";
import { Input } from "@typemate/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@typemate/ui/components/select";
import { useState } from "react";
import z from "zod";
import { projectsCollection } from "~/queries/projects";

const CURRENCIES = [
  "USD",
  "EUR",
  "GBP",
  "CAD",
  "AUD",
  "JPY",
  "INR",
  "SGD",
] as const;

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(50)
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, hyphens only"),
  invoicePrefix: z
    .string()
    .trim()
    .min(1)
    .max(10)
    .regex(/^[A-Z0-9]+$/, "Uppercase letters and numbers only"),
  currency: z.enum(CURRENCIES),
  timezone: z.string().min(1),
});

type Schema = z.infer<typeof schema>;

const toSlug = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const toPrefix = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase()
    .slice(0, 5);

const TIMEZONES = Intl.supportedValuesOf("timeZone");

const CreateProject = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { workspaceId } = useParams({
    from: "/(authenticated)/workspaces/$workspaceId",
  });

  const form = useForm({
    validators: { onSubmit: schema },
    defaultValues: {
      name: "",
      slug: "",
      invoicePrefix: "",
      currency: "USD" as Schema["currency"],
      timezone: "UTC",
    } as Schema,
    onSubmit: ({ value }) => {
      projectsCollection.insert({
        id: PrefixedIDs.proj(),
        organizationId: Branded.OrganizationId(workspaceId),
        name: value.name,
        slug: value.slug,
        invoicePrefix: value.invoicePrefix.toUpperCase(),
        currency: value.currency,
        timezone: value.timezone,
        invoiceSequence: 0,
        createdAt: new Date(),
        updatedAt: null,
      });
      setIsOpen(false);
      form.reset();
    },
  });

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger render={<Button>New Project</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
          <DialogDescription>
            A project groups templates and invoices for a single client or
            product.
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <form.Field name="name">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field>
                  <Input
                    aria-invalid={isInvalid}
                    id={field.name}
                    name={field.name}
                    onBlur={field.handleBlur}
                    onChange={(e) => {
                      field.handleChange(e.target.value);
                      form.setFieldValue("slug", toSlug(e.target.value));
                      form.setFieldValue(
                        "invoicePrefix",
                        toPrefix(e.target.value)
                      );
                    }}
                    placeholder="Project name"
                    value={field.state.value}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="slug">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field>
                  <Input
                    aria-invalid={isInvalid}
                    id={field.name}
                    name={field.name}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="project-slug"
                    value={field.state.value}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="invoicePrefix">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field>
                  <Input
                    aria-invalid={isInvalid}
                    className="uppercase"
                    id={field.name}
                    name={field.name}
                    onBlur={field.handleBlur}
                    onChange={(e) =>
                      field.handleChange(e.target.value.toUpperCase())
                    }
                    placeholder="INV PREFIX (e.g. HLTH)"
                    value={field.state.value}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="currency">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field>
                  <Select
                    onValueChange={(v) =>
                      field.handleChange(v as Schema["currency"])
                    }
                    value={field.state.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="timezone">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field>
                  <Select
                    onValueChange={(v) => field.handleChange(v ?? "UTC")}
                    value={field.state.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIMEZONES.map((tz) => (
                        <SelectItem key={tz} value={tz}>
                          {tz}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              onClick={() => setIsOpen(false)}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button disabled={form.state.isSubmitting} type="submit">
              Create Project
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProject;
