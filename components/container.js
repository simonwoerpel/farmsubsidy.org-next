import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

export default function MainContainer({ children }) {
  return (
    <main>
      <Container>{children}</Container>
    </main>
  );
}
