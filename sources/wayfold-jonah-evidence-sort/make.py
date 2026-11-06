from pathlib import Path
from html import escape
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import letter

base=Path(__file__).parent
url='https://udrwu9c0tjuedqy2.github.io/hla-faith/wayfold/bible-reading-vs-study/#jonah-evidence-sort'
app='https://apps.apple.com/us/app/wayfold-understand-the-bible/id6820304462'
cards=[
 ('A',"Jonah names God's mercy while explaining his earlier flight.",'Supports','Jonah 4:2',"Jonah connects his earlier flight with what he knows about God's character."),
 ('B','The king says he knows for certain what God will do.','Conflicts','Jonah 3:9',"The king asks whether God may turn and relent. His question expresses uncertainty."),
 ('C','Jonah is pleased about the plant that provides shade.','Supports','Jonah 4:6',"The narrative reports Jonah's gladness because of the plant."),
 ('D','Jonah grew the plant himself.','Conflicts','Jonah 4:10',"God says Jonah did not work for the plant or make it grow."),
 ('E','The final question refers to animals as well as people.','Supports','Jonah 4:11',"The question names the people of Nineveh and its many animals."),
 ('F','Jonah changes his mind after the final question.','Leaves open','Jonah 4:11 / end of the book',"The book ends with the question. It does not report a reply or a later change of mind.")
]
roles=[
 ('Reader','Read Jonah 3:9–4:11 aloud from your chosen Bible. Reread a requested verse and its surrounding sentence.'),
 ('Finder','Find the strongest verse for a card. Read enough context for the others to check the connection.'),
 ('Questioner','Ask what words support the decision. If a claim goes beyond the passage, ask what information is missing.')
]
steps=[
 ('Prepare · about 2 minutes','Bring a Bible for each pair. Choose a reader, finder and questioner. In a pair, share the third role. Scissors are optional. Keep the answer key face down.'),
 ('Read · about 4 minutes','Read Jonah 3:9–4:11 together. Notice the change from the city’s response to Jonah’s response. Revisit the wider book if a question needs context.'),
 ('Sort · about 8 minutes','Place each card under Supports, Conflicts or Leaves open. Record a verse and explain the decision. Rotate the roles after two cards. Disagreements are a reason to reread.'),
 ('Check and discuss · about 6 minutes','Compare the six decisions with the key. Revise a decision when the passage gives a reason. End by discussing the question below.')
]
for name,f in [('Sans','DejaVuSans.ttf'),('Bold','DejaVuSans-Bold.ttf')]:
 pdfmetrics.registerFont(TTFont(name,'/usr/share/fonts/truetype/dejavu/'+f))
c=canvas.Canvas(str(base/'jonah-ending-evidence-sort.pdf'),pagesize=letter)
c.setTitle('Jonah’s unfinished conversation | Small-group evidence sort')
c.setAuthor('Honest Little Apps')
ink='#293631'; accent='#3D6654'; pale='#F0F4EF'; line='#A4B3A8'
def text(x,y,s,size=11,font='Sans',color=ink):
 c.setFont(font,size);c.setFillColor(HexColor(color));c.drawString(x,y,s)
def wrap(x,y,s,width,size=11,font='Sans',leading=None,color=ink):
 leading=leading or size*1.4
 words=s.split();row=''
 for w in words:
  trial=(row+' '+w).strip()
  if pdfmetrics.stringWidth(trial,font,size)>width and row:
   text(x,y,row,size,font,color);y-=leading;row=w
  else:row=trial
 if row:text(x,y,row,size,font,color);y-=leading
 return y
def footer(n):
 c.setStrokeColor(HexColor(line));c.line(38,60,574,60)
 text(38,42,'Honest Little Apps · Original facilitator activity · '+str(n)+' / 2',8)
 text(38,25,'Accessible version and optional Wayfold app',8,'Bold',accent)
 c.linkURL(url,(38,21,287,36),relative=0)
def header(label,title,sub):
 text(38,753,'WAYFOLD COMPANION  /  '+label,9,'Bold',accent)
 text(38,718,title,26,'Bold')
 wrap(38,690,sub,536,11)
header('GROUP CARDS','Jonah’s unfinished conversation','Read Jonah 3:9–4:11. Sort six claims by what the passage supports, conflicts with or leaves open. Bring a Bible in the translation your group uses.')
text(38,636,'SUPPORTS',10,'Bold',accent);text(219,636,'CONFLICTS',10,'Bold',accent);text(406,636,'LEAVES OPEN',10,'Bold',accent)
wrap(38,620,'The text backs this claim.',159,9);wrap(219,620,'The text gives a reason to reject it.',159,9);wrap(406,620,'The passage does not settle it.',168,9)
text(38,575,'Cut the cards apart, or write a category beside each. Add the verse you used.',10)
for i,(code,claim,category,ref,key) in enumerate(cards):
 x=38+(i%2)*276;y=548-(i//2)*147
 c.setStrokeColor(HexColor(line));c.setLineWidth(.8);c.setDash(3,3);c.rect(x,y-130,260,130,stroke=1,fill=0);c.setDash()
 text(x+12,y-24,code,17,'Bold',accent)
 wrap(x+12,y-47,claim,235,11,leading=16)
 text(x+12,y-105,'Category',8,'Bold');text(x+12,y-121,'Verse',8,'Bold')
 c.setStrokeColor(HexColor(line));c.line(x+65,y-106,x+247,y-106);c.line(x+65,y-122,x+247,y-122)
text(38,86,'Facilitator steps, roles and answer key are on page 2.',10,'Bold',accent)
footer(1);c.showPage()
header('FACILITATOR GUIDE','Keep the passage open','Suggested length: 20 minutes. Adjust the pace to your group. The activity is a close-reading exercise for adults or teens.')
y=642
for title,body in steps:
 text(38,y,title,11,'Bold',accent);y=wrap(38,y-17,body,536,9.5,leading=13)-9
text(38,y,'THREE ROLES TO ROTATE',9,'Bold',accent);y-=18
for title,body in roles:
 y=wrap(38,y,title+' — '+body,536,9.2,leading=12)-5
text(38,y-3,'ANSWER KEY',9,'Bold',accent);y-=21
for code,claim,category,ref,key in cards:
 y=wrap(38,y,code+' · '+category+' · '+ref+' — '+key,536,9.2,leading=12)-5
text(38,y-3,'A QUESTION TO LEAVE WITH',9,'Bold',accent);y-=20
y=wrap(38,y,'How does the final question change the way you read the earlier scene with the plant? Point to details in Jonah 4:6–11. Keep personal reflection separate from claims about what Jonah did next.',536,9.5,leading=13)-10
y=wrap(38,y,'Reuse: groups, teachers and libraries may print, photocopy or share the complete, unmodified packet free with credit to Honest Little Apps. Cards include statements to test against the passage. All teaching prompts are original. Bring your group’s Bible.',536,8.2,leading=11)
assert y>68,y
footer(2);c.showPage();c.save()
h=['<section class="section" id="jonah-evidence-sort"><h2>Try a group evidence sort with Jonah</h2><p>Read Jonah 3:9–4:11 together. Then sort six claims into three categories using the text as your evidence. The final question gives the group something to return to after checking its answers.</p><p><a href="jonah-ending-evidence-sort.pdf">Print the two-page facilitator packet (PDF)</a></p><details><summary>Use the complete group activity on screen</summary><p>Suggested length: 20 minutes. Adjust the pace to your group. The activity is a close-reading exercise for adults or teens.</p><h3>Run the session</h3><ol>']
for title,body in steps:h.append('<li><strong>'+escape(title)+'</strong>. '+escape(body)+'</li>')
h+=['</ol><h3>Rotate the three roles</h3><dl>']
for title,body in roles:h+=['<dt><strong>'+title+'</strong></dt><dd>'+escape(body)+'</dd>']
h+=['</dl><h3>Sort the six claims</h3><p><strong>Supports</strong> means the text backs the claim. <strong>Conflicts</strong> means the text gives a reason to reject it. <strong>Leaves open</strong> means the passage does not settle it.</p><ol type="A">']
for code,claim,*rest in cards:h+=['<li>'+escape(claim)+'</li>']
h+=['</ol><p>For each card, name a category and the verse that led to it.</p><details><summary>Read the referenced answer key</summary><ol type="A">']
for code,claim,category,ref,key in cards:h+=['<li><strong>'+category+'</strong> — '+escape(ref)+'. '+escape(key)+'</li>']
h+=['</ol></details><h3>A question to leave with</h3><p>How does the final question change the way you read the earlier scene with the plant? Point to details in Jonah 4:6–11. Keep personal reflection separate from claims about what Jonah did next.</p></details><p>Groups, teachers and libraries may print, photocopy or share the complete, unmodified packet free with credit to Honest Little Apps.</p><p>Cards include statements to test against the passage. All teaching prompts are original. References were checked against <a href="https://ebible.org/engwebp/JON03.htm">Jonah 3</a> and <a href="https://ebible.org/engwebp/JON04.htm">Jonah 4</a> in the public-domain World English Bible. Use your group’s own translation while comparing the wording.</p></section>']
(base/'section.html').write_text(''.join(h))
