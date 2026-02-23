import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { PrefixedIDs } from "@typemate/db/ids";
import { Button } from "@typemate/ui/components/button";
import {
  Empty,
  EmptyContent,
  EmptyHeader,
  EmptyMedia,
} from "@typemate/ui/components/empty";
import { Field, FieldError } from "@typemate/ui/components/field";
import { EmptyIcon } from "@typemate/ui/components/icons";
import { Input, InputWithSpinner } from "@typemate/ui/components/input";
import z from "zod";
import { workspacesCollection } from "~/queries/workspaces";
import { authRepo } from "~/rpcs/auth";

export const Route = createFileRoute("/(authenticated)/create-new-workspace")({
  component: RouteComponent,
  ssr: false,
});

const formSchema = z.object({
  name: z.string().trim().min(1).max(50),
  slug: z.string().trim().min(1).max(50),
});

function RouteComponent() {
  const checkSlugMutation = useMutation({
    mutationFn: authRepo.checkOrganizationSlug,
  });

  const router = useRouter();

  const form = useForm({
    defaultValues: { name: "", slug: "" },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: ({ value: { name, slug } }) => {
      workspacesCollection.insert({
        name,
        slug,
        id: PrefixedIDs.org(),
        createdAt: new Date(),
      });

      router.navigate({ to: "/workspaces" });
    },
  });

  return (
    <div className="py-40">
      <div className="space-y-10">
        <div className="space-y-2">
          <h1 className="font-semibold text-5xl">Create new workspace</h1>
          <p className="text-muted-foreground text-sm">
            You can create a new workspace by filling out the form below. Once
            you create a workspace, you can add notes to it and share it with
            other users.
          </p>
        </div>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <Empty className="border">
            <EmptyHeader>
              <EmptyMedia>
                <EmptyIcon />
              </EmptyMedia>
              <EmptyContent className="w-sm">
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
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="Enter workspace name"
                          value={field.state.value}
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
                <form.Field
                  asyncDebounceMs={500}
                  name="slug"
                  validators={{
                    onChangeAsync: async ({ value }) => {
                      if (!value) {
                        return undefined;
                      }

                      const { status } = await checkSlugMutation.mutateAsync({
                        data: { slug: value },
                      });

                      if (!status) {
                        return {
                          message: "Slug is already taken",
                        };
                      }

                      return undefined;
                    },
                  }}
                >
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field>
                        <InputWithSpinner
                          aria-invalid={isInvalid}
                          id={field.name}
                          isLoading={checkSlugMutation.isPending}
                          name={field.name}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="Enter slug"
                          value={field.state.value}
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>

                <Button type="submit">Create Workspace</Button>
              </EmptyContent>
            </EmptyHeader>
          </Empty>
        </form>
      </div>
    </div>
  );
}
