const express = require('express');
const validator = require('validator');
const dns = require('dns');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

app.post('/verify', (req, res) => {
  const { email } = req.body;

  if (!email || !validator.isEmail(email)) {
    return res.status(400).json({ valid: false, reason: 'Invalid email format' });
  }

  const domain = email.split('@')[1];

  dns.resolveMx(domain, (err, addresses) => {
    if (err || addresses.length === 0) {
      return res.json({ valid: false, reason: 'Domain has no MX records' });
    }
    res.json({ valid: true, reason: 'Valid email and domain accepts mail' });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Email Verifier API running on port ${PORT}`));
