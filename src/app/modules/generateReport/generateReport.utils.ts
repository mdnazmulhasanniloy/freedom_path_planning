import fs from 'fs';
import path from 'path';
import { PDFDocument } from 'pdf-lib';
import { IGenerateReport } from './generateReport.interface';
import { uploadToS3 } from '@app/utils/s3';
import moment from 'moment';

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

    console.log(data?.withdrawalRate);

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
    form
      .getTextField('required_from_your_investments')
      .setText(
        `$${Number(data?.desiredAnnualIncome) - Number(data?.expectedNonInvestmentIncome)}`,
      );
    form.getTextField('withdrawal_rate').setText(`${data?.withdrawalRate}%`);
    form
      .getTextField('wealth_outside')
      .setText(`$${data?.businessOwnershipOutlook}`);
    form
      .getTextField('outstanding_personal')
      .setText(`$${data?.personalDebts}`);

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
    form.getTextField('ownership_position').setText(`$${data?.taxOnProceeds}`);

    form.getTextField('last_name').setText(`$${data?.name}`);

    // form.getTextField('last_name').setText(`$${data.name}`);

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
