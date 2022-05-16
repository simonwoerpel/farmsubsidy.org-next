export default async function api(path, params) {
  const searchParams = new URLSearchParams(params);
  const res = await fetch(
    `${process.env.API_ENDPOINT}/${path}?${searchParams.toString()}`
  );
  const { results } = await res.json();
  return results;
}
