// backend/scripts/seed-admin.js
const bcrypt = require('bcryptjs');
const { Sequelize } = require('../db'); // db.js'de oluşturduğunuz sequelize örneği
const User = require('../models/User');

(async () => {
  try {
    // veritabanına bağlantı + senkronizasyon (varsa)
    await Sequelize.authenticate();
    // eğer tablolar yoksa oluştur:
    await Sequelize.sync();

    const adminEmail = 'admin@site.com';
    const adminPassword = 'admin123';

    let admin = await User.findOne({ where: { email: adminEmail } });
    if (!admin) {
      const hash = await bcrypt.hash(adminPassword, 10);
      admin = await User.create({
        name: 'Yönetici',
        email: adminEmail,
        password: hash,
        role: 'admin'
      });
      console.log(`Yeni admin oluşturuldu: ${adminEmail} / ${adminPassword}`);
    } else {
      // mevcut kullanıcıya admin yetkisi ver
      admin.role = 'admin';
      await admin.save();
      console.log(`Var olan kullanıcıya admin yetkisi eklendi: ${adminEmail}`);
    }
  } catch (err) {
    console.error('Admin seed hatası:', err);
  } finally {
    process.exit();
  }
})();
