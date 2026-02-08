/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs';
import path from 'path';
import { PDFDocument, rgb } from 'pdf-lib';
import { IGenerateReport } from './generateReport.interface';
import { uploadToS3 } from '@app/utils/s3';
import moment from 'moment';

const drawNeedle = async (pdfDoc: PDFDocument, page: any, score: any) => {
  const { width, height } = page.getSize();

  // Set the left part of the gauge as the center (Red Zone starts from here)
  const centerX = width / 3; // New X position (left part of the page)
  const centerY = height / 1.5; // Adjust the Y position (vertical position)

  // Needle length and size adjustments
  const needleLength = 80; // Length of the needle
  const needleWidth = 10; // Thickness of the needle

  // Define the rotation angle based on the score
  let needleAngle = 0;

  // Correct the score to needle angle mapping (left to right)
  if (score >= 1 && score <= 50) {
    // Red zone: score between 1 to 50, needle angle between 0° (left) to 90° (middle)
    needleAngle = (score / 50) * 90; // From 0° to 90° (left to right in the red zone)
  } else if (score <= 79) {
    // Yellow zone: score between 51 to 79, needle angle between 90° (middle) to 135° (right)
    needleAngle = ((score - 50) / 30) * 45 + 90; // From 90° to 135° (middle to right in the yellow zone)
  } else {
    // Green zone: score between 80 to 100, needle angle between 135° (middle) to 180° (right)
    needleAngle = ((score - 79) / 21) * 45 + 135; // From 135° to 180° (middle to right in the green zone)
  }

  // Convert the angle to radians (for trigonometric calculation)
  const needleAngleInRadians = (needleAngle * Math.PI) / 180;

  // Draw the needle (using a simple line)
  const needleX = centerX + needleLength * Math.cos(needleAngleInRadians);
  const needleY = centerY + needleLength * Math.sin(needleAngleInRadians);

  // Draw the needle as a line
  page.drawLine({
    start: { x: centerX, y: centerY },
    end: { x: needleX, y: needleY },
    color: rgb(0, 0, 0), // Needle color (black)
    thickness: needleWidth,
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
