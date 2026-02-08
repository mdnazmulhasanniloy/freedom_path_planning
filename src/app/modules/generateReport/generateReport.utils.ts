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

    // -------- page fill logic (same as yours) --------
    form.getTextField('date').setText(date);
    form.getTextField('name').setText(data?.name ?? '');

    form
      .getTextField('desired-annual-income')
      .setText(`$${Number(data?.desiredAnnualIncome || 0)}`);
    form
      .getTextField('non-investment-annual-income')
      .setText(`$${Number(data?.expectedNonInvestmentIncome || 0)}`);

    const requiredInvestments =
      Number(data?.desiredAnnualIncome || 0) -
      Number(data?.expectedNonInvestmentIncome || 0);

    form
      .getTextField('required_from_your_investments')
      .setText(`$${requiredInvestments}`);

    form
      .getTextField('withdrawal_rate')
      .setText(`${Number(data?.withdrawalRate || 0)}%`);
    form
      .getTextField('withdrawal_rate_2')
      .setText(`${Number(data?.withdrawalRate || 0)}%`);

    const withdrawalRate = Number(data?.withdrawalRate || 0) / 100;
    const assetsRequiredAssuming =
      withdrawalRate === 0 ? 0 : requiredInvestments / withdrawalRate;

    form
      .getTextField('assets_required_assuming')
      .setText(`$${assetsRequiredAssuming.toFixed(0)}`);

    form
      .getTextField('wealth_outside')
      .setText(`$${Number(data?.businessOwnershipOutlook || 0)}`);
    form
      .getTextField('outstanding_personal')
      .setText(`$${Number(data?.personalDebts || 0)}`);

    const totalOutstandingDebt =
      Number(data?.businessOwnershipOutlook || 0) +
      Number(data?.personalDebts || 0);

    const gapToReachTheFreedomPoint =
      assetsRequiredAssuming - totalOutstandingDebt;

    form
      .getTextField('gap_to_reach_the_freedom_point')
      .setText(`$${gapToReachTheFreedomPoint.toFixed(0)}`);

    form
      .getTextField('professional_fees_and_commissions')
      .setText(`$${Number(data?.professionalFees || 0)}`);
    form
      .getTextField('employee_thank_yous')
      .setText(`$${Number(data?.employeeRetentionBonuses || 0)}`);
    form
      .getTextField('outstanding_debt_minus')
      .setText(`$${Number(data?.outstandingDebtOnHand || 0)}`);

    // second page fields
    form
      .getTextField('ownership_stake')
      .setText(`${Number(data?.ownershipStake || 0)}%`);

    const remainingPercent = 100 - Number(data?.yourTaxes || 0);
    const remainingDecimal = remainingPercent / 100;

    const grossProceeds =
      remainingDecimal === 0 ? 0 : gapToReachTheFreedomPoint / remainingDecimal;

    const ownershipDecimal = Number(data?.ownershipStake || 0) / 100;
    const finalGrossProceed =
      ownershipDecimal === 0 ? 0 : grossProceeds / ownershipDecimal;

    const grossSalePrice =
      finalGrossProceed +
      Number(data?.professionalFees || 0) +
      Number(data?.employeeRetentionBonuses || 0) +
      Number(data?.outstandingDebtOnHand || 0);

    form
      .getTextField('gross_sale_price')
      .setText(`$${grossSalePrice.toFixed(0)}`);
    form
      .getTextField('gross_sale_price_2')
      .setText(`$${grossSalePrice.toFixed(0)}`);

    form.getTextField('subtotal').setText(`$${finalGrossProceed.toFixed(0)}`);
    form
      .getTextField('gross_proceeds')
      .setText(`$${finalGrossProceed.toFixed(0)}`);

    form
      .getTextField('ownership_position')
      .setText(
        `$${(finalGrossProceed - gapToReachTheFreedomPoint).toFixed(0)}`,
      );

    form
      .getTextField('net_proceeds')
      .setText(`$${gapToReachTheFreedomPoint.toFixed(0)}`);

    form
      .getTextField('your_freedom_point')
      .setText(`$${assetsRequiredAssuming.toFixed(0)}`);
    form
      .getTextField('gap_to_reach')
      .setText(`$${gapToReachTheFreedomPoint.toFixed(0)}`);
    form
      .getTextField('current_wealth')
      .setText(`$${Number(data?.businessOwnershipOutlook || 0)}`);

    form
      .getTextField('withdrawal_rate_3')
      .setText(`${Number(data?.withdrawalRate || 0)}%,`);
    form
      .getTextField('your_freedom_point_2')
      .setText(`$${assetsRequiredAssuming.toFixed(0)}`);
    form
      .getTextField('required_from_your_investments_2')
      .setText(`$${requiredInvestments}`);
    form
      .getTextField('gap_to_reach_2')
      .setText(`$${gapToReachTheFreedomPoint.toFixed(0)}`);
    form
      .getTextField('your_freedom_point_3')
      .setText(`$${assetsRequiredAssuming.toFixed(0)}`);

    // ⚠️ your code had "$" and uses last_name field weirdly:
    // If it's really last name, don't prefix with "$"
    form.getTextField('last_name').setText(`${data?.name ?? ''}`);

    form
      .getTextField('current_wealth_2')
      .setText(`$${Number(data?.businessOwnershipOutlook || 0)}`);

    // score
    const score =
      assetsRequiredAssuming === 0
        ? 0
        : (Number(data?.businessOwnershipOutlook || 0) /
            assetsRequiredAssuming) *
          100;

    form.getTextField('score').setText(`${score.toFixed(0)}`);
    form
      .getTextField('score_name')
      .setText(`${data?.name ?? ''} by Steve DeTray`);

    // Draw needle on 4th page (index 3)
    const page4Index = 3;
    const page4 = pdfDoc.getPages()[page4Index];
    await drawNeedle(pdfDoc, page4, score);

    // flatten so the extracted page is also “final”
    form.flatten();

    // --------- 1) Save FULL PDF bytes ----------
    const fullPdfBytes = await pdfDoc.save();

    // --------- 2) Extract ONLY page 4 ----------
    const singlePageDoc = await PDFDocument.create();
    const [copiedPage4] = await singlePageDoc.copyPages(pdfDoc, [page4Index]);
    singlePageDoc.addPage(copiedPage4);

    const page4PdfBytes = await singlePageDoc.save();

    // --------- 3) Upload BOTH ----------
    const uploadSingle = await uploadToS3({
      file: fullPdfBytes,
      fileName: `psf/reports/Wealth_Gap_Report_${Math.floor(
        100000 + Math.random() * 900000,
      )}.pdf`,
      contentType: 'application/pdf',
    });

    const uploadPage = await uploadToS3({
      file: page4PdfBytes,
      fileName: `psf/reports/Wealth_Gap_Report_Page4_${Math.floor(
        100000 + Math.random() * 900000,
      )}.pdf`,
      contentType: 'application/pdf',
    });

    // Optional local saves
    fs.writeFileSync(
      path.join(process.cwd(), 'filled_pdf_full.pdf'),
      fullPdfBytes,
    );
    fs.writeFileSync(
      path.join(process.cwd(), 'filled_pdf_page4.pdf'),
      page4PdfBytes,
    );

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
