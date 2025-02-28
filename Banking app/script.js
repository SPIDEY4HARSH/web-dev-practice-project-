'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollToFeature = document.querySelector('.btn--scroll-to-feature');
const btnScrollToConversion = document.querySelector('.btn--scroll-to-conversion');
const section1 = document.querySelector('#section--1');
const sectionConversion = document.querySelector('#section--conversion');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const btnConvert = document.querySelector('#btn-convert');
const fromSelect = document.querySelector('#from');
const toSelect = document.querySelector('#to');
const amount = document.querySelector('#amount');
const convertedAmount = document.querySelector('#converted__amount');
const convertedAmountLabel = document.querySelector('#converted__amount__label');

// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Button scrolling
btnScrollToFeature.addEventListener('click', function (e) {
  section1.scrollIntoView({ behavior: 'smooth' });
});

btnScrollToConversion.addEventListener('click', function (e) {
  sectionConversion.scrollIntoView({ behavior: 'smooth' });
});

// Page navigation

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  // Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// Tabbed component

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  // Guard clause
  if (!clicked) return;

  // Remove active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  // Activate tab
  clicked.classList.add('operations__tab--active');

  // Activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// Menu fade animation
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// Passing "argument" into handler
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

// Sticky navigation: Intersection Observer API

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

// Reveal sections
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// Lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

// Slider
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();

    activateDot(0);
  };
  init();

  // Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();


// API Handler 
class CurrencyAPI {
  baseUrl = 'https://api.currencyapi.com/v3/';

  constructor(apiKey = '') {
    this.headers = {
        apikey: apiKey
    };
  }

  call (endpoint, params = {}) {
    const paramString = new URLSearchParams({
        ...params
    }).toString();

    return fetch(`${this.baseUrl}${endpoint}?base_currency=CAD${paramString}`, { headers: this.headers })
        .then(response => response.json())
        .then(data => {
            return data;
        });
  }

  status () {
    return this.call('status');
  }

  currencies (params) {
    return this.call('currencies', params);
  }

  latest (params) {
    return this.call('latest', params);
  }

  historical (params) {
    return this.call('historical', params);
  }

  range (params) {
    return this.call('range', params);
  }

  convert (params) {
    return this.call('convert', params);
  }
}

var currenciesResp = '{"data":{"AED":{"symbol":"AED","name":"United Arab Emirates Dirham","symbol_native":"د.إ","decimal_digits":2,"rounding":0,"code":"AED","name_plural":"UAE dirhams","countries":["AE"]},"AFN":{"symbol":"Af","name":"Afghan Afghani","symbol_native":"؋","decimal_digits":0,"rounding":0,"code":"AFN","name_plural":"Afghan Afghanis","countries":["AF"]},"ALL":{"symbol":"ALL","name":"Albanian Lek","symbol_native":"Lek","decimal_digits":0,"rounding":0,"code":"ALL","name_plural":"Albanian lekë","countries":["AL"]},"AMD":{"symbol":"AMD","name":"Armenian Dram","symbol_native":"դր.","decimal_digits":0,"rounding":0,"code":"AMD","name_plural":"Armenian drams","countries":["AM"]},"ANG":{"symbol":"ƒ","name":"NL Antillean Guilder","symbol_native":"NAƒ","decimal_digits":2,"rounding":0,"code":"ANG","icon_name":"ang","name_plural":"NL Antillean Guilders","countries":["CW","SX"]},"AOA":{"symbol":"Kz","name":"Angolan Kwanza","symbol_native":"Kz","decimal_digits":2,"rounding":0,"code":"AOA","icon_name":"aoa","name_plural":"Angolan Kwanza","countries":["AO"]},"ARS":{"symbol":"AR$","name":"Argentine Peso","symbol_native":"$","decimal_digits":2,"rounding":0,"code":"ARS","name_plural":"Argentine pesos","countries":["AR"]},"AUD":{"symbol":"AU$","name":"Australian Dollar","symbol_native":"$","decimal_digits":2,"rounding":0,"code":"AUD","name_plural":"Australian dollars","countries":["AU","CC","CX","HM","KI","NF","NR","TV"]},"AWG":{"symbol":"Afl.","name":"Aruban Florin","symbol_native":"Afl.","decimal_digits":2,"rounding":0,"code":"AWG","icon_name":"awg","name_plural":"Aruban Florin","countries":["AW"]},"AZN":{"symbol":"man.","name":"Azerbaijani Manat","symbol_native":"ман.","decimal_digits":2,"rounding":0,"code":"AZN","name_plural":"Azerbaijani manats","countries":["AZ"]},"BAM":{"symbol":"KM","name":"Bosnia-Herzegovina Convertible Mark","symbol_native":"KM","decimal_digits":2,"rounding":0,"code":"BAM","name_plural":"Bosnia-Herzegovina convertible marks","countries":["BA"]},"BBD":{"symbol":"Bds$","name":"Barbadian Dollar","symbol_native":"$","decimal_digits":2,"rounding":0,"code":"BBD","icon_name":"bbd","name_plural":"Barbadian Dollars","countries":["BB"]},"BDT":{"symbol":"Tk","name":"Bangladeshi Taka","symbol_native":"৳","decimal_digits":2,"rounding":0,"code":"BDT","name_plural":"Bangladeshi takas","countries":["BD"]},"BGN":{"symbol":"BGN","name":"Bulgarian Lev","symbol_native":"лв.","decimal_digits":2,"rounding":0,"code":"BGN","name_plural":"Bulgarian leva","countries":["BG"]},"BHD":{"symbol":"BD","name":"Bahraini Dinar","symbol_native":"د.ب.‏","decimal_digits":3,"rounding":0,"code":"BHD","name_plural":"Bahraini dinars","countries":["BH"]},"BIF":{"symbol":"FBu","name":"Burundian Franc","symbol_native":"FBu","decimal_digits":0,"rounding":0,"code":"BIF","name_plural":"Burundian francs","countries":["BI"]},"BMD":{"symbol":"BD$","name":"Bermudan Dollar","symbol_native":"$","decimal_digits":2,"rounding":0,"code":"BMD","icon_name":"bmd","name_plural":"Bermudan Dollars","countries":["BM"]},"BND":{"symbol":"BN$","name":"Brunei Dollar","symbol_native":"$","decimal_digits":2,"rounding":0,"code":"BND","name_plural":"Brunei dollars","countries":["BN"]},"BOB":{"symbol":"Bs","name":"Bolivian Boliviano","symbol_native":"Bs","decimal_digits":2,"rounding":0,"code":"BOB","name_plural":"Bolivian bolivianos","countries":["BO"]},"BRL":{"symbol":"R$","name":"Brazilian Real","symbol_native":"R$","decimal_digits":2,"rounding":0,"code":"BRL","name_plural":"Brazilian reals","countries":["BR"]},"BSD":{"symbol":"B$","name":"Bahamian Dollar","symbol_native":"$","decimal_digits":2,"rounding":0,"code":"BSD","icon_name":"bsd","name_plural":"Bahamian Dollars","countries":["BS"]},"BTN":{"symbol":"Nu.","name":"Bhutanese Ngultrum","symbol_native":"Nu.","decimal_digits":2,"rounding":0,"code":"BTN","icon_name":"btn","name_plural":"Bhutanese Ngultrum","countries":["BT"]},"BWP":{"symbol":"BWP","name":"Botswanan Pula","symbol_native":"P","decimal_digits":2,"rounding":0,"code":"BWP","name_plural":"Botswanan pulas","countries":["BW","ZW"]},"BYN":{"symbol":"Br","name":"Belarusian ruble","symbol_native":"Br","decimal_digits":2,"rounding":0,"code":"BYN","name_plural":"Belarusian rubles","countries":[]},"BYR":{"symbol":"BYR","name":"Belarusian Ruble","symbol_native":"BYR","decimal_digits":0,"rounding":0,"code":"BYR","name_plural":"Belarusian rubles","countries":["BY"]},"BZD":{"symbol":"BZ$","name":"Belize Dollar","symbol_native":"$","decimal_digits":2,"rounding":0,"code":"BZD","name_plural":"Belize dollars","countries":["BZ"]},"CAD":{"symbol":"CA$","name":"Canadian Dollar","symbol_native":"$","decimal_digits":2,"rounding":0,"code":"CAD","name_plural":"Canadian dollars","countries":["CA"]},"CDF":{"symbol":"CDF","name":"Congolese Franc","symbol_native":"FrCD","decimal_digits":2,"rounding":0,"code":"CDF","name_plural":"Congolese francs","countries":["CD"]},"CHF":{"symbol":"CHF","name":"Swiss Franc","symbol_native":"CHF","decimal_digits":2,"rounding":0,"code":"CHF","name_plural":"Swiss francs","countries":["CH","LI"]},"CLF":{"symbol":"UF","name":"Unidad de Fomento","symbol_native":"UF","decimal_digits":2,"rounding":0,"code":"CLF","name_plural":"Unidad de Fomentos","countries":["CL"]},"CLP":{"symbol":"CL$","name":"Chilean Peso","symbol_native":"$","decimal_digits":0,"rounding":0,"code":"CLP","name_plural":"Chilean pesos","countries":["CL"]},"CNY":{"symbol":"CN¥","name":"Chinese Yuan","symbol_native":"CN¥","decimal_digits":2,"rounding":0,"code":"CNY","name_plural":"Chinese yuan","countries":["CN"]},"COP":{"symbol":"CO$","name":"Coombian Peso","symbol_native":"$","decimal_digits":0,"rounding":0,"code":"COP","name_plural":"Colombian pesos","countries":["CO"]},"CRC":{"symbol":"₡","name":"Costa Rican Colón","symbol_native":"₡","decimal_digits":0,"rounding":0,"code":"CRC","name_plural":"Costa Rican colóns","countries":["CR"]},"CUC":{"symbol":"CUC$","name":"Cuban Convertible Peso","symbol_native":"$","decimal_digits":2,"rounding":0,"code":"CUC","icon_name":"cuc","name_plural":"Cuban Convertible Peso","countries":["CU"]},"CUP":{"symbol":"$MN","name":"Cuban Peso","symbol_native":"$","decimal_digits":2,"rounding":0,"code":"CUP","icon_name":"cup","name_plural":"Cuban Peso","countries":["CU"]},"CVE":{"symbol":"CV$","name":"Cape Verdean Escudo","symbol_native":"CV$","decimal_digits":2,"rounding":0,"code":"CVE","name_plural":"Cape Verdean escudos","countries":["CV"]},"CZK":{"symbol":"Kč","name":"Czech Republic Koruna","symbol_native":"Kč","decimal_digits":2,"rounding":0,"code":"CZK","name_plural":"Czech Republic korunas","countries":["CZ"]},"DJF":{"symbol":"Fdj","name":"Djiboutian Franc","symbol_native":"Fdj","decimal_digits":0,"rounding":0,"code":"DJF","name_plural":"Djiboutian francs","countries":["DJ"]},"DKK":{"symbol":"Dkr","name":"Danish Krone","symbol_native":"kr","decimal_digits":2,"rounding":0,"code":"DKK","name_plural":"Danish kroner","countries":["DK","FO","GL"]},"DOP":{"symbol":"RD$","name":"Dominican Peso","symbol_native":"RD$","decimal_digits":2,"rounding":0,"code":"DOP","name_plural":"Dominican pesos","countries":["DO"]},"DZD":{"symbol":"DA","name":"Algerian Dinar","symbol_native":"د.ج.‏","decimal_digits":2,"rounding":0,"code":"DZD","name_plural":"Algerian dinars","countries":["DZ"]},"EGP":{"symbol":"EGP","name":"Egyptian Pound","symbol_native":"ج.م.‏","decimal_digits":2,"rounding":0,"code":"EGP","name_plural":"Egyptian pounds","countries":["EG","PS"]},"ERN":{"symbol":"Nfk","name":"Eritrean Nakfa","symbol_native":"Nfk","decimal_digits":2,"rounding":0,"code":"ERN","name_plural":"Eritrean nakfas","countries":["ER"]},"ETB":{"symbol":"Br","name":"Ethiopian Birr","symbol_native":"Br","decimal_digits":2,"rounding":0,"code":"ETB","name_plural":"Ethiopian birrs","countries":["ET"]},"EUR":{"symbol":"€","name":"Euro","symbol_native":"€","decimal_digits":2,"rounding":0,"code":"EUR","name_plural":"Euros","countries":["AD","AT","AX","BE","BL","CP","CY","DE","EA","EE","ES","EU","FI","FR","FX","GF","GP","GR","IC","IE","IT","LT","LU","LV","MC","ME","MF","MQ","MT","NL","PM","PT","RE","SI","SK","SM","TF","VA","XK","YT","ZW"]},"FJD":{"symbol":"FJ$","name":"Fijian Dollar","symbol_native":"$","decimal_digits":2,"rounding":0,"code":"FJD","icon_name":"fjd","name_plural":"Fijian Dollar","countries":["FJ"]},"FKP":{"symbol":"FK£","name":"Falkland Islands Pound","symbol_native":"£","decimal_digits":2,"rounding":0,"code":"FKP","icon_name":"fkp","name_plural":"Falkland Islands Pound","countries":["FK"]},"GBP":{"symbol":"£","name":"British Pound Sterling","symbol_native":"£","decimal_digits":2,"rounding":0,"code":"GBP","name_plural":"British pounds sterling","countries":["GB","GG","GS","IM","JE","TA","UK","ZW"]},"GEL":{"symbol":"GEL","name":"Georgian Lari","symbol_native":"GEL","decimal_digits":2,"rounding":0,"code":"GEL","name_plural":"Georgian laris","countries":["GE"]},"GGP":{"symbol":"£","name":"Guernsey pound","symbol_native":"£","decimal_digits":2,"rounding":0,"code":"GGP","name_plural":"Guernsey pounds","countries":[]},"GHS":{"symbol":"GH₵","name":"Ghanaian Cedi","symbol_native":"GH₵","decimal_digits":2,"rounding":0,"code":"GHS","name_plural":"Ghanaian cedis","countries":["GH"]},"GIP":{"symbol":"£","name":"Gibraltar Pound","symbol_native":"£","decimal_digits":2,"rounding":0,"code":"GIP","icon_name":"gip","name_plural":"Gibraltar Pounds","countries":["GI"]},"GMD":{"symbol":"D","name":"Gambian Dalasi","symbol_native":"D","decimal_digits":2,"rounding":0,"code":"GMD","icon_name":"gmd","name_plural":"Gambian Dalasi","countries":["GM"]},"GNF":{"symbol":"FG","name":"Guinean Franc","symbol_native":"FG","decimal_digits":0,"rounding":0,"code":"GNF","name_plural":"Guinean francs","countries":["GN"]},"GTQ":{"symbol":"GTQ","name":"Guatemalan Quetzal","symbol_native":"Q","decimal_digits":2,"rounding":0,"code":"GTQ","name_plural":"Guatemalan quetzals","countries":["GT"]},"GYD":{"symbol":"G$","name":"Guyanaese Dollar","symbol_native":"$","decimal_digits":2,"rounding":0,"code":"GYD","icon_name":"gyd","name_plural":"Guyanaese Dollar","countries":["GY"]},"HKD":{"symbol":"HK$","name":"Hong Kong Dollar","symbol_native":"$","decimal_digits":2,"rounding":0,"code":"HKD","name_plural":"Hong Kong dollars","countries":["HK"]},"HNL":{"symbol":"HNL","name":"Honduran Lempira","symbol_native":"L","decimal_digits":2,"rounding":0,"code":"HNL","name_plural":"Honduran lempiras","countries":["HN"]},"HRK":{"symbol":"kn","name":"Croatian Kuna","symbol_native":"kn","decimal_digits":2,"rounding":0,"code":"HRK","name_plural":"Croatian kunas","countries":["HR"]},"HTG":{"symbol":"G","name":"Haitian Gourde","symbol_native":"G","decimal_digits":2,"rounding":0,"code":"HTG","icon_name":"htg","name_plural":"Haitian Gourde","countries":["HT"]},"HUF":{"symbol":"Ft","name":"Hungarian Forint","symbol_native":"Ft","decimal_digits":0,"rounding":0,"code":"HUF","name_plural":"Hungarian forints","countries":["HU"]},"IDR":{"symbol":"Rp","name":"Indonesian Rupiah","symbol_native":"Rp","decimal_digits":0,"rounding":0,"code":"IDR","name_plural":"Indonesian rupiahs","countries":["ID"]},"ILS":{"symbol":"₪","name":"Israeli New Sheqel","symbol_native":"₪","decimal_digits":2,"rounding":0,"code":"ILS","name_plural":"Israeli new sheqels","countries":["IL","PS"]},"IMP":{"symbol":"£","name":"Manx pound","symbol_native":"£","decimal_digits":2,"rounding":0,"code":"IMP","name_plural":"Manx pounds","countries":[]},"INR":{"symbol":"Rs","name":"Indian Rupee","symbol_native":"টকা","decimal_digits":2,"rounding":0,"code":"INR","name_plural":"Indian rupees","countries":["BT","IN"]},"IQD":{"symbol":"IQD","name":"Iraqi Dinar","symbol_native":"د.ع.‏","decimal_digits":0,"rounding":0,"code":"IQD","name_plural":"Iraqi dinars","countries":["IQ"]},"IRR":{"symbol":"IRR","name":"Iranian Rial","symbol_native":"﷼","decimal_digits":0,"rounding":0,"code":"IRR","name_plural":"Iranian rials","countries":["IR"]},"ISK":{"symbol":"Ikr","name":"Icelandic Króna","symbol_native":"kr","decimal_digits":0,"rounding":0,"code":"ISK","name_plural":"Icelandic krónur","countries":["IS"]},"JEP":{"symbol":"£","name":"Jersey pound","symbol_native":"£","decimal_digits":2,"rounding":0,"code":"JEP","name_plural":"Jersey pound","countries":[]},"JMD":{"symbol":"J$","name":"Jamaican Dollar","symbol_native":"$","decimal_digits":2,"rounding":0,"code":"JMD","name_plural":"Jamaican dollars","countries":["JM"]},"JOD":{"symbol":"JD","name":"Jordanian Dinar","symbol_native":"د.أ.‏","decimal_digits":3,"rounding":0,"code":"JOD","name_plural":"Jordanian dinars","countries":["JO","PS"]},"JPY":{"symbol":"¥","name":"Japanese Yen","symbol_native":"￥","decimal_digits":0,"rounding":0,"code":"JPY","name_plural":"Japanese yen","countries":["JP"]},"KES":{"symbol":"Ksh","name":"Kenyan Shilling","symbol_native":"Ksh","decimal_digits":2,"rounding":0,"code":"KES","name_plural":"Kenyan shillings","countries":["KE"]},"KGS":{"symbol":"KGS","name":"Kyrgystani Som","symbol_native":"KGS","decimal_digits":2,"rounding":0,"code":"KGS","icon_name":"kgs","name_plural":"Kyrgystani Som","countries":["KG"]},"KHR":{"symbol":"KHR","name":"Cambodian Riel","symbol_native":"៛","decimal_digits":2,"rounding":0,"code":"KHR","name_plural":"Cambodian riels","countries":["KH"]},"KMF":{"symbol":"CF","name":"Comorian Franc","symbol_native":"FC","decimal_digits":0,"rounding":0,"code":"KMF","name_plural":"Comorian francs","countries":["KM"]},"KPW":{"symbol":"₩","name":"North Korean Won","symbol_native":"₩","decimal_digits":2,"rounding":0,"code":"KPW","icon_name":"kpw","name_plural":"North Korean Won","countries":["KP"]},"KRW":{"symbol":"₩","name":"South Korean Won","symbol_native":"₩","decimal_digits":0,"rounding":0,"code":"KRW","name_plural":"South Korean won","countries":["KR"]},"KWD":{"symbol":"KD","name":"Kuwaiti Dinar","symbol_native":"د.ك.‏","decimal_digits":3,"rounding":0,"code":"KWD","name_plural":"Kuwaiti dinars","countries":["KW"]},"KYD":{"symbol":"CI$","name":"Cayman Islands Dollar","symbol_native":"$‏","decimal_digits":2,"rounding":0,"code":"KYD","icon_name":"kyd","name_plural":"Cayman Islands Dollar","countries":["KY"]},"KZT":{"symbol":"KZT","name":"Kazakhstani Tenge","symbol_native":"тңг.","decimal_digits":2,"rounding":0,"code":"KZT","name_plural":"Kazakhstani tenges","countries":["KZ"]},"LAK":{"symbol":"₭N","name":"Laotian Kip","symbol_native":"₭‏‏","decimal_digits":0,"rounding":0,"code":"LAK","name_plural":"Laotian Kip","countries":["LA"]},"LBP":{"symbol":"LB£","name":"Lebanese Pound","symbol_native":"ل.ل.‏","decimal_digits":0,"rounding":0,"code":"LBP","name_plural":"Lebanese pounds","countries":["LB"]},"LKR":{"symbol":"SLRs","name":"Sri Lankan Rupee","symbol_native":"SL Re","decimal_digits":2,"rounding":0,"code":"LKR","name_plural":"Sri Lankan rupees","countries":["LK"]},"LRD":{"symbol":"LD$","name":"Liberian Dollar","symbol_native":"L$","decimal_digits":2,"rounding":0,"code":"LRD","icon_name":"lrd","name_plural":"Liberian Dollar","countries":["LR"]},"LSL":{"symbol":"L","name":"Lesotho Loti","symbol_native":"M","decimal_digits":2,"rounding":0,"code":"LSL","icon_name":"lsl","name_plural":"Lesotho Loti","countries":["LS"]},"LTL":{"symbol":"Lt","name":"Lithuanian Litas","symbol_native":"Lt","decimal_digits":2,"rounding":0,"code":"LTL","name_plural":"Lithuanian litai","countries":[]},"LVL":{"symbol":"Ls","name":"Latvian Lats","symbol_native":"Ls","decimal_digits":2,"rounding":0,"code":"LVL","name_plural":"Latvian lati","countries":[]},"LYD":{"symbol":"LD","name":"Libyan Dinar","symbol_native":"د.ل.‏","decimal_digits":3,"rounding":0,"code":"LYD","name_plural":"Libyan dinars","countries":["LY"]},"MAD":{"symbol":"MAD","name":"Moroccan Dirham","symbol_native":"د.م.‏","decimal_digits":2,"rounding":0,"code":"MAD","name_plural":"Moroccan dirhams","countries":["EH","MA"]},"MDL":{"symbol":"MDL","name":"Moldovan Leu","symbol_native":"MDL","decimal_digits":2,"rounding":0,"code":"MDL","name_plural":"Moldovan lei","countries":["MD"]},"MGA":{"symbol":"MGA","name":"Malagasy Ariary","symbol_native":"MGA","decimal_digits":0,"rounding":0,"code":"MGA","name_plural":"Malagasy Ariaries","countries":["MG"]},"MKD":{"symbol":"MKD","name":"Macedonian Denar","symbol_native":"MKD","decimal_digits":2,"rounding":0,"code":"MKD","name_plural":"Macedonian denari","countries":["MK"]},"MMK":{"symbol":"MMK","name":"Myanma Kyat","symbol_native":"K","decimal_digits":0,"rounding":0,"code":"MMK","name_plural":"Myanma kyats","countries":["MM"]},"MNT":{"symbol":"₮","name":"Mongolian Tugrik","symbol_native":"₮","decimal_digits":2,"rounding":0,"code":"MNT","icon_name":"mnt","name_plural":"Mongolian Tugrik","countries":["MN"]},"MOP":{"symbol":"MOP$","name":"Macanese Pataca","symbol_native":"MOP$","decimal_digits":2,"rounding":0,"code":"MOP","name_plural":"Macanese patacas","countries":["MO"]},"MRO":{"symbol":"UM","name":"Mauritanian ouguiya","symbol_native":"UM","decimal_digits":2,"rounding":0,"code":"MRO","name_plural":"Mauritanian ouguiyas","countries":["MR"]},"MUR":{"symbol":"MURs","name":"Mauritian Rupee","symbol_native":"MURs","decimal_digits":0,"rounding":0,"code":"MUR","name_plural":"Mauritian rupees","countries":["MU"]},"MVR":{"symbol":"MRf","name":"Maldivian Rufiyaa","symbol_native":"Rf","decimal_digits":2,"rounding":0,"code":"MVR","name_plural":"Maldivian Rufiyaa","countries":["MV"]},"MWK":{"symbol":"MK","name":"Malawian Kwacha","symbol_native":"MK","decimal_digits":2,"rounding":0,"code":"MWK","icon_name":"mwk","name_plural":"Malawian Kwacha","countries":["MW"]},"MXN":{"symbol":"MX$","name":"Mexican Peso","symbol_native":"$","decimal_digits":2,"rounding":0,"code":"MXN","name_plural":"Mexican pesos","countries":["MX"]},"MYR":{"symbol":"RM","name":"Malaysian Ringgit","symbol_native":"RM","decimal_digits":2,"rounding":0,"code":"MYR","name_plural":"Malaysian ringgits","countries":["MY"]},"MZN":{"symbol":"MTn","name":"Mozambican Metical","symbol_native":"MTn","decimal_digits":2,"rounding":0,"code":"MZN","name_plural":"Mozambican meticals","countries":["MZ"]},"NAD":{"symbol":"N$","name":"Namibian Dollar","symbol_native":"N$","decimal_digits":2,"rounding":0,"code":"NAD","name_plural":"Namibian dollars","countries":["NA"]},"NGN":{"symbol":"₦","name":"Nigerian Naira","symbol_native":"₦","decimal_digits":2,"rounding":0,"code":"NGN","name_plural":"Nigerian nairas","countries":["NG"]},"NIO":{"symbol":"C$","name":"Nicaraguan Córdoba","symbol_native":"C$","decimal_digits":2,"rounding":0,"code":"NIO","name_plural":"Nicaraguan córdobas","countries":["NI"]},"NOK":{"symbol":"Nkr","name":"Norwegian Krone","symbol_native":"kr","decimal_digits":2,"rounding":0,"code":"NOK","name_plural":"Norwegian kroner","countries":["BV","NO","SJ"]},"NPR":{"symbol":"NPRs","name":"Nepalese Rupee","symbol_native":"नेरू","decimal_digits":2,"rounding":0,"code":"NPR","name_plural":"Nepalese rupees","countries":["NP"]},"NZD":{"symbol":"NZ$","name":"New Zealand Dollar","symbol_native":"$","decimal_digits":2,"rounding":0,"code":"NZD","name_plural":"New Zealand dollars","countries":["CK","NU","NZ","PN","TK"]},"OMR":{"symbol":"OMR","name":"Omani Rial","symbol_native":"ر.ع.‏","decimal_digits":3,"rounding":0,"code":"OMR","name_plural":"Omani rials","countries":["OM"]},"PAB":{"symbol":"B/.","name":"Panamanian Balboa","symbol_native":"B/.","decimal_digits":2,"rounding":0,"code":"PAB","name_plural":"Panamanian balboas","countries":["PA"]},"PEN":{"symbol":"S/.","name":"Peruvian Nuevo Sol","symbol_native":"S/.","decimal_digits":2,"rounding":0,"code":"PEN","name_plural":"Peruvian nuevos soles","countries":["PE"]},"PGK":{"symbol":"K","name":"Papua New Guinean Kina","symbol_native":"K","decimal_digits":2,"rounding":0,"code":"PGK","icon_name":"pgk","name_plural":"Papua New Guinean Kina","countries":["PG"]},"PHP":{"symbol":"₱","name":"Philippine Peso","symbol_native":"₱","decimal_digits":2,"rounding":0,"code":"PHP","name_plural":"Philippine pesos","countries":["PH"]},"PKR":{"symbol":"PKRs","name":"Pakistani Rupee","symbol_native":"₨","decimal_digits":0,"rounding":0,"code":"PKR","name_plural":"Pakistani rupees","countries":["PK"]},"PLN":{"symbol":"zł","name":"Polish Zloty","symbol_native":"zł","decimal_digits":2,"rounding":0,"code":"PLN","name_plural":"Polish zlotys","countries":["PL"]},"PYG":{"symbol":"₲","name":"Paraguayan Guarani","symbol_native":"₲","decimal_digits":0,"rounding":0,"code":"PYG","name_plural":"Paraguayan guaranis","countries":["PY"]},"QAR":{"symbol":"QR","name":"Qatari Rial","symbol_native":"ر.ق.‏","decimal_digits":2,"rounding":0,"code":"QAR","name_plural":"Qatari rials","countries":["QA"]},"RON":{"symbol":"RON","name":"Romanian Leu","symbol_native":"RON","decimal_digits":2,"rounding":0,"code":"RON","name_plural":"Romanian lei","countries":["RO"]},"RSD":{"symbol":"din.","name":"Serbian Dinar","symbol_native":"дин.","decimal_digits":0,"rounding":0,"code":"RSD","name_plural":"Serbian dinars","countries":["RS"]},"RUB":{"symbol":"RUB","name":"Russian Ruble","symbol_native":"руб.","decimal_digits":2,"rounding":0,"code":"RUB","name_plural":"Russian rubles","countries":["RU","SU"]},"RWF":{"symbol":"RWF","name":"Rwandan Franc","symbol_native":"FR","decimal_digits":0,"rounding":0,"code":"RWF","name_plural":"Rwandan francs","countries":["RW"]},"SAR":{"symbol":"SR","name":"Saudi Riyal","symbol_native":"ر.س.‏","decimal_digits":2,"rounding":0,"code":"SAR","name_plural":"Saudi riyals","countries":["SA"]},"SBD":{"symbol":"SI$","name":"Solomon Islands Dollar","symbol_native":"$","decimal_digits":2,"rounding":0,"code":"SBD","icon_name":"sbd","name_plural":"Solomon Islands Dollars","countries":["SB"]},"SCR":{"symbol":"SRe","name":"Seychellois Rupee","symbol_native":"SR","decimal_digits":2,"rounding":0,"code":"SCR","icon_name":"scr","name_plural":"Seychellois Rupees","countries":["SC"]},"SDG":{"symbol":"SDG","name":"Sudanese Pound","symbol_native":"SDG","decimal_digits":2,"rounding":0,"code":"SDG","name_plural":"Sudanese pounds","countries":["SD"]},"SEK":{"symbol":"Skr","name":"Swedish Krona","symbol_native":"kr","decimal_digits":2,"rounding":0,"code":"SEK","name_plural":"Swedish kronor","countries":["SE"]},"SGD":{"symbol":"S$","name":"Singapore Dollar","symbol_native":"$","decimal_digits":2,"rounding":0,"code":"SGD","name_plural":"Singapore dollars","countries":["SG"]},"SHP":{"symbol":"£","name":"Saint Helena Pound","symbol_native":"£","decimal_digits":2,"rounding":0,"code":"SHP","icon_name":"shp","name_plural":"Saint Helena Pounds","countries":["SH"]},"SLL":{"symbol":"Le","name":"Sierra Leonean Leone","symbol_native":"Le","decimal_digits":2,"rounding":0,"code":"SLL","icon_name":"sll","name_plural":"Sierra Leonean Leone","countries":["SL"]},"SOS":{"symbol":"Ssh","name":"Somali Shilling","symbol_native":"Ssh","decimal_digits":0,"rounding":0,"code":"SOS","name_plural":"Somali shillings","countries":["SO"]},"SRD":{"symbol":"$","name":"Surinamese Dollar","symbol_native":"$","decimal_digits":2,"rounding":0,"code":"SRD","icon_name":"srd","name_plural":"Surinamese Dollar","countries":["SR"]},"STD":{"symbol":"Db","name":"São Tomé and Príncipe dobra","symbol_native":"Db","decimal_digits":2,"rounding":0,"code":"STD","name_plural":"São Tomé and Príncipe dobras","countries":["ST"]},"SVC":{"symbol":"₡","name":"Salvadoran Colón","symbol_native":"₡","decimal_digits":2,"rounding":0,"code":"SVC","icon_name":"svc","name_plural":"Salvadoran Colón","countries":[]},"SYP":{"symbol":"SY£","name":"Syrian Pound","symbol_native":"ل.س.‏","decimal_digits":0,"rounding":0,"code":"SYP","name_plural":"Syrian pounds","countries":["SY"]},"SZL":{"symbol":"L","name":"Swazi Lilangeni","symbol_native":"E‏","decimal_digits":2,"rounding":0,"code":"SZL","icon_name":"szl","name_plural":"Swazi Lilangeni","countries":["SZ"]},"THB":{"symbol":"฿","name":"Thai Baht","symbol_native":"฿","decimal_digits":2,"rounding":0,"code":"THB","name_plural":"Thai baht","countries":["TH"]},"TJS":{"symbol":"TJS","name":"Tajikistani Somoni","symbol_native":"TJS","decimal_digits":2,"rounding":0,"code":"TJS","icon_name":"tjs","name_plural":"Tajikistani Somoni","countries":["TJ"]},"TMT":{"symbol":"T","name":"Turkmenistani Manat","symbol_native":"T‏","decimal_digits":2,"rounding":0,"code":"TMT","icon_name":"tmt","name_plural":"Turkmenistani Manat","countries":["TM"]},"TND":{"symbol":"DT","name":"Tunisian Dinar","symbol_native":"د.ت.‏","decimal_digits":3,"rounding":0,"code":"TND","name_plural":"Tunisian dinars","countries":["TN"]},"TOP":{"symbol":"T$","name":"Tongan Paʻanga","symbol_native":"T$","decimal_digits":2,"rounding":0,"code":"TOP","name_plural":"Tongan paʻanga","countries":["TO"]},"TRY":{"symbol":"TL","name":"Turkish Lira","symbol_native":"TL","decimal_digits":2,"rounding":0,"code":"TRY","name_plural":"Turkish Lira","countries":["TR"]},"TTD":{"symbol":"TT$","name":"Trinidad and Tobago Dollar","symbol_native":"$","decimal_digits":2,"rounding":0,"code":"TTD","name_plural":"Trinidad and Tobago dollars","countries":["TT"]},"TWD":{"symbol":"NT$","name":"New Taiwan Dollar","symbol_native":"NT$","decimal_digits":2,"rounding":0,"code":"TWD","name_plural":"New Taiwan dollars","countries":["TW"]},"TZS":{"symbol":"TSh","name":"Tanzanian Shilling","symbol_native":"TSh","decimal_digits":0,"rounding":0,"code":"TZS","name_plural":"Tanzanian shillings","countries":["TZ"]},"UAH":{"symbol":"₴","name":"Ukrainian Hryvnia","symbol_native":"₴","decimal_digits":2,"rounding":0,"code":"UAH","name_plural":"Ukrainian hryvnias","countries":["UA"]},"UGX":{"symbol":"USh","name":"Ugandan Shilling","symbol_native":"USh","decimal_digits":0,"rounding":0,"code":"UGX","name_plural":"Ugandan shillings","countries":["UG"]},"USD":{"symbol":"$","name":"US Dollar","symbol_native":"$","decimal_digits":2,"rounding":0,"code":"USD","name_plural":"US dollars","countries":["AC","AS","BQ","DG","EC","FM","GU","HT","IO","MH","MP","PA","PR","PW","SV","TC","TL","UM","US","VG","VI","ZW"]},"UYU":{"symbol":"$U","name":"Uruguayan Peso","symbol_native":"$","decimal_digits":2,"rounding":0,"code":"UYU","name_plural":"Uruguayan pesos","countries":["UY"]},"UZS":{"symbol":"UZS","name":"Uzbekistan Som","symbol_native":"UZS","decimal_digits":0,"rounding":0,"code":"UZS","name_plural":"Uzbekistan som","countries":["UZ"]},"VEF":{"symbol":"Bs.F.","name":"Venezuelan Bolívar","symbol_native":"Bs.F.","decimal_digits":2,"rounding":0,"code":"VEF","name_plural":"Venezuelan bolívars","countries":["VE"]},"VND":{"symbol":"₫","name":"Vietnamese Dong","symbol_native":"₫","decimal_digits":0,"rounding":0,"code":"VND","name_plural":"Vietnamese dong","countries":["VN"]},"VUV":{"symbol":"VUV","name":"Vanuatu Vatu","symbol_native":"VT","decimal_digits":0,"rounding":0,"code":"VUV","icon_name":"vuv","name_plural":"Vanuatu Vatu","countries":["VU"]},"WST":{"symbol":"WS$","name":"Samoan Tala","symbol_native":"T","decimal_digits":2,"rounding":0,"code":"WST","icon_name":"wst","name_plural":"Samoan Tala","countries":["WS"]},"XAF":{"symbol":"FCFA","name":"CFA Franc BEAC","symbol_native":"FCFA","decimal_digits":0,"rounding":0,"code":"XAF","name_plural":"CFA francs BEAC","countries":["CF","CG","CM","GA","GQ","TD"]},"XAG":{"symbol":"XAG","name":"Silver Ounce","symbol_native":"XAG","decimal_digits":2,"rounding":0,"code":"XAG","name_plural":"Silver Ounces","countries":[]},"XAU":{"symbol":"XAU","name":"Gold Ounce","symbol_native":"XAU","decimal_digits":2,"rounding":0,"code":"XAU","name_plural":"Gold Ounces","countries":[]},"XCD":{"symbol":"EC$","name":"East Caribbean Dollar","symbol_native":"$","decimal_digits":2,"rounding":0,"code":"XCD","icon_name":"xcd","name_plural":"East Caribbean Dollars","countries":["AG","AI","DM","GD","KN","LC","MS","VC"]},"XDR":{"symbol":"SDR","name":"Special drawing rights","symbol_native":"SDR","decimal_digits":2,"rounding":0,"code":"XDR","name_plural":"Special drawing rights","countries":[]},"XOF":{"symbol":"CFA","name":"CFA Franc BCEAO","symbol_native":"CFA","decimal_digits":0,"rounding":0,"code":"XOF","name_plural":"CFA francs BCEAO","countries":["BF","BJ","CI","GW","ML","NE","SN","TG"]},"XPF":{"symbol":"CFP","name":"CFP Franc","symbol_native":"CFP","decimal_digits":0,"rounding":0,"code":"XPF","icon_name":"xpf","name_plural":"CFP francs","countries":["NC","PF","WF"]},"YER":{"symbol":"YR","name":"Yemeni Rial","symbol_native":"ر.ي.‏","decimal_digits":0,"rounding":0,"code":"YER","name_plural":"Yemeni rials","countries":["YE"]},"ZAR":{"symbol":"R","name":"South African Rand","symbol_native":"R","decimal_digits":2,"rounding":0,"code":"ZAR","name_plural":"South African rand","countries":["LS","NA","ZA","ZW"]},"ZMK":{"symbol":"ZK","name":"Zambian Kwacha","symbol_native":"ZK","decimal_digits":0,"rounding":0,"code":"ZMK","name_plural":"Zambian kwachas","countries":[]},"ZMW":{"symbol":"ZK","name":"Zambian Kwacha","symbol_native":"ZK","decimal_digits":0,"rounding":0,"code":"ZMW","name_plural":"Zambian kwachas","countries":["ZM"]},"ZWL":{"symbol":"ZWL","name":"Zimbabwean dollar","symbol_native":"$","decimal_digits":2,"rounding":0,"code":"ZWL","name_plural":"Zimbabwean dollars","countries":[]},"XPT":{"symbol":"XPT","name":"Platinum Ounce","symbol_native":"XPT","decimal_digits":6,"rounding":0,"code":"XPT","name_plural":"Platinum Ounces","countries":[]},"XPD":{"symbol":"XPD","name":"Palladium Ounce","symbol_native":"XPD","decimal_digits":6,"rounding":0,"code":"XPD","name_plural":"Palladium Ounces","countries":[]},"BTC":{"symbol":"₿","name":"Bitcoin","symbol_native":"₿","decimal_digits":8,"rounding":0,"code":"BTC","name_plural":"Bitcoins","countries":[]},"ETH":{"symbol":"Ξ","name":"Ethereum","symbol_native":"Ξ","decimal_digits":18,"rounding":0,"code":"ETH","name_plural":"Ethereum","countries":[]},"BNB":{"symbol":"BNB","name":"Binance","symbol_native":"BNB","decimal_digits":8,"rounding":0,"code":"BNB","name_plural":"Binance","countries":[]},"XRP":{"symbol":"XRP","name":"Ripple","symbol_native":"XRP","decimal_digits":6,"rounding":0,"code":"XRP","name_plural":"Ripple","countries":[]},"SOL":{"symbol":"SOL","name":"Solana","symbol_native":"SOL","decimal_digits":9,"rounding":0,"code":"SOL","name_plural":"Solana","countries":[]},"DOT":{"symbol":"DOT","name":"Polkadot","symbol_native":"DOT","decimal_digits":10,"rounding":0,"code":"DOT","name_plural":"Polkadot","countries":[]},"AVAX":{"symbol":"AVAX","name":"Avalanche","symbol_native":"AVAX","decimal_digits":18,"rounding":0,"code":"AVAX","name_plural":"Avalanche","countries":[]},"MATIC":{"symbol":"MATIC","name":"Matic Token","symbol_native":"MATIC","decimal_digits":18,"rounding":0,"code":"MATIC","name_plural":"Matic Tokens","countries":[]},"LTC":{"symbol":"Ł","name":"Litecoin","symbol_native":"Ł","decimal_digits":8,"rounding":0,"code":"LTC","name_plural":"Litecoins","countries":[]},"ADA":{"symbol":"ADA","name":"Cardano","symbol_native":"ADA","decimal_digits":6,"rounding":0,"code":"ADA","name_plural":"Cardanos","countries":[]},"USDT":{"symbol":"USDT","name":"Tether","symbol_native":"USDT","decimal_digits":2,"rounding":0,"code":"USDT","name_plural":"Tethers","countries":[]},"USDC":{"symbol":"USDC","name":"USD Coin","symbol_native":"USDC","decimal_digits":2,"rounding":0,"code":"USDC","name_plural":"USD Coins","countries":[]},"DAI":{"symbol":"DAI","name":"Dai","symbol_native":"DAI","decimal_digits":2,"rounding":0,"code":"DAI","name_plural":"Dais","countries":[]},"BUSD":{"symbol":"BUSD","name":"Binance USD","symbol_native":"BUSD","decimal_digits":8,"rounding":0,"code":"BUSD","name_plural":"Binance USD","countries":[]},"ARB":{"symbol":"ARB","name":"Arbitrum","symbol_native":"ARB","decimal_digits":8,"rounding":0,"code":"ARB","name_plural":"Arbitrums","countries":[]},"OP":{"symbol":"OP","name":"Optimism","symbol_native":"OP","decimal_digits":8,"rounding":0,"code":"OP","name_plural":"Optimism","countries":[]}}}';
currenciesResp = JSON.parse(currenciesResp);
currenciesResp = currenciesResp.data;

window.onload = function(e){

  
  const currencyApi = new CurrencyAPI('INSERT YOUR API KEY HERE');
  currencyApi.latest().then(latestResponse =>{
    if(!latestResponse.data){
      latestResponse = '{"meta":{"last_updated_at":"2023-11-28T23:59:59Z"},"data":{"ADA":{"code":"ADA","value":2.5964700974},"AED":{"code":"AED","value":3.6724403834},"AFN":{"code":"AFN","value":69.7502110541},"ALL":{"code":"ALL","value":92.6649055764},"AMD":{"code":"AMD","value":398.9025194598},"ANG":{"code":"ANG","value":1.7829702943},"AOA":{"code":"AOA","value":824.2186457269},"ARB":{"code":"ARB","value":0.9861600473},"ARS":{"code":"ARS","value":359.4677335229},"AUD":{"code":"AUD","value":1.5025602248},"AVAX":{"code":"AVAX","value":0.0484691142},"AWG":{"code":"AWG","value":1.79},"AZN":{"code":"AZN","value":1.7},"BAM":{"code":"BAM","value":1.7799401915},"BBD":{"code":"BBD","value":2},"BDT":{"code":"BDT","value":109.9283389237},"BGN":{"code":"BGN","value":1.7788301945},"BHD":{"code":"BHD","value":0.376},"BIF":{"code":"BIF","value":2837.6964060559},"BMD":{"code":"BMD","value":1},"BNB":{"code":"BNB","value":0.0042372746},"BND":{"code":"BND","value":1.3294402522},"BOB":{"code":"BOB","value":6.9005712365},"BRL":{"code":"BRL","value":4.8729106577},"BSD":{"code":"BSD","value":1},"BTC":{"code":"BTC","value":0.0000264351},"BTN":{"code":"BTN","value":83.327439939},"BUSD":{"code":"BUSD","value":1.0009496557},"BWP":{"code":"BWP","value":13.4092617114},"BYN":{"code":"BYN","value":3.2949858387},"BYR":{"code":"BYR","value":32949.884749562},"BZD":{"code":"BZD","value":2},"CAD":{"code":"CAD","value":1.3567901771},"CDF":{"code":"CDF","value":2475.6377982923},"CHF":{"code":"CHF","value":0.8772201},"CLF":{"code":"CLF","value":0.0232900039},"CLP":{"code":"CLP","value":866.8383498739},"CNY":{"code":"CNY","value":7.1319408507},"COP":{"code":"COP","value":3942.6918335805},"CRC":{"code":"CRC","value":530.1732283144},"CUC":{"code":"CUC","value":1},"CUP":{"code":"CUP","value":24},"CVE":{"code":"CVE","value":100.2187313314},"CZK":{"code":"CZK","value":22.0073826554},"DAI":{"code":"DAI","value":1.0020779539},"DJF":{"code":"DJF","value":177.721},"DKK":{"code":"DKK","value":6.7733911544},"DOP":{"code":"DOP","value":56.6717075206},"DOT":{"code":"DOT","value":0.1901089826},"DZD":{"code":"DZD","value":133.8589181144},"EGP":{"code":"EGP","value":30.8461060808},"ERN":{"code":"ERN","value":15},"ETB":{"code":"ETB","value":55.2698262392},"ETH":{"code":"ETH","value":0.0004879496},"EUR":{"code":"EUR","value":0.9088801289},"FJD":{"code":"FJD","value":2.2256504231},"FKP":{"code":"FKP","value":0.7866710836},"GBP":{"code":"GBP","value":0.7867801089},"GEL":{"code":"GEL","value":2.6928303717},"GGP":{"code":"GGP","value":0.7866712159},"GHS":{"code":"GHS","value":11.9812623874},"GIP":{"code":"GIP","value":0.7866711321},"GMD":{"code":"GMD","value":58.2797200851},"GNF":{"code":"GNF","value":8591.6721723745},"GTQ":{"code":"GTQ","value":7.7989212951},"GYD":{"code":"GYD","value":208.4704569264},"HKD":{"code":"HKD","value":7.7937908281},"HNL":{"code":"HNL","value":24.6181441247},"HRK":{"code":"HRK","value":7.0420807393},"HTG":{"code":"HTG","value":132.3160476447},"HUF":{"code":"HUF","value":342.4993252571},"IDR":{"code":"IDR","value":15385.247146857},"ILS":{"code":"ILS","value":3.6903104448},"IMP":{"code":"IMP","value":0.7866711937},"INR":{"code":"INR","value":83.2110045262},"IQD":{"code":"IQD","value":1306.6382170861},"IRR":{"code":"IRR","value":41919.975768583},"ISK":{"code":"ISK","value":136.9879318032},"JEP":{"code":"JEP","value":0.7866709182},"JMD":{"code":"JMD","value":157.3811595737},"JOD":{"code":"JOD","value":0.71},"JPY":{"code":"JPY","value":147.0633798163},"KES":{"code":"KES","value":153.008154363},"KGS":{"code":"KGS","value":88.4155221713},"KHR":{"code":"KHR","value":4107.9779330358},"KMF":{"code":"KMF","value":447.2585648957},"KPW":{"code":"KPW","value":900.0120868661},"KRW":{"code":"KRW","value":1285.1671603699},"KWD":{"code":"KWD","value":0.3070500538},"KYD":{"code":"KYD","value":0.83333},"KZT":{"code":"KZT","value":456.6510720447},"LAK":{"code":"LAK","value":20661.445194925},"LBP":{"code":"LBP","value":14981.709774277},"LKR":{"code":"LKR","value":326.4695459789},"LRD":{"code":"LRD","value":187.7648814851},"LSL":{"code":"LSL","value":18.6037131751},"LTC":{"code":"LTC","value":0.0143582791},"LTL":{"code":"LTL","value":3.1377816976},"LVL":{"code":"LVL","value":0.6386796407},"LYD":{"code":"LYD","value":4.7981305719},"MAD":{"code":"MAD","value":10.0384716786},"MATIC":{"code":"MATIC","value":1.3382459903},"MDL":{"code":"MDL","value":17.6840531932},"MGA":{"code":"MGA","value":4494.2770946232},"MKD":{"code":"MKD","value":56.0328506827},"MMK":{"code":"MMK","value":2090.2670864538},"MNT":{"code":"MNT","value":3460.4497406122},"MOP":{"code":"MOP","value":7.9524214872},"MRO":{"code":"MRO","value":356.999828},"MUR":{"code":"MUR","value":44.0693671686},"MVR":{"code":"MVR","value":15.3221523391},"MWK":{"code":"MWK","value":1679.7352858532},"MXN":{"code":"MXN","value":17.12575234},"MYR":{"code":"MYR","value":4.6667806656},"MZN":{"code":"MZN","value":63.559070216},"NAD":{"code":"NAD","value":18.5378635481},"NGN":{"code":"NGN","value":787.8853525885},"NIO":{"code":"NIO","value":36.7184140568},"NOK":{"code":"NOK","value":10.6048713497},"NPR":{"code":"NPR","value":132.4977965804},"NZD":{"code":"NZD","value":1.6272903236},"OMR":{"code":"OMR","value":0.3824100715},"OP":{"code":"OP","value":0.5846892007},"PAB":{"code":"PAB","value":0.9991601159},"PEN":{"code":"PEN","value":3.7250306231},"PGK":{"code":"PGK","value":3.7162706658},"PHP":{"code":"PHP","value":55.3640859957},"PKR":{"code":"PKR","value":285.4525404759},"PLN":{"code":"PLN","value":3.921680744},"PYG":{"code":"PYG","value":7436.7563961228},"QAR":{"code":"QAR","value":3.6367306357},"RON":{"code":"RON","value":4.5172205824},"RSD":{"code":"RSD","value":106.4822702412},"RUB":{"code":"RUB","value":88.7758725333},"RWF":{"code":"RWF","value":1237.7559391059},"SAR":{"code":"SAR","value":3.7433905853},"SBD":{"code":"SBD","value":8.4358756585},"SCR":{"code":"SCR","value":14.3305719583},"SDG":{"code":"SDG","value":601.5},"SEK":{"code":"SEK","value":10.3083419982},"SGD":{"code":"SGD","value":1.3302702656},"SHP":{"code":"SHP","value":0.7867801391},"SLL":{"code":"SLL","value":22508.952497242},"SOL":{"code":"SOL","value":0.0172179276},"SOS":{"code":"SOS","value":571.4999416387},"SRD":{"code":"SRD","value":37.8382571212},"STD":{"code":"STD","value":22488.957627527},"SVC":{"code":"SVC","value":8.75},"SYP":{"code":"SYP","value":13001.880548833},"SZL":{"code":"SZL","value":18.5508427855},"THB":{"code":"THB","value":34.6735345087},"TJS":{"code":"TJS","value":10.8859917907},"TMT":{"code":"TMT","value":3.5},"TND":{"code":"TND","value":3.0889905351},"TOP":{"code":"TOP","value":2.3324704283},"TRY":{"code":"TRY","value":28.8985135825},"TTD":{"code":"TTD","value":6.7373707069},"TWD":{"code":"TWD","value":31.321083764},"TZS":{"code":"TZS","value":2497.6203635873},"UAH":{"code":"UAH","value":36.6178162334},"UGX":{"code":"UGX","value":3787.7363753385},"USD":{"code":"USD","value":1},"USDC":{"code":"USDC","value":1.0022289284},"USDT":{"code":"USDT","value":1.0011584092},"UYU":{"code":"UYU","value":39.1609869864},"UZS":{"code":"UZS","value":12308.087260418},"VEF":{"code":"VEF","value":3543044.7601391},"VND":{"code":"VND","value":24206.971934576},"VUV":{"code":"VUV","value":119.7751445987},"WST":{"code":"WST","value":2.7312067971},"XAF":{"code":"XAF","value":596.1527856125},"XAG":{"code":"XAG","value":0.0398712852},"XAU":{"code":"XAU","value":0.0004891308},"XCD":{"code":"XCD","value":2.7},"XDR":{"code":"XDR","value":0.7446600996},"XOF":{"code":"XOF","value":596.1527742223},"XPD":{"code":"XPD","value":0.0009418592},"XPF":{"code":"XPF","value":108.3595035335},"XPT":{"code":"XPT","value":0.0010638781},"XRP":{"code":"XRP","value":1.6352857292},"YER":{"code":"YER","value":249.6747130744},"ZAR":{"code":"ZAR","value":18.5749934749},"ZMK":{"code":"ZMK","value":9001.2},"ZMW":{"code":"ZMW","value":23.6924227001},"ZWL":{"code":"ZWL","value":5761.3040454659}}}';
      latestResponse = JSON.parse(latestResponse);
      console.log('using mock response');
    }
    latestResponse = latestResponse.data;
    for (let data in latestResponse){
      var toOption = document.createElement('option');
      toOption.text = latestResponse[data].code + ' ' + currenciesResp[data].name;
      toOption.value = latestResponse[data].value;
      toSelect.add(toOption);

      var fromOption = document.createElement('option');
      fromOption.text = latestResponse[data].code + ' ' + currenciesResp[data].name;
      fromOption.value = latestResponse[data].value;
      fromSelect.add(fromOption);
      
    }
  });
};

btnConvert.addEventListener('click', function (e) {
  
  var amountValue = amount.value;
  var fromSelectValue = fromSelect.value;
  var toSelectValue = toSelect.value;

  if (fromSelectValue == '' || toSelectValue == '' || (amountValue < 0)) {
    convertedAmount.classList.add('hidden');
    convertedAmountLabel.classList.add('hidden');
    return false;
  }
  var convertedValue = (amountValue * (toSelectValue / fromSelectValue)).toFixed(2);
  convertedAmount.innerHTML = convertedValue;
  convertedAmount.classList.remove('hidden');
  convertedAmountLabel.classList.remove('hidden');


});