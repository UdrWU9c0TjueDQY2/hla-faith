from pathlib import Path
from html import escape
import re, hashlib
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import HexColor, white
from reportlab.lib.pagesizes import letter
from pypdf import PdfReader, PdfWriter

ROOT = Path(__file__).resolve().parents[2]
FOLDER = ROOT / 'src/scrollway/road-to-emmaus'
PDF = FOLDER / 'emmaus-evidence-map.pdf'
APPLE = 'https://apps.apple.com/us/app/scrollway-bible-study-game/id6821770165'
PAGE = 'https://udrwu9c0tjuedqy2.github.io/hla-faith/scrollway/road-to-emmaus/#evidence-map'
PASSAGE = 'https://bible.usccb.org/bible/luke/24'
DATA = [
 ('A', 'The narrator identifies the person who joins the travelers as Jesus.', 'N', 'Luke 24:15-16', 'The narrator identifies him; the two travelers do not yet recognize him.'),
 ('B', 'The travelers describe their earlier hope that Jesus would redeem Israel.', 'S', 'Luke 24:21', 'This is part of what they tell their companion about their own earlier hope.'),
 ('C', 'The travelers say the women had reported a vision of angels.', 'S', 'Luke 24:22-23', 'Their speech reports what the women described. It does not say these two saw the angels.'),
 ('D', 'The two recognize Jesus before he begins explaining the Scriptures.', 'C', 'Luke 24:16, 25-27, 31', 'They do not recognize him on the road; recognition comes later at the meal.'),
 ('E', 'The unnamed traveler planned to return to fishing the next day.', 'U', 'Luke 24:13-35', 'This passage supplies neither that occupation nor that next-day plan. Not established is not the same as proved impossible.'),
 ('F', 'The narrator says the two return to Jerusalem after recognizing Jesus.', 'N', 'Luke 24:31-33', 'Recognition is narrated before their return. This is an event the narrator states, not a guessed motive.')
]
LABELS = {'N':'Narrator states it', 'S':'Travelers say/report it', 'C':'Contradicted here', 'U':'Not established here'}
pdfmetrics.registerFont(TTFont('DVS','/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'))
pdfmetrics.registerFont(TTFont('DVS-B','/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'))
W,H=letter; M=38; WIDTH=W-2*M
INK=HexColor('#20332f'); GREEN=HexColor('#285b50'); GRAY=HexColor('#4b5d56'); PALE=HexColor('#eef3e9'); LINE=HexColor('#b7c5b8')
c=canvas.Canvas(str(PDF),pagesize=letter,pageCompression=1)
c.setTitle('Emmaus Evidence Map - Narration, Reports and Inference')
c.setAuthor('Honest Little Apps')
c.setSubject('Original reading activity for Luke 24:13-35; separate Scrollway companion')
def text(s,x,y,size=10,font='DVS',color=INK):
 c.setFont(font,size);c.setFillColor(color);c.drawString(x,y,s)
def wrap(s,x,y,width=WIDTH,size=10,lead=14,font='DVS',color=INK):
 words=s.split();line=''
 for word in words:
  candidate=(line+' '+word).strip()
  if pdfmetrics.stringWidth(candidate,font,size)>width:
   text(line,x,y,size,font,color);y-=lead;line=word
  else:line=candidate
 if line:text(line,x,y,size,font,color);y-=lead
 return y
def header(kicker,title,sub):
 c.setFillColor(GREEN);c.rect(0,H-14,W,14,stroke=0,fill=1)
 text('HONEST LITTLE APPS / SCROLLWAY READING COMPANION',M,750,8.2,'DVS-B',GREEN)
 text(kicker,M,728,9,'DVS-B',GRAY)
 text(title,M,695,25,'DVS-B')
 return wrap(sub,M,672,size=10.2,lead=14)
def footer(n):
 c.setStrokeColor(LINE);c.setLineWidth(.6);c.line(M,74,W-M,74)
 text('Read Luke 24:13-35 and the full HTML activity online.',M,59,8.3,color=GREEN)
 c.linkURL(PAGE,(M,56,W-M,69),relative=0,thickness=0)
 text('Optional: Scrollway on the App Store (free download; optional Premium).',M,44,8.1,color=GREEN)
 c.linkURL(APPLE,(M,41,W-M,53),relative=0,thickness=0)
 text('Original paraphrases by Honest Little Apps, publisher of Scrollway. No app needed.',M,29,7.5,color=GRAY)
 text(f'{n} / 2',W-M-25,16,7.5,color=GRAY)

y=header('PARTICIPANT PAGE / CLAIMS TO TEST','Who says what?', 'Read Luke 24:13-35. Check each claim against the passage; do not use later stories or guesses to fill a gap. These are claims to test, not six asserted facts.')
y=wrap('N = Narrator states it     S = Travelers say/report it',M,y-5,size=9.2,font='DVS-B',color=GREEN)
y=wrap('C = Contradicted here     U = Not established here',M,y,size=9.2,font='DVS-B',color=GREEN)
y=wrap('For S, identify what the travelers say in verses 17-24. Their report is not the same as their personally witnessing every event. Choose a label, find a verse and give a reason.',M,y-4,size=9,lead=12)
y-=8
for code,claim,answer,ref,reason in DATA:
 c.setFillColor(PALE);c.roundRect(M,y-59,WIDTH,59,5,fill=1,stroke=0)
 text(code,M+10,y-16,11,'DVS-B',GREEN)
 wrap(claim,M+34,y-15,WIDTH-45,9.3,12)
 text('Label: ______    Verse(s): ______________    My reason:',M+34,y-45,8.2,color=GRAY)
 c.setStrokeColor(LINE);c.line(M+360,y-47,W-M-10,y-47)
 y-=67
y=wrap('A stronger sentence: Choose B or C. Begin your own one-line summary with "The travelers say..." What does naming the speaker prevent you from overstating?',M,y-2,size=9.2,lead=13)
footer(1);c.showPage()
y=header('ADULT KEY / KEEP SEPARATE UNTIL DISCUSSION','Evidence before inference.', 'The label describes how this particular passage supports the claim. A justified explanation matters more than a fast label. Reopen the cited verses together.')
y-=5
for code,claim,answer,ref,reason in DATA:
 text(f'{code}  {answer} - {LABELS[answer]}',M,y,10,'DVS-B',GREEN);y-=15
 y=wrap(f'{ref}. {reason}',M+16,y,WIDTH-16,9.3,13)
 y-=9
text('Make the boundary visible.',M,y-2,13,'DVS-B');y-=23
y=wrap('Write one observation that you can point to in the passage, then a separate interpretation or question. Label the second line so it is not mistaken for a detail the narrator supplied.',M,y,size=9.5,lead=13)
y-=4
text('Observation + verse:',M,y,9.5,'DVS-B');y-=16
c.setStrokeColor(LINE);c.line(M,y,W-M,y);y-=23
text('My interpretation or question:',M,y,9.5,'DVS-B');y-=16
c.line(M,y,W-M,y);y-=26
y=wrap('For E, "not established" does not prove that an occupation or plan was impossible. It means this passage gives no basis to claim it. Keep a possibility separate from a textual observation.',M,y,size=9.1,lead=13)
y=wrap('Source: Luke 24:13-35, checked against the USCCB online Bible. These are original paraphrases, not quotations or an endorsed USCCB resource.',M,y-10,size=8.3,lead=12,color=GRAY)
c.linkURL(PASSAGE,(M,y-1,W-M,y+28),relative=0,thickness=0)
footer(2);c.showPage();c.save()
# Preserve the font redistribution notice with the embedded fonts.
r=PdfReader(PDF);w=PdfWriter();w.clone_document_from_reader(r)
w.add_attachment('DejaVu-font-license.txt',Path('/usr/share/doc/fonts-dejavu-core/copyright').read_bytes())
with PDF.open('wb') as out:w.write(out)

items=[]
for code,claim,answer,ref,reason in DATA:
 items.append(f'<li><p><strong>{code}.</strong> {escape(claim)}</p><p>Choose N, S, C or U; identify a verse and a reason.</p><details><summary>Key for {code}</summary><p><strong>{answer}: {LABELS[answer]}.</strong> {escape(ref)}. {escape(reason)}</p></details></li>')
section='''<!--HLA:SCROLLWAY:EVIDENCE:START-->
<section id="evidence-map" class="panel" aria-labelledby="evidence-title" style="margin-top:1.5rem">
<h2 id="evidence-title">Who says what? An Emmaus evidence map</h2>
<p>This reading task asks a different question from putting the scenes in order: does the narrator state a detail, do the travelers report it, or have we added something the passage does not establish?</p>
<p><a href="emmaus-evidence-map.pdf">Download the participant page and adult key (PDF, 2 pages)</a>. The complete activity follows as HTML. Keep the key separate until you have offered a verse and reason.</p>
<p>Read <a href="https://bible.usccb.org/bible/luke/24">Luke 24:13-35</a>. These are original paraphrases and claims to test, not six asserted facts. Do not use later stories or guesses to fill a gap.</p>
<ul><li><strong>N: Narrator states it.</strong> An event or detail is supplied by the narrator.</li><li><strong>S: Travelers say/report it.</strong> Look at what they say in verses 17-24; a report is not the same as personally witnessing everything in it.</li><li><strong>C: Contradicted here.</strong> The claim conflicts with what this passage says.</li><li><strong>U: Not established here.</strong> This passage supplies no basis for the claim; that does not prove it impossible.</li></ul>
<ol>'''+''.join(items)+'''</ol>
<h3>A stronger sentence</h3><p>Choose B or C. Begin your own one-line summary with <em>The travelers say...</em> What does naming the speaker prevent you from overstating?</p>
<h3>Observation and inference are separate lines</h3><p>Write one observation and its verse reference, then a separate interpretation or question. Label the second line so it is not mistaken for a detail the narrator supplied. For E, a possibility is not a textual observation.</p>
<p class="fine">Original reading exercise from Honest Little Apps, publisher of Scrollway, created with AI assistance. It is a separate free companion, not a native-app question set or an endorsed USCCB resource. No names, written answers or form submissions are collected by this activity. Source: Luke 24:13-35, checked November 5, 2026. The optional iPhone/iPad app is a free download with optional paid Premium; check Apple for current local offers.</p>
</section>
<!--HLA:SCROLLWAY:EVIDENCE:END-->'''
source=FOLDER/'index.html';html=source.read_text()
start='<!--HLA:SCROLLWAY:EVIDENCE:START-->';end='<!--HLA:SCROLLWAY:EVIDENCE:END-->'
if start in html:html=re.sub(re.escape(start)+r'[\s\S]*?'+re.escape(end),lambda m:section,html)
else:html=html.replace('<footer class="app">',section+'\n<footer class="app">')
source.write_text(html)
print(PDF,PDF.stat().st_size,hashlib.sha256(PDF.read_bytes()).hexdigest())
