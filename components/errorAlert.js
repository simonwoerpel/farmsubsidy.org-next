import Alert from "react-bootstrap/Alert";

export default function ErrorAlert({ message }) {
  const { origin, pathname } = new URL(window.location);
  return (
    <Alert variant="danger">
      <Alert.Heading>Error</Alert.Heading>
      {message || "Sorry, an error occured."}
      <br />
      <a href={`${origin}${pathname}`}>Try this url.</a>
    </Alert>
  );
}
