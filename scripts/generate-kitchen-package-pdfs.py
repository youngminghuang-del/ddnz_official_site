from pathlib import Path
from io import BytesIO

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.lib.utils import ImageReader
from reportlab.pdfgen import canvas
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "downloads"

INK = colors.HexColor("#132239")
MUTED = colors.HexColor("#58677a")
PURPLE = colors.HexColor("#71339a")
CORAL = colors.HexColor("#c94727")
BLUE = colors.HexColor("#24708a")
PAPER = colors.HexColor("#fbfaf7")
PANEL = colors.HexColor("#eef2f3")
LINE = colors.HexColor("#c9d1d5")
TOTAL_PAGES = 8

ISOMETRICS = {
    "ddnz-takeaway-qsr-kitchen-package.pdf": ROOT / "public/images/restaurant-kitchen-packages/qsr-isometric-concept-v1.webp",
    "ddnz-cafe-light-meals-kitchen-package.pdf": ROOT / "public/images/restaurant-kitchen-packages/cafe-isometric-concept-v1.webp",
    "ddnz-casual-dining-kitchen-package.pdf": ROOT / "public/images/restaurant-kitchen-packages/casual-isometric-concept-v1.webp",
}


SCENARIOS = [
    {
        "slug": "ddnz-takeaway-qsr-kitchen-package.pdf",
        "tab": "Takeaway + QSR",
        "subtitle": "48 sqm | 80 to 140 peak orders per hour",
        "title": "Straight production flow for fried, grilled and delivery-led menus",
        "size": "8,000 x 6,000 mm",
        "aisle": "1,200 mm clear working aisle",
        "crew": "5 to 8 opening crew",
        "summary": "Receiving and cold holding feed preparation, preparation feeds one hot line, and the pass faces pickup. Dirty ware returns on the opposite side.",
        "rooms": [
            (0.02, 0.02, 0.25, 0.25, "RECEIVE + COLD"),
            (0.02, 0.30, 0.25, 0.48, "PREP"),
            (0.29, 0.02, 0.68, 0.43, "COOK LINE"),
            (0.68, 0.48, 0.29, 0.30, "WASH"),
            (0.29, 0.80, 0.68, 0.17, "PASS + PICKUP"),
        ],
        "equipment_blocks": [
            ("E04", 0.05, 0.08, 0.12, 0.13), ("E03", 0.05, 0.38, 0.18, 0.12),
            ("E01", 0.44, 0.11, 0.10, 0.13), ("E02", 0.56, 0.11, 0.12, 0.13),
            ("E05", 0.41, 0.06, 0.31, 0.04), ("E06", 0.72, 0.55, 0.21, 0.12),
            ("E07", 0.84, 0.84, 0.08, 0.10),
        ],
        "flows": [
            (CORAL, [(0.00, 0.10), (0.18, 0.22), (0.22, 0.48), (0.45, 0.50), (0.55, 0.27), (0.73, 0.27), (0.78, 0.86)]),
            (PURPLE, [(0.35, 0.94), (0.35, 0.67), (0.45, 0.48), (0.60, 0.38)]),
            (BLUE, [(0.99, 0.90), (0.92, 0.84), (0.84, 0.70)]),
        ],
        "equipment": [
            ("E01", "Double fryer", "800 x 700", "Two independent tanks"),
            ("E02", "Electric griddle", "900 x 700", "Flat top with splash guards"),
            ("E03", "Refrigerated prep counter", "1500 x 700", "Ingredient rail and GN pans"),
            ("E04", "Upright chiller", "740 x 870", "Rear receiving side"),
            ("E05", "Extraction hood", "2400 x 1100", "Above fryer and griddle"),
            ("E06", "Two-bowl sink + bench", "1800 x 700", "Dirty return side"),
            ("E07", "Ice machine", "500 x 600", "Pickup beverage point"),
        ],
        "utilities": ["380V / 3P cooking option", "Drain at wash and prep", "Fresh air and extraction review", "Hot water at warewash"],
        "packages": [
            ("Lean launch", "Core cooking, cold holding, preparation and washing."),
            ("Balanced", "Adds faster recovery and backup cold capacity."),
            ("High output", "Parallel frying and preparation for delivery peaks."),
        ],
    },
    {
        "slug": "ddnz-cafe-light-meals-kitchen-package.pdf",
        "tab": "Cafe + Light Meals",
        "subtitle": "60 sqm | 35 seats | beverage-led service",
        "title": "L-shaped service bar with coffee, ice and cold prep within reach",
        "size": "8,000 x 7,500 mm",
        "aisle": "1,100 mm bar aisle",
        "crew": "4 to 6 opening crew",
        "summary": "Customers move along display and payment. Staff work inside the bar triangle while receiving and washing remain behind the service line.",
        "rooms": [
            (0.02, 0.02, 0.29, 0.27, "STORE + RECEIVE"),
            (0.33, 0.02, 0.32, 0.27, "WASH + BACK PREP"),
            (0.67, 0.02, 0.30, 0.62, "BEVERAGE BAR"),
            (0.02, 0.31, 0.63, 0.66, "CUSTOMER + SEATING"),
            (0.67, 0.66, 0.30, 0.31, "DISPLAY + POS"),
        ],
        "equipment_blocks": [
            ("E07", 0.38, 0.10, 0.23, 0.12), ("E03", 0.71, 0.10, 0.22, 0.12),
            ("E02", 0.84, 0.29, 0.08, 0.12), ("E04", 0.71, 0.29, 0.09, 0.11),
            ("E01", 0.71, 0.48, 0.14, 0.12), ("E06", 0.86, 0.48, 0.08, 0.12),
            ("E05", 0.71, 0.75, 0.22, 0.12),
        ],
        "flows": [
            (CORAL, [(0.00, 0.11), (0.27, 0.22), (0.55, 0.28), (0.77, 0.47), (0.80, 0.76)]),
            (PURPLE, [(0.64, 0.60), (0.79, 0.59), (0.86, 0.47), (0.84, 0.28)]),
            (BLUE, [(0.67, 0.83), (0.62, 0.62), (0.49, 0.24)]),
        ],
        "equipment": [
            ("E01", "Two-group coffee machine", "860 x 620", "Facing the pickup counter"),
            ("E02", "Ice machine", "500 x 600", "Rear beverage station"),
            ("E03", "Under-counter chiller", "1500 x 700", "Milk and service stock"),
            ("E04", "Juice extractor", "300 x 450", "Next to preparation sink"),
            ("E05", "Refrigerated display", "1200 x 700", "Customer queue side"),
            ("E06", "Compact oven", "600 x 650", "Light meal finishing"),
            ("E07", "Dishwasher + sink", "1600 x 700", "Rear wash zone"),
        ],
        "utilities": ["220V and 380V schedule", "Filtered water for beverage line", "Ice machine drain", "Ventilation for light cooking"],
        "packages": [
            ("Lean launch", "Cold beverages, display, preparation and washing."),
            ("Balanced", "Adds light cooking and larger ice capacity."),
            ("High output", "Dual cold stations for rush-hour service."),
        ],
    },
    {
        "slug": "ddnz-casual-dining-kitchen-package.pdf",
        "tab": "Casual Dining",
        "subtitle": "120 sqm | 70 to 90 seats | full service",
        "title": "Zoned kitchen with separate raw prep, hot production and warewashing",
        "size": "12,000 x 10,000 mm",
        "aisle": "1,400 mm production aisle",
        "crew": "10 to 16 opening crew",
        "summary": "A central production aisle connects cold preparation to the cook line. Dish return reaches washing without crossing the plating pass.",
        "rooms": [
            (0.02, 0.02, 0.28, 0.27, "RECEIVING + DRY"),
            (0.32, 0.02, 0.26, 0.27, "COLD ROOMS"),
            (0.02, 0.31, 0.56, 0.45, "RAW + COLD PREP"),
            (0.60, 0.02, 0.37, 0.58, "HOT PRODUCTION"),
            (0.60, 0.62, 0.37, 0.35, "DISH + WASTE"),
            (0.02, 0.78, 0.56, 0.19, "PASS + PLATING"),
        ],
        "equipment_blocks": [
            ("E01", 0.36, 0.09, 0.20, 0.14), ("E02 RAW", 0.06, 0.39, 0.21, 0.13),
            ("E02 COLD", 0.32, 0.39, 0.21, 0.13), ("E03", 0.66, 0.12, 0.19, 0.14),
            ("E04", 0.86, 0.12, 0.08, 0.14), ("E06", 0.64, 0.07, 0.30, 0.04),
            ("E05", 0.16, 0.84, 0.32, 0.10), ("E07", 0.66, 0.70, 0.27, 0.14),
        ],
        "flows": [
            (CORAL, [(0.00, 0.10), (0.25, 0.22), (0.48, 0.40), (0.68, 0.43), (0.76, 0.27), (0.40, 0.88)]),
            (PURPLE, [(0.56, 0.68), (0.66, 0.54), (0.86, 0.48)]),
            (BLUE, [(0.00, 0.91), (0.44, 0.95), (0.64, 0.79), (0.88, 0.76)]),
        ],
        "equipment": [
            ("E01", "Double-door chiller", "1430 x 870", "Cold store interface"),
            ("E02", "Preparation counter", "1800 x 800", "Separate raw and cold prep"),
            ("E03", "Griddle + range line", "2200 x 900", "Central hot production"),
            ("E04", "Convection oven", "900 x 850", "End of cook line"),
            ("E05", "Pass + hot holding", "2400 x 800", "Dining room service edge"),
            ("E06", "Hood system", "3600 x 1300", "Local air balance review"),
            ("E07", "Dishwasher + three sinks", "2600 x 800", "Separate dirty return"),
        ],
        "utilities": ["Gas or electric cooking basis", "Grease and drainage coordination", "Extraction and replacement air", "Three-phase load schedule"],
        "packages": [
            ("Lean launch", "Core line for a focused opening menu."),
            ("Balanced", "Adds menu breadth and service resilience."),
            ("High output", "Parallel preparation and cooking for multiple dayparts."),
        ],
    },
]


def wrap_text(pdf, text, x, y, width, font="Helvetica", size=10, leading=15, color=MUTED):
    pdf.setFillColor(color)
    pdf.setFont(font, size)
    words = text.split()
    line = ""
    for word in words:
        candidate = f"{line} {word}".strip()
        if stringWidth(candidate, font, size) <= width:
            line = candidate
        else:
            pdf.drawString(x, y, line)
            y -= leading
            line = word
    if line:
        pdf.drawString(x, y, line)
        y -= leading
    return y


def draw_image_cover(pdf, path, x, y, width, height):
    if not Path(path).exists():
        return
    with Image.open(path) as source:
        source = source.convert("RGB")
        source.thumbnail((1400, 1400), Image.Resampling.LANCZOS)
        buffer = BytesIO()
        source.save(buffer, format="JPEG", quality=80, optimize=True)
        buffer.seek(0)
        image = ImageReader(buffer)
        source_w, source_h = image.getSize()
    scale = max(width / source_w, height / source_h)
    draw_w, draw_h = source_w * scale, source_h * scale
    pdf.saveState()
    clip = pdf.beginPath()
    clip.rect(x, y, width, height)
    pdf.clipPath(clip, stroke=0, fill=0)
    pdf.drawImage(image, x + (width - draw_w) / 2, y + (height - draw_h) / 2, draw_w, draw_h, mask="auto")
    pdf.restoreState()


def header(pdf, scenario, page_number, title):
    width, height = A4
    pdf.setFillColor(PAPER)
    pdf.rect(0, 0, width, height, fill=1, stroke=0)
    pdf.setFillColor(PURPLE)
    pdf.setFont("Helvetica-Bold", 17)
    pdf.drawString(42, height - 43, "DDNZ")
    pdf.setFillColor(MUTED)
    pdf.setFont("Helvetica-Bold", 7)
    pdf.drawRightString(width - 42, height - 40, f"{scenario['tab'].upper()} / CONCEPT PACKAGE")
    pdf.setStrokeColor(LINE)
    pdf.line(42, height - 55, width - 42, height - 55)
    pdf.setFillColor(INK)
    pdf.setFont("Helvetica-Bold", 23)
    pdf.drawString(42, height - 91, title)
    pdf.setFillColor(MUTED)
    pdf.setFont("Helvetica", 7)
    pdf.drawRightString(width - 42, 26, f"DDNZGLOBAL.COM | PAGE {page_number} OF {TOTAL_PAGES}")
    pdf.setStrokeColor(LINE)
    pdf.line(42, 39, width - 42, 39)


def cover(pdf, scenario):
    width, height = A4
    pdf.setFillColor(PAPER)
    pdf.rect(0, 0, width, height, fill=1, stroke=0)
    pdf.setFillColor(PURPLE)
    pdf.rect(0, 0, 18, height, fill=1, stroke=0)
    pdf.setFont("Helvetica-Bold", 23)
    pdf.drawString(52, height - 64, "DDNZ")
    pdf.setFillColor(CORAL)
    pdf.setFont("Helvetica-Bold", 8)
    pdf.drawString(52, height - 108, "RESTAURANT KITCHEN CONCEPT PACKAGE")
    pdf.setFillColor(INK)
    pdf.setFont("Helvetica-Bold", 38)
    y = height - 164
    for line in scenario["tab"].split(" + "):
        pdf.drawString(52, y, line)
        y -= 44
    pdf.setFillColor(PURPLE)
    pdf.setFont("Helvetica-Bold", 12)
    pdf.drawString(52, y - 6, scenario["subtitle"])
    y -= 62
    y = wrap_text(pdf, scenario["title"], 52, y, 450, "Helvetica-Bold", 21, 27, INK)
    y -= 16
    wrap_text(pdf, scenario["summary"], 52, y, 450, "Helvetica", 11, 17, MUTED)
    image_path = ISOMETRICS[scenario["slug"]]
    draw_image_cover(pdf, image_path, 52, 252, width - 104, 170)
    pdf.setFillColor(colors.white)
    pdf.setFillAlpha(.88)
    pdf.rect(52, 252, width - 104, 25, fill=1, stroke=0)
    pdf.setFillAlpha(1)
    pdf.setFillColor(MUTED)
    pdf.setFont("Helvetica", 7)
    pdf.drawString(62, 261, "3D planning visualization generated from the reference brief | Not a site photograph")
    pdf.setFillColor(PANEL)
    pdf.roundRect(52, 115, width - 104, 108, 7, fill=1, stroke=0)
    metrics = [("FOOTPRINT", scenario["size"]), ("WORKING CLEARANCE", scenario["aisle"]), ("TEAM BASIS", scenario["crew"])]
    for index, (label, value) in enumerate(metrics):
        x = 72 + index * 158
        pdf.setFillColor(PURPLE)
        pdf.setFont("Helvetica-Bold", 7)
        pdf.drawString(x, 192, label)
        wrap_text(pdf, value, x, 172, 130, "Helvetica-Bold", 10, 13, INK)
    pdf.setFillColor(MUTED)
    pdf.setFont("Helvetica", 7)
    pdf.drawString(52, 87, "Planning basis prepared for restaurant founders, growing brands and equipment distributors.")
    pdf.drawString(52, 72, "Final site dimensions, utilities, code compliance and installation drawings require local professional review.")
    pdf.setFont("Helvetica-Bold", 7)
    pdf.drawRightString(width - 52, 52, f"DDNZGLOBAL.COM | 01 / {TOTAL_PAGES:02d}")
    pdf.showPage()


def draw_arrow(pdf, points, x, y, w, h, color):
    pdf.setStrokeColor(color)
    pdf.setLineWidth(2.2)
    pdf.setDash(6, 4)
    transformed = [(x + px * w, y + h - py * h) for px, py in points]
    path = pdf.beginPath()
    path.moveTo(*transformed[0])
    for point in transformed[1:]:
        path.lineTo(*point)
    pdf.drawPath(path, stroke=1, fill=0)
    pdf.setDash()
    if len(transformed) > 1:
        x1, y1 = transformed[-2]
        x2, y2 = transformed[-1]
        pdf.setFillColor(color)
        pdf.circle(x2, y2, 3.2, fill=1, stroke=0)


def layout_page(pdf, scenario):
    header(pdf, scenario, 2, "Dimensioned layout and movement routes")
    width, height = A4
    x, y, w, h = 52, 250, width - 104, 445
    pdf.setFillColor(colors.HexColor("#f0f6f7"))
    pdf.setStrokeColor(INK)
    pdf.setLineWidth(1.5)
    pdf.rect(x, y, w, h, fill=1, stroke=1)
    for rx, ry, rw, rh, label in scenario["rooms"]:
        px, py = x + rx * w, y + h - (ry + rh) * h
        pdf.setFillColor(colors.white)
        pdf.setStrokeColor(colors.HexColor("#63778a"))
        pdf.setLineWidth(.6)
        pdf.rect(px, py, rw * w, rh * h, fill=1, stroke=1)
        pdf.setFillColor(MUTED)
        pdf.setFont("Helvetica-Bold", 6.5)
        pdf.drawString(px + 5, py + 6, label)
    for code, ex, ey, ew, eh in scenario["equipment_blocks"]:
        px, py = x + ex * w, y + h - (ey + eh) * h
        pdf.setFillColor(PAPER)
        pdf.setStrokeColor(PURPLE)
        pdf.setLineWidth(1)
        pdf.rect(px, py, ew * w, eh * h, fill=1, stroke=1)
        pdf.setFillColor(PURPLE)
        pdf.setFont("Helvetica-Bold", 6.5)
        pdf.drawCentredString(px + ew * w / 2, py + eh * h / 2 - 2, code)
    for color, points in scenario["flows"]:
        draw_arrow(pdf, points, x, y, w, h, color)
    pdf.setFillColor(MUTED)
    pdf.setFont("Helvetica-Bold", 7)
    pdf.drawCentredString(x + w / 2, y + h + 15, scenario["size"])
    pdf.saveState()
    pdf.translate(x - 17, y + h / 2)
    pdf.rotate(90)
    pdf.drawCentredString(0, 0, scenario["size"].split(" x ")[-1])
    pdf.restoreState()
    legend = [(CORAL, "Food and product"), (PURPLE, "Staff working route"), (BLUE, "Dirty ware")]
    for index, (color, label) in enumerate(legend):
        lx = 52 + index * 150
        pdf.setStrokeColor(color)
        pdf.setLineWidth(2)
        pdf.line(lx, 225, lx + 24, 225)
        pdf.setFillColor(MUTED)
        pdf.setFont("Helvetica-Bold", 7)
        pdf.drawString(lx + 31, 222, label)
    pdf.setFillColor(PANEL)
    pdf.roundRect(52, 77, width - 104, 116, 6, fill=1, stroke=0)
    pdf.setFillColor(PURPLE)
    pdf.setFont("Helvetica-Bold", 8)
    pdf.drawString(69, 166, "LAYOUT READING NOTES")
    notes = [scenario["aisle"], "Equipment codes correspond to the schedule on page 4.", "Doors, clearances and service openings must be checked against the measured site.", "Routes show operating intent, not authority-approved food-safety documentation."]
    for index, note in enumerate(notes):
        pdf.setFillColor(CORAL)
        pdf.circle(72, 145 - index * 20, 2.2, fill=1, stroke=0)
        pdf.setFillColor(INK)
        pdf.setFont("Helvetica", 8.5)
        pdf.drawString(82, 142 - index * 20, note)
    pdf.showPage()


def service_basis(name):
    lowered = name.lower()
    if any(word in lowered for word in ["sink", "dishwasher", "ice", "coffee", "juice"]):
        return "Water + trapped waste", "Keep valves and waste serviceable"
    if any(word in lowered for word in ["hood", "extraction"]):
        return "Fan and lighting load", "Access filters, fan and controls"
    if any(word in lowered for word in ["fryer", "griddle", "range", "oven"]):
        return "Gas or 3P power basis", "Rear isolation and service access"
    if any(word in lowered for word in ["chiller", "refrigerated", "display"]):
        return "220V dedicated outlet", "Ventilation and condenser access"
    return "Confirm selected model", "Maintain removable-panel access"


def services_page(pdf, scenario):
    header(pdf, scenario, 3, "Utility, service and clearance basis")
    width, height = A4
    pdf.setFillColor(PANEL)
    pdf.roundRect(42, height - 225, width - 84, 102, 6, fill=1, stroke=0)
    pdf.setFillColor(PURPLE)
    pdf.setFont("Helvetica-Bold", 8)
    pdf.drawString(58, height - 151, "DESIGN BASIS, NOT FINAL LOADS")
    wrap_text(pdf, "Connection types below support supplier comparison and MEP coordination. Exact voltage, phase, power, gas, water, drainage, duct size and fire provisions are confirmed against the approved model and local code.", 58, height - 174, width - 116, "Helvetica", 8.5, 13, INK)
    rows = []
    for code, name, _, _ in scenario["equipment"]:
        utility, access = service_basis(name)
        rows.append((code, name, utility, access))
    columns = [42, 78, 222, 364, width - 42]
    top = height - 270
    row_h = 55
    pdf.setFillColor(INK)
    pdf.rect(columns[0], top, columns[-1] - columns[0], 27, fill=1, stroke=0)
    pdf.setFillColor(colors.white)
    pdf.setFont("Helvetica-Bold", 6.5)
    for index, label in enumerate(["CODE", "EQUIPMENT", "CONNECTION BASIS", "SERVICE / CLEARANCE"]):
        pdf.drawString(columns[index] + 6, top + 10, label)
    for row_index, row in enumerate(rows):
        row_y = top - (row_index + 1) * row_h
        pdf.setFillColor(colors.white if row_index % 2 == 0 else PANEL)
        pdf.setStrokeColor(LINE)
        pdf.rect(columns[0], row_y, columns[-1] - columns[0], row_h, fill=1, stroke=1)
        for column in columns[1:-1]:
            pdf.line(column, row_y, column, row_y + row_h)
        pdf.setFillColor(PURPLE)
        pdf.setFont("Helvetica-Bold", 8)
        pdf.drawString(columns[0] + 6, row_y + 33, row[0])
        wrap_text(pdf, row[1], columns[1] + 6, row_y + 35, columns[2] - columns[1] - 12, "Helvetica-Bold", 7.5, 10, INK)
        wrap_text(pdf, row[2], columns[2] + 6, row_y + 35, columns[3] - columns[2] - 12, "Helvetica", 7.2, 10, INK)
        wrap_text(pdf, row[3], columns[3] + 6, row_y + 35, columns[4] - columns[3] - 12, "Helvetica", 7.2, 10, MUTED)
    pdf.setFillColor(MUTED)
    pdf.setFont("Helvetica", 7)
    pdf.drawString(42, 71, "NTS | Confirm the measured site, selected models, local authority requirements and licensed MEP design before construction.")
    pdf.showPage()


def equipment_page(pdf, scenario):
    header(pdf, scenario, 4, "Core equipment schedule")
    width, height = A4
    columns = [42, 82, 250, 345, width - 42]
    top = height - 126
    row_h = 67
    labels = ["CODE", "EQUIPMENT", "NOMINAL SIZE (MM)", "PLACEMENT BASIS"]
    pdf.setFillColor(INK)
    pdf.rect(columns[0], top, columns[-1] - columns[0], 27, fill=1, stroke=0)
    pdf.setFillColor(colors.white)
    pdf.setFont("Helvetica-Bold", 6.5)
    for index, label in enumerate(labels):
        pdf.drawString(columns[index] + 6, top + 10, label)
    for row_index, row in enumerate(scenario["equipment"]):
        row_y = top - (row_index + 1) * row_h
        pdf.setFillColor(colors.white if row_index % 2 == 0 else PANEL)
        pdf.setStrokeColor(LINE)
        pdf.rect(columns[0], row_y, columns[-1] - columns[0], row_h, fill=1, stroke=1)
        for column in columns[1:-1]:
            pdf.line(column, row_y, column, row_y + row_h)
        pdf.setFillColor(PURPLE)
        pdf.setFont("Helvetica-Bold", 9)
        pdf.drawString(columns[0] + 7, row_y + row_h - 22, row[0])
        wrap_text(pdf, row[1], columns[1] + 7, row_y + row_h - 19, columns[2] - columns[1] - 14, "Helvetica-Bold", 8.5, 12, INK)
        wrap_text(pdf, row[2], columns[2] + 7, row_y + row_h - 19, columns[3] - columns[2] - 14, "Helvetica", 8, 12, INK)
        wrap_text(pdf, row[3], columns[3] + 7, row_y + row_h - 19, columns[4] - columns[3] - 14, "Helvetica", 8, 12, MUTED)
    pdf.setFillColor(PANEL)
    pdf.roundRect(42, 94, width - 84, 76, 6, fill=1, stroke=0)
    pdf.setFillColor(PURPLE)
    pdf.setFont("Helvetica-Bold", 8)
    pdf.drawString(58, 146, "FINAL SCHEDULE INPUTS")
    wrap_text(pdf, "Menu, peak throughput, available voltage, gas policy, ambient conditions, door sizes and destination certification requirements are confirmed before supplier release.", 58, 128, width - 116, "Helvetica", 8.5, 13, INK)
    pdf.showPage()


def zone_checkpoint(label):
    lowered = label.lower()
    if "receive" in lowered or "store" in lowered or "cold" in lowered:
        return "Delivery route, door width, storage segregation and temperature holding"
    if "prep" in lowered:
        return "Washable surfaces, task separation, hand wash and short ingredient route"
    if "cook" in lowered or "hot" in lowered:
        return "Hood capture, heat clearance, fire provisions and emergency isolation"
    if "wash" in lowered or "dish" in lowered or "waste" in lowered:
        return "Dirty return, hot water, trapped waste, floor drain and chemical storage"
    if "pass" in lowered or "pickup" in lowered or "display" in lowered or "pos" in lowered:
        return "Order handoff, holding time, customer separation and clean service edge"
    return "Confirm operating route, hygiene boundary and service access"


def zone_page(pdf, scenario):
    header(pdf, scenario, 5, "Functional zone and hygiene schedule")
    width, height = A4
    pdf.setFillColor(PANEL)
    pdf.roundRect(42, height - 196, width - 84, 70, 6, fill=1, stroke=0)
    wrap_text(pdf, "The sequence below connects each room or operating zone to the main coordination checkpoint. It is a design review list, not an authority-approved food-safety plan.", 58, height - 151, width - 116, "Helvetica", 8.5, 13, INK)
    top = height - 236
    row_h = min(76, 460 / len(scenario["rooms"]))
    for index, (_, _, _, _, label) in enumerate(scenario["rooms"]):
        row_y = top - (index + 1) * row_h
        pdf.setFillColor(colors.white if index % 2 == 0 else PANEL)
        pdf.setStrokeColor(LINE)
        pdf.rect(42, row_y, width - 84, row_h, fill=1, stroke=1)
        pdf.setFillColor(PURPLE)
        pdf.setFont("Helvetica-Bold", 8)
        pdf.drawString(56, row_y + row_h - 22, f"{index + 1:02d}")
        pdf.setFillColor(INK)
        pdf.setFont("Helvetica-Bold", 9)
        pdf.drawString(88, row_y + row_h - 22, label)
        wrap_text(pdf, zone_checkpoint(label), 236, row_y + row_h - 20, width - 294, "Helvetica", 7.8, 11, MUTED)
    pdf.setFillColor(PURPLE)
    pdf.setFont("Helvetica-Bold", 8)
    pdf.drawString(42, 78, "REVIEW GATE")
    pdf.setFillColor(MUTED)
    pdf.setFont("Helvetica", 7.5)
    pdf.drawString(112, 78, "Freeze room sizes only after menu, peak load, equipment models, storage days and local code review are aligned.")
    pdf.showPage()


def package_page(pdf, scenario):
    header(pdf, scenario, 6, "Utilities and package levels")
    width, height = A4
    pdf.setFillColor(PURPLE)
    pdf.setFont("Helvetica-Bold", 8)
    pdf.drawString(42, height - 128, "UTILITY CHECKPOINTS")
    for index, utility in enumerate(scenario["utilities"]):
        y = height - 164 - index * 42
        pdf.setFillColor(PANEL)
        pdf.roundRect(42, y - 16, width - 84, 30, 5, fill=1, stroke=0)
        pdf.setFillColor(CORAL)
        pdf.circle(58, y - 1, 2.5, fill=1, stroke=0)
        pdf.setFillColor(INK)
        pdf.setFont("Helvetica-Bold", 9)
        pdf.drawString(70, y - 4, utility)
    pdf.setFillColor(PURPLE)
    pdf.setFont("Helvetica-Bold", 8)
    pdf.drawString(42, height - 355, "PACKAGE LEVELS")
    card_w = (width - 104) / 3
    for index, (name, description) in enumerate(scenario["packages"]):
        x = 42 + index * (card_w + 10)
        y = height - 555
        pdf.setFillColor(colors.HexColor("#faf6fd") if index == 1 else colors.white)
        pdf.setStrokeColor(PURPLE if index == 1 else LINE)
        pdf.setLineWidth(1.3 if index == 1 else .7)
        pdf.roundRect(x, y, card_w, 165, 6, fill=1, stroke=1)
        pdf.setFillColor(PURPLE)
        pdf.setFont("Helvetica-Bold", 7)
        pdf.drawString(x + 14, y + 139, f"0{index + 1}" + (" | RECOMMENDED BASIS" if index == 1 else ""))
        pdf.setFillColor(INK)
        pdf.setFont("Helvetica-Bold", 13)
        pdf.drawString(x + 14, y + 109, name)
        wrap_text(pdf, description, x + 14, y + 84, card_w - 28, "Helvetica", 8.5, 13, MUTED)
    pdf.setFillColor(PANEL)
    pdf.roundRect(42, 92, width - 84, 116, 6, fill=1, stroke=0)
    pdf.setFillColor(INK)
    pdf.setFont("Helvetica-Bold", 10)
    pdf.drawString(58, 178, "What changes the final price")
    bullets = ["Selected equipment models and local certification", "Freight mode, container loading and destination charges", "Local installation, permits, site works and professional drawings"]
    for index, bullet in enumerate(bullets):
        pdf.setFillColor(CORAL)
        pdf.circle(61, 151 - index * 21, 2.2, fill=1, stroke=0)
        pdf.setFillColor(MUTED)
        pdf.setFont("Helvetica", 8.5)
        pdf.drawString(72, 148 - index * 21, bullet)
    pdf.showPage()


def evidence_page(pdf, scenario):
    header(pdf, scenario, 7, "Evidence chain from review to destination")
    width, height = A4
    evidence = [
        (ROOT / "public/images/product-showcase/kitchen/kitchen-factory-inspection-sanitized.webp", "SUPPLIER REVIEW", "Real DDNZ field material from a China-origin production site."),
        (ROOT / "public/images/product-showcase/refrigeration/ice-maker-packout-source.webp", "PRODUCTION + PACK-OUT", "Real production and packing record for commercial ice equipment."),
        (ROOT / "public/images/operations/container-loading-forklift-anonymized.jpg", "CONTAINER LOADING", "Real anonymized export loading record."),
        (ROOT / "public/images/restaurant-kitchen-packages/uae-delivery-proof-poster-v2.webp", "UAE DESTINATION HANDLING", "Real DDNZ kitchen equipment unloading record."),
        (ROOT / "public/images/product-showcase/kitchen/kitchen-operating-sanitized.webp", "OPERATING CONTEXT", "Reference only. Not represented as a DDNZ installation case."),
    ]
    positions = [(42, 448, 244, 230), (309, 448, 244, 230), (42, 187, 155, 224), (220, 187, 155, 224), (398, 187, 155, 224)]
    for (path, label, caption), (x, y, w, h) in zip(evidence, positions):
        pdf.setFillColor(colors.white)
        pdf.setStrokeColor(LINE)
        pdf.rect(x, y, w, h, fill=1, stroke=1)
        draw_image_cover(pdf, path, x, y + 72, w, h - 72)
        pdf.setFillColor(PURPLE)
        pdf.setFont("Helvetica-Bold", 6.5)
        pdf.drawString(x + 11, y + 53, label)
        wrap_text(pdf, caption, x + 11, y + 37, w - 22, "Helvetica", 7.2, 10, MUTED)
    pdf.setFillColor(PANEL)
    pdf.roundRect(42, 81, width - 84, 76, 6, fill=1, stroke=0)
    pdf.setFillColor(INK)
    pdf.setFont("Helvetica-Bold", 9)
    pdf.drawString(58, 130, "Evidence rule")
    wrap_text(pdf, "Concept visuals explain the intended design. Field records prove work actually performed. Operating references show context but are never presented as a completed DDNZ installation.", 58, 111, width - 116, "Helvetica", 8, 12, MUTED)
    pdf.showPage()


def handoff_page(pdf, scenario):
    header(pdf, scenario, 8, "From concept plan to export release")
    width, height = A4
    steps = [
        ("01", "Operating brief", "Menu, capacity, service model, site and budget basis."),
        ("02", "Measured layout", "Actual dimensions, workflow, equipment positions and connections."),
        ("03", "Equipment package", "Comparable models, approved options, schedule and supplier quotations."),
        ("04", "QC + export release", "Identity checks, inspection evidence, packing records and freight handoff."),
    ]
    y = height - 145
    for number, name, text in steps:
        pdf.setFillColor(PURPLE)
        pdf.circle(59, y + 7, 16, fill=1, stroke=0)
        pdf.setFillColor(colors.white)
        pdf.setFont("Helvetica-Bold", 8)
        pdf.drawCentredString(59, y + 4, number)
        pdf.setFillColor(INK)
        pdf.setFont("Helvetica-Bold", 12)
        pdf.drawString(88, y + 10, name)
        wrap_text(pdf, text, 88, y - 8, width - 150, "Helvetica", 8.5, 12, MUTED)
        if number != "04":
            pdf.setStrokeColor(LINE)
            pdf.line(59, y - 33, 59, y - 69)
        y -= 105
    pdf.setFillColor(PANEL)
    pdf.roundRect(42, 115, width - 84, 180, 7, fill=1, stroke=0)
    pdf.setFillColor(PURPLE)
    pdf.setFont("Helvetica-Bold", 8)
    pdf.drawString(60, 267, "SEND DDNZ THESE INPUTS FOR A MATCHED REVIEW")
    inputs = ["Measured floor plan or lease drawing", "Menu and peak-hour order target", "Destination, voltage and fuel policy", "Target opening date and equipment budget"]
    for index, item in enumerate(inputs):
        pdf.setFillColor(colors.white)
        pdf.setStrokeColor(LINE)
        pdf.roundRect(60, 222 - index * 32, 14, 14, 2, fill=1, stroke=1)
        pdf.setFillColor(INK)
        pdf.setFont("Helvetica-Bold", 8.5)
        pdf.drawString(84, 225 - index * 32, item)
    pdf.setFillColor(CORAL)
    pdf.setFont("Helvetica-Bold", 11)
    pdf.drawString(60, 82, "manager@ddnzglobal.com")
    pdf.setFillColor(MUTED)
    pdf.setFont("Helvetica", 8)
    pdf.drawRightString(width - 42, 82, "Concept document only | Local professional review required")
    pdf.showPage()


def build_pdf(scenario):
    OUTPUT.mkdir(parents=True, exist_ok=True)
    destination = OUTPUT / scenario["slug"]
    pdf = canvas.Canvas(str(destination), pagesize=A4, pageCompression=1)
    pdf.setTitle(f"DDNZ {scenario['tab']} Kitchen Concept Package")
    pdf.setAuthor("DDNZ Global")
    pdf.setSubject("Restaurant kitchen layout and equipment concept package")
    cover(pdf, scenario)
    layout_page(pdf, scenario)
    services_page(pdf, scenario)
    equipment_page(pdf, scenario)
    zone_page(pdf, scenario)
    package_page(pdf, scenario)
    evidence_page(pdf, scenario)
    handoff_page(pdf, scenario)
    pdf.save()
    return destination


if __name__ == "__main__":
    for item in SCENARIOS:
        print(build_pdf(item))
