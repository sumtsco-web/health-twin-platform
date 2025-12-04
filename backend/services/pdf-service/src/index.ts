import express from 'express';
import PDFDocument from 'pdfkit';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app = express();
app.use(cors());
app.use(express.json());

// Ensure reports directory exists
const reportsDir = path.join(__dirname, '../../../reports');
if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
}

interface ReportData {
    title: string;
    period: string;
    generatedBy: string;
    stats: {
        totalEmployees: number;
        highRisk: number;
        avgRiskScore: number;
        fitToWork: number;
    };
    departments?: Array<{
        name: string;
        employees: number;
        highRisk: number;
        avgRisk: number;
    }>;
    alerts?: Array<{
        type: string;
        severity: string;
        count: number;
    }>;
}

app.post('/api/v1/pdf/generate', async (req, res) => {
    try {
        const data: ReportData = req.body;

        // Create PDF document
        const doc = new PDFDocument({ size: 'A4', margin: 50 });

        // Generate filename
        const filename = `report_${Date.now()}.pdf`;
        const filepath = path.join(reportsDir, filename);

        // Pipe to file
        const stream = fs.createWriteStream(filepath);
        doc.pipe(stream);

        // Header
        doc
            .fontSize(24)
            .fillColor('#6366F1')
            .text('Health Twin™', 50, 50)
            .fontSize(10)
            .fillColor('#666')
            .text('AI-Driven Occupational Health Monitoring', 50, 80);

        // Title
        doc
            .moveDown(2)
            .fontSize(20)
            .fillColor('#000')
            .text(data.title, { align: 'center' });

        // Period
        doc
            .moveDown(0.5)
            .fontSize(12)
            .fillColor('#666')
            .text(data.period, { align: 'center' });

        // Divider
        doc
            .moveDown(1)
            .strokeColor('#E5E7EB')
            .lineWidth(1)
            .moveTo(50, doc.y)
            .lineTo(550, doc.y)
            .stroke();

        // Summary Statistics
        doc
            .moveDown(2)
            .fontSize(16)
            .fillColor('#000')
            .text('Executive Summary');

        doc
            .moveDown(1)
            .fontSize(12)
            .fillColor('#333');

        const stats = [
            { label: 'Total Employees Monitored', value: data.stats.totalEmployees.toLocaleString() },
            { label: 'High Risk Cases', value: data.stats.highRisk.toString(), color: '#EF4444' },
            { label: 'Average Risk Score', value: `${data.stats.avgRiskScore}/100` },
            { label: 'Fit to Work', value: `${data.stats.fitToWork}%`, color: '#10B981' }
        ];

        stats.forEach((stat, index) => {
            const y = doc.y;
            doc
                .fillColor('#666')
                .text(stat.label, 50, y)
                .fillColor(stat.color || '#000')
                .fontSize(14)
                .font('Helvetica-Bold')
                .text(stat.value, 400, y, { align: 'right' })
                .font('Helvetica')
                .fontSize(12);
            doc.moveDown(0.8);
        });

        // Department Breakdown
        if (data.departments && data.departments.length > 0) {
            doc
                .moveDown(2)
                .fontSize(16)
                .fillColor('#000')
                .text('Department Breakdown');

            doc.moveDown(1);

            // Table header
            const tableTop = doc.y;
            doc
                .fontSize(10)
                .fillColor('#666')
                .text('Department', 50, tableTop)
                .text('Employees', 250, tableTop)
                .text('High Risk', 350, tableTop)
                .text('Avg Risk', 450, tableTop);

            doc
                .moveDown(0.5)
                .strokeColor('#E5E7EB')
                .lineWidth(0.5)
                .moveTo(50, doc.y)
                .lineTo(550, doc.y)
                .stroke();

            doc.moveDown(0.5);

            // Table rows
            data.departments.forEach((dept) => {
                const y = doc.y;
                doc
                    .fontSize(10)
                    .fillColor('#000')
                    .text(dept.name, 50, y)
                    .text(dept.employees.toString(), 250, y)
                    .fillColor('#EF4444')
                    .text(dept.highRisk.toString(), 350, y)
                    .fillColor('#6366F1')
                    .text(dept.avgRisk.toString(), 450, y);
                doc.moveDown(0.8);
            });
        }

        // Alerts Summary
        if (data.alerts && data.alerts.length > 0) {
            doc
                .moveDown(2)
                .fontSize(16)
                .fillColor('#000')
                .text('Alert Summary');

            doc.moveDown(1);

            data.alerts.forEach((alert) => {
                const color = alert.severity === 'critical' ? '#F43F5E' :
                    alert.severity === 'high' ? '#EF4444' : '#F59E0B';

                doc
                    .fontSize(12)
                    .fillColor('#333')
                    .text(`${alert.type}:`, 50, doc.y)
                    .fillColor(color)
                    .text(`${alert.count} ${alert.severity} alerts`, 300, doc.y);
                doc.moveDown(0.8);
            });
        }

        // Footer
        doc
            .fontSize(8)
            .fillColor('#999')
            .text(
                `Generated on ${new Date().toLocaleString()} by ${data.generatedBy}`,
                50,
                doc.page.height - 50,
                { align: 'center' }
            );

        // Finalize PDF
        doc.end();

        // Wait for file to be written
        stream.on('finish', () => {
            res.json({
                success: true,
                filename,
                filepath: `/reports/${filename}`,
                size: fs.statSync(filepath).size
            });
        });

    } catch (error) {
        console.error('PDF generation error:', error);
        res.status(500).json({ error: 'Failed to generate PDF' });
    }
});

// Serve generated PDFs
app.use('/reports', express.static(reportsDir));

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', service: 'pdf-generator' });
});

const PORT = process.env.PORT || 8006;
app.listen(PORT, () => {
    console.log(`PDF Service running on port ${PORT}`);
});
