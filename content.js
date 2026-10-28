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

  // Contact details (leave "" to hide a line)
  phone: "(555) 123-4567",
  email: "hello@cafecartel.club",
  whatsapp: "",            // digits only with country code, e.g. "15551234567"
  address: "123 Main Street, Your City, ST 00000",

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

  // Menu items. Put photos in the images/ folder.
  products: [
    { name: "Espresso",      price: "$3.00", description: "Rich, bold double shot.",                 image: "images/placeholder.svg" },
    { name: "Cappuccino",    price: "$4.50", description: "Espresso with steamed milk and foam.",   image: "images/placeholder.svg" },
    { name: "Iced Latte",    price: "$5.00", description: "Smooth espresso over ice with milk.",    image: "images/placeholder.svg" },
    { name: "Croissant",     price: "$3.50", description: "Buttery and baked fresh every morning.", image: "images/placeholder.svg" },
  ],
};
