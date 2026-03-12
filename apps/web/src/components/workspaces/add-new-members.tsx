import { Button } from "@typemate/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@typemate/ui/components/dialog";

const AddNewMembersToWorkspace = () => {
  return (
    <Dialog>
      <DialogTrigger render={<Button>Add New Members</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Members</DialogTitle>
          <DialogDescription>
            Add new members to the workspace. They will be able to access the
            workspace and its resources.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewMembersToWorkspace;
