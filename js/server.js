// Backend functionality for Camping Affiliate Hub
// This file will handle server-side operations for the website

// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../')));

// Routes
// Home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// About page
app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, '../about.html'));
});

// Contact page
app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, '../contact.html'));
});

// API endpoint for contact form
app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body;
  
  // Validate input
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Please fill all required fields' });
  }
  
  // In a production environment, you would set up nodemailer to send emails
  // For now, we'll just log the message and return a success response
  console.log('Contact form submission:');
  console.log('Name:', name);
  console.log('Email:', email);
  console.log('Subject:', subject);
  console.log('Message:', message);
  
  // Store contact submissions in a JSON file
  const contactData = {
    name,
    email,
    subject,
    message,
    date: new Date().toISOString()
  };
  
  const contactsFile = path.join(__dirname, 'data/contacts.json');
  
  // Create data directory if it doesn't exist
  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }
  
  // Read existing contacts or create new array
  let contacts = [];
  if (fs.existsSync(contactsFile)) {
    const fileContent = fs.readFileSync(contactsFile, 'utf8');
    contacts = JSON.parse(fileContent);
  }
  
  // Add new contact
  contacts.push(contactData);
  
  // Write back to file
  fs.writeFileSync(contactsFile, JSON.stringify(contacts, null, 2));
  
  res.status(200).json({ success: true, message: 'Message received! We will get back to you soon.' });
});

// API endpoint for newsletter signup
app.post('/api/newsletter', (req, res) => {
  const { email } = req.body;
  
  // Validate input
  if (!email) {
    return res.status(400).json({ success: false, message: 'Please provide an email address' });
  }
  
  // Store newsletter subscriptions in a JSON file
  const subscriptionData = {
    email,
    date: new Date().toISOString()
  };
  
  const subscriptionsFile = path.join(__dirname, 'data/subscriptions.json');
  
  // Create data directory if it doesn't exist
  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }
  
  // Read existing subscriptions or create new array
  let subscriptions = [];
  if (fs.existsSync(subscriptionsFile)) {
    const fileContent = fs.readFileSync(subscriptionsFile, 'utf8');
    subscriptions = JSON.parse(fileContent);
  }
  
  // Check if email already exists
  const emailExists = subscriptions.some(sub => sub.email === email);
  if (emailExists) {
    return res.status(400).json({ success: false, message: 'Email already subscribed' });
  }
  
  // Add new subscription
  subscriptions.push(subscriptionData);
  
  // Write back to file
  fs.writeFileSync(subscriptionsFile, JSON.stringify(subscriptions, null, 2));
  
  res.status(200).json({ success: true, message: 'Thank you for subscribing to our newsletter!' });
});

// API endpoint for tracking affiliate link clicks
app.post('/api/track-affiliate', (req, res) => {
  const { productId, productName, category } = req.body;
  
  // Store click data in a JSON file
  const clickData = {
    productId,
    productName,
    category,
    date: new Date().toISOString(),
    referrer: req.headers.referer || 'direct'
  };
  
  const clicksFile = path.join(__dirname, 'data/affiliate_clicks.json');
  
  // Create data directory if it doesn't exist
  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }
  
  // Read existing clicks or create new array
  let clicks = [];
  if (fs.existsSync(clicksFile)) {
    const fileContent = fs.readFileSync(clicksFile, 'utf8');
    clicks = JSON.parse(fileContent);
  }
  
  // Add new click
  clicks.push(clickData);
  
  // Write back to file
  fs.writeFileSync(clicksFile, JSON.stringify(clicks, null, 2));
  
  res.status(200).json({ success: true });
});

// API endpoint to get product data
app.get('/api/products', (req, res) => {
  const category = req.query.category;
  const productsFile = path.join(__dirname, 'data/products.json');
  
  // Check if products file exists
  if (!fs.existsSync(productsFile)) {
    return res.status(404).json({ success: false, message: 'Products data not found' });
  }
  
  // Read products data
  const fileContent = fs.readFileSync(productsFile, 'utf8');
  const products = JSON.parse(fileContent);
  
  // Filter by category if specified
  if (category) {
    const filteredProducts = products.filter(product => product.category === category);
    return res.status(200).json({ success: true, products: filteredProducts });
  }
  
  res.status(200).json({ success: true, products });
});

// 404 handler
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '../404.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
