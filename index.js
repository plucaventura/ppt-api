const express = require("express");
const PptxGenJS = require("pptxgenjs");

const app = express();

// supporta immagini base64 grandi
app.use(express.json({ limit: "50mb" }));

// 🔴 INSERISCI QUI IL BASE64 DEL TEMPLATE (PNG)
const TEMPLATE_BASE64 = "INSERISCI_QUI_IL_BASE64_DEL_TEMPLATE_PNG";

app.post("/generate-ppt", async (req, res) => {
  try {
    const { titolo, immagine1, immagine2 } = req.body;

    let pptx = new PptxGenJS();

    // layout widescreen standard (16:9)
    pptx.layout = "LAYOUT_WIDE";

    let slide = pptx.addSlide();

    // 🧩 TEMPLATE COME SFONDO
    slide.background = {
      data: "image/png;base64," + TEMPLATE_BASE64
    };

    // 📝 TITOLO DINAMICO
    if (titolo) {
      slide.addText(titolo, {
        x: 0.5,
        y: 0.3,
        w: 9,
        h: 0.8,
        fontSize: 28,
        bold: true,
        color: "000000"
      });
    }

    // 🖼️ SNAPSHOT 1
    if (immagine1) {
      slide.addImage({
        data: immagine1, // già base64 completo da Office Script
        x: 1.0,
        y: 2.0,
        w: 4.5,
        h: 3.0
      });
    }

    // 🖼️ SNAPSHOT 2
    if (immagine2) {
      slide.addImage({
        data: immagine2,
        x: 5.5,
        y: 2.0,
        w: 4.5,
        h: 3.0
      });
    }

    // 🎯 GENERA FILE
    const buffer = await pptx.write("nodebuffer");

    // 📤 RISPOSTA HTTP
    res.writeHead(200, {
      "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "Content-Disposition": "attachment; filename=report.pptx",
      "Content-Length": buffer.length
    });

    res.end(buffer);

  } catch (err) {
    console.error(err);
    res.status(500).send("Errore: " + err.message);
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("API running");
});
