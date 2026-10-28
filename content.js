// =====================================================================
//  CAFÉ CONTENT: edit this file to change what the website shows.
//  Keep the quotes "..." and the commas at the end of each line.
//  Save, commit and push, and the live site updates in about a minute.
// =====================================================================

window.STORE = {
  name: "Cafe Cartel",
  tagline: "Great coffee, fresh food and a place to slow down.",
  about:
    "Tell your story here: when Cafe Cartel opened, where the beans come from, " +
    "and what makes it the neighborhood's favorite spot.",

  // Online ordering.
  // The site's own cart sends each order to the email (and text number, if set) below.
  // Customers pay at pickup or on delivery.
  orderEmail: "catering@cafecartel.club",
  orderTextNumber: "",     // café cell for text-message orders, digits only, e.g. "12015551234"
  orderNote: "Pickup or delivery · Pay when you get your order",
  // If you later turn on Toast Online Ordering, paste its link here and the Order
  // buttons will go to Toast instead of the site's cart.
  orderUrl: "",

  // Delivery zones shown in the "Pickup & Delivery" section.
  // (Set the same fees and minimums in Toast so checkout matches.)
  delivery: [
    { area: "In town",     minimum: "$10", fee: "$5" },
    { area: "Out of town", minimum: "$15", fee: "$5" },
  ],

  // Contact details (leave "" to hide a line)
  phone: "(555) 123-4567",
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

  // Menu items. "category" creates the tabs above the menu (Coffee, Food, ...).
  // Put photos in the images/ folder.
  products: [
    { category: "Coffee", name: "Espresso",        price: "$3.00", description: "Rich, bold double shot.",                 image: "images/placeholder.svg" },
    { category: "Coffee", name: "Cappuccino",      price: "$4.50", description: "Espresso with steamed milk and foam.",   image: "images/placeholder.svg" },
    { category: "Coffee", name: "Iced Latte",      price: "$5.00", description: "Smooth espresso over ice with milk.",    image: "images/placeholder.svg" },
    { category: "Food",   name: "Croissant",       price: "$3.50", description: "Buttery and baked fresh every morning.", image: "images/placeholder.svg" },
    { category: "Food",   name: "Breakfast Sandwich", price: "$7.50", description: "Egg, cheese and your choice of meat.", image: "images/placeholder.svg" },
    { category: "Sweets", name: "Chocolate Chip Cookie", price: "$2.50", description: "Warm, gooey and huge.",            image: "images/placeholder.svg" },
  ],
};
