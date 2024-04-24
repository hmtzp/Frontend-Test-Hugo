import React from "react";
import Container from 'react-bootstrap/Container';
import { Breadcrumb } from "react-bootstrap";
import "./Breadcrumbs.scss";

const Breadcrumbs = ({ info }) => {
  if (!Array.isArray(info) || info.length === 0) {
    return null; // Si info no es un array o está vacío, no renderizar nada
  }

  return (
    <Container>
      <Breadcrumb>
        {info.map((item, index) => (
          <Breadcrumb.Item key={index} active={index === info.length - 1}>
            {item.name}
          </Breadcrumb.Item>
        ))}
      </Breadcrumb>
    </Container>
  );
};

export default Breadcrumbs;