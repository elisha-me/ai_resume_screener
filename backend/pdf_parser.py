import pdfplumber

def extract_text(file_bytes) -> str:
    with pdfplumber.open(file_bytes) as pdf:
        text = ""
        for page in pdf.pages:
            text += page.extract_text() or ""
    return text.strip()
