function preprocess(query) {
  return query.toLowerCase()
   .replace(/[^\w\s]/g, "")
   .split(/\s+/);
}

const categories = {
  Billing: ["bill","billing","payment","invoice","refund","charge","issue","fees"],
  Account: ["login","password","account","username","profile","signup","register"],
  Technical: ["error","bug","system","crash","slow","load","problem"]
};

const decisionTree = {
  Billing: { solution:"Check your billing history or verify your payment details.",
     fail:"Forwarding your issue to the billing support team." },

  Account: { solution:"Try resetting your password or verifying your account information.", 
    fail:"Forwarding your issue to the account support team." },

  Technical: { solution:"Restart the application or clear your cache and try again.", 
    fail:"Forwarding your issue to the technical support team." },

  Unknown: { solution:"Please provide more details about your problem.",
     fail:"Forwarding your issue to a support agent." }
};

function detectCategory(query) {
  const words = preprocess(query);
  const scores = Object.fromEntries(Object.keys(categories).map(cat => [cat,0]));
  words.forEach(word=>{
    for(const [cat,keys] of Object.entries(categories)) {
      if(keys.includes(word)) scores[cat]++;
    }
  });
  const [highestCategory, highestScore] = Object.entries(scores).reduce(([bestCat,bestScore],[cat,score])=> score>bestScore?[cat,score]:[bestCat,bestScore],["Unknown",0]);
  return highestScore>0?highestCategory:"Unknown";
}

const database = [];
function storeInDatabase(user, query, category) {
  const record = { user, query, category, timestamp: new Date() };
  database.push(record);
  console.log("Stored in DB:", record);
}

function generateSolution(user, query) {
  const category = detectCategory(query);
  storeInDatabase(user, query, category);
  const solution = decisionTree[category]?.solution||decisionTree.Unknown.solution;
  return { category, solution };
}

function handleFeedback(user, category, solved) {
  if(!decisionTree[category]) category="Unknown";
  const message = solved?"Your issue has been resolved!":decisionTree[category].fail;
  if(!solved) console.log(`Service Rep contacted for user: ${user}`);
  return { status: solved?"Closed":"In Progress", message };
}

module.exports = { generateSolution, handleFeedback, detectCategory, preprocess, database };








