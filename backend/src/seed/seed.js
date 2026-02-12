const bcrypt = require('bcryptjs');
const { User, Product, Wallet, Transaction } = require('../models');

const SALT_ROUNDS = 12;
const INITIAL_BALANCE = parseFloat(process.env.INITIAL_WALLET_BALANCE) || 50.00;

/**
 * Seed the database with initial data.
 * Only runs if the database is empty (idempotent).
 */
async function seedDatabase() {
  const userCount = await User.count();
  if (userCount > 0) {
    console.log('[Seed] Database already seeded. Skipping.');
    return;
  }

  console.log('[Seed] Seeding database...');

  // ─── Admin User ───────────────────────────────────────
  const adminPasswordHash = await bcrypt.hash('Admin@ZDM2024!', SALT_ROUNDS);
  const admin = await User.create({
    name: 'System Administrator',
    email: 'admin@zerodaymarket.io',
    passwordHash: adminPasswordHash,
    role: 'admin'
  });

  const adminWallet = await Wallet.create({
    userId: admin.id,
    balance: 0
  });

  await Transaction.create({
    walletId: adminWallet.id,
    type: 'credit',
    amount: 0,
    description: 'Admin account — no wallet balance',
    referenceType: 'system',
    referenceId: adminWallet.id,
    balanceAfter: 0
  });

  // ─── Products ─────────────────────────────────────────
  const products = [
    {
      name: 'Wireless Charging Pad',
      description: 'Fast wireless charging pad compatible with all Qi-enabled devices. Features intelligent LED status indicator, anti-slip silicone surface, and foreign object detection for safe charging. Supports up to 15W fast charge for compatible devices.',
      price: 10.00,
      imageKey: 'charging-pad',
      category: 'Accessories',
      isRefundable: false,
      stock: 150
    },
    {
      name: 'USB-C Hub Pro 7-in-1',
      description: 'Premium aluminum USB-C hub with HDMI 4K@60Hz output, 2x USB 3.0 ports, SD/microSD card readers, and 100W Power Delivery passthrough. Plug-and-play with no drivers required.',
      price: 10.00,
      imageKey: 'usb-hub',
      category: 'Accessories',
      isRefundable: false,
      stock: 200
    },
    {
      name: 'Mechanical Keyboard MX',
      description: 'Full-size mechanical keyboard with Cherry MX Blue switches, per-key RGB backlighting, and a brushed aluminum frame. Features N-key rollover, detachable USB-C cable, and programmable macro keys.',
      price: 30.00,
      imageKey: 'keyboard',
      category: 'Peripherals',
      isRefundable: false,
      stock: 75
    },
    {
      name: 'Smart LED Desk Lamp',
      description: 'Touch-controlled LED desk lamp with 5 color temperatures (2700K–6500K), stepless brightness adjustment, and a built-in USB charging port. Memory function recalls your last used setting.',
      price: 30.00,
      imageKey: 'desk-lamp',
      category: 'Home Office',
      isRefundable: false,
      stock: 120
    },
    {
      name: 'Premium Noise-Canceling Headphones',
      description: 'Over-ear wireless headphones with hybrid active noise cancellation, 40mm custom drivers, and 40-hour battery life. Hi-Res Audio certified with LDAC codec support. Foldable design with premium carrying case.',
      price: 45.00,
      imageKey: 'headphones',
      category: 'Audio',
      isRefundable: false,
      stock: 60
    },
    {
      name: 'Ergonomic Office Chair Pro',
      description: 'Fully adjustable ergonomic office chair with adaptive lumbar support, breathable mesh back, 4D armrests, and a synchronized tilt mechanism. Supports up to 300 lbs with a reinforced aluminum base. Backed by a 5-year comprehensive warranty.',
      price: 60.00,
      imageKey: 'office-chair',
      category: 'Furniture',
      isRefundable: true,
      stock: 30
    },
    {
      name: 'UltraWide Monitor 34"',
      description: '34-inch curved WQHD (3440x1440) ultrawide monitor with 144Hz refresh rate, 1ms MPRT, HDR400, and 98% DCI-P3 color gamut. Features USB-C 90W Power Delivery, KVM switch, and height-adjustable stand.',
      price: 60.00,
      imageKey: 'monitor',
      category: 'Displays',
      isRefundable: true,
      stock: 25
    },
    {
      name: 'Standing Desk Converter',
      description: 'Height-adjustable standing desk converter with dual monitor arms capable of supporting up to 27" displays, a spacious keyboard tray, and integrated cable management. Gas-spring mechanism for smooth height transitions. Clamps to any desk surface.',
      price: 75.00,
      imageKey: 'standing-desk',
      category: 'Furniture',
      isRefundable: false,
      stock: 40
    }
  ];

  await Product.bulkCreate(products);

  console.log(`[Seed] Created admin user: admin@zerodaymarket.io`);
  console.log(`[Seed] Created ${products.length} products`);
  console.log('[Seed] Database seeding complete.');
}

module.exports = seedDatabase;
