import Placeholder from "react-bootstrap/Placeholder";

export default function LoadingPlaceholder({ isLoading, children }) {
  return isLoading ? <Placeholder animation="glow" /> : children;
}
