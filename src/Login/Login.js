import React from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Container, Button } from "react-bootstrap";
import { boldSmall } from "../styles";
export default function Login() {
  const navigate = useNavigate();
  return (
    <Container className="d-flex flex-column justify-content-center align-items-center ">
      <Row className="m-5">Login</Row>

      <Row xs={2} md={4} lg={6} className="w-100">
        <Col xs={2} md={4} lg={6}>
          <Button onClick={() => navigate("/email-login")}>Email Login </Button>
        </Col>
        <Col xs={2} md={4} lg={6}>
          <Button onClick={() => navigate("/google-login")}>
            Google Login{" "}
          </Button>
        </Col>
      </Row>
      <Row>
        <div className="d-flex flex-column justify-content-start mt-5">
          <div className="text-center">
            <p style={boldSmall} className="mb-1">
              Don't have an account?
            </p>
            <Button
              variant="primary"
              onClick={() => navigate("/signup")}
              className="mb-4"
            >
              Signup
            </Button>
          </div>
        </div>
      </Row>
    </Container>
  );
}
