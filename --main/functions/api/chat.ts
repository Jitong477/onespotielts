export async function onRequestPost({ request, env }: any) {
  try {
    const body = await request.json();
    const { videoCtx, messages, text } = body;
    const apiKey = env.OPENAI_API_KEY;
    const baseUrl = env.OPENAI_BASE_URL || "https://api.openai-next.com/v1";
    const model = env.OPENAI_MODEL || "gpt-4";

    if (apiKey && apiKey !== "YOUR_OPENAI_API_KEY_HERE") {
      try {
        const apiMessages = (messages || []).map((msg: any) => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        }));

        if (apiMessages.length === 0 && text) {
          apiMessages.push({ role: 'user', content: text });
        }

        const systemText = `You are an expert IELTS 1v1 Speaking and Writing Tutor.\nCurrently studying Video Lesson: "${videoCtx?.title || "IELTS Lesson"}" (Category: ${videoCtx?.category || "General"}, Recommended Theme keywords: ${JSON.stringify(videoCtx?.keyVocab || [])}).\n\nGuidelines:\n1. Always reply in Chinese, except when presenting English words, phrases, idioms, and full native-speaker sample speaking responses.\n2. Provide direct, supportive, and extremely clean replies.\n3. If the user asks for a translation, phrase upgrade, or grammar correction:\n   - Provide a highly encouraging analysis.\n   - Show a clear, side-by-side comparison between:\n     - ❌ Baseline (普通普通表达/原句)\n     - ✨ IELTS Upgrade (雅思提分表达, standard Band 7.5+ or 8.5)\n   - Explain 2-3 precise vocabulary/collocations used in the upgraded version in bullet points.\n4. Keep the output neat, elegant, and readable using clean markdown.`;

        const completionRes = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model,
            messages: [{ role: "system", content: systemText }, ...apiMessages],
            temperature: 0.7
          })
        });

        const completionJson = await completionRes.json();
        const reply = completionJson.choices?.[0]?.message?.content || "抱歉，由于模型未能返回数据，未能处理您的请求。";
        return new Response(JSON.stringify({ reply, isRealAI: true }), {
          headers: { "Content-Type": "application/json" }
        });
      } catch (err) {
        console.error("OpenAI chat error", err);
      }
    }

    const lowerInput = (text || "").toLowerCase();
    let reply = "";

    if (lowerInput.includes("园林") || lowerInput.includes("garden")) {
      reply = `**📚 苏州古典园林的高级雅思表达：**\n\n1. **Classical Gardens of Suzhou** (苏州古典园林)\n2. **Horticultural masterpiece** (园艺巅峰杰作 - 用来代替 very nice garden)\n3. **Labyrinthine pathways** (曲径通幽/迷宫般的园林路径)\n4. **A peaceful sanctuary** (心灵静谧的避风港 - 用来替代 quiet place)\n5. **Pristine whitewashed walls and dark-tiled roofs** (粉墙黛瓦/经典的白墙黛瓦)\n6. **Delicate stone bridges over bubbling streams** (小桥流水 - 溪水叮咚、精致石桥)\n\n**💡 提分金句示范：**\n> *"To me, the classical Chinese gardens in Suzhou are not just tourist attractions, but absolute **horticultural masterpieces**. Wandering among those **pristine whitewashed walls and dark-tiled roofs**, alongside **delicate stone bridges over bubbling streams**, offers an incredible **quiet sanctuary for spiritual replenishment**."*\n\n你可以把这句收藏进你的口语备考本！你可以继续向我打字输入有关英语翻译或表达的困惑，我会即刻帮您雅思重构升阶！`;
    } else if (lowerInput.includes("焦虑") || lowerInput.includes("anxiety") || lowerInput.includes("董宇辉")) {
      reply = `**🧠 关于心理健康与焦虑的高阶口语词块：**\n\n1. **Inevitable by-product of ambition** (雄心壮志的必然产物 - 用来替代 bad feeling from work)\n2. **Discontent with status quo** (对现状不太满足/渴望进步)\n3. **Decompress frayed nerves** (放松极度紧绷焦虑的神经)\n\n**🎤 口语示范：**\n> *"Anxiety is often an inevitable by-product of our ambitions, especially when we are discontent with the status quo and driven to make rapid progress."*\n\n你可以试着输入有关其他雅思Part3常考的心理，健康或生活压力话题！`;
    } else if (lowerInput.includes("多元") || lowerInput.includes("trajectories") || lowerInput.includes("大冰") || lowerInput.includes("职业") || lowerInput.includes("生命") || lowerInput.includes("精彩") || lowerInput.includes("平凡")) {
      reply = `**🌟 多元职业与人生选择的主流口语大招：**\n\n1. **Diverse life trajectories** (多样化的人生轨迹)\n2. **Sovereignty of self-determination** (命运/自我决断的自主权)\n3. **Shatter conventional stereotypes of success** (击碎传统的单一成功定义)\n\n**🎤 原创高分模版：**\n> *"Exploring diverse life trajectories allows the younger generation to shatter conventional stereotypes of success and exert their sovereignty of self-determination."*\n\n这些智识语料非常适合用在 Part 3 陈述中，欢迎在口语包中归档跟练！`;
    } else if (lowerInput.includes("姥姥") || lowerInput.includes("烹饪") || lowerInput.includes("做饭") || lowerInput.includes("grandma") || lowerInput.includes("cooking") || lowerInput.includes("爱") || lowerInput.includes("长辈")) {
      reply = `**👩‍🍳 描写姥姥与隔代疼爱的高分词汇：**\n\n1. **Culinary talents** (精湛的妙手厨艺)\n2. **Meticulous recipes** (精心慢制的私房菜谱)\n3. **Unconditional affection** (毫无保留的爱意与溺爱)\n4. **Intergenerational bonding** (隔代亲密的情感联结)\n\n**✨ 雅思 Part 2 绝佳导入：**\n> *"If I were to talk about an exceptional cook in my family, it would definitely be my grandma. She possesses incredible culinary talents and always prepares meticulous recipes daily with unconditional affection."*\n\n这些词和句式能够立刻让你的叙事充满色彩与学术连贯性。`;
    } else {
      reply = `你好！关于视频 **【${videoCtx?.title || "课堂主题"}】**，为了帮助你获得最佳备考提升，当前课件推荐了这些核心亮点高分表达：\n${((videoCtx?.keyVocab) || []).map((v: any) => `* **${v.word}** (${v.translation})`).join('\n')}\n\n你可以试着输入一些雅思生词来测试如何升级发音与场景拓展，或者打入一些句子，我来帮你一键重构润色！`;
    }

    return new Response(JSON.stringify({ reply }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err: any) {
    console.error("chat function error", err);
    return new Response(JSON.stringify({ error: err.message || "chat failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
