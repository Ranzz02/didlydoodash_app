import "./create.css";
import { Button, FormControl, Modal, TextField } from "@mui/material";
import { ChangeEvent, FormEvent, useState } from "react";
import { API } from "@/utils/api";
import { toast } from "react-toastify";
import { Whiteboard } from "@/utils/types";
import { useWhiteboards } from "@/stores/whiteboards";

export interface CreataWhiteboardProps {
  orgId: string;
  projectId: string;
}

export default function CreateWhiteboard(props: CreataWhiteboardProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [input, setInput] = useState({
    name: "",
  });

  const { orgId, projectId } = props;
  const { addWhiteboard } = useWhiteboards();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateWhiteboard = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    return API.post(
      `/organisations/${orgId}/projects/${projectId}/whiteboards`,
      { ...input }
    )
      .then((respones) => {
        const whiteboard: Whiteboard = respones.data.whiteboard;
        if (!whiteboard) return;
        addWhiteboard(whiteboard);
        toast.success(`Successfully created whiteboard: ${whiteboard.name}`);
      })
      .catch((error) => {
        toast.error(
          `Failed to create whiteboard: ${error.response.data.message}`,
          {
            position: "top-left",
          }
        );
      });
  };

  return (
    <>
      <img
        className="create-whiteboard-button"
        src={`${import.meta.env.BASE_URL}icons/plus.svg`}
        alt=""
        onClick={() => setOpen(true)}
      />
      <Modal
        className="create-whiteboard-container"
        open={open}
        onClose={() => setOpen(false)}
      >
        <FormControl
          component="form"
          onSubmit={handleCreateWhiteboard}
          className="create-whiteboard-form"
        >
          <h2>Create Whiteboard</h2>
          <TextField
            name="name"
            value={input.name}
            onChange={handleChange}
            label="Name"
          />
          <Button type="submit" variant="contained">
            Create
          </Button>
        </FormControl>
      </Modal>
    </>
  );
}
