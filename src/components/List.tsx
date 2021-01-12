import React from "react";
import {
  Content,
  Flex,
  Heading,
  IllustratedMessage,
} from "@adobe/react-spectrum";
import NotFound from "@spectrum-icons/illustrations/NotFound";
import { isEmpty } from "ramda";

type Props<T> = {
  items: T[];
  children: (item: T) => React.ReactElement;
};

export default function List<T>({ items, children }: Props<T>) {
  if (isEmpty(items)) {
    return (
      <IllustratedMessage>
        <NotFound />
        <Heading>No Result</Heading>
        <Content>Add some?</Content>
      </IllustratedMessage>
    );
  } else {
    return (
      <Flex direction="column" flexGrow={1}>
        {items.map(children)}
      </Flex>
    );
  }
}
