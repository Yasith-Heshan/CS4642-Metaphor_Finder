const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { year, poet, domain, mood, meaning } = req.body;

    const must_queries = [];
    let should_queries = [];

    if (year) {
      must_queries.push({
        match: {
          year: year,
        },
      });
    }

    if (poet) {
      must_queries.push({
        match: {
          "poet.case_insensitive_and_inflections": {
            query: poet,
          },
        },
      });
    }

    if (domain) {
      must_queries.push({
        match: {
          domain: domain,
        },
      });
    }

    if (mood) {
      must_queries.push({
        match: {
          mood: mood,
        },
      });
    }

    const bool_queries = {
      must: must_queries,
    };

    if (meaning) {
      should_queries = [
        {
          match: {
            "english_meaning.case_insensitive_and_inflections": {
              query: meaning,
            },
          },
        },
        {
          match: {
            meaning: meaning,
          },
        },
      ];
      bool_queries["should"] = should_queries;
      bool_queries["minimum_should_match"] = 1;
    }
    let suitable_query = {};
    if (must_queries.length === 0 && should_queries.length === 0) {
      suitable_query = {
        match_all: {},
      };
    } else {
      suitable_query = {
        bool: bool_queries,
      };
    }

    const initial_poems_response = await req.app.locals.elasticClient.search({
      index: process.env.ELASTIC_SERCH_INDEX,
      body: {
        query: {
          match_all: {},
        },
        size: 228,
        from: 0,
      },
    });

    const initial_poems = initial_poems_response.hits.hits;

    const response = await req.app.locals.elasticClient.search({
      index: process.env.ELASTIC_SERCH_INDEX,
      body: {
        query: suitable_query,
        size: 228,
        from: 0,
      },
    });

    const hits = response.hits.hits;
    const poems = {};
    hits.forEach((hit) => {
      const poem_lines = [];
      initial_poems.forEach((poem) => {
        if (poem._source.poem_id === hit._source.poem_id) {
          poem_lines.push(poem._source.line);
        }
      });

      if (!(hit._source.poem_id in poems)) {
        const domain = hit._source.domain !== "" ? [hit._source.domain] : [];
        const mood = hit._source.mood !== "" ? [hit._source.mood] : [];
        const metaphorical_terms =
          hit._source.metaphorical_terms !== ""
            ? [hit._source.metaphorical_terms]
            : [];
        const sinhala_meaning =
          hit._source.meaning !== "" ? [hit._source.meaning] : [];
        const english_meaning =
          hit._source.english_meaning !== ""
            ? [hit._source.english_meaning]
            : [];
        poems[hit._source.poem_id] = {
          poem_name: hit._source.poem_name,
          year: hit._source.year,
          poem: poem_lines,
          poet: hit._source.poet,
          metaphorical_terms,
          domain,
          mood,
          sinhala_meaning,
          english_meaning,
        };
      } else {
        const domain = hit._source.domain !== "" ? [hit._source.domain] : [];
        const mood = hit._source.mood !== "" ? [hit._source.mood] : [];
        const metaphorical_terms =
          hit._source.metaphorical_terms !== ""
            ? [hit._source.metaphorical_terms]
            : [];
        const sinhala_meaning =
          hit._source.meaning !== "" ? [hit._source.meaning] : [];
        const english_meaning =
          hit._source.english_meaning !== ""
            ? [hit._source.english_meaning]
            : [];
        if (domain.length !== 0) {
          poems[hit._source.poem_id].domain.push(...domain);
        }
        if (mood.length !== 0) {
          poems[hit._source.poem_id].mood.push(...mood);
        }
        if (metaphorical_terms.length !== 0) {
          poems[hit._source.poem_id].metaphorical_terms.push(
            ...metaphorical_terms
          );
        }
        if (sinhala_meaning.length !== 0) {
          poems[hit._source.poem_id].sinhala_meaning.push(...sinhala_meaning);
        }
        if (english_meaning.length !== 0) {
          poems[hit._source.poem_id].english_meaning.push(...english_meaning);
        }
      }
    });

    res.json(poems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
