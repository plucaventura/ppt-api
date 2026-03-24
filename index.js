const express = require("express");
const PptxGenJS = require("pptxgenjs");

const app = express();
app.use(express.json({ limit: "50mb" }));

app.post("/generate-ppt", async (req, res) => {
  try {
    const { titolo, immagine1, immagine2 } = req.body;

    let pptx = new PptxGenJS();
    await pptx.load("template.pptx");

    let slide = pptx.addSlide();

    // Titolo
    slide.addText(titolo || "Titolo", {
      x: 0.5,
      y: 0.3,
      fontSize: 28,
      bold: true,
    });

    // Immagine 1
    if (immagine1) {
      slide.addImage({
        data: "image/png;base64," + immagine1,
        x: 0.5,
        y: 1.5,
        w: 4.5,
        h: 3,
      });
    }

    // Immagine 2
    if (immagine2) {
      slide.addImage({
        data: "image/png;base64," + immagine2,
        x: 5.2,
        y: 1.5,
        w: 4.5,
        h: 3,
      });
    }

    const buffer = await pptx.write("nodebuffer");

    res.writeHead(200, {
      "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "Content-Disposition": "attachment; filename=output.pptx",
      "Content-Length": buffer.length,
    });

    res.end(buffer);

  } catch (err) {
    res.status(500).send("Errore: " + err.message);
  }
});

app.listen(process.env.PORT || 3000);
