import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth/options';
import { runNeonQuery } from '@/app/lib/db/neon';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [
      technicalTrainings,
      technicalTrainingsActive,
      nonTechnicalTrainings,
      nonTechnicalTrainingsActive,
      consultingServices,
      consultingServicesActive,
      contacts,
      contactsNew,
      calendarEvents,
      calendarEventsActive,
      calendarEventsUpcoming,
      upcomingEventRows,
    ] = await Promise.all([
      runNeonQuery<{ count: string }>('SELECT COUNT(*)::text AS count FROM technical_trainings'),
      runNeonQuery<{ count: string }>('SELECT COUNT(*)::text AS count FROM technical_trainings WHERE status = true'),
      runNeonQuery<{ count: string }>('SELECT COUNT(*)::text AS count FROM non_technical_trainings'),
      runNeonQuery<{ count: string }>('SELECT COUNT(*)::text AS count FROM non_technical_trainings WHERE status = true'),
      runNeonQuery<{ count: string }>('SELECT COUNT(*)::text AS count FROM consulting_services'),
      runNeonQuery<{ count: string }>('SELECT COUNT(*)::text AS count FROM consulting_services WHERE status = true'),
      runNeonQuery<{ count: string }>('SELECT COUNT(*)::text AS count FROM contact_submissions'),
      runNeonQuery<{ count: string }>("SELECT COUNT(*)::text AS count FROM contact_submissions WHERE status = 'new'"),
      runNeonQuery<{ count: string }>('SELECT COUNT(*)::text AS count FROM calendar_events'),
      runNeonQuery<{ count: string }>('SELECT COUNT(*)::text AS count FROM calendar_events WHERE status = true'),
      runNeonQuery<{ count: string }>(
        "SELECT COUNT(*)::text AS count FROM calendar_events WHERE status = true AND end_time >= NOW()"
      ),
      runNeonQuery<{
        id: string;
        title: string;
        start_time: string;
        end_time: string;
        location: string | null;
        status: boolean;
      }>(
        `
        SELECT id, title, start_time, end_time, location, status
        FROM calendar_events
        WHERE status = true
          AND end_time >= NOW()
        ORDER BY start_time ASC
        LIMIT 6
        `
      ),
    ]);

    return NextResponse.json({
      data: {
        technicalTrainings: Number(technicalTrainings.rows[0]?.count || 0),
        technicalTrainingsActive: Number(technicalTrainingsActive.rows[0]?.count || 0),
        nonTechnicalTrainings: Number(nonTechnicalTrainings.rows[0]?.count || 0),
        nonTechnicalTrainingsActive: Number(nonTechnicalTrainingsActive.rows[0]?.count || 0),
        consultingServices: Number(consultingServices.rows[0]?.count || 0),
        consultingServicesActive: Number(consultingServicesActive.rows[0]?.count || 0),
        contacts: Number(contacts.rows[0]?.count || 0),
        contactsNew: Number(contactsNew.rows[0]?.count || 0),
        calendarEvents: Number(calendarEvents.rows[0]?.count || 0),
        calendarEventsActive: Number(calendarEventsActive.rows[0]?.count || 0),
        calendarEventsUpcoming: Number(calendarEventsUpcoming.rows[0]?.count || 0),
        upcomingEvents: upcomingEventRows.rows || [],
      },
    });
  } catch (error) {
    console.error('Admin dashboard stats error:', error);
    return NextResponse.json({ error: 'Failed to load dashboard stats' }, { status: 500 });
  }
}
