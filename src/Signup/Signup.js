import React from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Container, Button } from "react-bootstrap";
export default function Signup() {
  const navigate = useNavigate();
  return (
    <Container>
      <Row className="m-5">Signup</Row>

      <Row xs={2} md={4} lg={6}>
        <Col xs={2} md={4} lg={6}>
          <Button onClick={() => navigate("/email-signup")}>
            Email Signup{" "}
          </Button>
        </Col>
        <Col xs={2} md={4} lg={6}>
          <Button onClick={() => navigate("/google-signup")}>
            Google Signup{" "}
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
