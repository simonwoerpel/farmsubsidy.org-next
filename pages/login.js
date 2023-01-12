import { useState } from "react";
import { useRouter } from "next/router";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Page } from "~/components/pages.js";
import LegalNotice from "~/components/legalNotice.js";
import { login, useAuth } from "~/lib/auth.js";
import getCachedContext from "~/lib/context.js";

const LoginForm = () => {
  const router = useRouter();
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleLogin = () => {
    const { next } = router.query;
    setError(false);
    login(user, password)
      .then(() => (next ? router.push(next) : router.push("/")))
      .catch(({ message }) => setError(message));
  };

  return (
    <Form as="form">
      {error && <Alert variant="secondary">{error}</Alert>}
      <Form.Group className="mb-3" controlId="formBasicUser">
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          placeholder="Username"
          value={user}
          onChange={(e) => setUser(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Form.Group>
      <Button
        variant="secondary"
        disabled={!(!!user && !!password)}
        onClick={handleLogin}
      >
        Login
      </Button>
    </Form>
  );
};

export default function LoginPage({ ...ctx }) {
  const authenticated = useAuth();

  return (
    <Page {...ctx}>
      <header className="page-heading">
        <h1>Login</h1>
      </header>
      <div className="fs-page__content">
        {authenticated ? (
          <Alert variant="primary">You are already logged in.</Alert>
        ) : (
          <>
            <LegalNotice variant="dark" />
            <LoginForm />
          </>
        )}
      </div>
    </Page>
  );
}

export async function getStaticProps() {
  const ctx = await getCachedContext();
  return { props: { ...ctx } };
}
