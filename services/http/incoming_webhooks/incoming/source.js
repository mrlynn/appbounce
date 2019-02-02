exports = function(payload, response) {
  const mongodb = context.services.get("mongodb-atlas");
  const agents = mongodb.db("referrals").collection("agents");
  agents.insertOne({
    body: EJSON.parse(payload.body.text()),
    query: payload.query
  }).then(result => {
    response.setStatusCode(201);
    response.setBody(result.insertedId);
  });
};