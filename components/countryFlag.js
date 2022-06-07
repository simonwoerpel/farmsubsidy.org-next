import "semantic-ui-flag/flag.css";

export default function Flag({ iso }) {
  return <i className={`${iso?.toLowerCase()} flag`}></i>;
}
