// =====================================================================
//  STORE CONTENT: edit this file to change what the website shows.
//  Keep the quotes "..." and the commas at the end of each line.
//  Save, commit and push, and the live site updates in about a minute.
// =====================================================================

window.STORE = {
  name: "Your Store Name",
  tagline: "Quality products, friendly service, right in your neighborhood.",
  about:
    "Tell your story here: when the store opened, what makes it special, " +
    "and why customers keep coming back.",

  // Contact details (leave "" to hide a line)
  phone: "(555) 123-4567",
  email: "hello@yourstore.com",
  whatsapp: "",            // digits only with country code, e.g. "15551234567"
  address: "123 Main Street, Your City, ST 00000",

  // Opening hours, shown in this order
  hours: [
    ["Monday – Friday", "9:00 AM – 7:00 PM"],
    ["Saturday", "10:00 AM – 6:00 PM"],
    ["Sunday", "Closed"],
  ],

  // Social links (leave "" to hide)
  social: {
    instagram: "",
    facebook: "",
    tiktok: "",
  },

  // Products or categories. Put photos in the images/ folder.
  products: [
    { name: "Product One",   price: "$19.99", description: "A short line about this product.", image: "images/placeholder.svg" },
    { name: "Product Two",   price: "$24.99", description: "A short line about this product.", image: "images/placeholder.svg" },
    { name: "Product Three", price: "$9.99",  description: "A short line about this product.", image: "images/placeholder.svg" },
    { name: "Product Four",  price: "$39.99", description: "A short line about this product.", image: "images/placeholder.svg" },
  ],
};
