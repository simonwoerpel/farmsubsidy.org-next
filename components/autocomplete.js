import { useState } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import Flag from "./countryFlag.js";

export default function Autocomplete({ recipients, onSelect }) {
  return recipients?.length > 0 ? (
    <ListGroup>
      {recipients.map(({ name, country, id }) => (
        <ListGroup.Item key={id} action onClick={() => onSelect(name)}>
          {name} <Flag iso={country} />
        </ListGroup.Item>
      ))}
    </ListGroup>
  ) : null;
}
