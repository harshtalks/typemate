import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { authClient } from "@typemate/auth/client";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@typemate/ui/components/alert-dialog";
import { Button, buttonVariants } from "@typemate/ui/components/button";
import { Field, FieldError } from "@typemate/ui/components/field";
import { MailboxIcon } from "@typemate/ui/components/icons";
import { Input } from "@typemate/ui/components/input";
import { toast } from "sonner";

import z from "zod";

const schema = z.object({
  email: z.string().trim().lowercase().pipe(z.email()),
});

type Schema = z.infer<typeof schema>;

const SendMagicLink = () => {
  const mutation = useMutation({
    mutationFn: ({ email }: Schema) => authClient.signIn.magicLink({ email }),
  });

  const form = useForm({
    validators: {
      onSubmit: schema,
    },
    defaultValues: { email: "" },
    onSubmit: ({ value: { email } }) => {
      toast.promise(mutation.mutateAsync({ email }), {
        loading: "Sending magic link...",
        success: "Magic link sent!",
        error: "Failed to send magic link.",
      });
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger className={buttonVariants({ variant: "secondary" })}>
        Continue With Email <MailboxIcon />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Continue With Email</AlertDialogTitle>
          <AlertDialogDescription>
            We'll email you a magic link to sign in.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <form.Field name="email">
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
                    placeholder="Enter Email Address"
                    value={field.state.value}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
          <AlertDialogFooter>
            <AlertDialogCancel
              className={buttonVariants({ variant: "destructive" })}
              disabled={form.state.isSubmitting || mutation.isPending}
              type="button"
            >
              Cancel
            </AlertDialogCancel>
            <Button
              disabled={form.state.isSubmitting || mutation.isPending}
              type="submit"
            >
              Continue With Email
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SendMagicLink;
