import { Button } from "@adobe/react-spectrum";
import React from "react";
import AddCircle from "@spectrum-icons/workflow/AddCircle";

export default function FAB() {
  return (
    <Button
      variant="primary"
      isQuiet
      position="fixed"
      bottom="size-200"
      right="size-200"
      width="size-1000"
      height="size-1000"
    >
      <AddCircle size="XXL" color="notice" />
    </Button>
  );
}
