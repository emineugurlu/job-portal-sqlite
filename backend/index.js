// backend/index.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

const sequelize    = require('./db');
const User         = require('./models/User');
const JobPosting   = require('./models/JobPosting');
const Category     = require('./models/Category');
const authenticateToken = require('./middleware/auth');

const app = express();

// ——— Model İlişkileri ———
Category.hasMany(JobPosting,   { foreignKey: 'categoryId' });
JobPosting.belongsTo(Category, { foreignKey: 'categoryId' });

// ——— Multer Ayarları ———
// Genel dosyalar (ilan ekleri)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, 'uploads')),
  filename:    (req, file, cb) => {
    const ext = file.originalname.split('.').pop();
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`);
  }
});
const upload = multer({ storage });

// CV yüklemeleri
const cvStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, 'uploads', 'cvs')),
  filename:    (req, file, cb) => {
    const ext = file.originalname.split('.').pop();
    cb(null, `${req.user.id}-${Date.now()}.${ext}`);
  }
});
const cvUpload = multer({ storage: cvStorage });

// ——— Global Middleware ———
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ——— DB Bağlantısı & Senkronizasyon ———
(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('DB bağlantısı ve senkronizasyon başarılı!');
  } catch (err) {
    console.error('DB bağlantı hatası:', err);
  }
})();

// ——— Auth Endpoints ———
// Kayıt
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash });
    res.json({ id: user.id, name: user.name, email: user.email });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Kayıt başarısız' });
  }
});

// Giriş
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ error: 'Kullanıcı bulunamadı' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ error: 'Şifre yanlış' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, cv: user.cv } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// ——— Profile Endpoints ———
// Profil getir
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email', 'cv']
    });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Profil alınamadı' });
  }
});

// Profil güncelle
app.put('/api/profile', authenticateToken, async (req, res) => {
  try {
    const { name, password } = req.body;
    const user = await User.findByPk(req.user.id);
    if (name)     user.name     = name;
    if (password) user.password = await bcrypt.hash(password, 10);
    await user.save();
    res.json({ id: user.id, name: user.name, email: user.email, cv: user.cv });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Profil güncelleme başarısız' });
  }
});

// CV yükle
app.post('/api/profile/cv', authenticateToken, cvUpload.single('cv'), async (req, res) => {
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
});

// ——— Category Endpoints ———
// Kategori listele
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kategoriler alınamadı' });
  }
});

// Kategori oluştur (yetki)
app.post('/api/categories', authenticateToken, async (req, res) => {
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
// Oluştur (attachment + yetki)
app.post(
  '/api/jobs',
  authenticateToken,
  upload.single('attachment'),
  async (req, res) => {
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

// Listele (search + pagination + sort + category filter)
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
      order: [[sortBy, order.toUpperCase()]],
      limit: limNum,
      offset,
      include: [{ model: Category, attributes: ['id', 'name'] }]
    });

    res.json({
      total: count,
      pages: Math.ceil(count / limNum),
      page:  pageNum,
      jobs:  rows
    });
  } catch (err) {
    console.error('GET /api/jobs error:', err);
    res.status(500).json({ error: 'İş ilanları alınamadı' });
  }
});

// Tek ilan getir
app.get('/api/jobs/:id', async (req, res) => {
  try {
    const job = await JobPosting.findByPk(req.params.id, {
      include: [{ model: Category, attributes: ['id', 'name'] }]
    });
    if (!job) return res.status(404).json({ error: 'İlan bulunamadı' });
    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Hata oluştu' });
  }
});

// Güncelle (attachment + yetki)
app.put(
  '/api/jobs/:id',
  authenticateToken,
  upload.single('attachment'),
  async (req, res) => {
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

// Sil (yetki)
app.delete('/api/jobs/:id', authenticateToken, async (req, res) => {
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
