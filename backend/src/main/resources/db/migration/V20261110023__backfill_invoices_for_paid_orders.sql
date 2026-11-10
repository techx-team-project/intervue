INSERT INTO invoices (order_id, number, issued_at, invoice_type, buyer_name, buyer_tax_id,
                      buyer_address, recipient_email, subtotal, discount_amount, vat_rate,
                      vat_amount, total_amount, currency, created_at, updated_at)
SELECT o.id,
       CONCAT('TMP-', o.id),
       COALESCE(o.paid_at, o.created_at),
       COALESCE(d.invoice_type, 'PERSONAL'),
       COALESCE(NULLIF(CASE WHEN d.invoice_type = 'BUSINESS' THEN d.company_name
                            ELSE d.full_name END, ''), 'Khach hang'),
       d.tax_id,
       CASE WHEN d.invoice_type = 'BUSINESS' THEN d.company_address ELSE d.personal_address END,
       COALESCE(d.recipient_email, ''),
       o.subtotal, o.discount_amount, o.vat_rate, o.vat_amount, o.total_amount, o.currency,
       NOW(), NOW()
FROM orders o
LEFT JOIN order_invoice_details d ON d.order_id = o.id
WHERE o.status IN ('PAID', 'FULFILLED', 'REFUND_REQUESTED', 'REFUNDED')
  AND NOT EXISTS (SELECT 1 FROM invoices i WHERE i.order_id = o.id);

UPDATE invoices
   SET number = CONCAT('INV-', YEAR(issued_at), '-', LPAD(id, 6, '0'))
 WHERE number LIKE 'TMP-%';
