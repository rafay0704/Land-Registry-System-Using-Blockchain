import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import stampImage from '../images/stamp1.jpg';
const stopCapture = async (
  imgbSeller,
  imgbBuyer,
  imgbWitness,
  witness,
  users,
  insp,
  land
) => {
  const pdfDoc = await PDFDocument.create();
  const Sellerimage = await pdfDoc.embedPng(imgbSeller);
  const Buyerimage = await pdfDoc.embedPng(imgbBuyer);
  const Witnessimage = await pdfDoc.embedPng(imgbWitness);

  const stampImageBytes = await fetch(stampImage).then((res) => res.arrayBuffer());
  const StampImage = await pdfDoc.embedJpg(stampImageBytes);


  const page = pdfDoc.addPage([1200, 900]);
  const { width, height } = page.getSize();
  const imgWidth = Math.min(width / 3, Sellerimage.width / 3);
  const imgHeight = Math.min(height / 3, Sellerimage.height / 3);
  page.drawText("Transfer of Land Ownership Dcoument", {
    x: 500,
    y: height - imgHeight + 130,
    size: 18,
    font: await pdfDoc.embedFont(StandardFonts.Helvetica),
    color: rgb(0, 0, 0),
  });
  page.drawText("Seller Information", {
    x: 100,
    y: height - imgHeight + 20,
    size: 14,
    font: await pdfDoc.embedFont(StandardFonts.Helvetica),
    color: rgb(0, 0, 0),
  });
  page.drawImage(Sellerimage, {
    x: 100,
    y: height - imgHeight - 150,
    width: imgWidth,
    height: imgHeight,
  });
  page.drawText("Name:", {
    x: 100,
    y: height - imgHeight - 180,
    size: 12,
    font: await pdfDoc.embedFont(StandardFonts.Helvetica),
    color: rgb(0, 0, 0),
  });
  page.drawText(users[0].name, {
    x: 200,
    y: height - imgHeight - 180,
    size: 12,
    font: await pdfDoc.embedFont(StandardFonts.Helvetica),
    color: rgb(0, 0, 0),
  });
  page.drawText("Address:", {
    x: 100,
    y: height - imgHeight - 210,
    size: 12,
    font: await pdfDoc.embedFont(StandardFonts.Helvetica),
    color: rgb(0, 0, 0),
  });
  page.drawText(users[0].address, {
    x: 200,
    y: height - imgHeight - 210,
    size: 12,
    font: await pdfDoc.embedFont(StandardFonts.Helvetica),
    color: rgb(0, 0, 0),
  });
  page.drawText("Cinc:", {
    x: 100,
    y: height - imgHeight - 240,
    size: 12,
    font: await pdfDoc.embedFont(StandardFonts.Helvetica),
    color: rgb(0, 0, 0),
  });
  page.drawText(users[0].cinc, {
    x: 200,
    y: height - imgHeight - 240,
    size: 12,
    font: await pdfDoc.embedFont(StandardFonts.Helvetica),
    color: rgb(0, 0, 0),
  });
  page.drawText("City:", {
    x: 100,
    y: height - imgHeight - 270,
    size: 12,
    font: await pdfDoc.embedFont(StandardFonts.Helvetica),
    color: rgb(0, 0, 0),
  });
  page.drawText(users[0].city, {
    x: 200,
    y: height - imgHeight - 270,
    size: 12,
    font: await pdfDoc.embedFont(StandardFonts.Helvetica),
    color: rgb(0, 0, 0),
  });
  page.drawText("Email:", {
    x: 100,
    y: height - imgHeight - 300,
    size: 12,
    font: await pdfDoc.embedFont(StandardFonts.Helvetica),
    color: rgb(0, 0, 0),
  });
  page.drawText(users[0].email, {
    x: 200,
    y: height - imgHeight - 300,
    size: 12,
    font: await pdfDoc.embedFont(StandardFonts.Helvetica),
    color: rgb(0, 0, 0),
  });
  page.drawText("Buyer Information", {
    x: 700,
    y: height - imgHeight + 20,
    size: 14,
    font: await pdfDoc.embedFont(StandardFonts.Helvetica),
    color: rgb(0, 0, 0),
  });
  page.drawImage(Buyerimage, {
    x: 700,
    y: height - imgHeight - 150,
    width: imgWidth,
    height: imgHeight,
  });
  page.drawText("Name:", {
    x: 700,
    y: height - imgHeight - 180,
    size: 12,
    font: await pdfDoc.embedFont(StandardFonts.Helvetica),
    color: rgb(0, 0, 0),
  });
  page.drawText(users[1].name, {
    x: 800,
    y: height - imgHeight - 180,
    size: 12,
    font: await pdfDoc.embedFont(StandardFonts.Helvetica),
    color: rgb(0, 0, 0),
  });
  page.drawText("Address:", {
    x: 700,
    y: height - imgHeight - 210,
    size: 12,
    font: await pdfDoc.embedFont(StandardFonts.Helvetica),
    color: rgb(0, 0, 0),
  });
  page.drawText(users[1].address, {
    x: 800,
    y: height - imgHeight - 210,
    size: 12,
    font: await pdfDoc.embedFont(StandardFonts.Helvetica),
    color: rgb(0, 0, 0),
  });
  page.drawText("Cinc:", {
    x: 700,
    y: height - imgHeight - 240,
    size: 12,
    font: await pdfDoc.embedFont(StandardFonts.Helvetica),
    color: rgb(0, 0, 0),
  });
  page.drawText(users[1].cinc, {
    x: 800,
    y: height - imgHeight - 240,
    size: 12,
    font: await pdfDoc.embedFont(StandardFonts.Helvetica),
    color: rgb(0, 0, 0),
  });
  page.drawText("City:", {
    x: 700,
    y: height - imgHeight - 270,
    size: 12,
    font: await pdfDoc.embedFont(StandardFonts.Helvetica),
    color: rgb(0, 0, 0),
  });
  page.drawText(users[1].city, {
    x: 800,
    y: height - imgHeight - 270,
    size: 12,
    font: await pdfDoc.embedFont(StandardFonts.Helvetica),
    color: rgb(0, 0, 0),
  });
  page.drawText("Email:", {
    x: 700,
    y: height - imgHeight - 300,
    size: 12,
    font: await pdfDoc.embedFont(StandardFonts.Helvetica),
    color: rgb(0, 0, 0),
  });
  page.drawText(users[1].email, {
    x: 800,
    y: height - imgHeight - 300,
    size: 12,
    font: await pdfDoc.embedFont(StandardFonts.Helvetica),
    color: rgb(0, 0, 0),
  });
  page.drawText("Witness Information", {
    x: 100,
    y: height - imgHeight - 370,
    size: 14,
    font: await pdfDoc.embedFont(StandardFonts.Helvetica),
    color: rgb(0, 0, 0),
  });
  page.drawImage(Witnessimage, {
    x: 100,
    y: height - imgHeight - 540,
    width: imgWidth,
    height: imgHeight,
  });
  page.drawText("Name:", {
    x: 100,
    y: height - imgHeight - 570,
    size: 12,
    font: await pdfDoc.embedFont(StandardFonts.Helvetica),
    color: rgb(0, 0, 0),
  });
  page.drawText(witness.name, {
    x: 200,
    y: height - imgHeight - 570,
    size: 12,
    font: await pdfDoc.embedFont(StandardFonts.Helvetica),
    color: rgb(0, 0, 0),
  });
  page.drawText("Address:", {
    x: 100,
    y: height - imgHeight - 600,
    size: 12,
    font: await pdfDoc.embedFont(StandardFonts.Helvetica),
    color: rgb(0, 0, 0),
  });
  page.drawText(witness.address, {
    x: 200,
    y: height - imgHeight - 600,
    size: 12,
    font: await pdfDoc.embedFont(StandardFonts.Helvetica),
    color: rgb(0, 0, 0),
  });
  page.drawText("Land Information", {
    x: 700,
    y: height - imgHeight - 370,
    size: 14,
    font: await pdfDoc.embedFont(StandardFonts.Helvetica),
    color: rgb(0, 0, 0),
  });
  page.drawText("Owner Address:", {
    x: 700,
    y: height - imgHeight - 400,
    size: 12,
    font: await pdfDoc.embedFont(StandardFonts.Helvetica),
    color: rgb(0, 0, 0),
  });
  page.drawText(land[0]?.ownerAddress, {
    x: 800,
    y: height - imgHeight - 400,
    size: 12,
    font: await pdfDoc.embedFont(StandardFonts.Helvetica),
    color: rgb(0, 0, 0),
  });
  page.drawText("Land Address:", {
    x: 700,
    y: height - imgHeight - 430,
    size: 12,
    font: await pdfDoc.embedFont(StandardFonts.Helvetica),
    color: rgb(0, 0, 0),
  });
  page.drawText(land[0]?.landAddress, {
    x: 800,
    y: height - imgHeight - 430,
    size: 12,
    font: await pdfDoc.embedFont(StandardFonts.Helvetica),
    color: rgb(0, 0, 0),
  });
  page.drawText("Area Marla:", {
    x: 700,
    y: height - imgHeight - 460,
    size: 12,
    font: await pdfDoc.embedFont(StandardFonts.Helvetica),
    color: rgb(0, 0, 0),
  });
  page.drawText(land[0]?.area.toString(), {
    x: 800,
    y: height - imgHeight - 460,
    size: 12,
    font: await pdfDoc.embedFont(StandardFonts.Helvetica),
    color: rgb(0, 0, 0),
  });
  page.drawText("Land Price:", {
    x: 700,
    y: height - imgHeight - 490,
    size: 12,
    font: await pdfDoc.embedFont(StandardFonts.Helvetica),
    color: rgb(0, 0, 0),
  });
  page.drawText(land[0]?.landPrice.toString(), {
    x: 800,
    y: height - imgHeight - 490,
    size: 12,
    font: await pdfDoc.embedFont(StandardFonts.Helvetica),
    color: rgb(0, 0, 0),
  });
  page.drawText("Property Id:", {
    x: 700,
    y: height - imgHeight - 520,
    size: 12,
    font: await pdfDoc.embedFont(StandardFonts.Helvetica),
    color: rgb(0, 0, 0),
  });
  page.drawText(land[0]?.propertyPID.toString(), {
    x: 800,
    y: height - imgHeight - 520,
    size: 12,
    font: await pdfDoc.embedFont(StandardFonts.Helvetica),
    color: rgb(0, 0, 0),
  });
  page.drawText("Area Detail:", {
    x: 700,
    y: height - imgHeight - 550,
    size: 12,
    font: await pdfDoc.embedFont(StandardFonts.Helvetica),
    color: rgb(0, 0, 0),
  });
  page.drawText(land[0]?.physicalSurveyNumber, {
    x: 800,
    y: height - imgHeight - 550,
    size: 12,
    font: await pdfDoc.embedFont(StandardFonts.Helvetica),
    color: rgb(0, 0, 0),
  });
  
  const stampWidth = 150; // Adjust the size of the stamp image as needed
  const stampHeight = 130; // Adjust the size of the stamp image as needed
  const stampX = 800; // Adjust the X coordinate of the stamp image placement as needed
  const stampY = height - imgHeight - 750; // Adjust the Y coordinate of the stamp image placement as needed
  page.drawImage(StampImage, {
    x: stampX,
    y: stampY,
    width: stampWidth,
    height: stampHeight,
  });
  page.drawText("Verified By:", {
    x: 880,
    y: height - imgHeight - 680,
    size: 12,
    font: await pdfDoc.embedFont(StandardFonts.Helvetica),
    color: rgb(0, 0, 0),
  });
 
  page.drawText("TimeStamp:", {
    x: 800,
    y: height - imgHeight - 730,
    size: 12,
    font: await pdfDoc.embedFont(StandardFonts.Helvetica),
    color: rgb(0, 0, 0),
  });
  const date = new Date();
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  };
  const timestamp = date.toLocaleString('en-PK', options);
  page.drawText(timestamp, {
    x: 870,
    y: height - imgHeight - 730,
    size: 12,
    font: await pdfDoc.embedFont(StandardFonts.Helvetica),
    color: rgb(0, 0, 0),
  });
  page.drawText(insp, {
    x: 800,
    y: height - imgHeight - 700,
    size: 12,
    font: await pdfDoc.embedFont(StandardFonts.Helvetica),
    color: rgb(0, 0, 0),
  });
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
  // Download the PDF file
};
export default stopCapture;
