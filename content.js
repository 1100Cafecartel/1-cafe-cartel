// =====================================================================
//  CAFÉ CONTENT: edit this file to change what the website shows.
//  Keep the quotes "..." and the commas at the end of each line.
//  Save, commit and push, and the live site updates in about a minute.
//
//  The full menu, prices and ordering live on the order site
//  (order.cafecartel.club), managed in Menu & hours. This page only shows
//  highlights and sends people there.
// =====================================================================

window.STORE = {
  name: "Cafe Cartel",
  kicker: "Colombian coffee · Hoboken",
  tagline: "Every espresso drink is a double shot. Colombian bakery & kitchen, made fresh daily.",
  about:
    "Cafe Cartel brings the coffee of Colombia to Hoboken. Every espresso drink is a double shot " +
    "of Colombian coffee, and our bakery and kitchen make pandebono, empanadas, arepas and more " +
    "fresh every day. Stop in, or order ahead and skip the line.",

  // Every "Order" button goes here
  orderUrl: "https://order.cafecartel.club/s/cafecartel",
  orderNote: "Order ahead for pickup · Pay online or at the counter",

  // House favorites: photo cards near the top. "id" is the item's number on the
  // order site (open the item there and look at the end of the address: #i/22).
  favorites: [
    { name: "Café Cartagena", price: "6.35", desc: "Vanilla coffee with orange juice", img: "images/menu/cafe-cartagena.jpg", id: 22 },
    { name: "Medellín Mocha", price: "5.35", desc: "Seasonal favorite", img: "images/menu/medellin-mocha.jpg", id: 29 },
    { name: "Matcha Komorebi", price: "6.35", desc: "Matcha, hot or iced", img: "images/menu/matcha-komorebi.jpg", id: 24 },
    { name: "Cold Brew", price: "6.35", desc: "9-hour Kyoto slow drip", img: "images/menu/cold-brew.jpg", id: 20 },
    { name: "Pandebono", price: "3.49", desc: "Warm Colombian cheese bread", img: "images/menu/pandebono.jpg", id: 59 },
    { name: "Pita Paisa", price: "8.99", desc: "Colombian chorizo, chimichurri, provolone", img: "images/menu/pita-paisa.jpg", id: 45 },
    { name: "Chipotle Chicken Empanada", price: "3.99", desc: "Made fresh daily", img: "images/menu/chipotle-chicken-empanada.jpg", id: 54 },
    { name: "Bacon, Egg & Cheese", price: "5.39", desc: "On a pandebono or English muffin", img: "images/menu/bacon-egg-cheese.jpg", id: 50 },
  ],

  // Menu sections: one photo card each, opening that section on the order site.
  // "name" must match the section name in Menu & hours.
  sections: [
    { name: "Coffee", img: "images/menu/cappuccino.jpg", note: "Double shot, always" },
    { name: "Tea & Matcha", img: "images/menu/chai.jpg", note: "Chai, matcha, loose-leaf" },
    { name: "Seasonal", img: "images/menu/biscoff-macchiato.jpg", note: "Limited time" },
    { name: "All-Day Breakfast", img: "images/menu/sausage-egg-cheese.jpg", note: "On a pandebono" },
    { name: "Lunch & Dinner", img: "images/menu/casita-melt.jpg", note: "Pressed sandwiches & arepas" },
    { name: "Empanadas", img: "images/menu/spicy-chorizo-empanada.jpg", note: "3.99 each" },
    { name: "Bakery", img: "images/menu/almond-croissant.jpg", note: "Pandebono & croissants" },
    { name: "Cold Drinks", img: "images/menu/colombiana.jpg", note: "Colombian sodas & juices" },
  ],

  // Rewards
  rewardsName: "Sundays Off",
  rewardsText: "Buy 6 handcrafted drinks, the 7th is on us. Order online with your phone number and your stamps add up automatically.",

  // Pickup / delivery cards (leave delivery: [] to show pickup only)
  delivery: [
    { area: "Within Hoboken", fee: "$4.99" },
  ],

  // Contact details (leave "" to hide a line)
  phone: "201-267-0369",
  email: "catering@cafecartel.club",
  whatsapp: "",            // digits only with country code, e.g. "15551234567"
  address: "1100 Adams St, Hoboken, NJ 07030",

  // Opening hours, shown in this order
  hours: [
    ["Monday – Wednesday", "7:00 AM – 4:00 PM"],
    ["Thursday – Sunday", "7:00 AM – 5:00 PM"],
  ],

  // Social links (leave "" to hide)
  social: {
    instagram: "https://www.instagram.com/cafecartel/",
    facebook: "",
    tiktok: "",
  },
};
