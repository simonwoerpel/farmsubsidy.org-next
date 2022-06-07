import Layout from "./layout.js";
import Header, { Hero } from "./header.js";
import MainContainer, { Content, Sidebar } from "./container.js";

export function Page({ children, ...props }) {
  // with default sidebar
  return (
    <Layout {...props}>
      <Header {...props} />
      <MainContainer>
        <Content>{children}</Content>
        <Sidebar />
      </MainContainer>
    </Layout>
  );
}

export function CustomPage({ children, ...props }) {
  // render Content / Sidebar explicitly in children
  return (
    <Layout {...props}>
      <Header {...props} />
      <MainContainer>{children}</MainContainer>
    </Layout>
  );
}

export function IndexPage({ children, ...props }) {
  // custom index page with hero
  return (
    <Layout {...props}>
      <Hero {...props} />
      <MainContainer>{children}</MainContainer>
    </Layout>
  );
}
