# StressLess
## Projekti: Terveyssovelluksen kehitys
#### Aleksi Kivilehto, Peppi Mäkinen, Tinna Rantalainen ja Tytti Vilén

StressLess on web-sovellus, joka yhdistää Kubios HRV mobiilisovelluksen intuitiiviseen päiväkirjamerkintöihin perustuvaan kalenteriin.

## Tärkeitä URLeja
- Sovelluksen URL: https://hyte-server-aleksi.northeurope.cloudapp.azure.com
- Api on saatavilla osoitteessa: https://hyte-server-aleksi.northeurope.cloudapp.azure.com/api
    - Tässä osoitteessa ei ole placeholder HTML-sivua, mutta tämä on API pyyntöjen URL:in pohja.
- Api dokumentaatio: https://hyte-server-aleksi.northeurope.cloudapp.azure.com/docs
- Sovelluksen testikansio: https://github.com/peppimakinen/StressLess/tree/main/tests
- **Sovelluksen rautalankamalli Figmassa:** https://www.figma.com/design/RfTN8sGf2Gm3EorjUcXsC9/StressLess?node-id=0%3A1&t=MIqJtmYkvYciJton-1
    - Sovelluksen ulkomuotoon päädyttiin tekemään kosmeettisia muutoksia käyttäjätestien perusteella. Näitä kosmeettisia muutoksia ei päivitetty enää rautalankamalliin, joten visuaalisesti jotkin osiot voivat olla erilaisia käytössä olevaan sovellukseen verrattuna.

## Testikäyttäjät
- Sovelluksen potilasnäkymään kirjaudutaan olemissaolevilla Kubios-tunnuksilla.
- Potilas voi luoda päiväkirjamerkintöjä vain päiville, joilla on suoritettuja Readiness mittauksia.
- Lääkärikäyttäjän tunnukset löytyvät OMA:sta.
    - Tälle lääkärikäyttäjälle voi myös jakaa oman potilaskäyttäjän datan, kun suorittaa alkukartoituksen.
 
- **Note** Mikäli kirjauduit jo sovellukseen loppuseminaarin aikana, olet suorittanut alkukartoituksen silloin. Sinun täytyy poistaa olemassaoleva tilisi, mikäli haluat täyttää alkukartoituksen uudestaan. Olemassaolevan alkukartoituksen muokkaaminen on nostettu esiin "Jatkokehitysideat"-kohdassa.
  
## Sovelluksen käyttöliittymä

### Landing sivu ja kirjautuminen:
![Screenshot 2024-05-09 234629](https://github.com/peppimakinen/StressLess/assets/111729213/9a81261f-b95b-4a85-93a8-7af56451086a)
Kuva 1. Landing page.

- Sovellus tukee kahta eri käyttäjätasoa: patient ja doctor [kuva 1]. Kummallekkin käyttäjätasolle on omat kirjautumissivut, joihin pääsee kotisivulta.
- Sovellus tunnistaa automaattisesti käyttäjätason.
![Screenshot 2024-05-02 220117](https://github.com/peppimakinen/StressLess/assets/111729213/c3bb687a-81fe-4165-afd5-a94ae9eeb2fe)
Kuva 2. Potilaiden sisäänkirjautumissivu.
![Screenshot 2024-05-10 003538](https://github.com/peppimakinen/StressLess/assets/111729213/1c06653e-675c-4382-a0ca-8ad383e5f63f)
Kuva 3. Lääkärin sisäänkirjautumissivu.

- Potilas autentikoituu sovellukseen Kubios tunnuksien avulla [kuva 2]. Lääkäri puolestaan käyttää sovelluksen ylläpitäjien luomia tunnuksia, jotka ei ole linkitetty Kubiokseen [kuva 3].
- Mikäli potilas kirjautuu ensimmäisen kerran sovellukseen, sovellus automaattisesti hakee Kubios Cloudista tarvittavat tiedot, ja rekisteröi uuden StressLess käyttäjän järjestelmään.
- Sovellus tunnistaa, onko sisäänkirjautuva potilas suorittanut alkukartoituksen. Mikäli alkukartoitusta ei ole suoritettu, käyttäjä uudelleenohjataan sinne.

### Alkukartoitus:
![Screenshot 2024-05-10 000036](https://github.com/peppimakinen/StressLess/assets/111729213/e0512394-cdc5-4e46-8c68-0f6989308aec)
Kuva 4. Alkukartoitus.

- Uudelle potilaskäyttäjälle esitetään kysymyksiä, joista osa on pakollisia [kuva 4].
- Potilas voi lisätä aktiviteetteja, joita käytetään myöhemmin päiväkirjamerkintöjen tekemisessä.

![Screenshot 2024-05-10 000057](https://github.com/peppimakinen/StressLess/assets/111729213/f1ad41c5-0511-4733-8a83-36ab970fb70c)
Kuva 5. Alkukartoituksen lopuksi käyttäjä valitsee liittääkö lääkärinsä tiliin.
![Screenshot 2024-05-10 004043](https://github.com/peppimakinen/StressLess/assets/111729213/b39ea48f-fbde-4584-b4a6-3ad0696c6274)
Kuva 6. Lääkärin ilmoitus alkukartoituksessa.

- Potilas voi etsiä lääkäriä käyttäjänimen avulla [kuva 5 ja kuva 6]. Mikäli lääkärikäyttäjä löytyy, käyttäjä voi jakaa tälle omat tietonsa. 

### Kalenterinäkymä:
![Screenshot 2024-05-08 000725](https://github.com/peppimakinen/StressLess/assets/111729213/cda3772d-ddc3-4d06-98b5-b9a0c01770ed)
Kuva 7. Potilaan kalenterinäkymä.

- Potilas voi selata kalenteri ja luoda uusia päiväkirjamerkintöjä vain niille päiville, joilla on HRV dataa saatavilla Kubios Cloudista [kuva 7].
![Screenshot 2024-05-09 234826](https://github.com/peppimakinen/StressLess/assets/111729213/d05c97c1-581d-4e9d-8c52-96df32ad5424)
Kuva 8. Päiväkirjamerkinnän tekeminen.

- Potilas voi lisätä päiväkirjamerkintään värikoodin, alkukartoituksessa määritetyn aktiviteetin ja muistiinpanoja päivästä[kuva 8].
- Kun päiväkirjamerkintä on luotu, sovellus hakee automaattisesti sille päivälle olevan HRV datan Kubios Cloudista ja liittää sen päiväkirjamerkintään.
- Kalenterinäkymä päivittyy automaattisesti uuden merkinnän luomisen jälkeen.

![Screenshot 2024-05-09 234814](https://github.com/peppimakinen/StressLess/assets/111729213/aeddfa9c-3ef2-40ed-bfbb-741ef38b716a)
Kuva 9. Tallennetun päiväkirjamerkinnän katseleminen.

- Potilas voi avata luodun päiväkirjamerkinnän klikkaamalla sitä, jolloin tämä näkee myös siihen liitetyt HRV arvot [kuva 9].
- Potilas ei voi luoda uutta päiväkirjamerkintää tulevaisuuteen.
- Potilas voi muokata olemassaolevia päiväkirjamerkintöjä. Muokatun päiväkirjamerkinnän tallentaminen myös päivittää uudet mittausarvot sille päivälle, mikäli uusi mittaus on suoritettu onnistuneesti.

### Lääkärin asiakasnäkymä:
![Screenshot 2024-05-09 235140](https://github.com/peppimakinen/StressLess/assets/111729213/c3c419fd-a802-44a7-8f8f-9cdc323208c7)
Kuva 10. Lääkärin potilasnäkymä.

- Sivulla näkyy kaikki potilaat, jotka ovat jakaneet sisäänkirjautuneelle lääkärille tietonsa [kuva 10].
![Screenshot 2024-05-09 235154](https://github.com/peppimakinen/StressLess/assets/111729213/2b9b260a-8310-44f4-a333-26c11d53dd24)
Kuva 11. Lääkärin valitseman potilaan kalenterinäkymä.

- Lääkäri voi avata tietyn potilaan kalenterinäkymän [kuva 11].
![Screenshot 2024-05-10 000603](https://github.com/peppimakinen/StressLess/assets/111729213/b6895cea-cfde-4d48-b464-5d112708b7f2)
Kuva 12. Potilaan tekemä päiväkirjamerkintä lääkärin näkökulmasta.

- Lääkäri voi avata tietyn potilaan olemassa olevan päiväkirjamerkinnän klikkaamalla sitä [kuva 12]. Lääkärikäyttäjälle näytetään tässä myös potilaan kattavampi HRV analyysi siltä päivältä. 
- Kalenterinäkymästä lääkäri voi avata valitun potilaan viikkoraportit tai alkukartoituksen.
![Screenshot 2024-05-09 235224](https://github.com/peppimakinen/StressLess/assets/111729213/c3cadfd9-a144-416f-8b34-5495e1aab03d)
Kuva 13. Potilaan tekemä alkukartoitus lääkärin näkökulmasta.

- Jos lääkärikäyttäjä valitsee 'Alkukartoitus' -painikkeen, sovellus luo kalenterinäkymän päälle modaalin, joka näyttää valitun potilaan vastaukset alkukartoituksessa [kuva 13]. 

### Viikkoraporttien lista:
![Screenshot 2024-05-09 234839](https://github.com/peppimakinen/StressLess/assets/111729213/ff94a139-a61d-4d78-be79-1e8e476323c1)
Kuva 14. Viikkoraporttilista.

- Sovellus luo automaattisesti viikkoraportin aikavälillä: Ensimmäinen päiväkirjamerkintä - viimeisin sunnuntai. Viikkoraportit generoituu automaattisesti niille viikoille, joilla on olemassa olevia päiväkirjamerkintöjä, kun "Viikkoraportit" välilehti avataan [kuva 14].
- Kun viikkoraportti on generoitu, sitä ei voi enään muokata. Tämä siksi, että sovellus on luotu käytettäväksi päivittäin, eikä päiväkirjamerkintöjä lisäillä menneille viikoille jälkikäteen. 
- Lääkärikäyttäjän viikkoraporttien lista, sekä itse viikkoraportit ovat samat kuin potilaan näkymässä. 

### Yksittäinen viikkoraportti:
![Screenshot 2024-05-09 234922](https://github.com/peppimakinen/StressLess/assets/111729213/581af4b2-dd4a-40de-b875-a96f2d1b53c9)
Kuva 15. Viikkoraportti valitulta viikolta.

- Raportti kerää kaikki päiväkirjamerkinnät tietyltä aikaväliltä ja luo niiden perusteella raportin [kuva 15].
- Raportti sisältää:
    - Ympyrädiagrammin valitun viikon päiväkirjamerkintöjen värikoodeista
    - Pylväsdiagrammin viikonpäivien mitatusta stressi indeksistä
    - Sanallisen kuvauksen siitä, miten stressi indeksin keskiarvo eroaa viime viikon raportin stressi indeksin keskiarvosta.
 
### Asetukset:
- Kaikilla käyttäjillä on kyky poistaa oma käyttäjätili
![Screenshot 2024-05-09 235244](https://github.com/peppimakinen/StressLess/assets/111729213/52fceb44-a981-4cf9-89bc-fbfe318851cb)
Kuva 16. Lääkärin profiili asetukset.

- Lääkärikäyttäjällä on kyky vaihtaa oman tilin salasana [kuva 16]. Potilas uudelleenohjataan Kubioksen palveluihin.
![Screenshot 2024-05-10 001100](https://github.com/peppimakinen/StressLess/assets/111729213/355469fd-5eb2-4151-811c-18d054554145)
Kuva 17. Potilaan yhteystiedot asetukset.

- Potilaalle näytetään lääkärin nimi, mikäli hän on valinnut alkukartoituksessa jakavansa tietojaan tälle [kuva 17].
![Screenshot 2024-05-09 234950](https://github.com/peppimakinen/StressLess/assets/111729213/2eed173f-ff95-434f-bb47-fab2dae7f592)
Kuva 18. Potilaan profiili asetukset.

- Potilaalle näytetään tehtyjen päiväkirjamerkintöjen lukumäärä [kuva 18].
![Screenshot 2024-05-09 235008](https://github.com/peppimakinen/StressLess/assets/111729213/47c70e61-4717-4557-a599-3ec07966c668)
Kuva 19. Ilmoitusten asetukset.

- "Ilmoitukset" välilehti on jatkokehitystä varten [kuva 19]. Niissä EI ole toiminnallisuutta. 


## Backend
StressLess API hyödyntää GET, POST, PUT ja DELETE toimintoja. Sen tarkoituksena on hallita sovelluksen käyttäjien tietoja sekä hakea Kubios Cloudista potilaskäyttäjien HRV dataa. 

- Api on saatavilla osoitteessa: https://hyte-server-aleksi.northeurope.cloudapp.azure.com/api
- Api dokumentaatio on saatavilla osoitteessa: https://hyte-server-aleksi.northeurope.cloudapp.azure.com/docs

### Käyttö
- Kloonaa repositorio laitteellesi
- Aja `npm i` backend kansion sisällä
- Asenna kaikki tarvittavat paketit
- Aja tietokannan luonti skripti backend/db kansiosta
- Luo oma `.env` tiedosto käyttäen `.env-sample` tiedostoa
- Käynnistä serveri ajamalla `npm run dev` backend kansion sisällä
- Luo Apidokumentaatio ajamalla `npm run docs` backend kansion sisällä serverin ollessa pois päältä

### Autentikaatio

Tämän API:n autentikaatio suoritetaan käyttämällä JSON Web Token (JWT) -tekniikkaa Bearer-autentikointiskeemalla. Sisäänkirjautumisen onnistuessa käyttäjälle palautetaan tokeni, joka tulee liittää uusiin palvelimeen kohdistuviin pyyntöihin.

Nämä tokenit vanhenevat tunnin kuluttua. Kun ne vanhenevat, sinun tulee hankkia uusi token uudelleenautentikoitumalla.

### Avainominaisuudet
- Tokenissa on määriteltynä käyttäjätaso. Valtaosa saatavilla olevista toiminnoista riippuu käyttäjätasosta.
- Sisäänkirjautuneen potilaan saatavilla olevat ominaisuudet riippuvat siitä, onko potilas suorittanut alkukartoituksen.
- Pyyntöjen sisältämä data ja parametrit validoidaan.
- Potilas voi jakaa valitsemalleen lääkärille tietonsa.
- Potilas voi luoda, muokata ja hakea päiväkirjamerkintöjä.
- Päiväkirjamerkintään yhdistetyn HRV analyysin tarkkuus riippuu käyttäjätasosta. Lääkärille näytetään koko analyysi, toisinkuin potilaalle.
- Viikkoraportit generoituvat automaattisesti joka viikon jälkeen, kun niitä haetaan ensimmäisen kerran.
- Generoitua viikkoraporttia ei voi muokata sen luomisen jälkeen.
- Potilaskäyttäjä ei voi käyttää lääkärille tarkoitettuja endpointteja.
- Lääkärikäyttäjä ei voi käyttää potilaalle tarkoitettuja endpointteja.
- Lääkärikäyttäjä ei voi hakea potilaan dataa, joka ei sitä jakanut hänelle alkukartoituksen yhteydessä.
- Lääkärikäyttäjä ei pysty muokata potilaan dataa.
- Kumpikin käyttäjäryhmä pystyy poistamaan oman tilin.

### Tietokannan rakenne
![databaseStructure](Backend/db/databaseStructure.png)
Kuva 20. Sovelluksen tietokanta

- Users - Sisältää käyttäjän
- Survey - Yhdistää tietyn alkukartoituksen tiettyyn käyttäjään
- SQ - Yhdistää tietyt kysymykset tiettyyn alkukartoitukseen
- Questions - Sisältää kysymykset ja käyttäjän vastaukset niihin kysymyksiin
- DiaryEntries - Sisältää tietyn käyttäjän päiväkirjamerkinnän pohjan
- CompletedActivities - Yhdistää tietyn suoritetun aktiviteetin tiettyyn päiväkirjamerkintään
- DM - Yhdistää haetun Kubios datan tiettyyn päiväkirjamerkintään
- Measurements - Sisältää kaiken Kubios Cloud HRV Readiness analyysi datan
- WeeklyReports - Yhdistää olemassaolevat viikkoraportit tiettyyn käyttäjään
- DoctorPatient - Yhdistää tietyn potilaan tiettyyn lääkäriin. Antaa lääkärille luvan katsoa tietyn potilaan tietoja. 

## Jatkokehitysideat
- Aktiviteettien lisäys ja poistaminen alkukartoituksen jälkeen.
- Ominaisuus, että kun aktiviteettejä lisää alkukartoituksessa, niin niitä voisi myös poistaa tai muokata esim kirjotusvirheiden takia
- Oman alkukartoituksen katsominen tai muokkaaminen potilaana. 
- Päiväkirjamerkinnän poistaminen.
- Oman lääkärin lisäys alkukartoituksen jälkeen.
- Valitun lääkärin poistaminen.
- "Ilmoitukset" välilehti loppuun.
- Monipuolisempi viikkoraportti lääkärikäyttäjälle.

## Tiedossa olevat bugit/ongelmat
- Sovelluksen näyttötilaisuudessa käyttäjät pystyivät ohittamaan alkukartoituksen “aktiviteetti”-osion, vaikka se on sovelluksen käytölle olennainen osa. **12.5.2024 Ongelma korjattu.**
- Ei havaittu bugi, mutta lievä puute: Viikkoraporttien generointia sunnuntain viimmeisinä tunteina ei ole saatu testattua kunnolla, sillä sovelluksen tapa tulkita aikavyöhykkeitä/päivämääriä ja kellojen siirtämistä Azuressa eroaa paikallisesta kehitysympäristöstä. Ongelmaan on puututtu backendissä määrittelemällä manuaalisesti kellonaikoja käytetyille päivämäärille.
- Mikäli käyttäjä kirjautuu ulos sovelluksesta, hänet uudelleenohjataan auth sivulle, josta ei pääse pois sivuston sisäise navigaation puuttumisen vuoksi. Käyttäjän pitää siis muistaa sovelluksen kotisivun URL palatakseen sivuston Landing pagelle.
- HTML dokumentin lataamisen yhteydessä ei tapahdu autentikaatiota, joten mikäli tiedät URL:in tiettyyn näkymään, pystyt myös esikatsella sivuston rakennetta. **Mitään sisältöä tai dataa ei kuitenkaan tässä näytetä, sillä käyttäjä ei ole autentikoitunut oikeaoppisesti**.
- Mikäli käyttäjällä on useampi viikkoraportti, niin voisi lisätä näkyvän scrollbaarin indikoimaan, että valikkoa voi scrollata alemmas.
- Mikäli backendin käyttöönotto ei onnistu, varmista että dotenv-lisäosa on ladattu onnistuneesti. Tähän ongelmaan on törmätty aikasemmin ja se on korjattu, mutta ratkaisun testaus on ollut rajallista sen intensiivisen luonteen vuoksi. 
  
## Referenssit
- Backendin kirjautumisen pohja perustuu opettajan malliesimerkkiin
- Backendin luoma yhteys Kubios Cloudiin on myös pohjautuu opettajan malliesimerkkiin
- Backendin report-controllerissa oleva `getWeekNumber` funktio on peräisin: https://bito.ai/resources/javascript-get-week-number-javascript-explained/ Tätä fuktiota muutettiin projektin loppupuolella chatGPT avulla, kun funktion toiminta petti sovelluksen ollessa Azuren palvelimella. 
- ChatGPT 3.5. ongelmanratkaisuun ja ratkaisun eri vaihtoehtojen vertailuun.
- Kurssin GitHub-sivustot.
- Sovelluksen taustakuva hankittu: https://pixabay.com/
- Muu kuvamateriaali sovellukseen hankittu: https://blush.design/
