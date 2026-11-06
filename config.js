// Business facts used on every page. Edit here, then run `node build.js`.
// Everything below is verified from RC Construction's public HomeStars and Google profiles (Oct 2026),
// except the items marked CONFIRM, which must be checked with Sam before launch.

module.exports = {
  // The live address of the site. Change to the real domain once it's connected in Cloudflare.
  siteUrl: process.env.SITE_URL || 'https://rc-construction.pages.dev',

  name: 'RC Construction',
  tagline: 'Basement, bathroom and home renovations',
  phone: '+16478649281', // from RC's HomeStars replies and Google listing
  phoneDisplay: '(647) 864-9281',
  email: 'Rahimiconstruction@outlook.com', // RC's inbox for the website and web forms (Nov 2026)
  city: 'Oshawa',
  region: 'Durham Region',
  province: 'ON',
  // Towns Sam serves (confirmed by the RC team, Nov 2026), grouped by region for the Service Areas page.
  areaGroups: [
    { region: 'Durham Region', towns: ['Oshawa', 'Whitby', 'Courtice', 'Bowmanville', 'Ajax', 'Pickering', 'Port Perry'] },
    { region: 'York Region', towns: ['Whitchurch-Stouffville', 'King City', 'Gormley'] },
    { region: 'Eastern Ontario', towns: ['Cobourg', 'Kingston'] },
  ],

  // Review facts shown on the site (keep in sync with the live profiles).
  // Google listings: the main one (34 reviews) and a second one at RC's street address (1 review).
  google: {
    rating: '5.0', count: 34,
    url: 'https://www.google.com/maps/place/?q=place_id:ChIJT_eoHR9EIm4RoMKXWhseQpo',
    url2: 'https://www.google.com/maps/place/?q=place_id:ChIJ5xxXKucc1YkRy0xM9eXxkg0',
  },
  homestars: { rating: '4.9', count: 29, url: 'https://www.homestars.com/profile/2920698-rc-construction', since: 2018 },
  warranty: true, // HomeStars profile: "Offers warranty". CONFIRM the terms before describing them.

  // Free form handling through https://web3forms.com: get an access key emailed to RC's inbox and paste it here.
  web3formsKey: process.env.WEB3FORMS_KEY || '4f8f67bb-8d0c-48ef-ad9f-092dcb0619d3',

  // Other public profiles (add Facebook / Instagram / Google listing link when known).
  sameAs: ['https://www.homestars.com/profile/2920698-rc-construction', 'https://www.google.com/maps/place/?q=place_id:ChIJT_eoHR9EIm4RoMKXWhseQpo'],
};
module.exports.areas = module.exports.areaGroups.flatMap((g) => g.towns);
