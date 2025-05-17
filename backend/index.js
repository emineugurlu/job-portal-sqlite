// backend/index.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

const sequelize = require('./db');
const User = require('./models/User');
const JobPosting = require('./models/JobPosting');
const authenticateToken = require('./middleware/auth');

const app = express();

// Multer ayarları (dosya yükleme için)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename:    (req, file, cb) => {
    const ext = file.originalname.split('.').pop();
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`);
  }
});
const upload = multer({ storage });

// Global middleware
app.use(cors());
app.use(express.json());
// Uploads klasörünü statik olarak sun
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Veritabanı bağlantısı ve tablo senkronizasyonu
(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('DB bağlantısı ve sync başarılı!');
  } catch (err) {
    console.error('DB bağlantı hatası:', err);
  }
})();

// --- Auth (Kayıt / Giriş) ---
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash });
    res.json({ id: user.id, name: user.name, email: user.email });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Kayıt başarısız' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ error: 'Kullanıcı bulunamadı' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ error: 'Şifre yanlış' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// --- Job Posting CRUD ---

// 1) Oluşturma (dosya desteği + yetki)
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

// 2) Listeleme (herkese açık, arama destekli)
app.get('/api/jobs', async (req, res) => {
  try {
    const { search } = req.query;
    const where = search
      ? {
          [Op.or]: [
            { title:    { [Op.like]: `%${search}%` } },
            { company:  { [Op.like]: `%${search}%` } },
            { location: { [Op.like]: `%${search}%` } },
          ]
        }
      : {};

    const jobs = await JobPosting.findAll({ where });
    res.json(jobs);
  } catch (err) {
    console.error('GET /api/jobs error:', err);
    res.status(500).json({ error: 'İş ilanları alınamadı' });
  }
});

// 3) Tek bir ilan (herkese açık)
app.get('/api/jobs/:id', async (req, res) => {
  try {
    const job = await JobPosting.findByPk(req.params.id);
    if (!job) return res.status(404).json({ error: 'İlan bulunamadı' });
    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Hata oluştu' });
  }
});

// 4) Güncelleme (dosya desteği + yetki)
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

// 5) Silme (yetki)
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

// --- Server Başlat ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server ${PORT} portunda çalışıyor`));
