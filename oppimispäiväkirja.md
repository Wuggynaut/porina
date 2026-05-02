# Oppimispäiväkirja

## Yleiskatsaus

Porina on mobiilisovellus erikoiskahvin valmistukseen. Käyttäjät voivat selata kuratoituja reseptejä pour over-, AeroPress- ja pressopannumenetelmiin, säätää suhteita, seurata vaiheittaista ajastinta valmistuksen aikana sekä tallentaa valmistuskertoja.
Projekti kehitettiin Windows ja Linux-ympäristöissä (IntelliJ IDEA), Androidille, käyttäen Expoa ja TypeScriptiä.

___

## Vaiheet 1 & 2: Tietomallit, navigaatio, reseptiselain

Alkuvaihe keskittyi pääasiassa Expo Routerin ja React Nativen layout-mallin omaksumiseen.
Expo Routerin tiedostopohjainen reititys tuntui luontevalta web-kehyksistä siirryttäessä; `[id].tsx` luo dynaamisen reitin, ja parametrit saadaan `useLocalSearchParams`-hookin kautta.
Yllättävämpi yksityiskohta oli, että reittiparametrit ovat aina merkkijonoja, vaikka URL:iin välitettäisiin numero. Tämän vuoksi suhdelaskurini tuotti aluksi NaN-arvoja, koska tein laskutoimituksia ilman tyyppimuunnosta.

React Nativen flexbox käyttäytyi paikoin odottamattomasti. Esimerkiksi, käytin aikaa selvittääkseni, miksi `justifyContent: 'space-between'` ei vaikuttanut nappirivissä. Ongelma ei ollut ominaisuudessa, vaan siinä, että parent-kontaineri kutistui sisältönsä leveyteen.
Layout ongelmissa tulikin nopeasti selväksi, että usein ongelmat kohdistuvat ylempiin kontainereihin, eikä elementteihin joita juuri tarkastellaan.
Tämän takia aloin käyttämään tilapäistä `backgroundColor: Red` debuggaus-väriä leiskaa tehdessä.

Tässä vaiheessa irrotin uudelleenkäytettävän `Card`-komponentin havaittuani samanlaisia tyylejä useissa näkymissä.
Keskeinen päätös oli, tehdäänkö siitä komponentti vai pelkkä jaettu tyylimäärittely.
Päädyin komponenttiin, koska kortit keräävät ajan myötä yhteistä toiminnallisuutta. Tämä osottautui ajan myötä oikeaksi päätökseksi.

TypeScript toi kitkaa React Navigationin `headerTitleStyle`-määrittelyssä, joka sallii vain rajatun joukon ominaisuuksia, vaikka runtime hyväksyy laajemman `TextStyle`-joukon.
Esimerkiksi `letterSpacing` ja `textTransform` toimivat käytännössä, mutta TypeScript hylkäsi ne.
Ratkaisin tämän tyyppimuunnoksella (`as any`), mikä ei ole eleganttia, mutta tuntui olevan suhteellisen yleinen ratkaisumalli ongelmaan ratkaisuja etsiessäni.

___

## Vaihe 3: Ajastin

Tämä vaihe sisälsi eniten oppimista sekä eniten epäonnistuneiden lähestymistapojen iterointia.

### useBrewTimer-hook ja reducer-virheet

Ajastimen tilakone toteutettiin `useReducer`-hookilla. Opettavin bugi oli switch-casessa: `RESUME`-haara ei virheellisesti palauttanut arvoa, joten suoritus jatkui seuraavaan `TICK-haaraan`, joka keskeytti heti, koska tila oli edelleen 'paused'. Resume-painike ei näyttänyt tekevän mitään.
Virhe oli hankala havaita, koska runtime-virhettä ei syntynyt. Tähän löytyi kuitenkin asetus, jolla kääntäjä tunnistaa tämän jatkossa.

### SVG-rengas ja varjokikkailu

Edistymisrengas kävi läpi useita visuaalisia versioita. Tavoitteena oli “upotettu” ulkoasu, jossa vaalea rengas näyttää kaiverretulta.
Koska react-native-svg ei tue kunnolla SVG-filttereitä, yritin simuloida efektiä useilla päällekkäisillä kuvioilla eri leveydellä ja läpinäkyvyydellä.
Tämä ei suuresta vaivasta huolimatta missään välissä tuottanut tyydyttävää tulosta, joten luovuin tästä.

Palasin yksinkertaisiin väreihin, mikä toi simppelimmän, mutta toimivan, visuaalisen ilmeen.

### Reanimated

Reanimated mahdollisti ajastimen renkaan sulavan animoimisen, mutta se kävi läpi usean iteraation ennen kuin toimiva ratkaisu löytyi.
Ensimmäinen versio käytti 950 ms:n `withTiming`-animaatiota siirtymien välillä. Tein tämän jotta tickien saapumisen ja animoinnin välille tulisi konfliktia. Tämä ei kuitenkaan toiminut, sillä animaatio jäi aina hieman jälkeen ja askelrajoilla se näkyi selvästi: askelkortti vaihtui ja haptinen palaute laukesi, kun renkaalla oli vielä vähän matkaa jakoviivalle.

Yritetty korjaus oli animoida yhden tickin verran eteenpäin: laskea seuraava tavoitepositio ja animoida siihen koko sekunnin ajan. Tämä kuitenkin rikkoi idle-tilan: rengas animoitui sekunnin edelle jo mountissa ennen kuin ajastin oli edes käynnissä. Lisäksi tauolla rengas jäi näkyvästi todellista tilannetta edelle.

Seuraavaksi kokeilin, että ProgressRing tietää ajastimen tilan, ei pelkästään sen progress-arvoa. Käynnissä ollessaan se animoi eteenpäin seuraavaan tick-positioon, jotta liike on jatkuvaa ja sulavaa.
Idle- ja valmis-tilassa se napsahtaa nopeasti oikeaan kohtaan kevyellä ease-animaatiolla.
Taukotilassa palauttaminen todelliseen progress-arvoon kuitenkin aiheutti näkyvän nykäyksen taaksepäin, mikä näytti väärältä.

Lopullinen korjaus oli `cancelAnimation(animatedProgress)`, joka pysäyttää jaetun arvon sen hetkiseen interpoloituun kohtaan.

#### Nappien ja varjojen animoinnit

Nappien jakautumisanimaatio puolestaan opetti, että animoitavan elementin on oltava mountattuna koko ajan.
Ehdollinen renderöinti estää siirtymäanimaatiot. Ratkaisuna oli hallita näkyvyyttä `opacity`-arvolla ja estää interaktiot `disabled`-propilla.

Androidilla korttivarjot rikkoutuivat animoinneissa. Tämä johtuu siitä, että Androidin varjoihin käyttämä `elevation`-varjot eivät yhdisty hyvin opacity-animaatioihin.
Ratkaisu oli tehdä `Card`-komponentista `Animated.View` ja nollata `elevation` animaation alussa.

### Ajastimen fontti

Ajastimen numerot “hyppivät” vaakasuunnassa, koska niissä käyttämäni DM Sans -fontti käyttää suhteellisia merkkejä. Vaihto monospaced-fonttiin (DM Mono) ratkaisi ongelman.


### Expo Go vs kehitysbuildit

Suurin yksittäinen ongelma ilmeni tässä vaiheessa: Reanimated aiheutti kaatumisen Expo Go:ssa, ja sen syyn löytäminen oli hankalaa harhaanjohtavien virheilmoitusten takia.

Ratkaisu oli siirtyä kehitysbuildien käyttöön ja konfiguroida Android SDK. Tämä toi myös Windows-spesifiä kitkaa ympäristömuuttujien kanssa.

___

## Vaihe 4: Firebase ja Firestore

## Firebase JS SDK vs React Native Firebase

Valitsin Firebase JS SDK:n, koska se toimii Expo Go:ssa ilman natiivirakennusta. Rajoitettu autentikointituki se ei ollut tässä projektissa ongelma.

## Firestore

Tämä vaihe eteni sujuvasti. Lopulliset Firestore toiminnallisuudet ovat hyvin kevyitä. Uusia käsitteitä olivat Firestoren reaaliaikaiset kuuntelijat, joskin en ehtinyt sisäistämään näitä erityisen syvällisesti ennenkuin projekti piti saada purkkiin palautusta varten.

___

## Muuta huomioitavaa

### Versionhallinta ja Tietoturva-häiriö

Julkaisin vahingossa Firebase-konfiguraation GitHubiin, mikä sisälsi API-avaimen. GitHub ilmoitti virheestä automaattisesti.
Korjasin sen seuraavasti:

1. Avaimen rotaatio
2. Poisto versionhallinnasta
3. Historian siivous (`git filter-repo`)
4. Force push

Sivuvaikutuksena `.gitignore` aiheutti ongelmia, kun aloin tekemään EAS-Buildeja, mutta tämän ratkaisin `.easignore`-tiedostolla.

### Arkkitehtuurireflektio

Viimeisessä vaiheessaa tajusin, että Firebase on ylimitotitettu tämän projektin käyttötarkitukseen.
Sovellus on perustavanlaatuisesti yksittäisen käyttäjän offline-työkalu. Pidän nämä toiminnallisuudet kunnes kurssi on päättynyt, mutta jatkokehityksen yhteydessä aion kitkeä nämä aspektit sovelluksesta pois, ja siirtyä lokaaleihin vaihtoehtoihin.

### Visuaalinen ilme

Olen erityisen ylpeä sovelluksen visuaalisesta ilmeestä. Sovelluksen väripaletti syntyi käyttämällä [Khroma](https://www.khroma.co/generator) sovellusta. Uskoisin, että jos olisin hypännyt suoraan vääntämään ulkonäköä koodiin, väripaletiksi olisi tullut suhteellisen 'geneerinen' ruskea, koska se on ensimmäinen assosiaatio kahviin. Tällainen prosessi kuitenkin johtaa helposti ikävän geneereihin ratkaisuihin, monesti ensimmäinen idea ei ole se paras idea.

Toinen apuväline joka hioi sovelluksen visuaalista ilmettä oli mockupit joita työstin eri ruuduista Photoshopissa. Nämä löytyvät myös versionhallinnasta. Lopullinen visuaalinen ilme ei vastaa näitä konseptikuvia 1:1, mutta ne loivat todella avuliaan tähtäimen kun visuaalista layouttia rakensi.

Sovelluksen logon tein Photoshopissa ite.