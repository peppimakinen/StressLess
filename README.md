# StressLess
## Projekti: Terveyssovelluksen kehitys
#### Aleksi Kivilehto, Peppi Mäkinen, Tinna Rantalainen ja Tytti Vilén

Committing messages should be in the following format:  
Verb + What (+ in progress)

### Frontend
**Fonts:**  
Headings - font-family: 'Cabin', sans-serif;  
Body text - font-family: "Nunito Sans", sans-serif;

**Image naming practice:**  
imgName.filetype

**Colours:**  
Black - #1E1B18  
White - #FFFAFF  
Buttons/Accents - #313E50  
Light Blue - #E1F6FA  
Green - #9BCF53  
Yellow - #FFF67E  
Red - #FF8585
Grey - #D9D9D9


### StressLess on web-sovellus, joka yhdistää Kubios HRV mobiilisovelluksen intuitiiviseen päiväkirjamerkintöihin perustuvaan kalenteriin.

**Tärkeitä URLeja:**
- Sovelluksen URL: hyte-server-aleksi.northeurope.cloudapp.azure.com
- Api on saatavilla osoitteessa: hyte-server-aleksi.northeurope.cloudapp.azure.com/api
- Api dokumentaatio: hyte-server-aleksi.northeurope.cloudapp.azure.com/docs
- Sovelluksen testikansio: https://github.com/peppimakinen/StressLess/tree/release/Frontend/tests

**Sovelluksen database:**
![databaseStructure](https://github.com/peppimakinen/StressLess/assets/111729213/d89eca6c-f535-42b9-adaa-c8cbb1f8e33f)
Kuva 1. Sovelluksen database.

**Sovelluksen user interface:**
Landing sivu ja kirjautuminen:
![Screenshot 2024-05-09 234629](https://github.com/peppimakinen/StressLess/assets/111729213/9a81261f-b95b-4a85-93a8-7af56451086a)
Kuva 2. Landing page.

- Sovellus tukee kahta eri käyttäjätasoa: patient ja doctor [kuva 2]. Kummallekkin käyttäjätasolle on omat kirjautumissivut, joihin pääsee kotisivulta.
- Sovellus tunnistaa automaattisesti käyttäjätason.
![Screenshot 2024-05-02 220117](https://github.com/peppimakinen/StressLess/assets/111729213/c3bb687a-81fe-4165-afd5-a94ae9eeb2fe)
Kuva 3. Potilaiden sisäänkirjautumissivu.
![Screenshot 2024-05-10 003538](https://github.com/peppimakinen/StressLess/assets/111729213/1c06653e-675c-4382-a0ca-8ad383e5f63f)
Kuva 4. Lääkärin sisäänkirjautumissivu.

- Potilas autentikoituu sovellukseen Kubios tunnuksien avulla [kuva 3]. Lääkäri puolestaan käyttää sovelluksen ylläpitäjien luomia tunnuksia, jotka ei ole linkitetty Kubiokseen [kuva 4].
- Mikäli potilas kirjautuu ensimmäisen kerran sovellukseen, sovellus automaattisesti hakee Kubios Cloudista tarvittavat tiedot, ja rekisteröi uuden StressLess käyttäjän järjestelmään.
- Sovellus tunnistaa, onko sisäänkirjautuva potilas suorittanut alkukartoituksen. Mikäli alkukartoitusta ei ole suoritettu, käyttäjä uudelleenohjataan sinne.

Alkukartoitus:
![Screenshot 2024-05-10 000036](https://github.com/peppimakinen/StressLess/assets/111729213/e0512394-cdc5-4e46-8c68-0f6989308aec)
Kuva 5. Alkukartoitus.

- Uudelle potilaskäyttäjälle esitetään kysymyksiä, joista osa on pakollisia [kuva 5].
- Potilas voi lisätä aktiviteetteja, joita käytetään myöhemmin päiväkirjamerkintöjen tekemisessä.

![Screenshot 2024-05-10 000057](https://github.com/peppimakinen/StressLess/assets/111729213/f1ad41c5-0511-4733-8a83-36ab970fb70c)
Kuva 6. Alkukartoituksen lopuksi käyttäjä valitsee liittääkö lääkärinsä tiliin.
![Screenshot 2024-05-10 004043](https://github.com/peppimakinen/StressLess/assets/111729213/b39ea48f-fbde-4584-b4a6-3ad0696c6274)
Kuva 7. Lääkärin ilmoitus alkukartoituksessa.

- Potilas voi etsiä lääkäriä käyttäjänimen avulla [kuva 6 ja kuva 7]. Mikäli lääkärikäyttäjä löytyy, käyttäjä voi jakaa tälle omat tietonsa. 

Kalenterinäkymä:
![Screenshot 2024-05-08 000725](https://github.com/peppimakinen/StressLess/assets/111729213/cda3772d-ddc3-4d06-98b5-b9a0c01770ed)
Kuva 8. Potilaan kalenterinäkymä.

- Potilas voi selata kalenteri ja luoda uusia päiväkirjamerkintöjä vain niille päiville, joilla on HRV dataa saatavilla Kubios Cloudista [kuva 8].
![Screenshot 2024-05-09 234826](https://github.com/peppimakinen/StressLess/assets/111729213/d05c97c1-581d-4e9d-8c52-96df32ad5424)
Kuva 9. Päiväkirjamerkinnän tekeminen.

- Potilas voi lisätä päiväkirjamerkintään värikoodin, alkukartoituksessa määritetyn aktiviteetin ja muistiinpanoja päivästä[kuva 9].
- Kun päiväkirjamerkintä on luotu, sovellus hakee automaattisesti sille päivälle olevan HRV datan Kubios Cloudista ja liittää sen päiväkirjamerkintään.
- Kalenterinäkymä päivittyy automaattisesti uuden merkinnän luomisen jälkeen.

![Screenshot 2024-05-09 234814](https://github.com/peppimakinen/StressLess/assets/111729213/aeddfa9c-3ef2-40ed-bfbb-741ef38b716a)
Kuva 10. Tallennetun päiväkirjamerkinnän katseleminen.

- Potilas voi avata luodun päiväkirjamerkinnän klikkaamalla sitä, jolloin tämä näkee myös siihen liitetyt HRV arvot [kuva 10].
- Potilas ei voi luoda uutta päiväkirjamerkintää tulevaisuuteen.
- Potilas voi muokata olemassaolevia päiväkirjamerkintöjä. Muokatun päiväkirjamerkinnän tallentaminen myös päivittää uudet mittausarvot sille päivälle, mikäli uusi mittaus on suoritettu onnistuneesti.

Lääkärin asiakasnäkymä:
![Screenshot 2024-05-09 235140](https://github.com/peppimakinen/StressLess/assets/111729213/c3c419fd-a802-44a7-8f8f-9cdc323208c7)
Kuva 11. Lääkärin potilasnäkymä.

- Sivulla näkyy kaikki potilaat, jotka ovat jakaneet sisäänkirjautuneelle lääkärille tietonsa [kuva 11].
![Screenshot 2024-05-09 235154](https://github.com/peppimakinen/StressLess/assets/111729213/2b9b260a-8310-44f4-a333-26c11d53dd24)
Kuva 12. Lääkärin valitseman potilaan kalenterinäkymä.

- Lääkäri voi avata tietyn potilaan kalenterinäkymän [kuva 12].
![Screenshot 2024-05-10 000603](https://github.com/peppimakinen/StressLess/assets/111729213/b6895cea-cfde-4d48-b464-5d112708b7f2)
Kuva 13. Potilaan tekemä päiväkirjamerkintä lääkärin näkökulmasta.

- Lääkäri voi avata tietyn potilaan olemassa olevan päiväkirjamerkinnän klikkaamalla sitä [kuva 13]. Lääkärikäyttäjälle näytetään tässä myös potilaan kattavampi HRV analyysi siltä päivältä. 
- Kalenterinäkymästä lääkäri voi avata valitun potilaan viikkoraportit tai alkukartoituksen.
![Screenshot 2024-05-09 235224](https://github.com/peppimakinen/StressLess/assets/111729213/c3cadfd9-a144-416f-8b34-5495e1aab03d)
Kuva 14. Potilaan tekemä alkukartoitus lääkärin näkökulmasta.

- Jos lääkärikäyttäjä valitsee 'Alkukartoitus' -painikkeen, sovellus luo kalenterinäkymän päälle modaalin, joka näyttää valitun potilaan vastaukset alkukartoituksessa [kuva 14]. 

Viikkoraporttien lista:
![Screenshot 2024-05-09 234839](https://github.com/peppimakinen/StressLess/assets/111729213/ff94a139-a61d-4d78-be79-1e8e476323c1)
Kuva 15. Viikkoraporttilista.

- Sovellus luo automaattisesti viikkoraportin aikavälillä: Ensimmäinen päiväkirjamerkintä - viimeisin sunnuntai. Viikkoraportit generoituu automaattisesti niille viikoille, joilla on olemassa olevia päiväkirjamerkintöjä, kun "Viikkoraportit" välilehti avataan [kuva 15].
- Kun viikkoraportti on generoitu, sitä ei voi enään muokata. Tämä siksi, että sovellus on luotu käytettäväksi päivittäin, eikä päiväkirjamerkintöjä lisäillä menneille viikoille jälkikäteen. 
- Lääkärikäyttäjän viikkoraporttien lista, sekä itse viikkoraportit ovat samat kuin potilaan näkymässä. 

Yksittäinen viikkoraportti:
![Screenshot 2024-05-09 234922](https://github.com/peppimakinen/StressLess/assets/111729213/581af4b2-dd4a-40de-b875-a96f2d1b53c9)
Kuva 16. Viikkoraportti valitulta viikolta.

- Raportti kerää kaikki päiväkirjamerkinnät tietyltä aikaväliltä ja luo niiden perusteella raportin [kuva 16].
- Raportti sisältää:
    - Ympyrädiagrammin valitun viikon päiväkirjamerkintöjen värikoodeista
    - Pylväsdiagrammin viikonpäivien mitatusta stressi indeksistä
    - Sanallisen kuvauksen siitä, miten stressi indeksin keskiarvo eroaa viime viikon raportin stressi indeksin keskiarvosta.
 
Asetukset:
- Kaikilla käyttäjillä on kyky poistaa oma käyttäjätili
![Screenshot 2024-05-09 235244](https://github.com/peppimakinen/StressLess/assets/111729213/52fceb44-a981-4cf9-89bc-fbfe318851cb)
Kuva 17. Lääkärin profiili asetukset.

- Lääkärikäyttäjällä on kyky vaihtaa oman tilin salasana [kuva 17]. Potilas uudelleenohjataan Kubioksen palveluihin.
![Screenshot 2024-05-10 001100](https://github.com/peppimakinen/StressLess/assets/111729213/355469fd-5eb2-4151-811c-18d054554145)
Kuva 18. Potilaan yhteystiedot asetukset.

- Potilaalle näytetään lääkärin nimi, mikäli hän on valinnut alkukartoituksessa jakavansa tietojaan tälle [kuva 18].
![Screenshot 2024-05-09 234950](https://github.com/peppimakinen/StressLess/assets/111729213/2eed173f-ff95-434f-bb47-fab2dae7f592)
Kuva 19. Potilaan profiili asetukset.

- Potilaalle näytetään tehtyjen päiväkirjamerkintöjen lukumäärä [kuva 19].
![Screenshot 2024-05-09 235008](https://github.com/peppimakinen/StressLess/assets/111729213/47c70e61-4717-4557-a599-3ec07966c668)
Kuva 20. Ilmoitusten asetukset.

- "Ilmoitukset" välilehti on jatkokehitystä varten [kuva 20]. Niissä EI ole toiminnallisuutta. 

**Sovelluksen rautalankamalli Figmassa:** https://www.figma.com/design/RfTN8sGf2Gm3EorjUcXsC9/StressLess?node-id=0%3A1&t=MIqJtmYkvYciJton-1
Sovelluksen ulkomuotoon päädyttiin tekemään kosmeettisia muutoksia käyttäjätestien perusteella. Näitä kosmeettisia muutoksia ei päivitetty enää rautalankamalliin, joten visuaalisesti jotkin osiot voivat olla erilaisia käytössä olevaan sovellukseen verrattuna.

**Tiedossa olevat bugit/ongelmat:**
- Sovelluksen näyttötilaisuudessa käyttäjät pystyivät ohittamaan alkukartoituksen “aktiviteetti”-osion, vaikka se on sovelluksen käytölle olennainen osa. Kuitenkin ongelman syy saatiin nopeasti selville (unohtunut “required” kyseisestä kohdasta) ja bugi pystyttiin korjaamaan samana päivänä.


**Referenssit:**
- ChatGPT 3.5. ongelmanratkaisuun ja ratkaisun eri vaihtoehtojen vertailuun.
- Kurssin GitHub-sivustot.
- Sovelluksen taustakuva hankittu: https://pixabay.com/
- Muu kuvamateriaali sovellukseen hankittu: https://blush.design/
