import React, { useState } from "react";
import axios from "axios";
import * as ReactBootStrap from "react-bootstrap";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { formatPhoneNumber } from "../helper";
import { red, pillButton, boldSmall } from "../styles";
import UserAlreadyExistsModal from "./UserAlreadyExistsModal";

export default function EmailSignup() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showSpinner, setShowSpinner] = useState(false);
  const [signupSuccessful, setSignupSuccessful] = useState(false);
  const [userAlreadyExists, setUserAlreadyExists] = useState(false);
  const required =
    errorMessage === "Please fill out all fields" ? (
      <span style={red} className="ms-1">
        *
      </span>
    ) : (
      ""
    );
  const submitForm = async () => {
    if (email === "" || password === "" || confirmPassword === "") {
      setErrorMessage("Please fill out all fields");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords must match");
      return;
    } else if (password === confirmPassword) {
      setErrorMessage("");
    }
    setShowSpinner(true);
    const user = {
      first_name: firstName,
      last_name: lastName,
      phone_number: phoneNumber,
      email: email,
      password: password,
      role: "",
    };
    axios
      .post("http://127.0.0.1:2000/api/v2/CreateAccount/FINDME", user)
      .then((response) => {
        console.log(response);
        if (response.data.message == "User already exists") {
          setUserAlreadyExists(!userAlreadyExists);
          return;
          // add validation
        } else {
          setSignupSuccessful(true);
        }
      });
  };
  const onCancel = () => {
    setUserAlreadyExists(false);
  };
  return (
    <Container className="d-flex flex-column justify-content-center align-items-center ">
      <UserAlreadyExistsModal
        isOpen={userAlreadyExists}
        onCancel={onCancel}
        email={email}
      />
      <Row className="mt-5 mb-3">Email Signup</Row>
      {signupSuccessful ? (
        <div>
          <Row>
            <div className="d-flex flex-column justify-content-start mt-5">
              <div className="text-center">
                <p style={boldSmall} className="mb-1">
                  Signup Successful
                </p>
                <Button
                  variant="primary"
                  onClick={() => navigate("/login")}
                  className="mb-4"
                >
                  Login
                </Button>
              </div>
            </div>
          </Row>
        </div>
      ) : (
        <div className="mt-5 w-100">
          <Row className="mt-5 w-100">
            <Col></Col>
            <Col>
              <Form>
                <Row>
                  {" "}
                  <Col>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                      <Form.Label>First Name</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="First Name"
                        name="email"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Last Name"
                        name="email"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    placeholder="(xxx)xxx-xxxx"
                    type="tel"
                    pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                    name="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) =>
                      setPhoneNumber(formatPhoneNumber(e.target.value))
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Email address"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm Password"
                    name="confirm_password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </Form.Group>
                {showSpinner ? (
                  <div className="w-100 d-flex flex-column justify-content-center align-items-center">
                    <ReactBootStrap.Spinner animation="border" role="status" />
                  </div>
                ) : (
                  ""
                )}
                <Row>
                  <Col>
                    {" "}
                    <Button variant="primary" onClick={submitForm}>
                      Signup
                    </Button>
                  </Col>
                  <Col>
                    {" "}
                    <Button variant="primary" onClick={() => navigate("/")}>
                      Cancel
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Col>
            <Col></Col>
          </Row>
          <Row>
            <div className="d-flex flex-column justify-content-start mt-5">
              <div className="text-center">
                <p style={boldSmall} className="mb-1">
                  Already have an account?
                </p>
                <Button
                  variant="primary"
                  onClick={() => navigate("/login")}
                  className="mb-4"
                >
                  Login
                </Button>
              </div>
            </div>
          </Row>
        </div>
      )}
    </Container>
  );
}
