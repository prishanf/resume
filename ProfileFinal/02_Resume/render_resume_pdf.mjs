import path from "node:path";
import { pathToFileURL } from "node:url";
import puppeteer from "puppeteer";

const cwd = process.cwd();
const inputHtml = path.resolve(cwd, "Prishan_Fernando_Resume.html");
const outputPdf = path.resolve(cwd, "Prishan_Fernando_Resume.pdf");

const browser = await puppeteer.launch({
  headless: "new",
});

try {
  const page = await browser.newPage();
  await page.setCacheEnabled(false);
  const url = `${pathToFileURL(inputHtml).toString()}?v=${Date.now()}`;
  await page.goto(url, {
    waitUntil: ["load", "networkidle0"],
  });

  await page.pdf({
    path: outputPdf,
    format: "Letter",
    printBackground: true,
    preferCSSPageSize: true,
  });

  // eslint-disable-next-line no-console
  console.log(`Wrote ${outputPdf}`);
} finally {
  await browser.close();
}

