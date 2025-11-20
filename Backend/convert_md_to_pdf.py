import markdown2
from fpdf import FPDF

md_path = 'backend_setup_instructions.md'
pdf_path = 'backend_setup_instructions.pdf'

with open(md_path, 'r', encoding='utf-8') as f:
    md_content = f.read()

html = markdown2.markdown(md_content)

class PDF(FPDF):
    def header(self):
        self.set_font('Arial', 'B', 14)
        self.cell(0, 10, 'Restaurant Ordering System Backend Setup Guide', ln=True, align='C')
        self.ln(10)

    def chapter_body(self, html):
        self.set_font('Arial', '', 12)
        # Remove HTML tags for simplicity
        import re
        text = re.sub('<[^<]+?>', '', html)
        self.multi_cell(0, 10, text)

pdf = PDF()
pdf.add_page()
pdf.chapter_body(html)
pdf.output(pdf_path)
print(f'PDF generated: {pdf_path}')
