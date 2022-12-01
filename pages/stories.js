import { useState, useEffect } from "react";
import Papa from "papaparse";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Link from "next/link";
import Card from "react-bootstrap/Card";
import { Page } from "~/components/pages.js";
import Flag from "~/components/countryFlag.js";
import getCachedContext from "~/lib/context.js";
import { STORIES_CSV_URL } from "~/lib/settings.js";

async function getStories() {
  const res = await fetch(STORIES_CSV_URL);
  const csv = await res.text();
  const { data: stories } = Papa.parse(csv, { header: true });
  return stories;
}

const Story = ({ story }) => (
  <Card border="primary" style={{ width: "18rem", margin: 10 }}>
    <Card.Body>
      <Card.Title>
        <Flag iso={story.country} />
        {story.publisher_url ? (
          <Card.Link href={story.publisher_url}>{story.publisher}</Card.Link>
        ) : (
          story.publisher
        )}
      </Card.Title>
      <Card.Subtitle className="mb-2 text-muted">
        {story.published_at}
      </Card.Subtitle>
      <Card.Text>{story.teaser}</Card.Text>
      {story.url ? (
        <Card.Link href={story.url}>Read story [{story.language}]</Card.Link>
      ) : (
        <span>Coming soon</span>
      )}
    </Card.Body>
  </Card>
);

export default function MarkdownPage({ countries, years, stories }) {
  const [remoteStories, setStories] = useState(stories);

  // reload stories on mount
  useEffect(() => {
    getStories().then((stories) => setStories(stories));
  }, []);

  return (
    <Page countries={countries} years={years}>
      <header className="page-heading">
        <h1>Stories</h1>
      </header>
      <div className="fs-page__content">
        <p>
          In cooperation with WDR, NDR, Süddeutsche Zeitung, Correctiv, Der
          Standard, IrpiMedia, Reporter.lu, Reporters United, Expresso, Follow
          The Money and Gazeta Wyborcza, FragDenStaat analysed the data and
          published stories jointly starting on 1 December 2022 at 18:00.
        </p>
        <p>You can find the stories below as soon as they get published.</p>
        <Container>
          <Row>
            {remoteStories.map((s) => (
              <Story key={s.url} story={s} />
            ))}
          </Row>
        </Container>
      </div>
    </Page>
  );
}

export async function getStaticProps() {
  const ctx = await getCachedContext();
  const stories = await getStories();
  return { props: { ...ctx, stories } };
}
