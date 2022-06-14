// pass through api via nextjs server side to use hidden secret api key for
// full exports
import API from "~/lib/api.js";
import { EXPORT_LIMIT } from "~/lib/settings.js";

const EXPORT = { output: "export", limit: EXPORT_LIMIT };

export default async function handler(req, res) {
  let { api: endpoint, p, limit, order_by, ...query } = req.query;
  const api = API[endpoint];
  if (!!api) {
    const { export_url } = await api({ ...EXPORT, ...query }, true);
    res.status(200).json({ query, export_url });
    res.end();
  } else {
    res.status(404).json({ error: "Route not found." });
    res.end();
  }
}
