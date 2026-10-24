const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'data', 'db.json');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database helper functions
function readDb() {
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading DB:', err);
    return { categories: [], products: [], orders: [], tables: [], settings: {} };
  }
}

function writeDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing DB:', err);
    return false;
  }
}

// Server-Sent Events (SSE) for Real-Time Kitchen & Cashier notifications
let sseClients = [];

function broadcastEvent(eventName, payload) {
  const dataString = `event: ${eventName}\ndata: ${JSON.stringify(payload)}\n\n`;
  sseClients.forEach((client) => {
    try {
      client.res.write(dataString);
    } catch (e) {
      // client disconnected
    }
  });
}

app.get('/api/events', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });
  res.write('\n');

  const clientId = Date.now();
  const newClient = { id: clientId, res };
  sseClients.push(newClient);

  req.on('close', () => {
    sseClients = sseClients.filter((c) => c.id !== clientId);
  });
});

// 1. Menu API
app.get('/api/menu', (req, res) => {
  const db = readDb();
  res.json({
    settings: db.settings,
    categories: db.categories,
    products: db.products,
    addons: db.addons,
  });
});

// 2. Tables API
app.get('/api/tables', (req, res) => {
  const db = readDb();
  res.json(db.tables || []);
});

// 3. Orders API
app.get('/api/orders', (req, res) => {
  const db = readDb();
  const { status, table } = req.query;
  let orders = db.orders || [];

  if (status) {
    orders = orders.filter((o) => o.status === status);
  }
  if (table) {
    orders = orders.filter((o) => o.table === table);
  }

  // Sort newest first
  orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(orders);
});

app.get('/api/orders/:id', (req, res) => {
  const db = readDb();
  const order = (db.orders || []).find((o) => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

app.post('/api/orders', (req, res) => {
  const db = readDb();
  const { table, customerName, items, orderType, paymentMethod } = req.body;

  if (!items || !items.length) {
    return res.status(400).json({ error: 'Keranjang belanja kosong' });
  }

  // Generate ID
  const orderCount = (db.orders || []).length + 101;
  const orderId = `DOR-${orderCount}`;

  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const timeString = `${hours}:${minutes} WIB`;

  let subtotal = 0;
  const processedItems = items.map((item) => {
    const itemSubtotal = (item.price || 0) * (item.quantity || 1) + (item.addonsTotal || 0) * (item.quantity || 1);
    subtotal += itemSubtotal;
    return {
      productId: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity || 1,
      temperature: item.temperature || '-',
      sugar: item.sugar || '-',
      addons: item.addons || [],
      notes: item.notes || '',
      subtotal: itemSubtotal,
    };
  });

  // Calculate Restaurant Tax PB1 (10%)
  const tax = Math.round(subtotal * 0.10);
  const total = subtotal + tax;

  const newOrder = {
    id: orderId,
    table: table ? String(table).padStart(2, '0') : '00',
    customerName: customerName || 'Tamu',
    orderType: orderType || 'Dine In',
    items: processedItems,
    subtotal: subtotal,
    tax: tax,
    total: total,
    specialInstructions: req.body.specialInstructions || '',
    status: 'pending', // pending -> processing -> ready -> completed
    paymentStatus: String(paymentMethod || '').toUpperCase().includes('QRIS') ? 'paid' : (req.body.paymentStatus || 'unpaid'),
    paymentMethod: paymentMethod || 'Cash',
    createdAt: now.toISOString(),
    timeString: timeString,
  };

  db.orders = db.orders || [];
  db.orders.unshift(newOrder);

  // Update table status if dine-in
  if (table && db.tables) {
    const targetTable = db.tables.find((t) => t.number === String(table).padStart(2, '0'));
    if (targetTable) targetTable.status = 'occupied';
  }

  writeDb(db);

  // Broadcast realtime event to cashier
  broadcastEvent('new_order', newOrder);

  res.status(201).json(newOrder);
});

// Update order status (pending, processing, ready, completed, cancelled)
app.patch('/api/orders/:id/status', (req, res) => {
  const db = readDb();
  const order = (db.orders || []).find((o) => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  const { status } = req.body;
  if (!status) return res.status(400).json({ error: 'Status is required' });

  order.status = status;
  if (status === 'completed') {
    // If order completed, check if table can be freed
    const tableOrders = db.orders.filter(
      (o) => o.table === order.table && o.status !== 'completed' && o.status !== 'cancelled'
    );
    if (tableOrders.length === 0 && db.tables) {
      const targetTable = db.tables.find((t) => t.number === order.table);
      if (targetTable) targetTable.status = 'available';
    }
  }

  writeDb(db);
  broadcastEvent('order_updated', order);
  res.json(order);
});

// Process Payment
app.post('/api/orders/:id/pay', (req, res) => {
  const db = readDb();
  const order = (db.orders || []).find((o) => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  const { paymentMethod, amountPaid } = req.body;
  order.paymentStatus = 'paid';
  order.paymentMethod = paymentMethod || 'Cash';
  order.amountPaid = Number(amountPaid) || order.total;
  order.change = Math.max(0, order.amountPaid - order.total);
  order.paidAt = new Date().toISOString();

  writeDb(db);
  broadcastEvent('order_paid', order);
  res.json(order);
});

// Product Management (CRUD)
app.post('/api/products', (req, res) => {
  const db = readDb();
  const { id, name, category, price, description, badge, isDrink, image } = req.body;

  if (id) {
    // Edit existing
    const idx = db.products.findIndex((p) => p.id === Number(id));
    if (idx !== -1) {
      db.products[idx] = { ...db.products[idx], name, category, price: Number(price), description, badge, isDrink, image };
      writeDb(db);
      return res.json(db.products[idx]);
    }
  }

  // Create new
  const newId = Math.max(...db.products.map((p) => p.id), 0) + 1;
  const newProduct = {
    id: newId,
    name,
    category,
    price: Number(price),
    description: description || '',
    badge: badge || '',
    isDrink: Boolean(isDrink),
    image: image || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400',
  };
  db.products.push(newProduct);
  writeDb(db);
  res.status(201).json(newProduct);
});

app.delete('/api/products/:id', (req, res) => {
  const db = readDb();
  db.products = db.products.filter((p) => p.id !== Number(req.params.id));
  writeDb(db);
  res.json({ success: true });
});

// Reports API
app.get('/api/reports/daily', (req, res) => {
  const db = readDb();
  const orders = db.orders || [];

  const totalOrders = orders.length;
  const paidOrders = orders.filter((o) => o.paymentStatus === 'paid');
  const totalRevenue = paidOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const processingCount = orders.filter((o) => o.status === 'processing').length;

  // Item frequency
  const itemMap = {};
  orders.forEach((o) => {
    (o.items || []).forEach((item) => {
      itemMap[item.name] = (itemMap[item.name] || 0) + (item.quantity || 1);
    });
  });

  const popularItems = Object.entries(itemMap)
    .map(([name, qty]) => ({ name, qty }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  res.json({
    totalOrders,
    paidCount: paidOrders.length,
    totalRevenue,
    pendingCount,
    processingCount,
    popularItems,
  });
});

// Waiter Call API
app.post('/api/call-waiter', (req, res) => {
  const { table, serviceType } = req.body;
  const alertData = {
    id: Date.now(),
    table: table ? String(table).padStart(2, '0') : '00',
    serviceType: serviceType || 'Panggil Pelayan',
    timeString: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
  };
  broadcastEvent('waiter_called', alertData);
  res.json({ success: true, alertData });
});

// Feedback / Kritik & Saran API
app.post('/api/feedback', (req, res) => {
  const db = readDb();
  const { table, customerName, rating, message } = req.body;
  const newFeedback = {
    id: Date.now(),
    table: table ? String(table).padStart(2, '0') : '00',
    customerName: customerName || 'Pelanggan',
    rating: Number(rating) || 5,
    message: message || '',
    createdAt: new Date().toISOString()
  };
  db.feedback = db.feedback || [];
  db.feedback.unshift(newFeedback);
  writeDb(db);
  broadcastEvent('new_feedback', newFeedback);
  res.status(201).json(newFeedback);
});

app.get('/api/feedback', (req, res) => {
  const db = readDb();
  res.json(db.feedback || []);
});

// Auth API
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const db = readDb();
  if (username === db.admin.username && password === db.admin.password) {
    res.json({
      success: true,
      user: {
        name: db.admin.name,
        role: 'cashier',
        shift: db.admin.shift,
      },
    });
  } else {
    res.status(401).json({ success: false, error: 'Username atau password salah' });
  }
});

app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`☕ DORE Coffee & Pastry POS Server running on port ${PORT}`);
  console.log(`📱 Customer Portal : http://localhost:${PORT}/?table=04`);
  console.log(`🖥️ Cashier Portal  : http://localhost:${PORT}/admin.html`);
  console.log(`======================================================\n`);
});
