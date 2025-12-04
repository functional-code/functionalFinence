import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { calculateTax } from './engine/calculator';
import { TaxpayerProfile } from './types';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('FunctionalFinance API is running');
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

import authRoutes from './auth/auth.routes';

app.use('/api/auth', authRoutes);

app.post('/api/calculate', (req, res) => {
    try {
        const profile: TaxpayerProfile = req.body;
        // TODO: Add Zod validation here
        const result = calculateTax(profile);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Calculation failed' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
