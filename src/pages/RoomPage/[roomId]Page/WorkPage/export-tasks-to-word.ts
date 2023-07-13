import { saveAs } from "file-saver";
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");

const exportTasksToWord = async () => {
  const response = await fetch("tag-example.docx");
  const content = await response.arrayBuffer();
  const zip = new PizZip(content);

  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  });

  doc.render({
    first_name: "John",
    last_name: "Doe",
    phone: "0652455478",
    description: "New Website",
  });

  const buf = doc.getZip().generate({
    type: "blob",
    compression: "DEFLATE",
  });

  saveAs(buf, "output.docx");
};

export default exportTasksToWord;
