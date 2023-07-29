import React, { useState } from "react";
import axios from "axios";
import * as ReactBootStrap from "react-bootstrap";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import PasswordModal from "./PasswordModal";
import UserDoesNotExistModal from "./UserDoesNotExistModal";
import { red, pillButton, boldSmall, hidden, small } from "../styles";

export default function EmailLogin() {
  const navigate = useNavigate();
  const [passModal, setpassModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showSpinner, setShowSpinner] = useState(false);

  const [loginSuccessful, setLoginSuccessful] = useState(false);
  const [userDoesntExist, setUserDoesntExist] = useState(false);
  const submitForm = async () => {
    if (email === "" || password === "") {
      setErrorMessage("Please fill out all fields");
      return;
    }
    setShowSpinner(true);
    // axios
    //   .post("http://127.0.0.1:2000/api/v2/AccountSalt/FINDME", {
    //     email: email,
    //   })
    axios
      .post("https://mrle52rri4.execute-api.us-west-1.amazonaws.com/dev/api/v2/AccountSalt/PM", {
        email: email,
      })
      .then((res) => {
        let saltObject = res;
        if (saltObject.data.code === 200) {
          let hashAlg = saltObject.data.result[0].password_algorithm;
          let salt = saltObject.data.result[0].password_salt;

          if (hashAlg != null && salt != null) {
            // Make sure the data exists
            if (hashAlg !== "" && salt !== "") {
              // Rename hash algorithm so client can understand
              switch (hashAlg) {
                case "SHA256":
                  hashAlg = "SHA-256";
                  break;
                default:
                  break;
              }
              // Salt plain text password
              let saltedPassword = password + salt;
              // Encode salted password to prepare for hashing
              const encoder = new TextEncoder();
              const data = encoder.encode(saltedPassword);
              //Hash salted password
              crypto.subtle.digest(hashAlg, data).then((res) => {
                let hash = res;
                // Decode hash with hex digest
                let hashArray = Array.from(new Uint8Array(hash));
                let hashedPassword = hashArray
                  .map((byte) => {
                    return byte.toString(16).padStart(2, "0");
                  })
                  .join("");
                console.log(hashedPassword);
                let loginObject = {
                  email: email,
                  password: hashedPassword,
                };
                console.log(JSON.stringify(loginObject));
                axios
                  // .post("http://127.0.0.1:2000/api/v2/Login/FINDME", loginObject)
                  .post("https://mrle52rri4.execute-api.us-west-1.amazonaws.com/dev/api/v2/Login/PM", loginObject)
                  .then((response) => {
                    console.log(response.data.message);
                    if (response.data.message === "Incorrect password") {
                      setErrorMessage(response.data.message);
                      setShowSpinner(false);
                    } else if (response.data.message === "Email doesn't exist") {
                      setUserDoesntExist(true);
                      setShowSpinner(false);
                    } else if (response.data.message === "Login successful") {
                      setErrorMessage("");
                      setLoginSuccessful(true);
                    }
                  })
                  .catch((err) => {
                    if (err.response) {
                      console.log(err.response);
                    }
                    console.log(err);
                  });
              });
            }
          }
        } else {
          setUserDoesntExist(true);
          setShowSpinner(false);
        }
      });
  };

  const onReset = async () => {
    if (email == "") {
      setErrorMessage("Please enter an email");
      return;
    }
    setShowSpinner(true);
    axios
      // .post("http://127.0.0.1:2000/api/v2/SetTempPassword/FINDME", {
      .post("https://mrle52rri4.execute-api.us-west-1.amazonaws.com/dev/api/v2/SetTempPassword/FINDME", {
        email: email,
      })
      .then((response) => {
        if (response.data.message === "A temporary password has been sent") {
          setErrorMessage("");
          setShowSpinner(false);
          setpassModal(true);
        }
        if (response.data.code === 280) {
          console.log(response);
          setErrorMessage("No account found with that email.");
          return;
        }
      });
  };
  const onCancel = () => {
    setpassModal(false);
  };

  const onCancelModal = () => {
    setUserDoesntExist(false);
  };

  const required =
    errorMessage === "Please fill out all fields" ? (
      <span style={red} className="ms-1">
        *
      </span>
    ) : (
      ""
    );
  return (
    <Container className="d-flex flex-column justify-content-center align-items-center ">
      {<PasswordModal isOpen={passModal} onCancel={onCancel} />}
      {<UserDoesNotExistModal isOpen={userDoesntExist} onCancel={onCancelModal} email={email} />}
      <Row className="m-5">Email Login </Row>
      {loginSuccessful ? (
        <div>Success</div>
      ) : (
        <Row className="w-100">
          <Col></Col>
          <Col>
            <Form>
              <Form.Group className="mx-2 my-3">
                <Form.Label as="h5" className="mb-0 ms-1">
                  Email Address {email === "" ? required : ""}
                </Form.Label>
                <Form.Control style={{ borderRadius: 0 }} placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </Form.Group>
              <Form.Group className="mx-2 my-3">
                <Form.Label as="h5" className="mb-0 ms-1">
                  Password {password === "" ? required : ""}
                </Form.Label>
                <Form.Control style={{ borderRadius: 0 }} placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </Form.Group>
            </Form>
            <div className="text-center pt-1 pb-2">
              <div className="text-center mb-4">
                <p style={{ ...boldSmall, cursor: "pointer" }} onClick={onReset}>
                  Forgot Password?
                </p>
              </div>
              {showSpinner ? (
                <div className="w-100 d-flex flex-column justify-content-center align-items-center">
                  <ReactBootStrap.Spinner animation="border" role="status" />
                </div>
              ) : (
                ""
              )}
              <Button variant="outline-primary" onClick={submitForm}>
                Login
              </Button>
            </div>
            <div className="text-center" style={errorMessage === "" ? hidden : {}}>
              <p style={{ ...red, ...small }}>{errorMessage || "error"}</p>
            </div>
          </Col>
          <Col></Col>
        </Row>
      )}
    </Container>
  );
}
