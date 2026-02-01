import fs from 'fs';
import path from 'path';
import { PDFDocument, rgb } from 'pdf-lib';
import { IGenerateReport } from './generateReport.interface';
import { uploadToS3 } from '@app/utils/s3';
import moment from 'moment';

const drawNeedle = async (pdfDoc: PDFDocument, page, score) => {
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
const fillFreedomPdf = async (
  data: IGenerateReport,
): Promise<string | undefined> => {
  try {
    const date = moment().format('ll');
    const pdfPath = path.join(process.cwd(), 'freedom-report.pdf');

    if (!fs.existsSync(pdfPath)) {
      console.error('PDF file not found at:', pdfPath);
      return '';
    }

    const existingPdfBytes = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const form = pdfDoc.getForm();

    // Add the date
    form.getTextField('date').setText(date);

    // Add the name (no changes needed for name)
    form.getTextField('name').setText(data?.name);

    // Add the "$" sign for numeric fields
    form
      .getTextField('desired-annual-income')
      .setText(`$${data?.desiredAnnualIncome}`);
    form
      .getTextField('non-investment-annual-income')
      .setText(`$${data?.expectedNonInvestmentIncome}`);

    // Calculate the "required from your investments"
    const requiredInvestments =
      Number(data?.desiredAnnualIncome) -
      Number(data?.expectedNonInvestmentIncome);
    form
      .getTextField('required_from_your_investments')
      .setText(`$${requiredInvestments}`);

    form.getTextField('withdrawal_rate').setText(`${data?.withdrawalRate}%`);
    form.getTextField('withdrawal_rate_2').setText(`${data?.withdrawalRate}%`);

    // Calculate the "assets required assuming"
    const withdrawalRate = Number(data?.withdrawalRate) / 100;
    const assetsRequiredAssuming = requiredInvestments / withdrawalRate;

    form
      .getTextField('assets_required_assuming')
      .setText(`$${assetsRequiredAssuming.toFixed(0)}`);

    form
      .getTextField('wealth_outside')
      .setText(`$${data?.businessOwnershipOutlook}`);
    form
      .getTextField('outstanding_personal')
      .setText(`$${data?.personalDebts}`);

    const totalOutstandingDebt =
      Number(data?.businessOwnershipOutlook) + Number(data?.personalDebts);
    const gapToReachTheFreedomPoint =
      assetsRequiredAssuming - totalOutstandingDebt;

    form
      .getTextField('gap_to_reach_the_freedom_point')
      .setText(`$${gapToReachTheFreedomPoint.toFixed(0)}`);

    // For professional fees, employee retention, outstanding debt, etc.
    form
      .getTextField('professional_fees_and_commissions')
      .setText(`$${data?.professionalFees}`);
    form
      .getTextField('employee_thank_yous')
      .setText(`$${data?.employeeRetentionBonuses}`);
    form
      .getTextField('outstanding_debt_minus')
      .setText(`$${data?.outstandingDebtOnHand}`);

    // Set the ownership position (assuming this is a number, add "$" sign)
    // form.getTextField('ownership_position').setText(`$${data?.taxOnProceeds}`);

    // set second page data
    form.getTextField('ownership_stake').setText(`${data?.ownershipStake}%`);

    // calculate gross proceeds
    const remainingPercent = 100 - Number(data?.yourTaxes);
    const remainingDecimal = remainingPercent / 100;
    const grossProceeds = gapToReachTheFreedomPoint / remainingDecimal;
    const ownershipDecimal = Number(data?.ownershipStake) / 100;
    const finalGrossProceed = grossProceeds / ownershipDecimal;

    // calculate Gross Sale Price
    const grossSalePrice =
      finalGrossProceed +
      Number(data?.professionalFees) +
      Number(data?.employeeRetentionBonuses) +
      Number(data?.outstandingDebtOnHand);

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

    // set summary of report
    form
      .getTextField('your_freedom_point')
      .setText(`$${assetsRequiredAssuming.toFixed(0)}`);
    form
      .getTextField('gap_to_reach')
      .setText(`$${gapToReachTheFreedomPoint.toFixed(0)}`);
    form
      .getTextField('current_wealth')
      .setText(`$${data?.businessOwnershipOutlook}`);

    // set summary of details
    form.getTextField('withdrawal_rate_3').setText(`${data?.withdrawalRate}%,`);
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
      .getTextField('gap_to_reach_2')
      .setText(`$${gapToReachTheFreedomPoint.toFixed(0)}`);
    form
      .getTextField('your_freedom_point_3')
      .setText(`$${assetsRequiredAssuming.toFixed(0)}`);

    form.getTextField('last_name').setText(`$${data?.name}`);

    form
      .getTextField('current_wealth_2')
      .setText(`$${data?.businessOwnershipOutlook}`);

    // calculate score
    const score =
      (Number(data?.businessOwnershipOutlook) / assetsRequiredAssuming) * 100;
    form.getTextField('score').setText(`${score.toFixed(0)}`);

    //set score
    form.getTextField('score_name').setText(`${data?.name} by Steve DeTray`);
    // form.getTextField('score').setText(`${data?.score}`);

    const page = pdfDoc.getPages()[3]; // Assuming we want to draw on page 4
    // Draw the gauge and the needle based on the score
    await drawNeedle(pdfDoc, page, score);

    // Flatten the form fields to make them non-editable
    form.flatten();

    const pdfBytes = await pdfDoc.save();

    // Upload the generated PDF to S3
    const uploadSingle = await uploadToS3({
      file: pdfBytes,
      fileName: `psf/reports/Wealth_Gap_Report${Math.floor(100000 + Math.random() * 900000)}`,
      contentType: 'application/pdf',
    });

    // Save the filled PDF locally (optional)
    const newPdfPath = path.join(process.cwd(), 'filled_pdf.pdf');
    fs.writeFileSync(newPdfPath, pdfBytes);

    // Return the URL from S3
    // console.log('hello');
    return uploadSingle!;
  } catch (error) {
    console.error('Error filling PDF form:', error);
  }
};

export default fillFreedomPdf;
