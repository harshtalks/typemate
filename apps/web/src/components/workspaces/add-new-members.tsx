import { useForm } from "@tanstack/react-form";
import { useParams, useRouteContext } from "@tanstack/react-router";
import { PrefixedIDs } from "@typemate/db/ids";
import { Branded } from "@typemate/types";
import {
  AlertDialogCancel,
  AlertDialogFooter,
} from "@typemate/ui/components/alert-dialog";
import { Button, buttonVariants } from "@typemate/ui/components/button";
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
import { addHours } from "date-fns";
import { useState } from "react";

import z from "zod";
import { invitationsCollection } from "~/queries/invitations";

const schema = z.object({
  email: z.string().trim().lowercase().pipe(z.email()),
  role: z.enum(["admin", "developer"]),
});

type Schema = z.infer<typeof schema>;

const AddNewMembersToWorkspace = () => {
  const [isOpen, setIsOpen] = useState(false);

  const {
    user: {
      user: { id: userId },
    },
  } = useRouteContext({
    from: "/(authenticated)/workspaces/$workspaceId",
  });

  const { workspaceId } = useParams({
    from: "/(authenticated)/workspaces/$workspaceId",
  });

  const form = useForm({
    validators: {
      onSubmit: schema,
    },
    defaultValues: { email: "", role: "admin" } as Schema,
    onSubmit: (values) => {
      invitationsCollection.insert({
        createdAt: new Date(),
        organizationId: Branded.OrganizationId(workspaceId),
        email: values.value.email,
        role: values.value.role,
        id: PrefixedIDs.invitation(),
        expiresAt: addHours(new Date(), 48),
        inviterId: userId,
      });

      setIsOpen(false);
    },
  });

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger render={<Button>Add New Members</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Members</DialogTitle>
          <DialogDescription>
            Add new members to the workspace. They will be able to access the
            workspace and its resources.
          </DialogDescription>
        </DialogHeader>
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
          <form.Field name="role">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field>
                  <Select
                    onValueChange={(e) =>
                      field.handleChange(e as Schema["role"])
                    }
                    value={field.state.value}
                  >
                    <SelectTrigger className={"capitalize"}>
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={"admin"}>Admin</SelectItem>
                      <SelectItem value={"developer"}>Developer</SelectItem>
                    </SelectContent>
                  </Select>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
          <AlertDialogFooter>
            <AlertDialogCancel
              className={buttonVariants({ variant: "destructive" })}
              disabled={form.state.isSubmitting}
              type="button"
            >
              Cancel
            </AlertDialogCancel>
            <Button disabled={form.state.isSubmitting} type="submit">
              Invite Member
            </Button>
          </AlertDialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewMembersToWorkspace;
