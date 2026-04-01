# Autoservisa bilances kontroles sistēma - prasību dokuments

## 1. Projekta mērķis

Izstrādāt vienas lapas web aplikāciju autoservisam, kuras galvenais mērķis ir precīzi kontrolēt bilanci un peļņu katram servisā izpildītajam darbam.

Sistēmai jāpalīdz saprast, cik konkrētais klienta darbs servisam patiesībā nopelna, ņemot vērā:

- detaļu izmaksas
- detaļu pārdošanas cenas
- darba stundas
- darba ieņēmumus
- darbinieka izmaksas
- fiksētās mēneša izmaksas (elektroenerģija, īre, siltums, uzkopšana, apģērbs)
- citus papildus izdevumus
- gala peļņu

Galvenā biznesa problēma: teorētiski servisam vajadzētu pelnīt labi, bet praksē pāri nepaliek tas, kas sākotnēji plānots. Sistēmas uzdevums ir dot skaidru, vienkāršu un uzticamu pārskatu par katra darba reālo rezultātu.

## 2. Projekta apjoms

Pirmā versija ir manuālas ievades sistēma bez ārēju API integrācijām.

Tas nozīmē:

- lietotājs pats ievada visus datus
- detaļu cenas sākotnēji netiek automātiski ielasītas no ārējiem veikaliem
- sistēma fokusējas uz strukturētu datu ievadi, automātiskiem aprēķiniem un pārskatāmu bilances kontroli

## 3. Sistēmas tips

- vienas lapas web aplikācija
- desktop-first, bet lietojama arī planšetē
- vienkāršs un ātrs interfeiss ikdienas lietošanai servisā
- kreisā puse: vienmēr redzama navigācijas josla ar diviem posteņiem: Darbi un Iestatījumi
- galvenais saturs: darbu saraksts vai iestatījumu forma

## 4. Galvenie lietošanas scenāriji

### 4.1. Pieslēgšanās

Ja lietotājs nav autentificēts, viņš tiek novirzīts uz pieteikšanās lapu.

Pieteikšanās lapā jābūt:

- `email` vai `username` laukam
- `parole` laukam
- pieteikšanās pogai

Lietotāji tiek pievienoti manuāli datubāzē. Nav nepieciešams reģistrācijas plūsma.

### 4.2. Jauna darba izveide

Lietotājs spiež pogu `Jauns darbs +` navigācijā vai galvenajā skatā.

Atveras modālais logs ar šādiem laukiem:

- `date`, noklusēti aizpildīts ar šodienas datumu
- `plateNumber`, ar placeholder formātu `AB1234`
- `clientName`
- `clientPhone`

### 4.3. Pāreja uz darba detalizēto skatu

Pēc darba saglabāšanas lietotājs tiek novirzīts uz konkrētā darba detalizēto skatu.

### 4.4. Darba pozīciju ievade — optimizēts lielam skaitam

Pozīciju ievade ir optimizēta ātrumam — viens darbs parasti satur 10–30 pozīcijas.

Dizaina principi:
- katra pozīcija rādīta kompakti kā īsa rinda (ne karte vai liels bloks)
- jauna rinda tiek pievienota ar vienu klikšķi vai Enter taustiņu
- lauki ir mazi, skaitliski lauki šauri
- nav liekas atstarpes vai paddings
- `Tab` navigācija starp laukiem
- lietotājs var rediģēt pozīciju tieši tabulā (inline editing)

### 4.5. Esoša darba apskate un labošana

Lietotājs var atvērt saglabātu darbu, labot darba galveni un pievienot, dzēst vai labot tā pozīcijas.

### 4.6. Peļņas pārbaude konkrētam darbam

Lietotājs redz:

- darba kopējos ieņēmumus
- darba kopējās izmaksas
- darba kopējo peļņu
- katras pozīcijas individuālo peļņu

### 4.7. Darbu pārskatīšana laika periodā

Lietotājs var pārskatīt darbus divos režīmos:

- **Mēneša skats** — visi darbi izvēlētajā mēnesī
- **Nedēļas skats** — visi darbi tekošās ISO darba nedēļas laikā (pirmdiena–svētdiena)

Nedēļas skats darbojas pareizi arī tad, ja nedēļa šķer divu mēnešu robežu.

Starp režīmiem var pārslēgties ar pogu `Mēnesis / Nedēļa` blakus perioda navigācijai.

### 4.8. Meklēšana

Darbu sarakstā zem kopsavilkuma kartītēm ir meklēšanas lauks.

Lietotājs var atrast darbus pēc:

- klienta vārda
- telefona numura
- auto numurzīmes

Meklēšana filtrē redzamos darbus reāllaikā (klienta pusē).

### 4.9. PDF eksports konkrētam darbam

Lietotājs var lejupielādēt PDF dokumentu konkrētajam darbam.

PDF satur tabulu ar kolonnām:

- detaļas nosaukums
- pārdošanas cena
- piezīmes
- kopējā cena (daudzums × pārdošanas cena)

PDF apakšā rādīts kopsummas bloks ar darba kopējo summu.

### 4.10. Iestatījumu pārvaldība

Navigācijā pieejama "Iestatījumi" sadaļa.

Iestatījumos lietotājs var norādīt:

- darbinieka stundas likme (EUR/h), noklusēti `8 EUR/h`
- pakalpojuma stundas likme (EUR/h), noklusēti `35 EUR/h`
- aptuvenie mēneša fiksētie izdevumi (katrs atsevišķi):
  - elektroenerģija (EUR/mēnesī)
  - īre (EUR/mēnesī)
  - siltums (EUR/mēnesī)
  - uzkopšana (EUR/mēnesī)
  - apģērbs (EUR/mēnesī)

Šie dati tiek saglabāti datubāzē.

## 5. Datu modelis

### 5.1. Pamatprincips

Sistēmas pamatvienība ir `darbs`, nevis viena atsevišķa detaļas rinda.

Viens `darbs` satur:

- darba datumu
- auto identifikāciju
- klienta informāciju
- darba līmeņa piezīmes vai papildus izdevumus
- vairākas `darba pozīcijas`

### 5.2. Entīte: User (Lietotājs)

| Lauks | Tips | Obligāts | Apraksts |
| --- | --- | --- | --- |
| `id` | UUID / integer | jā | unikāls identifikators |
| `username` | string | jā | unikāls lietotājvārds |
| `passwordHash` | string | jā | paroles hash (bcrypt) |
| `createdAt` | datetime | jā | izveides laiks |

### 5.3. Entīte: Settings (Iestatījumi)

Viena rinda datubāzē — globālie servisa iestatījumi.

| Lauks | Tips | Obligāts | Apraksts |
| --- | --- | --- | --- |
| `id` | integer | jā | vienmēr `1` |
| `laborRate` | decimal | jā | pakalpojuma stundas likme, noklusēti `35` |
| `employeeHourlyCost` | decimal | jā | darbinieka stundas likme, noklusēti `8` |
| `electricityCost` | decimal | jā | elektroenerģija EUR/mēnesī, noklusēti `0` |
| `rentCost` | decimal | jā | īre EUR/mēnesī, noklusēti `0` |
| `heatCost` | decimal | jā | siltums EUR/mēnesī, noklusēti `0` |
| `cleaningCost` | decimal | jā | uzkopšana EUR/mēnesī, noklusēti `0` |
| `clothingCost` | decimal | jā | apģērbs EUR/mēnesī, noklusēti `0` |
| `updatedAt` | datetime | jā | pēdējo izmaiņu laiks |

### 5.4. Entīte: Darbs

Katrs `darbs` reprezentē vienu klienta servisa apmeklējumu vai vienu pabeigtu darbu.

| Lauks | Tips | Obligāts | Apraksts |
| --- | --- | --- | --- |
| `id` | UUID / integer | jā | unikāls darba identifikators |
| `date` | date | jā | darba datums |
| `plateNumber` | string | jā | auto numurzīme |
| `clientName` | string | nē | klienta vārds |
| `clientPhone` | string | nē | klienta tālruņa numurs |
| `vehicleNote` | string | nē | brīvs auto apraksts, piemēram, marka/modelis |
| `additionalExpenses` | decimal | nē | darba līmeņa papildus izdevumi, kas nav piesaistīti vienai pozīcijai |
| `notes` | text | nē | piezīmes par darbu |
| `createdAt` | datetime | jā | izveides laiks |
| `updatedAt` | datetime | jā | pēdējo izmaiņu laiks |

### 5.5. Entīte: Darba pozīcija

Katra `darba pozīcija` ir viena rinda konkrētā darbā.

| Lauks | Tips | Obligāts | Apraksts |
| --- | --- | --- | --- |
| `id` | UUID / integer | jā | unikāls pozīcijas identifikators |
| `jobId` | reference | jā | saite uz `darbs` |
| `rowOrder` | integer | jā | rindas secība darbā |
| `partName` | string | jā | detaļas vai pozīcijas nosaukums |
| `partCode` | string | nē | detaļas kods / artikuls |
| `quantity` | decimal | jā | daudzums, piemēram, `1`, `2` vai `4.5` |
| `partPurchasePrice` | decimal | jā | iepirkuma cena par vienību |
| `partSalePrice` | decimal | jā | pārdošanas cena klientam par vienību |
| `laborHours` | decimal | jā | nostrādātās stundas šai pozīcijai |
| `laborRate` | decimal | jā | darba ieņēmumu likme stundā (no iestatījumiem brīdī, kad pievienota) |
| `employeeHourlyCost` | decimal | jā | darbinieka izmaksu likme stundā (no iestatījumiem brīdī, kad pievienota) |
| `notes` | text | nē | piezīmes par konkrēto pozīciju |

### 5.6. Atvasinātie lauki

Šie lauki netiek ievadīti manuāli, bet tiek aprēķināti sistēmā:

#### Pozīcijas līmenī

- `partPurchaseTotal`
- `partSaleTotal`
- `laborRevenue`
- `employeeCost`
- `lineRevenue`
- `lineCost`
- `lineProfit`

#### Darba līmenī

- `totalRevenue`
- `totalCost`
- `profit`
- `positionCount`

## 6. Aprēķinu loģika

### 6.1. Pozīcijas aprēķini

`partPurchaseTotal = quantity * partPurchasePrice`

`partSaleTotal = quantity * partSalePrice`

`laborRevenue = laborHours * laborRate`

`employeeCost = laborHours * employeeHourlyCost`

`lineRevenue = partSaleTotal + laborRevenue`

`lineCost = partPurchaseTotal + employeeCost`

`lineProfit = lineRevenue - lineCost`

### 6.2. Darba aprēķini

`totalRevenue = visu pozīciju lineRevenue summa`

`totalCost = visu pozīciju lineCost summa + additionalExpenses`

`profit = totalRevenue - totalCost`

### 6.3. Fiksēto izmaksu integrācija

Fiksētās mēneša izmaksas tiek iekļautas perioda kopējo izmaksu aprēķinā, taču tikai par jau pagājušajām darba dienām (pirmdienā–piektdiena) līdz šodienai ieskaitot.

Piemēram, ja mēneša fiksētās izmaksas ir 600 EUR un mēnesī ir 20 darba dienas, bet ir pagājušas tikai 3 dienas, tiek iekļauts: `600 / 20 * 3 = 90 EUR`.

Tas novērš situāciju, kad peļņa izskatās negatīva tikai tāpēc, ka mēnesis vai nedēļa vēl nav beigusies.

Pagājušajiem periodiem (kur visi dati ir zināmi) tiek iekļautas visas perioda darba dienas.

## 7. Funkcionālās prasības

### 7.1. Autentifikācija

- Neautentificēts lietotājs tiek novirzīts uz `/login`
- Pieteikšanās ar `username` un `password`
- Sessija tiek saglabāta ar `httpOnly` cookie vai JWT
- Izrakstīšanās dzēš sesiju

### 7.2. Darbu saraksts

Sistēmai jāattēlo visi darbi tabulas veidā ar kolonnām:

- datums
- numurzīme
- klienta vārds
- pozīciju skaits
- kopējie ieņēmumi
- kopējās izmaksas
- peļņa

### 7.3. Jauna darba pievienošana

Jaunu darbu pievieno ar pogu `Jauns darbs +`.

### 7.4. Darba pozīciju pārvaldība — kompakts režīms

Darba detalizētajā skatā pozīcijas tiek rādītas kā kompaktas tabulas rindas.

Katrai rindai jābūt ievades laukiem:

- `partName` (plats)
- `partCode` (šaurs)
- `quantity` (šaurs)
- `partPurchasePrice` (šaurs)
- `partSalePrice` (šaurs)
- `laborHours` (šaurs)
- `notes` (vidēji plats)
- `lineProfit` (rādīts kā aprēķinātā vērtība)
- Dzēšanas poga

Jauna rinda tiek pievienota automātiski ar pogu vai Enter.

### 7.5. Pozīcijas aprēķinu attēlošana

Katras pozīcijas rindas beigās jābūt redzamiem:

- `lineProfit` (peļņa šai pozīcijai)

### 7.6. Darba kopējo rādītāju attēlošana

Darba detalizētā skata augšdaļā:

- `izmaksas`
- `ienākumi`
- `peļņa`

### 7.7. Darba rediģēšana

Lietotājs var rediģēt darba galveni un visas pozīcijas tieši tabulā.

### 7.8. Darba dzēšana

Ar apstiprinājuma darbību. Dzēšot darbu, tiek dzēstas arī tā pozīcijas.

### 7.9. Meklēšana

Zem kopsavilkuma kartītēm atrodas meklēšanas lauks. Filtrē redzamos darbus pēc:

- klienta vārda
- telefona numura
- numurzīmes

Meklēšana notiek klienta pusē — nav nepieciešams servera pieprasījums.

### 7.10. Perioda pārslēgšana

Darbu saraksta lapā lietotājs var izvēlēties divus skatīšanās režīmus:

- **Mēneša skats** — navigācija pa mēnešiem ar `‹` / `›` bultiņām
- **Nedēļas skats** — navigācija pa darba nedēļām (pirmdiena–svētdiena), darbojas arī ja nedēļa šķer mēnešu robežu

Pašreizējā perioda "nākamais" poga ir atspējota.

### 7.11. Kopsavilkuma rādītāji

Virs darbu saraksta jāparāda:

- kopējais darbu skaits
- kopējie ieņēmumi
- kopējās izmaksas
- kopējā peļņa

### 7.12. Iestatījumi

Iestatījumu lapā lietotājs var mainīt un saglabāt:

- `laborRate` — pakalpojuma stundas likme
- `employeeHourlyCost` — darbinieka stundas likme
- `electricityCost` — elektroenerģija mēnesī
- `rentCost` — īre mēnesī
- `heatCost` — siltums mēnesī
- `cleaningCost` — uzkopšana mēnesī
- `clothingCost` — apģērbs mēnesī

Mainot `laborRate` vai `employeeHourlyCost`, tas ietekmē tikai jaunās pozīcijas — esošās pozīcijas saglabā savas vērtības.

### 7.13. PDF eksports

Katra darba detalizētajā skatā ir poga `Lejupielādēt PDF`.

PDF satur:
- darba galveni (numurzīme, klients, datums)
- tabulu ar kolonnām: nosaukums, pārdošanas cena, piezīmes, kopā
- kopsummas rindu apakšā

### 7.14. Datu saglabāšana

Visi darbi, pozīcijas un iestatījumi jāsaglabā persistenti datubāzē.

## 8. UI/UX prasības

### 8.1. Navigācija

Fiksēta kreisā sānu josla (sidebar), vienmēr redzama:

- Servisa nosaukums / logo augšpusē
- Navigācijas posteņi:
  - `Darbi` (darbu saraksts)
  - `Iestatījumi`
- Izrakstīšanās poga apakšpusē

### 8.2. Animācijas (Framer Motion)

- Lappušu pārejas animācijas (fade-in/slide-in)
- Ielādes ekrāns ar animētu indikatoru
- Modālo logu animācijas (parādīšanās/aizvēršanās)
- Darbu saraksta rindu animācijas (stagger)
- Pozīciju rindu pievienošanas/dzēšanas animācijas
- Metrika karšu ielādes animācijas

### 8.3. Kompakts pozīciju saraksts

- Pozīciju rindas minimāla augstuma (ne lielākas par vajadzīgo)
- Skaitliskie lauki šauri (maks. 80-90px plati)
- Nosaukuma lauks plats (aizpilda pieejamo vietu)
- Rindas vizuāli atdalītas, bet bez lieka padding
- Hover efekts uz rindas

### 8.4. Ielādes stāvokļi

- Skeleton animācija datu ielādes laikā
- Pogu ielādes stāvoklis (spinner) pēc iesniegšanas
- Optimistiskā UI (pozīcija tiek pievienota momentāni)

### 8.5. Krāsu shēma

- Fons: #f3f4f6
- Virsma: #ffffff
- Teksts: #111827
- Pelēks: #6b7280
- Peļņa: #166534 / #dcfce7
- Zaudējums: #b91c1c / #fee2e2
- Akcents: #2563eb (zils)

### 8.6. Responsivitāte

Primāri desktop lietojums. Planšetē josla var sašaurināties līdz ikonām.

## 9. Validācijas prasības

### 9.1. Obligātie lauki darba līmenī

- `date`
- `plateNumber`

### 9.2. Obligātie lauki pozīcijas līmenī

- `partName`
- `quantity`
- `partPurchasePrice`
- `partSalePrice`
- `laborHours`

### 9.3. Skaitliskie lauki

Tikai derīgas skaitliskas vērtības (nav negatīvas vērtības tur, kur nav loģiski).

## 10. Autentifikācija

### 10.1. Plūsma

1. Lietotājs atver `/login`
2. Ievada `username` un `password`
3. Serveris pārbauda hash
4. Ja pareizi — tiek izveidota sessija un lietotājs tiek novirzīts uz `/`
5. Ja nepareizi — tiek rādīta kļūda

### 10.2. Aizsardzība

- Visas lapas (izņemot `/login`) aizsargātas ar middleware
- Sesija glabājas `httpOnly` cookie
- Paroles tiek hashētas ar `bcrypt`

### 10.3. Lietotāju pārvaldība

MVP versijā lietotāji tiek pievienoti tieši datubāzē. Nav nepieciešams admin UI.

## 11. PDF eksports

### 11.1. Formāts

- A4 lapas izmērs
- Latvijas formatētas cenas (EUR)
- Datums DD.MM.YYYY formātā

### 11.2. Saturs

**Galvene:**
- Numurzīme
- Klienta vārds
- Datums

**Tabula:**
| Nosaukums | Pārdošanas cena | Piezīmes | Kopā |
|-----------|----------------|---------|------|
| ...       | ...            | ...     | ...  |

**Apakša:**
- Kopsumma: `totalRevenue`

## 12. Tehniskās prasības

### 12.1. Stack

- Frontend: Next.js 15 (App Router)
- Backend: Next.js Server Actions
- Database: PostgreSQL
- ORM: Prisma
- Auth: sessijas ar JWT vai `iron-session`
- Animācijas: Framer Motion
- PDF: `@react-pdf/renderer` vai `jsPDF`
- Styling: Custom CSS vai Tailwind

### 12.2. Datubāzes tabulas

- `users`
- `settings`
- `jobs`
- `job_items`

### 12.3. Aprēķinu loģika

Visi aprēķini centralizēti serverī. `laborRate` un `employeeHourlyCost` glabājas katrā pozīcijā atsevišķi vēsturiskās precizitātes dēļ.

## 13. MVP robežas

Šīs funkcijas nav obligātas:

- Detaļu cenu automātiska ielasīšana
- Klientu kartītes
- Auto vēsture
- Noliktavas uzskaite
- Darbinieku atsevišķa uzskaite
- Grāmatvedības integrācijas
- Multi-user permission sistēma ar lomām
- Darba statusu plūsma

## 14. Akcepta kritēriji

MVP tiek uzskatīts par gatavu, ja:

1. Neautentificēts lietotājs tiek novirzīts uz `/login`
2. Pēc pieteikšanās lietotājs redz darbu sarakstu
3. Lietotājs var pievienot jaunu darbu
4. Lietotājs var pievienot 10–30 pozīcijas vienam darbam ātri un ērti
5. Pozīcijas ir kompaktas — aizņem maz vietas
6. Visi aprēķini (pozīcija un darba līmenī) ir pareizi
7. Iestatījumu lapā var mainīt likmes un fiksētās izmaksas
8. Jaunu pozīciju pievienošana izmanto aktuālās iestatījumu likmes
9. Esošās pozīcijas saglabā savas vēsturiskās likmes
10. PDF eksports darbojas un satur pareizos datus
11. Framer Motion animācijas darbojas nevainojami
12. Ielādes ekrāns redzams datu ielādes laikā
13. Kreisā sānu josla vienmēr redzama ar Darbi un Iestatījumi posteņiem
14. Meklēšana un filtrēšana darbojas

## 15. Potenciālie attīstības virzieni

1. Detaļu cenu lookup
2. Klientu datubāze
3. Auto vēsture
4. Servisa darbu statusi
5. Darbinieku piesaiste pozīcijām
6. Paplašinātas atskaites (peļņa pa mēnešiem, klientiem, detaļu tipiem)
7. Excel / CSV eksports
8. Importēšana no Excel
9. Multi-user ar lomām (admins, meistars, vadītājs)
10. Fiksēto izmaksu automātiska sadale pa darbiem
