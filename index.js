const express = require("express");
const PptxGenJS = require("pptxgenjs");

const app = express();

// supporta immagini grandi
app.use(express.json({ limit: "50mb" }));

// 🔴 Base64 del template istituzionale (PNG)
const TEMPLATE_BASE64 = "INSERISCI_QUI_IL_BASE64_DEL_TEMPLATE";

function fixBase64(img) {
  if (!img) return null;
  if (img.startsWith("data:image")) return img; // già corretto
  return "data:image/png;base64," + img;       // aggiungi prefisso
}

app.post("/generate-ppt", async (req, res) => {
  try {
    const { titolo, immagine1, immagine2 } = req.body;

    let pptx = new PptxGenJS();
    pptx.layout = "LAYOUT_WIDE";

    let slide = pptx.addSlide();

    // 🧩 Template come sfondo
    slide.background = {
      data: "image/png;base64," + TEMPLATE_BASE64
    };

    // 📝 Titolo dinamico
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

    // 🖼️ Snapshot 1
    const img1 = fixBase64(immagine1);
    if (img1) {
      slide.addImage({
        data: img1,
        x: 1.0,
        y: 2.0,
        w: 4.5,
        h: 3.0
      });
    }

    // 🖼️ Snapshot 2
    const img2 = fixBase64(immagine2);
    if (img2) {
      slide.addImage({
        data: img2,
        x: 5.5,
        y: 2.0,
        w: 4.5,
        h: 3.0
      });
    }

    // 🎯 Genera file PPT
    const buffer = await pptx.write("nodebuffer");

    // 📤 Risposta HTTP
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
