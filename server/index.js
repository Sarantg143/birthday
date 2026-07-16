import express from "express";
import cors from "cors";
import { Resend } from "resend";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const resend = new Resend(process.env.RESEND_API_KEY);

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
  });
});

app.post("/api/send-email", async (req, res) => {
  try {
    const { name, to, subject, message } = req.body;

    if (!to) {
      return res.status(400).json({
        success: false,
        message: "Recipient email is required",
      });
    }

    const { data, error } = await resend.emails.send({
      from: `Happy Birthday <${process.env.FROM_EMAIL}>`,
      to,
      subject: subject || "She Said YES! ❤️",
      html: `
      <div style="font-family:Georgia,serif;background:#fef9f0;padding:30px;border-radius:12px;max-width:600px;margin:auto;">
        <div style="text-align:center">
          <h1 style="color:#8e44ad;">💜 She Said YES! 💜</h1>
        </div>

        <p style="font-size:18px;">
          Congratulations! <strong>${name}</strong> accepted your love.
        </p>

        ${
          message
            ? `
            <div style="background:#fff;padding:20px;border-radius:10px;">
              ${message}
            </div>
          `
            : ""
        }

        <br>

        <div style="text-align:center">
          ❤️ Happy Birthday ❤️
        </div>
      </div>
      `,
    });

    if (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        error,
      });
    }

    console.log("Email Sent:", data);

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});