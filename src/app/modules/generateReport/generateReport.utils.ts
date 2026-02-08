/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs';
import path from 'path';
import { PDFDocument, rgb } from 'pdf-lib';
import { IGenerateReport } from './generateReport.interface';
import { uploadToS3 } from '@app/utils/s3';
import moment from 'moment';

export const drawNeedle = async (
  pdfDoc: PDFDocument,
  page: any,
  score: number,
) => {
  const { width, height } = page.getSize();

  // Where the gauge center is (tune if needed)
  const centerX = width / 3;
  const centerY = height / 1.5;

  const needleLength = 80;
  const needleWidth = 8; // a bit thinner looks closer to your expectation

  // 1) Clamp score to 0..100
  const s = Math.max(0, Math.min(100, Number(score) || 0));

  // 2) Convert score -> angle (degrees)
  // Coordinate system:
  // 180° = left, 90° = up, 0° = right
  let angleDeg = 90;

  if (s <= 49) {
    // RED: 0..49 maps 180° -> 90°
    // (LEFT to UP)
    const t = s / 49; // 0..1
    angleDeg = 180 - t * 90;
  } else if (s <= 79) {
    // YELLOW: 50..79 maps 90° -> 45°
    // (UP to slightly right)
    const t = (s - 50) / (79 - 50); // 0..1
    angleDeg = 90 - t * 45;
  } else {
    // GREEN: 80..100 maps 45° -> 0°
    // (right-ish to RIGHT end)
    const t = (s - 80) / (100 - 80); // 0..1
    angleDeg = 45 - t * 45;
  }

  // 3) Degrees -> radians
  const rad = (angleDeg * Math.PI) / 180;

  // 4) Needle endpoint
  const needleX = centerX + needleLength * Math.cos(rad);
  const needleY = centerY + needleLength * Math.sin(rad);

  // 5) Draw needle
  page.drawLine({
    start: { x: centerX, y: centerY },
    end: { x: needleX, y: needleY },
    color: rgb(0, 0, 0),
    thickness: needleWidth,
  });

  // Optional: draw a small center dot (looks like your expected gauge)
  page.drawCircle({
    x: centerX,
    y: centerY,
    size: 6,
    color: rgb(0.45, 0.45, 0.45),
  });
};

type UploadResult = {
  uploadSingle: string;
  uploadPage: string;
};

/* -------------------------------------------
   Currency formatter (adds comma automatically)
-------------------------------------------- */
const formatUSD = (value: number | string): string => {
  const num = Number(value || 0);
  return `$${num.toLocaleString('en-US', {
    maximumFractionDigits: 0,
  })}`;
};

export const fillFreedomPdf = async (
  data: IGenerateReport,
): Promise<UploadResult | undefined> => {
  try {
    const date = moment().format('ll');
    const pdfPath = path.join(process.cwd(), 'freedom-report.pdf');

    if (!fs.existsSync(pdfPath)) {
      console.error('PDF file not found at:', pdfPath);
      return;
    }

    const existingPdfBytes = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const form = pdfDoc.getForm();

    /* ---------- Page 1 ---------- */
    form.getTextField('date').setText(date);
    form.getTextField('name').setText(data?.name ?? '');

    const desiredAnnualIncome = Number(data?.desiredAnnualIncome || 0);
    const nonInvestmentIncome = Number(data?.expectedNonInvestmentIncome || 0);

    form
      .getTextField('desired-annual-income')
      .setText(formatUSD(desiredAnnualIncome));
    form
      .getTextField('non-investment-annual-income')
      .setText(formatUSD(nonInvestmentIncome));

    const requiredInvestments = desiredAnnualIncome - nonInvestmentIncome;

    form
      .getTextField('required_from_your_investments')
      .setText(formatUSD(requiredInvestments));

    const withdrawalRatePercent = Number(data?.withdrawalRate || 0);
    const withdrawalRate = withdrawalRatePercent / 100;

    form.getTextField('withdrawal_rate').setText(`${withdrawalRatePercent}%`);
    form.getTextField('withdrawal_rate_2').setText(`${withdrawalRatePercent}%`);

    const assetsRequiredAssuming =
      withdrawalRate === 0 ? 0 : requiredInvestments / withdrawalRate;

    form
      .getTextField('assets_required_assuming')
      .setText(formatUSD(assetsRequiredAssuming));

    const currentWealth = Number(data?.businessOwnershipOutlook || 0);
    const personalDebts = Number(data?.personalDebts || 0);

    form.getTextField('wealth_outside').setText(formatUSD(currentWealth));
    form.getTextField('outstanding_personal').setText(formatUSD(personalDebts));

    const gapToReachTheFreedomPoint =
      assetsRequiredAssuming - (currentWealth + personalDebts);

    form
      .getTextField('gap_to_reach_the_freedom_point')
      .setText(formatUSD(gapToReachTheFreedomPoint));

    /* ---------- Page 2 ---------- */
    const professionalFees = Number(data?.professionalFees || 0);
    const employeeBonuses = Number(data?.employeeRetentionBonuses || 0);
    const outstandingDebt = Number(data?.outstandingDebtOnHand || 0);

    form
      .getTextField('professional_fees_and_commissions')
      .setText(formatUSD(professionalFees));
    form
      .getTextField('employee_thank_yous')
      .setText(formatUSD(employeeBonuses));
    form
      .getTextField('outstanding_debt_minus')
      .setText(formatUSD(outstandingDebt));

    const ownershipStakePercent = Number(data?.ownershipStake || 0);
    const ownershipDecimal = ownershipStakePercent / 100;

    form.getTextField('ownership_stake').setText(`${ownershipStakePercent}%`);

    const taxPercent = Number(data?.yourTaxes || 0);
    const remainingDecimal = (100 - taxPercent) / 100;

    const grossProceeds =
      remainingDecimal === 0 ? 0 : gapToReachTheFreedomPoint / remainingDecimal;

    const finalGrossProceed =
      ownershipDecimal === 0 ? 0 : grossProceeds / ownershipDecimal;

    const grossSalePrice =
      finalGrossProceed + professionalFees + employeeBonuses + outstandingDebt;

    form.getTextField('gross_sale_price').setText(formatUSD(grossSalePrice));
    form.getTextField('gross_sale_price_2').setText(formatUSD(grossSalePrice));

    form.getTextField('subtotal').setText(formatUSD(finalGrossProceed));
    form.getTextField('gross_proceeds').setText(formatUSD(finalGrossProceed));

    form
      .getTextField('ownership_position')
      .setText(formatUSD(finalGrossProceed - gapToReachTheFreedomPoint));

    form
      .getTextField('net_proceeds')
      .setText(formatUSD(gapToReachTheFreedomPoint));

    /* ---------- Summary ---------- */
    form
      .getTextField('your_freedom_point')
      .setText(formatUSD(assetsRequiredAssuming));
    form
      .getTextField('gap_to_reach')
      .setText(formatUSD(gapToReachTheFreedomPoint));
    form.getTextField('current_wealth').setText(formatUSD(currentWealth));

    form
      .getTextField('withdrawal_rate_3')
      .setText(`${withdrawalRatePercent}%,`);
    form
      .getTextField('your_freedom_point_2')
      .setText(formatUSD(assetsRequiredAssuming));
    form
      .getTextField('required_from_your_investments_2')
      .setText(formatUSD(requiredInvestments));
    form
      .getTextField('gap_to_reach_2')
      .setText(formatUSD(gapToReachTheFreedomPoint));
    form
      .getTextField('your_freedom_point_3')
      .setText(formatUSD(assetsRequiredAssuming));

    form.getTextField('last_name').setText(data?.name ?? '');
    form.getTextField('current_wealth_2').setText(formatUSD(currentWealth));

    /* ---------- Score ---------- */
    const score =
      assetsRequiredAssuming === 0
        ? 0
        : (currentWealth / assetsRequiredAssuming) * 100;

    form.getTextField('score').setText(score.toFixed(0));
    form
      .getTextField('score_name')
      .setText(`${data?.name ?? ''} by Steve DeTray`);

    /* ---------- Gauge ---------- */
    const page4Index = 3;
    const page4 = pdfDoc.getPages()[page4Index];
    await drawNeedle(pdfDoc, page4, score);

    form.flatten();

    /* ---------- Save PDFs ---------- */
    const fullPdfBytes = await pdfDoc.save();

    const singlePageDoc = await PDFDocument.create();
    const [copiedPage4] = await singlePageDoc.copyPages(pdfDoc, [page4Index]);
    singlePageDoc.addPage(copiedPage4);
    const page4PdfBytes = await singlePageDoc.save();

    const uploadSingle = await uploadToS3({
      file: fullPdfBytes,
      fileName: `psf/reports/Wealth_Gap_Report_${Date.now()}.pdf`,
      contentType: 'application/pdf',
    });

    const uploadPage = await uploadToS3({
      file: page4PdfBytes,
      fileName: `psf/reports/Wealth_Gap_Report_Page4_${Date.now()}.pdf`,
      contentType: 'application/pdf',
    });

    return {
      uploadSingle: uploadSingle!,
      uploadPage: uploadPage!,
    };
  } catch (error) {
    console.error('Error filling PDF form:', error);
    return;
  }
};

export default fillFreedomPdf;
