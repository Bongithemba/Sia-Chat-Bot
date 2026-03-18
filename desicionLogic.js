// Preprocessing / Tokenization
function preprocess(query) {
    return query
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .split(/\s+/);
}

// Keyword-based Categorization
const keywords = {
    Billing: ["bill", "payment", "invoice", "refund", "charge"],
    Account: ["login", "password", "account", "username", "profile"],
    Technical: ["error", "bug", "system", "crash", "slow"]
};

function detectCategory(query) {
    const words = preprocess(query);
    let scores = { Billing: 0, Account: 0, Technical: 0 };

    words.forEach(word => {
        for (let cat in keywords) {
            if (keywords[cat].includes(word)) scores[cat]++;
        }
    });

    let highestCategory = "Unknown";
    let highestScore = 0;

    for (let cat in scores) {
        if (scores[cat] > highestScore) {
            highestScore = scores[cat];
            highestCategory = cat;
        }
    }

    return highestScore > 0 ? highestCategory : "Unknown";
}

//  Decision Tree
const decisionTree = {
    Billing: {
        solution: "Check your billing history or verify your payment details.",
        fail: "Forwarding your issue to the billing support team."
    },
    Account: {
        solution: "Try resetting your password or verifying your account information.",
        fail: "Forwarding your issue to the account support team."
    },
    Technical: {
        solution: "Restart the application or clear your cache and try again.",
        fail: "Forwarding your issue to the technical support team."
    },
    Unknown: {
        solution: "Please provide more details about your problem.",
        fail: "Forwarding your issue to a support agent."
    }
};

// Generate automated solution
function generateSolution(query) {
    const category = detectCategory(query);
    return {
        category,
        solution: decisionTree[category].solution
    };
}

//  Handle user feedback
function handleFeedback(category, solved) {
    if (solved) {
        return { status: "Closed", message: "Your issue has been resolved!" };
    } else {
        return { status: "In Progress", message: decisionTree[category].fail };
    }
}

module.exports = { generateSolution, handleFeedback };