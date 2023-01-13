# farmsubsidy.org

The aim of https://farmsubsidy.org is to obtain detailed data relating to
payments and recipients of farm subsidies in every EU member state and make
this data available in a way that is useful to European citizens.

This is the [Next.js](https://nextjs.org/) powered frontend that runs
https://farmsubsidy.org. The backend is powered by
[farmsubsidy-store](https://github.com/okfde/farmsubsidy-store)

## Data updates

The data is updated constantly. We keep track in this [changelog](CHANGELOG.md)

## Developing the frontent

### Local configuration

Api endpoint is controlled via the env var `NEXT_PUBLIC_API_ENDPOINT` and
defaults to the local dev server from
[farmsubsidy-store](https://github.com/okfde/farmsubsidy-store) -
[localhost:8000](http://localhost:8000)

[The production api](https://api.farmsubsidy.org) could be used as well, of course.

Env vars can set in bash or in the configuration file `env.local`

[Next.js env var configuration](https://nextjs.org/docs/basic-features/environment-variables)

### Getting Started

First, run the development server:

```bash
yarn dev
```

or, to point to the production api:

```bash
NEXT_PUBLIC_API_ENDPOINT=https://api.farmsubsidy.org yarn dev
```


Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The page auto-updates as you edit the files.


### Next.js

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
