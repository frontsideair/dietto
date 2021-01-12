import React from "react";
import { Link as SpectrumLink } from "@adobe/react-spectrum";
import { Link as RouterLink, LinkProps } from "react-router-dom";

export default function Link(props: LinkProps) {
  return (
    <SpectrumLink>
      <RouterLink {...props} />
    </SpectrumLink>
  );
}
