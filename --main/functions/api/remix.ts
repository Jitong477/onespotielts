export async function onRequestPost({ request, env }: any) {
  try {
    const body = await request.json();
    const { title, category, originalTranscript, keywords, targetBand = "8.0", userPractice } = body;

    const defaultVocab = keywords && keywords.length > 0
      ? keywords.map((k: any) => ({
          word: k.word || k,
          translation: k.translation || "学术核心词"
        }))
      : [
          { word: "Immersive learning environment", translation: "沉浸式学习环境" },
          { word: "Linguistic dexterity", translation: "语言灵巧度/纯熟度" },
          { word: "Cultural heritage protection", translation: "文化遗产保护" }
        ];

    const apiKey = env.OPENAI_API_KEY;
    const baseUrl = env.OPENAI_BASE_URL || "https://api.openai-next.com/v1";
    const model = env.OPENAI_MODEL || "gpt-4";
    let responseBody: any;

    if (apiKey && apiKey !== "YOUR_OPENAI_API_KEY_HERE") {
      try {
        const completionRes = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model,
            messages: [
              {
                role: "system",
                content: `You are an expert IELTS Examiner and Academic Trainer. Take a piece of spoken baseline transcript (which might have weak grammar, basic lexicon, or simple phrasing), and reconstruct or 'Remix' it into a highly polished, band ${targetBand} model speaking sample.\n\nProvide responses in strict JSON format. IMPORTANT: Only output a valid JSON object. Do not include markdown formatting or backticks around the JSON. Match the following schema exactly:\n{\n  "band": "${targetBand}",\n  "vocabulary": [\n    { "word": "advanced phrase", "translation": "Chinese translation of the phrase" }\n  ],\n  "template": "Speaking paragraphs at Band ${targetBand} level. Highly academic but natural flow",\n  "usage": [\n    "Recommended IELTS Topic Part 2 or 3 item"\n  ],\n  "aiFeedback": "Expert evaluation feedback (in Chinese) criticizing the original, comparing the improvements, and recommending practical pronunciation/logic-device tips for this speech."\n}`
              },
              {
                role: "user",
                content: `Video Topic: ${title}\nCategory: ${category}\nRequested core vocab blocks: ${JSON.stringify(defaultVocab)}\nOriginal transcript / User practice speech: ${userPractice || originalTranscript}\nTarget Band: ${targetBand}`
              }
            ],
            temperature: 0.7
          })
        );

        const completionJson = await completionRes.json();
        const rawText = completionJson.choices?.[0]?.message?.content?.trim() || "{}";
        const cleaned = rawText.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
        const parsed = JSON.parse(cleaned || "{}");

        responseBody = {
          band: parsed.band || targetBand,
          vocabulary: parsed.vocabulary || defaultVocab,
          template: parsed.template || "",
          usage: parsed.usage || [`Part 2/3: Talk about topics related to ${title}`],
          aiFeedback: parsed.aiFeedback || "智能重构已完成！",
          isRealAI: true
        };
      } catch (err) {
        console.error("OpenAI remix error", err);
      }
    }

    if (!responseBody) {
      let simulatedTemplate = "";
      let simulatedTips = [];
      if (category === "Culture" || title.toLowerCase().includes("china") || title.toLowerCase().includes("garden")) {
        simulatedTemplate = `Honestly, establishing an immersive learning environment within historic landscapes like traditional gardens naturally fosters linguistic dexterity. Understanding local communities enables deep cultural heritage protection.`;
        simulatedTips = [
          "Part 2: Describe a historic location or quiet place",
          "Part 3: Traditional architecture preservation as an investment"
        ];
      } else if (category === "Tech") {
        simulatedTemplate = `Regarding technology, automated structures outline virtual environments requiring strong human vigilance. Thus, resolving algorithmic bias is essential to secure mutual trust and digital accountability.`;
        simulatedTips = [
          "Part 3: Social consequences of artificial automation",
          "Part 3: Technology and long-term industrial shifts"
        ];
      } else {
        simulatedTemplate = `To achieve conversational agility, practicing in high-fidelity environments is completely paramount. Consistently applying advanced vocabulary transforms passive knowledge into native fluency.`;
        simulatedTips = [
          "Part 1: Your daily habits and study routines",
          "Part 2: A challenging skill you recently master"
        ];
      }

      responseBody = {
        band: targetBand,
        vocabulary: defaultVocab,
        template: simulatedTemplate,
        usage: simulatedTips,
        aiFeedback: userPractice
          ? `【口语对练评估】\n目标分数：Band ${targetBand}\n当前评估：Band ${Math.min(parseFloat(targetBand), 6.5)}\n指导意见：您的发音清晰度不错，也能尝试运用亮点词块。建议增加像 "${defaultVocab[0]?.word || "immersive"}" 这类更具智识深度的词表达，并使用因果逻辑连词（如 consequently, thus）来加强流利度。`
          : `欢迎使用 IELTS Layer 口语重构。点击“雅思智能模塑”以查看最符合 Band ${targetBand} 要求的重构范本，结合推荐词汇及段落进行诵读跟练！`,
        isOfflineSimulated: true
      };
    }

    return new Response(JSON.stringify(responseBody), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err: any) {
    console.error("remix function error", err);
    return new Response(JSON.stringify({ error: err.message || "remix failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
