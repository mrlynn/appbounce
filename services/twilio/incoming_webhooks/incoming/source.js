exports = function(payload, response) {
  
  // Get a handle for the twilio service
  const twilio = context.services.get("twilio");
  // Get a handle for the referrals database and the agents collection
  const agents = context.services.get("mongodb-atlas").db("referrals").collection("agents");
  // Get the fromPhone from the incoming text
  const fromPhone = payload.From;
  // The text should be a string containing an Agent's Text Tag - like STEVE for example.
  var agent_text_tag = payload.Body.trim(); 
  agent_text_tag = agent_text_tag.toUpperCase();
  // Now, let's find the agent in the database and get his/her associate app url
  const agentFind = agents.findOne({"agent_text_tag": agent_text_tag}).then(agent => { 
    console.log("Found Agent ID: " + agent.id);     
    console.log("Agent Name: " + agent.first_name + ' ' + agent.last_name);  
    console.log("Text Tag: " + agent.agent_text_tag);     
    console.log("App URL: " + agent.app_url);     

//  context.functions.execute("agentReferral", agent.id, fromPhone);          // CALL FUNCTION TO RECORD HISTORY

    twilio.send({
      to: fromPhone,
      from: context.values.get("storeTwilio"),
      body: `Thanks for your interest. Please click or tap ${agent.app_url} to get in touch with ${agent.first_name}` 
    });
    
  },(failure) => {
    
    twilio.send({
      to: fromPhone,
      from: context.values.get("storeTwilio"),
      body: `Unfortuntely, we were unable to find an agent with the tag ${agent_text_tag}. Please call Steve Karpo at (123) 123-1233 for assistance.` 
    });
    
  });
};
