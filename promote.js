// promote.js
require('dotenv').config();
const sequelize = require('./backend/db');      // path’i projenize göre güncelleyin
const User      = require('./backend/models/User');

(async () => {
  try {
    await sequelize.authenticate();
    // Burada kendi admin e-posta adresinizi yazın:
    const user = await User.findOne({ where: { email: 'admin@ornek.com' } });
    if (!user) {
      console.log('Böyle bir kullanıcı bulunamadı.');
      process.exit(1);
    }
    user.role = 'admin';
    await user.save();
    console.log(`${user.email} artık admin!`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
