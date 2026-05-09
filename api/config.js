function getMapsApiKey() {
  return process.env.Maps_api || process.env.MAPS_API || process.env.NEXT_PUBLIC_MAPS_API || "";
}

module.exports = function handler(req, res) {
  res.setHeader("Content-Type", "application/javascript; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.status(200).send(`window.CAREMATCH_CONFIG = ${JSON.stringify({ mapsApiKey: getMapsApiKey() })};`);
};
