import axios from "axios";

const sendgrid = axios.create({
  baseURL: "https://api.sendgrid.com/v3",
  headers: {
    Authorization: `Bearer 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`,
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

const sendEmail = async (to, subject, html) => {
  try {
    const response = await sendgrid.post("/mail/send", {
      personalizations: [
        {
          to: [
            {
              email: to,
            },
          ],
          subject: subject,
        },
      ],
      from: {
        email: "doankhietthanh@gmail.com",
      },
      content: [
        {
          type: "text/html",
          value: html,
        },
      ],
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

export { sendEmail };
