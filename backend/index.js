const express = require("express");
var cors = require("cors");
const app = express();
app.use(express.json());
const fs = require("fs");
const dotenv = require("dotenv");
const moodAndDomain = require("./routes/moodAndDomain");
const search = require("./routes/search");

dotenv.config();
const port = process.env.PORT;

require("array.prototype.flatmap").shim();
const { Client } = require("@elastic/elasticsearch");
const client = new Client({ node: process.env.ELASTIC_SEARCH_NODE });

app.locals.elasticClient = client;
console.log("Connected to Elasticsearch");

app.use(
  cors({
    origin: process.env.FRONTEND_BASE_URL,
    credentials: true,
  })
);

function readJsonFile(filePath) {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading or parsing the JSON file:", error);
    return null;
  }
}

const mappings_data = readJsonFile("jsons/mapping_file.json");
const dataset = readJsonFile("jsons/dataset.json");

async function run() {
  // Check if the index exists
  const indexExists = await client.indices.exists({
    index: process.env.ELASTIC_SERCH_INDEX,
  });

  if (indexExists) {
    const deleteResponse = await client.indices.delete({
      index: process.env.ELASTIC_SERCH_INDEX,
    });
    console.log("Index deleted:", deleteResponse);
  }
  // Create a new index
  const createResponse = await client.indices.create(
    {
      index: process.env.ELASTIC_SERCH_INDEX,
      body: mappings_data,
    },
    { ignore: [400] }
  );
  console.log("Index created:", createResponse);

  const body = dataset.flatMap((doc) => [
    { index: { _index: process.env.ELASTIC_SERCH_INDEX } },
    doc,
  ]);

  const bulkResponse = await client.bulk({ refresh: true, body });

  if (bulkResponse.errors) {
    const erroredDocuments = [];
    bulkResponse.items.forEach((action, i) => {
      const operation = Object.keys(action)[0];
      if (action[operation].error) {
        erroredDocuments.push({
          status: action[operation].status,
          error: action[operation].error,
          operation: body[i * 2],
          document: body[i * 2 + 1],
        });
      }
    });
    console.log(erroredDocuments);
  }

  const count = await client.count({ index: process.env.ELASTIC_SERCH_INDEX });
  console.log(count);
}

run().catch((error) => {
  console.log(error);
});

app.use("/get_moods_domains", moodAndDomain);

app.use("/search", search);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
