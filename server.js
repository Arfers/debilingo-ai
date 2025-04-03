const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post("/evaluate", async (req, res) => {
  const userText = req.body.text;

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Ты преподаватель французского/английского/немецкого языков. Кратко оцени развернутый ответ ученика: 'отлично', 'нормально', или 'плохо'. Если есть ошибки — поясни. Пиши кратко и строго по делу.",
        },
        {
          role: "user",
          content: userText,
        },
      ],
    });

    const responseText = completion.data.choices[0].message.content;
    res.json({ result: responseText });
  } catch (error) {
    console.error("Ошибка при обращении к OpenAI:", error.message);
    res.status(500).json({ error: "Ошибка при анализе ответа." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
