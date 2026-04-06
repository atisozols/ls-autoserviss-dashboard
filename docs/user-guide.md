# Autoserviss — Lietotāja rokasgrāmata

---

## Pieslēgšanās

Atverot sistēmu, tiek parādīta pieslēgšanās lapa.

- Ievadi **lietotājvārdu** un **paroli**
- Spied **Pieslēgties**

Pēc veiksmīgas pieslēgšanās tiec novirzīts uz darbu sarakstu.

---

## Navigācija

Kreisajā pusē vienmēr redzama navigācija ar trim posteņiem: **Darbi**, **Darbinieki** un **Iestatījumi**.

### Globālais perioda pārslēdzējs

Lapas augšā labajā pusē atrodas perioda pārslēdzējs. Tas darbojas **visās lapās** — periods saglabājas, pārvietojoties starp Darbi un Darbinieki.

Divi režīmi:

- **Mēnesis** — rāda datus izvēlētajā mēnesī
- **Nedēļa** — rāda datus izvēlētajā darba nedēļā (pirmdiena–svētdiena)

Ar bultiņām **‹** un **›** var pārvietoties uz iepriekšējiem periodiem. Pašreizējā perioda "nākamais" bultiņa ir atspējota.

Nedēļas skats darbojas pareizi arī tad, ja nedēļa šķer divu mēnešu robežu (piemēram, 28. apr. – 2. maijs).

---

## Galvenais skats — Darbu saraksts

### Kopsavilkuma kartiņas

Zem perioda pārslēdzēja redzamas četras kartiņas:

| Kartiņa | Ko rāda |
|---|---|
| **Ienākumi** | Kopējie perioda ieņēmumi |
| **Izmaksas** | Darbu izmaksas + fiksētās izmaksas par pagājušajām dienām |
| **Peļņa** | Ienākumi mīnus izmaksas |
| **Gaida apmaksu** | Neapmaksāto darbu kopsumma |

Fiksētās izmaksas tiek iekļautas tikai par darba dienām līdz šodienai ieskaitot — tādējādi peļņa nenorāda nepamatoti zemu vērtību perioda sākumā.

### Meklēšana

Zem kopsavilkuma kartiņām atrodas meklēšanas lauks. Ievadi klienta vārdu, telefona numuru vai auto numurzīmi — saraksts filtrējas uzreiz.

### Darbu tabula

Katra rinda ir viens darbs. Redzams datums, numurzīme, klients, pozīciju skaits, izmaksas, ienākumi, peļņa un apmaksas statuss.

Ja klientam ir norādīts telefons, viņa vārds ir klikšķināms — nospied, lai zvanītu.

Spied **Atvērt →** pie jebkura darba, lai atvērtu tā detalizēto skatu.

---

## Jauna darba izveide

Spied pogu **Jauns darbs +** lapas augšā.

Atveras logs ar laukiem:

- **Datums** — automātiski aizpildīts ar šodienas datumu
- **Numurzīme** — auto reģistrācijas numurs (piemēram, AB1234)
- **Klienta vārds** — neobligāts
- **Tel. numurs** — neobligāts
- **Darbinieks** — izvēle no saraksta (neobligāts; redzams tikai ja sistēmā ir pievienoti darbinieki)

Spied **Saglabāt un atvērt** — darbs tiek izveidots un uzreiz atveras tā detalizētais skats.

---

## Darba detalizētais skats

### Galvene

Augšā redzama numurzīme, klienta vārds un datums. Ja norādīts telefons, tas ir klikšķināms saite — nospied, lai zvanītu tieši no lapas.

Labajā pusē divas pogas:
- **PDF** — lejupielādēt darba lapu
- **Dzēst darbu** — neatgriezeniski dzēš darbu un visas tā pozīcijas

### Finanšu kartiņas

Četras kartiņas rāda šī konkrētā darba rezultātus:

- **Ienākumi** — kopējie šī darba ieņēmumi
- **Izmaksas** — pozīciju izmaksas + aprēķinātā daļa no fiksētajām mēneša izmaksām
- **Peļņa** — ienākumi mīnus izmaksas
- **Gaida apmaksu** — vēl neapmaksātā summa

### Pamatinformācija

Šeit var labot darba pamata datus:

- **Datums**, **Numurzīme**, **Klienta vārds**, **Tel. numurs**
- **Darbinieks** — var mainīt vai noņemt (ja sistēmā ir pievienoti darbinieki)
- **Piezīmes** — brīvs teksts par darbu

Pēc izmaiņām spied **Saglabāt galveni**.

> Maiņot darbinieku, tas ietekmē tikai **jaunas** pozīcijas — esošās pozīcijas saglabā savas vēsturiskās likmes.

### Maksājumu statuss

Rāda cik daudz no darba summas ir apmaksāts:

- Progresa josla vizuāli parāda apmaksāto procentu
- Redzams: apmaksātā summa, kopējā summa, atlikusī summa

**Lai atzīmētu apmaksu:**
- Ievadi saņemto summu laukā un spied **Saglabāt**, vai
- Spied **Apmaksāts ✓**, ja samaksāts pilnā apmērā

---

## Darba pozīcijas

Darba apakšdaļā atrodas tabula ar visām pozīcijām — katra rinda ir viena detaļa vai viena darba vienība.

### Jauna pozīcija

Pēdējā rinda tabulā ar **+** ir ievades rinda jaunai pozīcijai.

Aizpildi laukus:

| Lauks | Apraksts |
|---|---|
| **Detaļa / darbs** | Nosaukums, piemēram, "Bremžu kluči priekšā" |
| **Kods** | Detaļas kods vai artikuls (neobligāts) |
| **Daudz.** | Daudzums |
| **Iepirkums** | Iepirkuma cena par vienību (EUR) |
| **Pārdošana** | Pārdošanas cena klientam par vienību (EUR) |
| **Stundas** | Nostrādātās stundas šai pozīcijai |
| **Piezīmes** | Brīvs teksts (neobligāts) |

Spied **Enter** vai **✓** pogu, lai pievienotu rindu.

### Aprēķinātās kolonnas

Katras rindas labajā pusē automātiski tiek rādīts:

| Kolonna | Ko rāda |
|---|---|
| **Darbinieks** | Darbinieka algas izmaksas šai pozīcijai |
| **Izmaksas** | Kopējās izmaksas (detaļas iepirkums + darbinieks) |
| **Ienākumi** | Kopējie ienākumi (detaļas pārdošana + darba cena) |
| **Peļņa** | Ienākumi mīnus izmaksas (zaļš/sarkans) |

### Esošo pozīciju labošana

Katra rinda ir tieši rediģējama — klikšķini uz jebkura lauka un maini vērtību. Saglabāšana notiek automātiski pēc lauka pamešanas.

Mazais punkts rindas beigās rāda saglabāšanas statusu:
- **Zaļš** — saglabāts
- **Dzeltens** — saglabā...
- **Oranžs** — nav vēl saglabāts

Lai dzēstu rindu, spied **×** pogu labajā malā.

---

## Darbinieku lapa

Navigācijā spied **Darbinieki**.

### Perioda statistika

Lapas augšā redzamas divas kopsavilkuma kartiņas par **izvēlēto periodu**:

- **Kopējās stundas** — visu darbinieku nostrādātās stundas
- **Kopējās algas izmaksas** — visu darbinieku algas

Tabula rāda katru darbinieku ar viņa stundām un algas izmaksām izvēlētajā periodā.

> Periods (mēnesis vai nedēļa) ir tas pats, kas Darbu lapā — mainot periodu, tas mainās abās lapās vienlaikus.

### Darbinieku pārvaldība

Zemāk atrodas darbinieku saraksts ar iespēju:

- **Labot** — mainīt darbinieka vārdu vai stundas likmi (inline)
- **Dzēst** — noņemt darbinieku (darbi saglabājas, bet darbinieka saite tiek noņemta)

### Jauna darbinieka pievienošana

Saraksta apakšā atrodas forma:

- Ievadi **vārdu**
- Norādi **stundas likmi** (EUR/h), noklusēti 8 €
- Spied **Pievienot +**

---

## PDF eksports

Darba detalizētajā skatā spied pogu **PDF**.

Atveras jauna cilne ar darba lapu — tiek automātiski atvērts printēšanas dialogs. Izvēlies **Saglabāt kā PDF**.

PDF saturēs:
- Numurzīme, klients, datums
- Tabulu ar katras pozīcijas aprakstu, detaļas cenu, darba cenu un kopsummu
- Kopējo darba summu apakšā

---

## Iestatījumi

Navigācijā spied **Iestatījumi**.

### Darba likmes

- **Pakalpojuma likme** — stundas cena klientam (EUR/h), noklusēti 35 €
- **Darbinieka likme** — noklusētā darbinieka izmaksu likme (EUR/h), noklusēti 8 €; tiek izmantota ja darbam nav piesaistīts konkrēts darbinieks

Šīs likmes tiek izmantotas kā noklusējums **jaunām** pozīcijām. Esošās pozīcijas saglabā savas vēsturiskās vērtības.

### Fiksētās mēneša izmaksas

Ievadi aptuvenos mēneša izdevumus:

- Elektroenerģija
- Īre
- Siltums
- Uzkopšana
- Apģērbs

Šīs izmaksas tiek automātiski sadalītas pa darba dienām un iekļautas perioda kopsavilkumā. Aprēķinā tiek ņemtas vērā tikai darba dienas no perioda sākuma līdz šodienai ieskaitot.

Spied **Saglabāt iestatījumus**, lai saglabātu izmaiņas.

---

## Izrakstīšanās

Navigācijas apakšā spied **Iziet**, lai izrakstītos.
