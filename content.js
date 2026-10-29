// =====================================================================
//  CAFÉ CONTENT: edit this file to change what the website shows.
//  Keep the quotes "..." and the commas at the end of each line.
//  Save, commit and push, and the live site updates in about a minute.
// =====================================================================

window.STORE = {
  name: "Cafe Cartel",
  kicker: "Colombian coffee · Hoboken",
  tagline: "Every espresso drink is a double shot. Colombian bakery & kitchen, made fresh daily.",
  about:
    "Cafe Cartel brings the coffee of Colombia to Hoboken. Every espresso drink is a double shot " +
    "of Colombian coffee, and our bakery and kitchen make pandebono, empanadas, arepas and more " +
    "fresh every day. Stop in, order ahead for pickup, or let us bring it to you.",

  // Online ordering.
  // The site's own cart sends each order to the email (and text number, if set) below.
  // Customers pay at pickup or on delivery.
  orderEmail: "catering@cafecartel.club",
  orderTextNumber: "",     // café cell for text-message orders, digits only, e.g. "12015551234"
  orderNote: "Pickup or delivery · Pay when you get your order",
  // If you later turn on Toast Online Ordering, paste its link here and the Order
  // buttons will go to Toast instead of the site's cart.
  orderUrl: "",

  // Delivery zones shown in the "Pickup & Delivery" section and used at checkout.
  delivery: [
    { area: "In town",     minimum: "$10", fee: "$5" },
    { area: "Out of town", minimum: "$15", fee: "$5" },
  ],

  // Contact details (leave "" to hide a line)
  phone: "201-267-0369",
  email: "catering@cafecartel.club",
  whatsapp: "",            // digits only with country code, e.g. "15551234567"
  address: "1100 Adams St, Hoboken, NJ 07030",

  // Opening hours, shown in this order
  hours: [
    ["Monday – Friday", "7:00 AM – 6:00 PM"],
    ["Saturday", "8:00 AM – 6:00 PM"],
    ["Sunday", "8:00 AM – 3:00 PM"],
  ],

  // Social links (leave "" to hide)
  social: {
    instagram: "",
    facebook: "",
    tiktok: "",
  },

  // Drink add-ons offered on sections marked extras: true
  extras: [
    { name: "Make it iced", price: 1.00 },
    { name: "Oat or almond milk", price: 0.70, choices: ["Oat milk", "Almond milk"] },
    { name: "Add a flavor", price: 0.70, choices: ["Vanilla", "Caramel", "Hazelnut", "Dulce de Leche", "Mocha", "Lavender", "Sugar-free vanilla"] },
    { name: "Extra shot", price: 1.50 },
    { name: "Double extra shot", price: 2.50 },
  ],

  // THE MENU
  //   price: one price          sizes: { Reg: 4.85, Lg: 5.85 }
  //   desc: small line under the name
  //   choices: the customer picks one (flavors, bread, tea...)
  //   image: optional photo, e.g. "images/latte.jpg"
  menu: [
    { section: "Coffee", group: "Drinks", note: "Every espresso drink is a double shot · Colombian coffee", extras: true, items: [
      { name: "Espresso", price: 3.35 },
      { name: "Macchiato", price: 3.85 },
      { name: "Cortado", price: 4.35 },
      { name: "Americano", sizes: { Reg: 4.35, Lg: 5.35 } },
      { name: "Latte", sizes: { Reg: 4.85, Lg: 5.85 } },
      { name: "Cappuccino", sizes: { Reg: 4.85, Lg: 5.85 } },
      { name: "Flat White", sizes: { Reg: 4.55, Lg: 5.85 } },
      { name: "Hot Drip", sizes: { Reg: 3.85, Lg: 4.85 } },
      { name: "Iced Coffee", sizes: { Reg: 3.85, Lg: 4.85 } },
      { name: "Cold Brew", sizes: { Reg: 6.35, Lg: 7.35, "No ice 16oz": 8.00, "No ice 24oz": 9.00 } },
      { name: "Café con Leche", price: 5.35 },
      { name: "Café Cartagena", price: 6.35, desc: "Vanilla coffee with orange juice" },
      { name: "Hot Chocolate", price: 5.35 },
    ]},
    { section: "Tea & Matcha", group: "Drinks", extras: true, items: [
      { name: "Matcha Komorebi", sizes: { Reg: 6.35, Lg: 6.85 } },
      { name: "Chai", sizes: { Reg: 4.85, Lg: 5.85 } },
      { name: "Loose-Leaf Tea", price: 4.55, choices: ["Dragonwell", "Earl Grey", "Jasmine", "Mint", "Corazón", "Nocturne"] },
    ]},
    { section: "Seasonal", group: "Drinks", extras: true, highlight: true, items: [
      { name: "El Dorado Harvest", sizes: { Reg: 5.35, Lg: 5.85 } },
      { name: "Coco Caramelo", sizes: { Reg: 5.35, Lg: 5.85 } },
      { name: "Medellín Mocha", sizes: { Reg: 5.35, Lg: 5.85 } },
      { name: "Pumpkin Horchata", sizes: { Reg: 4.50, Lg: 6.85 } },
      { name: "Biscoff Macchiato", sizes: { Reg: 5.35, Lg: 6.35 } },
      { name: "Strawberry Matcha", sizes: { Reg: 5.99, Lg: 6.99 } },
      { name: "Ginger Hibiscus", sizes: { Reg: 4.99, Lg: 5.59 } },
      { name: "Strawberry Hibiscus", sizes: { Reg: 4.99, Lg: 5.59 } },
    ]},
    { section: "Cold Drinks", group: "Drinks", items: [
      { name: "Coke · Diet Coke · Sprite", price: 2.00, choices: ["Coke", "Diet Coke", "Sprite"] },
      { name: "Coke Zero", price: 2.50 },
      { name: "Colombiana · Postobón", price: 2.50, choices: ["Colombiana", "Postobón"] },
      { name: "Hit Juice", price: 2.50 },
      { name: "Dasani Water", price: 2.00 },
      { name: "Organic Juice", price: 3.00 },
      { name: "San Pellegrino", price: 3.50 },
    ]},
    { section: "All-Day Breakfast", group: "Food", note: "On a pandebono or English muffin", items: [
      { name: "Bacon, Egg & Cheese", price: 5.39, choices: ["On a pandebono", "On an English muffin"] },
      { name: "Sausage, Egg & Cheese", price: 5.29, choices: ["On a pandebono", "On an English muffin"] },
      { name: "Egg & Cheese", price: 5.09, choices: ["On a pandebono", "On an English muffin"] },
      { name: "Ham & Cheese Pandebono", price: 5.29 },
    ]},
    { section: "Empanadas", group: "Food", note: "3.99 each", items: [
      { name: "Chipotle Chicken Empanada", price: 3.99 },
      { name: "Argentinian Beef Empanada", price: 3.99 },
      { name: "Spicy Chorizo Empanada", price: 3.99 },
      { name: "Ham & Cheese Empanada", price: 3.99 },
      { name: "Portobello, Spinach & Mozzarella Empanada", price: 3.99 },
    ]},
    { section: "Lunch & Dinner", group: "Food", items: [
      { name: "Pita Paisa", price: 8.99, desc: "Colombian chorizo, chimichurri, provolone" },
      { name: "Casita Melt", price: 8.99, desc: "Roast beef, provolone, pickled cabbage" },
      { name: "Fuego Ham & Cheese", price: 8.99, desc: "Chipotle mayo, American cheese, sweet peppers" },
      { name: "Rolos Chicken Salad", price: 7.99, desc: "Cranberry chicken salad wrap, mixed greens" },
      { name: "Cheese Arepa", price: 6.75, desc: "White corn arepa, melted mozzarella" },
    ]},
    { section: "Bakery", group: "Food", items: [
      { name: "Pandebono", price: 3.49, desc: "Colombian cheese bread" },
      { name: "Plain Croissant", price: 3.50 },
      { name: "Chocolate Croissant", price: 3.85 },
      { name: "Almond Croissant", price: 3.85 },
      { name: "Everything Croissant", price: 3.85 },
      { name: "Everything Cheese Croissant", price: 3.90 },
      { name: "Muffin", price: 2.90, choices: ["Banana", "Mocha", "Cinnamon", "Vanilla Chocolate Chip"] },
      { name: "Danish", price: 3.20, choices: ["Cheese", "Cinnamon", "Maple Pecan"] },
    ]},
  ],
};
