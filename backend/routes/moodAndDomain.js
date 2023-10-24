const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const moods_response = await req.app.locals.elasticClient.search({
      index: "poems",
      body: {
        size: 0, // Setting size to 0 to retrieve only aggregation results
        aggs: {
          unique_domains: {
            terms: {
              field: "mood",
              size: 228,
            },
          },
        },
      },
    });

    const moods = moods_response.aggregations.unique_domains.buckets;
    const selected_moods = [];
    moods.forEach((mood) => {
      if (mood.key !== "") {
        selected_moods.push(mood.key);
      }
    });

    const domain_response = await req.app.locals.elasticClient.search({
      index: "poems",
      body: {
        size: 0, // Setting size to 0 to retrieve only aggregation results
        aggs: {
          unique_domains: {
            terms: {
              field: "domain",
              size: 228,
            },
          },
        },
      },
    });

    const domains = domain_response.aggregations.unique_domains.buckets;
    const selected_domains = [];
    domains.forEach((domain) => {
      if (domain.key !== "") {
        selected_domains.push(domain.key);
      }
    });

    res.json({ moods: selected_moods, domains: selected_domains });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
