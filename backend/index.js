require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const sequelize = require('./db');
const User = require('./models/User');
const JobPosting = require('./models/JobPosting');

const app = express();
app.use(cors());
app.use(express.json());

// DB bağlantısı ve modellerin sync edilmesi
(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('DB bağlantısı ve sync başarılı!');
  } catch (error) {
    console.error('DB bağlantı hatası:', error);
  }
})();

// --- Auth Endpoints ---

// Kayıt
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    res.json({ id: user.id, name: user.name, email: user.email });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Kayıt başarısız' });
  }
});

// Giriş
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ error: 'Kullanıcı bulunamadı' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Şifre yanlış' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// --- Job Posting CRUD Endpoints ---

// Yeni iş ilanı oluştur
app.post('/api/jobs', async (req, res) => {
  try {
    const job = await JobPosting.create(req.body);
    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'İş ilanı oluşturulamadı' });
  }
});

// Tüm iş ilanlarını listele
app.get('/api/jobs', async (req, res) => {
  try {
    const jobs = await JobPosting.findAll();
    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'İş ilanları alınamadı' });
  }
});

// Tek bir iş ilanı getir
app.get('/api/jobs/:id', async (req, res) => {
  try {
    const job = await JobPosting.findByPk(req.params.id);
    if (!job) return res.status(404).json({ error: 'İş ilanı bulunamadı' });
    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Hata oluştu' });
  }
});

// İş ilanı güncelle
app.put('/api/jobs/:id', async (req, res) => {
  try {
    const job = await JobPosting.findByPk(req.params.id);
    if (!job) return res.status(404).json({ error: 'İş ilanı bulunamadı' });
    await job.update(req.body);
    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Güncelleme başarısız' });
  }
});

// İş ilanı sil
app.delete('/api/jobs/:id', async (req, res) => {
  try {
    const job = await JobPosting.findByPk(req.params.id);
    if (!job) return res.status(404).json({ error: 'İş ilanı bulunamadı' });
    await job.destroy();
    res.json({ message: 'İş ilanı silindi' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Silme başarısız' });
  }
});

// --- Server Başlatma ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server ${PORT} portunda çalışıyor`));
