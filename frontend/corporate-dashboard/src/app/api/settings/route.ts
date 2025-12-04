import { NextResponse } from 'next/server';

// In-memory storage for demo (in production, this would be in database)
let userSettings = {
    cardiacRiskThreshold: 60,
    fatigueThreshold: 70,
    hrvThreshold: 50,
    heartRateThreshold: 90,
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    alertFrequency: 'immediate',
    dataRetention: 90,
    autoReports: true,
    reportFrequency: 'weekly',
    timezone: 'Asia/Dubai',
};

export async function GET() {
    try {
        return NextResponse.json(userSettings);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const newSettings = await request.json();

        // Validate settings
        if (newSettings.cardiacRiskThreshold < 0 || newSettings.cardiacRiskThreshold > 100) {
            return NextResponse.json({ error: 'Invalid cardiac risk threshold' }, { status: 400 });
        }

        // Update settings
        userSettings = { ...userSettings, ...newSettings };

        // In production, save to database:
        // await db.userSettings.update({ userId: 'current-user', data: newSettings });

        return NextResponse.json({
            success: true,
            message: 'Settings saved successfully',
            settings: userSettings
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
    }
}
