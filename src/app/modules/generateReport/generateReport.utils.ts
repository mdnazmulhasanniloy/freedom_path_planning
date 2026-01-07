import fs from 'fs';
import path from 'path';
import { PDFDocument } from 'pdf-lib';
import { IGenerateReport } from './generateReport.interface';
import { uploadToS3 } from '@app/utils/s3';

const fillFreedomPdf = async (data: IGenerateReport): Promise<void> => {
  try {
    const pdfPath = path.join(process.cwd(), 'freedom-report.pdf');
    console.log('Looking for PDF at:', pdfPath);

   
    if (!fs.existsSync(pdfPath)) {
      console.error('PDF file not found at:', pdfPath);
      return;
    }

    const existingPdfBytes = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const form = pdfDoc.getForm();

    
    form.getTextField('name').setText(data.name);
    form
      .getTextField('desired-annual-income')
      .setText(data.desiredAnnualIncome);
    form
      .getTextField('non-investment-annual-income')
      .setText(data.expectedNonInvestmentIncome);
    form.getTextField('wealth_outside').setText(data.businessOwnershipOutlook);
    form.getTextField('outstanding_personal').setText(data.personalDebts);
    form
      .getTextField('professional_fees_and_commissions')
      .setText(data.professionalFees);
    form
      .getTextField('employee_thank_yous')
      .setText(data.employeeRetentionBonuses);
    form
      .getTextField('outstanding_debt_minus')
      .setText(data.outstandingDebtOnHand);
    form.getTextField('ownership_position').setText(data.taxOnProceeds);

   
    form.flatten();

 
    const pdfBytes = await pdfDoc.save();

    const uploadSingle = await uploadToS3({
      file: pdfBytes,
      fileName: `psf/reports/${Math.floor(100000 + Math.random() * 900000)}`,
      contentType: 'application/pdf',
    });

    console.log(uploadSingle)
    const newPdfPath = path.join(process.cwd(), 'filled_pdf.pdf');
    fs.writeFileSync(newPdfPath, pdfBytes);

    console.log('PDF filled and saved to', newPdfPath);
  } catch (error) {
    console.error('Error filling PDF form:', error);
  }
};

export default fillFreedomPdf;
