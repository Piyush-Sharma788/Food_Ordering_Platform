import { IOrder } from '@/types';

export class ReceiptGenerator {
  /**
   * Generates a printable HTML template for the order receipt
   */
  public generateReceiptHtml(order: IOrder): string {
    const itemsHtml = order.items
      .map(
        (it) => `
        <tr>
          <td style="padding: 10px 8px; border-bottom: 1px solid #eeeeee;">${it.name}</td>
          <td style="padding: 10px 8px; border-bottom: 1px solid #eeeeee; text-align: center;">${it.quantity}</td>
          <td style="padding: 10px 8px; border-bottom: 1px solid #eeeeee; text-align: right;">Rs. ${it.price.toFixed(2)}</td>
          <td style="padding: 10px 8px; border-bottom: 1px solid #eeeeee; text-align: right;">Rs. ${(it.price * it.quantity).toFixed(2)}</td>
        </tr>`
      )
      .join('');

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Receipt - Order ${order.orderNumber}</title>
  <style>
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      margin: 0;
      padding: 40px;
      color: #111111;
      background: #ffffff;
    }
    .header {
      border-bottom: 2px solid #000000;
      padding-bottom: 20px;
      margin-bottom: 25px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .brand {
      font-size: 26px;
      font-weight: bold;
      letter-spacing: -0.5px;
    }
    .order-badge {
      font-size: 14px;
      background: #000000;
      color: #ffffff;
      padding: 6px 12px;
      border-radius: 4px;
      font-weight: 600;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 30px;
      font-size: 14px;
    }
    .table-container table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 25px;
      font-size: 14px;
    }
    .table-container th {
      background: #f4f4f4;
      text-align: left;
      padding: 10px 8px;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .totals {
      float: right;
      width: 280px;
      font-size: 14px;
      margin-top: 10px;
    }
    .totals-row {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
    }
    .totals-row.grand-total {
      border-top: 2px solid #000000;
      font-size: 18px;
      font-weight: bold;
      margin-top: 8px;
      padding-top: 10px;
    }
    .footer {
      clear: both;
      margin-top: 60px;
      padding-top: 20px;
      border-top: 1px dashed #cccccc;
      text-align: center;
      font-size: 12px;
      color: #666666;
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">Cd: Zaika</div>
      <div style="font-size: 13px; color: #555;">Campus Food Ordering & Management</div>
    </div>
    <div class="order-badge">ORDER #${order.orderNumber}</div>
  </div>

  <div class="info-grid">
    <div>
      <strong>Order Details:</strong><br />
      Date: ${new Date(order.createdAt).toLocaleString()}<br />
      Restaurant: ${order.restaurantName}<br />
      Delivery Mode: ${order.deliveryType === 'pickup' ? 'Campus Counter Pickup' : 'Campus Room Delivery'}<br />
      Estimated Preparation: ~${order.estimatedPrepTimeMinutes} minutes
    </div>
    <div style="text-align: right;">
      <strong>Student / Customer:</strong><br />
      Student ID: ${order.studentId}<br />
      Payment Status: <span style="text-transform: uppercase;">${order.paymentStatus}</span> (${order.paymentMethod})<br />
      Status: <span style="text-transform: uppercase; font-weight: bold;">${order.status}</span>
    </div>
  </div>

  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th>Item</th>
          <th style="text-align: center;">Qty</th>
          <th style="text-align: right;">Unit Price</th>
          <th style="text-align: right;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
    </table>
  </div>

  <div class="totals">
    <div class="totals-row">
      <span>Subtotal:</span>
      <span>Rs. ${order.subtotal.toFixed(2)}</span>
    </div>
    <div class="totals-row">
      <span>Campus Convenience Tax:</span>
      <span>Rs. ${order.tax.toFixed(2)}</span>
    </div>
    <div class="totals-row">
      <span>Delivery Fee:</span>
      <span>Rs. ${order.deliveryFee.toFixed(2)}</span>
    </div>
    <div class="totals-row grand-total">
      <span>Total Paid:</span>
      <span>Rs. ${order.totalPrice.toFixed(2)}</span>
    </div>
  </div>

  <div class="footer">
    Thank you for ordering with Cd: Zaika! Show this digital receipt at the counter when your food is ready.
  </div>
</body>
</html>`;
  }

  /**
   * Renders the receipt as a PDF Buffer using Puppeteer
   */
  public async generatePdfReceipt(order: IOrder): Promise<Buffer> {
    const html = this.generateReceiptHtml(order);

    try {
      // Dynamic import to avoid build-time static evaluation
      const puppeteerModule = await import('puppeteer');
      const puppeteer = puppeteerModule.default || puppeteerModule;

      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
      });

      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'domcontentloaded', timeout: 15000 });
      const pdfUint8Array = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' },
      });

      await browser.close();
      return Buffer.from(pdfUint8Array);
    } catch (err) {
      console.warn('Puppeteer launch failed (fallback to HTML buffer):', err);
      // Return HTML as buffer if Chromium is unavailable in container/sandbox
      return Buffer.from(html, 'utf-8');
    }
  }
}

export const receiptGenerator = new ReceiptGenerator();
export default receiptGenerator;
