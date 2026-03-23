const express = require("express");
const PptxGenJS = require("pptxgenjs");
const axios = require("axios");

const app = express();
app.use(express.json());

app.post("/generate-ppt", async (req, res) => {
  try {
    const { titolo, descrizione, immagineUrl } = req.body;

    let pptx = new PptxGenJS();
    let slide = pptx.addSlide();

    slide.addText(titolo || "Titolo", { x: 1, y: 1, fontSize: 24 });
    slide.addText(descrizione || "Descrizione", { x: 1, y: 2, fontSize: 14 });

    if (immagineUrl) {
      const image = await axios.get(immagineUrl, {
        responseType: "arraybuffer",
      });

      const base64 = Buffer.from(image.data, "binary").toString("base64");

      slide.addImage({
        data: "image/jpeg;base64," + base64,
        x: 1,
        y: 3,
        w: 4,
        h: 3,
      });
    }

    const buffer = await pptx.write("nodebuffer");

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.presentationml.presentation");
    res.send(buffer);

  } catch (err) {
    res.status(500).send("Errore: " + err.message);
  }
});

app.listen(3000, () => console.log("Server running"));
