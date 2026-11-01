import io
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable


class ReceiptGenerator:
    def generate_pdf(self, order) -> bytes:
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=A4,
            leftMargin=36,
            rightMargin=36,
            topMargin=36,
            bottomMargin=36
        )

        elements = []
        styles = getSampleStyleSheet()

        brand_style = ParagraphStyle(
            'BrandTitle',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=24,
            leading=28,
            textColor=colors.black
        )

        sub_style = ParagraphStyle(
            'SubText',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=10,
            leading=13,
            textColor=colors.HexColor('#555555')
        )

        header_data = [
            [
                Paragraph("<b>Cd: Zaika</b><br/><font size=9 color='#555555'>Campus Food Ordering & Management</font>", brand_style),
                Paragraph(f"<font size=12><b>ORDER #{order.order_number}</b></font><br/><font size=9 color='#0d9488'><b>STATUS: {order.get_status_display().upper()}</b></font>", ParagraphStyle('RightH', alignment=2, fontName='Helvetica'))
            ]
        ]
        header_table = Table(header_data, colWidths=[320, 200])
        header_table.setStyle(TableStyle([
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
        ]))
        elements.append(header_table)
        elements.append(HRFlowable(width="100%", thickness=2, color=colors.black, spaceBefore=4, spaceAfter=14))

        # Order Details info grid
        info_left = (
            f"<b>Restaurant:</b> {order.restaurant_name}<br/>"
            f"<b>Date:</b> {order.created_at.strftime('%b %d, %Y - %I:%M %p')}<br/>"
            f"<b>Fulfillment:</b> {order.get_delivery_type_display()}<br/>"
            f"<b>Location:</b> {order.delivery_location}"
        )
        info_right = (
            f"<b>Student ID:</b> {order.student_id}<br/>"
            f"<b>Estimated Kitchen Prep:</b> ~{order.estimated_prep_time_minutes} minutes<br/>"
            f"<b>Payment Status:</b> {order.get_payment_status_display().upper()} ({order.payment_method})<br/>"
            f"<b>Customer:</b> {order.user.get_full_name() or order.user.username}"
        )

        info_data = [
            [Paragraph(info_left, sub_style), Paragraph(info_right, sub_style)]
        ]
        info_table = Table(info_data, colWidths=[260, 260])
        info_table.setStyle(TableStyle([
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f9fafb')),
            ('PADDING', (0, 0), (-1, -1), 10),
            ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#e5e7eb')),
        ]))
        elements.append(info_table)
        elements.append(Spacer(1, 16))

        # Items Table
        items_data = [
            [
                Paragraph("<b>Item Description</b>", sub_style),
                Paragraph("<b>Qty</b>", ParagraphStyle('C', alignment=1, fontName='Helvetica-Bold', fontSize=9)),
                Paragraph("<b>Unit Price</b>", ParagraphStyle('R', alignment=2, fontName='Helvetica-Bold', fontSize=9)),
                Paragraph("<b>Amount</b>", ParagraphStyle('R', alignment=2, fontName='Helvetica-Bold', fontSize=9))
            ]
        ]

        for it in order.items.all():
            items_data.append([
                Paragraph(f"<b>{it.name}</b>", sub_style),
                Paragraph(str(it.quantity), ParagraphStyle('C', alignment=1, fontSize=9)),
                Paragraph(f"Rs. {it.price:.2f}", ParagraphStyle('R', alignment=2, fontSize=9)),
                Paragraph(f"Rs. {it.item_total:.2f}", ParagraphStyle('R', alignment=2, fontSize=9, fontName='Helvetica-Bold'))
            ])

        items_table = Table(items_data, colWidths=[270, 50, 100, 100])
        items_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#f3f4f6')),
            ('LINEBELOW', (0, 0), (-1, -1), 0.5, colors.HexColor('#e5e7eb')),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ]))
        elements.append(items_table)
        elements.append(Spacer(1, 14))

        # Totals block
        totals_data = [
            ["", Paragraph("Items Subtotal:", ParagraphStyle('T', alignment=2, fontSize=9)), f"Rs. {order.subtotal:.2f}"],
            ["", Paragraph("Campus Tax (5%):", ParagraphStyle('T', alignment=2, fontSize=9)), f"Rs. {order.tax:.2f}"],
            ["", Paragraph("Delivery Fee:", ParagraphStyle('T', alignment=2, fontSize=9)), f"Rs. {order.delivery_fee:.2f}"],
            ["", Paragraph("<b>GRAND TOTAL:</b>", ParagraphStyle('T', alignment=2, fontSize=11, fontName='Helvetica-Bold')), f"Rs. {order.total_price:.2f}"],
        ]
        totals_table = Table(totals_data, colWidths=[270, 130, 120])
        totals_table.setStyle(TableStyle([
            ('ALIGN', (2, 0), (2, -1), 'RIGHT'),
            ('FONTNAME', (2, -1), (2, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (2, -1), (2, -1), 11),
            ('LINEABOVE', (1, -1), (2, -1), 1.5, colors.black),
            ('PADDING', (0, 0), (-1, -1), 4),
        ]))
        elements.append(totals_table)

        # Footer notes
        elements.append(Spacer(1, 24))
        elements.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#cccccc'), spaceBefore=6, spaceAfter=10))
        elements.append(Paragraph(
            "<font size=8 color='#666666'>Show this digital receipt at the counter or to your campus courier when your food is ready.<br/>"
            "Cd: Zaika — Campus Food Platform. Inquiries: cd.ugi@gmail.com | Phone: (+91) 8400976494</font>",
            ParagraphStyle('F', alignment=1, leading=11)
        ))

        doc.build(elements)
        pdf_data = buffer.getvalue()
        buffer.close()
        return pdf_data


receipt_generator = ReceiptGenerator()

