// backend/index.js

// ——— Dosya Sistemi & Yol Modülleri ———
const fs   = require('fs');
const path = require('path');

// ——— Gerekli Klasörleri Oluştur (uploads ve uploads/cvs) ———
const uploadDir = path.join(__dirname, 'uploads');
const cvsDir    = path.join(uploadDir, 'cvs');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
if (!fs.existsSync(cvsDir))    fs.mkdirSync(cvsDir);

// ——— Ortam Değişkenleri & Temel Kütüphaneler ———
require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const multer     = require('multer');
const bcrypt     = require('bcryptjs');
const jwt        = require('jsonwebtoken');
const { Op }     = require('sequelize');

const sequelize         = require('./db');
const User              = require('./models/User');
const JobPosting        = require('./models/JobPosting');
const Category          = require('./models/Category');
const authenticateToken = require('./middleware/auth');

const app = express();

// ——— Model İlişkileri ———
Category.hasMany(JobPosting,   { foreignKey: 'categoryId' });
JobPosting.belongsTo(Category, { foreignKey: 'categoryId' });

// ——— Multer Ayarları ———
// 1) Genel dosyalar (ilan ekleri)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename:    (req, file, cb) => {
    const ext = file.originalname.split('.').pop();
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`);
  }
});
const upload = multer({ storage });

// 2) CV yüklemeleri
const cvStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, cvsDir),
  filename:    (req, file, cb) => {
    const ext = file.originalname.split('.').pop();
    cb(null, `${req.user.id}-${Date.now()}.${ext}`);
  }
});
const cvUpload = multer({ storage: cvStorage });

// ——— Global Middleware ———
app.use(cors());
app.use(express.json());
// uploads klasörünü statik sun
app.use('/uploads', express.static(uploadDir));

// ——— DB Bağlantısı & Senkronizasyon ———
;(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('DB bağlantısı ve senkronizasyon başarılı!');
  } catch (err) {
    console.error('DB bağlantı hatası:', err);
  }
})();

// ——— Auth Endpoints ———

// Kayıt: varsayılan rol 'user'
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name, email, password: hash,
      role: 'user'    // admin eklemek istiyorsan DB üzerinden manuel atayabilirsin
    });
    res.json({ id: user.id, name: user.name, email: user.email });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Kayıt başarısız' });
  }
});

// Giriş: JWT içinde id + role
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ error: 'Kullanıcı bulunamadı' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ error: 'Şifre yanlış' });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        cv: user.cv
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// ——— Profile Endpoints ———

// Profil getir (her auth kullanıcı)
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email', 'cv', 'role']
    });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Profil alınamadı' });
  }
});

// Profil güncelle (her auth kullanıcı)
app.put('/api/profile', authenticateToken, async (req, res) => {
  try {
    const { name, password } = req.body;
    const user = await User.findByPk(req.user.id);
    if (name)     user.name     = name;
    if (password) user.password = await bcrypt.hash(password, 10);
    await user.save();
    res.json({ id: user.id, name: user.name, email: user.email, cv: user.cv, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Profil güncelleme başarısız' });
  }
});

// CV yükle (her auth kullanıcı)
app.post(
  '/api/profile/cv',
  authenticateToken,
  cvUpload.single('cv'),
  async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ error: 'Dosya seçilmedi' });
      const user = await User.findByPk(req.user.id);
      user.cv = `cvs/${req.file.filename}`;
      await user.save();
      res.json({ cv: user.cv });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'CV yükleme başarısız' });
    }
  }
);

// ——— Category Endpoints ———

// Kategori listele (herkese açık)
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kategoriler alınamadı' });
  }
});

// Kategori oluştur (sadece admin)
app.post('/api/categories', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Yetersiz yetki' });
  try {
    const { name } = req.body;
    const category = await Category.create({ name });
    res.json(category);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Kategori oluşturulamadı' });
  }
});

// ——— Job Posting CRUD ———

// 1) Oluştur (sadece admin)
app.post(
  '/api/jobs',
  authenticateToken,
  upload.single('attachment'),
  async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Yetersiz yetki' });
    try {
      const data = { ...req.body };
      if (req.file) data.attachment = req.file.filename;
      const job = await JobPosting.create(data);
      res.json(job);
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: 'İş ilanı oluşturulamadı' });
    }
  }
);

// 2) Listele (herkese açık)
app.get('/api/jobs', async (req, res) => {
  try {
    const {
      search   = '',
      page     = 1,
      limit    = 10,
      sortBy   = 'createdAt',
      order    = 'desc',
      category = null
    } = req.query;

    const where = {
      ...(search ? {
        [Op.or]: [
          { title:    { [Op.like]: `%${search}%` } },
          { company:  { [Op.like]: `%${search}%` } },
          { location: { [Op.like]: `%${search}%` } },
        ]
      } : {}),
      ...(category ? { categoryId: category } : {})
    };

    const pageNum = Math.max(parseInt(page, 10), 1);
    const limNum  = Math.max(parseInt(limit, 10), 1);
    const offset  = (pageNum - 1) * limNum;

    const { count, rows } = await JobPosting.findAndCountAll({
      where,
      order:  [[sortBy, order.toUpperCase()]],
      limit:  limNum,
      offset,
      include: [{ model: Category, attributes: ['id','name'] }]
    });

    res.json({
      total: count,
      pages: Math.ceil(count/limNum),
      page:  pageNum,
      jobs:  rows
    });
  } catch (err) {
    console.error('GET /api/jobs error:', err);
    res.status(500).json({ error: 'İş ilanları alınamadı' });
  }
});

// 3) Tek ilan getir (herkese açık)
app.get('/api/jobs/:id', async (req, res) => {
  try {
    const job = await JobPosting.findByPk(req.params.id, {
      include: [{ model: Category, attributes: ['id','name'] }]
    });
    if (!job) return res.status(404).json({ error: 'İlan bulunamadı' });
    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Hata oluştu' });
  }
});

// 4) Güncelle (sadece admin)
app.put(
  '/api/jobs/:id',
  authenticateToken,
  upload.single('attachment'),
  async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Yetersiz yetki' });
    try {
      const job = await JobPosting.findByPk(req.params.id);
      if (!job) return res.status(404).json({ error: 'İlan bulunamadı' });
      const updates = { ...req.body };
      if (req.file) updates.attachment = req.file.filename;
      await job.update(updates);
      res.json(job);
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: 'Güncelleme başarısız' });
    }
  }
);

// 5) Sil (sadece admin)
app.delete('/api/jobs/:id', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Yetersiz yetki' });
  try {
    const job = await JobPosting.findByPk(req.params.id);
    if (!job) return res.status(404).json({ error: 'İlan bulunamadı' });
    await job.destroy();
    res.json({ message: 'İlan silindi' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Silme başarısız' });
  }
});

// ——— Sunucu Başlat ———
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server ${PORT} portunda çalışıyor`));
