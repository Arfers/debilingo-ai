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
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Ты преподаватель французского/английского/немецкого языков. Кратко оцени развернутый ответ ученика от 1 (абсолютно не ясно) до 5 (уровень носителя языка). Если есть ошибки — поясни. Пиши кратко и строго по делу." },
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
