// netlify/functions/evaluate-idea.js

exports.handler = async function (event, context) {
  const { idea } = JSON.parse(event.body);

  if (!idea) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing idea input." }),
    };
  }

  const prompt = `You are an expert startup advisor. A user has this business idea: "${idea}".
Evaluate it briefly under:
1. Originality (rate out of 10)
2. Market Potential
3. Weaknesses
4. Viability
Then recommend 1-2 next steps.`;

  try {
    const response = await fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "text-davinci-003",
        prompt,
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({ result: data.choices[0].text.trim() }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "OpenAI request failed." }),
    };
  }
};
