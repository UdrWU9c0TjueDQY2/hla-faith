"""Original paired listening activity; no native UI or third-party worksheet reuse."""
from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.lib.utils import ImageReader
from reportlab.graphics.barcode.qr import QrCodeWidget
from reportlab.graphics.shapes import Drawing
from reportlab.graphics import renderPDF
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'src/lampstep/listen-before-advice-practice/reflect-check-ask-partner-cards.pdf'
STORE='https://apps.apple.com/us/app/lampstep-bible-for-real-life/id6820775927'
PAGE='https://udrwu9c0tjuedqy2.github.io/hla-faith/lampstep/listen-before-advice-practice/'
W,H=595.276,841.89
NAVY=HexColor('#132636'); GOLD=HexColor('#ad7900'); GRAY=HexColor('#43515b')
pdfmetrics.registerFont(TTFont('HLA','/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'))
pdfmetrics.registerFont(TTFont('HLA-Bold','/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'))
c=canvas.Canvas(str(OUT),pagesize=(W,H))
c.setTitle('Reflect. Check. Ask. - paired listening practice')
c.setAuthor('Honest Little Apps')
c.setSubject('Original fictional listening scenarios and speaker correction worksheet')

def line(x,y,s,size=11,font='Helvetica',color=NAVY):
    font='HLA-Bold' if font=='Helvetica-Bold' else 'HLA'
    c.setFillColor(color);c.setFont(font,size);c.drawString(x,y,s)
def rule(y):
    c.setStrokeColor(HexColor('#cad1d6'));c.setLineWidth(.6);c.line(42,y,W-42,y)
def header(kicker,title,sub):
    line(42,H-44,'HONEST LITTLE APPS',10,'Helvetica-Bold',GOLD)
    line(42,H-72,kicker.upper(),9,'Helvetica-Bold')
    line(42,H-108,title,27,'Helvetica-Bold')
    line(42,H-133,sub,11,color=GRAY)
def footer(n):
    rule(100)
    c.drawImage(ImageReader(str(ROOT/'src/assets/lampstep/icon-128.webp')),42,42,42,42,mask='auto')
    line(95,77,'Optional daily practice: Lampstep for iPhone and iPad',10,'Helvetica-Bold')
    line(95,61,"Today's Fork is free. Plus is optional; check Apple's current offer.",9,color=GRAY)
    line(95,46,'Honest Little Apps publishes Lampstep and this separate worksheet.',8,color=GRAY)
    c.linkURL(STORE,(42,38,W-105,88),relative=0)
    qr=QrCodeWidget(STORE);b=qr.getBounds();d=Drawing(55,55,transform=[55/(b[2]-b[0]),0,0,55/(b[3]-b[1]),0,0]);d.add(qr);renderPDF.draw(d,c,W-95,35)
    c.linkURL(STORE,(W-95,35,W-40,90),relative=0)
    line(42,23,'Print for personal or group practice. No account or app is required.',8,color=GRAY)
    line(W-60,23,str(n)+'/2',8,color=GRAY)

header('A paper companion for two people','Reflect. Check. Ask.','Listen for what was said before offering a solution.')
line(42,677,'Use fictional cards, not a personal problem.',13,'Helvetica-Bold')
for i,s in enumerate([
 'Choose one card on page 2. One person reads it; the other listens.',
 'The listener reflects both stated parts, then asks whether they understood.',
 'The speaker corrects or confirms the reflection. Swap roles for another card.',
 'There is no score. A possible sentence is a starting point, not the only answer.'
]):line(42,652-i*19,s,11)
for y,title,prompt,rows in [
 (543,'1  Notice the two facts','Write only what the speaker explicitly said.',2),
 (426,'2  Set one assumption aside','What motive or story were you about to add?',2),
 (309,'3  Reflect, then check','What I heard was... Have I understood?',2),
 (192,'4  Make room for the correction','What did the speaker clarify? Ask: ideas, or listening?',1)
]:
 line(42,y,title,13,'Helvetica-Bold');line(42,y-20,prompt,10,color=GRAY)
 for j in range(rows):rule(y-43-j*23)
footer(1);c.showPage()
header('Four original fictional speaker cards','Try a different first response.','Read the speaker line first. Cover the possible reflection until after your attempt.')
cards=[
 ('THE PRESENTATION', 'I finished the slides, but I am worried the numbers', 'are still from last month.', 'The slides are ready, and you want to check whether', 'the numbers are current. Have I understood?'),
 ('THE GROUP WALK', 'I want to join the walk, but I can only manage', 'the short route today.', 'You want to come along, and today the short route', 'is the one that works for you. Is that right?'),
 ('THE SHARED MEAL', 'I am happy to cook, but I need someone else', 'to handle the shopping this week.', 'You can do the cooking, and you need someone else', 'to do this week\'s shopping. Have I got that?'),
 ('THE STUDY GROUP', 'I want to come to the study group, but I need', 'the passage before we meet.', 'You want to join the group, and having the passage', 'ahead of time would help. Have I understood?')
]
for i,(label,a,b,r,s) in enumerate(cards):
 top=674-i*126
 c.setStrokeColor(HexColor('#b4bec4'));c.setLineWidth(.7);c.roundRect(42,top-109,W-84,116,7,stroke=1,fill=0)
 line(55,top-10,label,9,'Helvetica-Bold',GOLD)
 line(55,top-30,a,12,'Helvetica-Bold');line(55,top-47,b,12,'Helvetica-Bold')
 line(55,top-66,'ONE POSSIBLE REFLECTION',8,'Helvetica-Bold',GRAY)
 line(55,top-83,r,10);line(55,top-98,s,10)
line(42,159,'Optional faith connection',11,'Helvetica-Bold')
line(42,142,'Read James 1:19 in its surrounding passage using your own Bible.',10,color=GRAY)
line(42,125,'Discuss hearing before speaking. These cards are not Scripture quotations.',10,color=GRAY)
footer(2);c.save()
print(OUT)
