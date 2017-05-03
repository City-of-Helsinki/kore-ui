'use strict';

import React from 'react';
import DocumentTitle from 'react-document-title';

class AboutPage extends React.Component {

  render() {
    return (
      <DocumentTitle title='Tietoa palvelusta - Koulurekisteri'>
        <div className='about-page'>
          <div className='container'>
            <h1>Tietoa Koulurekisteri.hel.fi –palvelusta</h1>
            <p className='lead'>
              Koulurekisteristä voit etsiä tietoa Helsingin kouluista kaupungin perustamisesta
              lähtien.
              Rekisteriin on koottu koulujen toiminnan kannalta oleellisimmat asiat, kuten
              nimenmuutokset, sijainnit ja tietoa koulutyypistä eri aikoina. Voit etsiä tietoa
              yleissivistävästä kansanopetuksesta 1550-luvulta nykypäivään.
            </p>
            <p>
              Vuosikymmenien aikana yhdistyneet ja toisistaan eronneet koulut on linkitetty
              rekisterissä. Lisäksi tietoa löytyy koulujen rehtoreista.
            </p>
            <p>
              Nykyään toimivien koulujen tiedot päivitetään koulurekisteriin lukuvuosittain ja
              historiallista tietoa täydennetään tarpeen mukaan.
            </p>
            <p>
              Koulurekisterin tiedot on koottu arkistolähteistä ja kirjallisuudesta. Palvelussa
              käytetyt historialliset kartat ovat Helsingin kaupunginarkiston ja
              kaupunkimittausosaston kokoelmista. Valokuvat ovat pääosin
              Helsingin kaupunginmuseon kuva-arkistosta.
            </p>
            <p>
              Koulurekisteri on Helsingin kaupungin Tietokeskuksen kaupunginarkiston ja
              opetusviraston yhteinen hanke. Palvelun on
              toteuttanut <a href='http://www.fastmonkeys.com/'>Fast Monkeys Oy</a> yhteistyössä
              Helsingin kaupunginkanslian kumppanikoodarien kanssa.
              Palvelun <a href='https://github.com/City-of-Helsinki/kore'>rajapinta</a>{' '}
              ja <a href='https://github.com/fastmonkeys/kore'>käyttöliittymä</a> ovat avointa
              lähdekoodia ja vapaasti kaikkien tutkittavissa ja
              paranneltavissa. Aineistoon voi tutustua myös osoitteessa http://kore.hel.ninja/v1/
            </p>
          </div>
        </div>
      </DocumentTitle>
    );
  }
}

export default AboutPage;
