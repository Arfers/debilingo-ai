const express = require("express");
const cors = require("cors");
const OpenAI = require("openai"); // вот это вместо Configuration
const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/check", async (req, res) => {
  const userAnswer = req.body.answer;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Ты — интеллектуальный помощник языкового сайта для начинающих. Оцени развернутый ответ ученика по 5-балльной шкале, строго по критериям: ясность, грамматика, словарный запас. Форматируй ответ следующим образом: 1. Общая оценка: X/5; 2. Ошибки: (маркированным списком кратко и понятно описывай каждую ошибку, одна ошибка — один пункт. всегда указывай, как правильно); 3. Комментарий: (краткое общее замечание — только если необходимо); Пиши строго, понятно, без воды. Не используй сложные термины. Форматируй ошибки в виде HTML-списка" },
        { role: "user", content: userAnswer }
      ],
    });

    const aiFeedback = completion.choices[0].message.content;
    res.json({ result: aiFeedback });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Ошибка при обращении к OpenAI" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server started on port", PORT);
});
