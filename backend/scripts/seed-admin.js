// scripts/seed-admin.js

require('dotenv').config();
const bcrypt = require('bcryptjs');
const { Sequelize } = require('sequelize');

// Aynı `db.js` konfigürasyonunu buraya da import edin:
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite'  // db.js'deki storage yolunuza göre güncelleyin
});

// User modelini tanımlayın (db/models/User.js ile birebir olmalı):
const User = sequelize.define('User', {
  id:       { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  name:     { type: Sequelize.STRING, allowNull: false },
  email:    { type: Sequelize.STRING, allowNull: false, unique: true },
  password: { type: Sequelize.STRING, allowNull: false },
  role:     { type: Sequelize.ENUM('user','admin'), allowNull: false, defaultValue: 'user' }
}, {
  tableName: 'Users',
  timestamps: true
});

async function promoteToAdmin(email) {
  try {
    await sequelize.authenticate();
    // Varolan kullanıcıyı bul
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log(`⚠️  Kullanıcı bulunamadı: ${email}`);
      process.exit(1);
    }
    // role'ü güncelle
    user.role = 'admin';
    await user.save();
    console.log(`✅  ${email} artık admin!`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

// Burada admin yapmak istediğiniz e-posta adresini girin:
promoteToAdmin('admin@gmail.com');
