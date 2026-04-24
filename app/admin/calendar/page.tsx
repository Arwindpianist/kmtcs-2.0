'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { DateRange } from 'react-day-picker';
import { CalendarIcon } from 'lucide-react';
import { toast } from 'sonner';
import DataTable from '@/app/components/admin/DataTable';
import { AdminTablePageSkeleton } from '@/app/components/skeletons/PageSkeletons';
import { logger } from '@/app/lib/logger';
import { Button } from '@/app/components/ui/button';
import { Calendar } from '@/app/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/app/components/ui/popover';
import { cn } from '@/app/lib/utils';

type TrainingTable = 'technical_trainings' | 'non_technical_trainings';

interface TrainingRecord {
  id: string;
  title: string;
  description: string;
  duration: string;
  objectives: string[];
  course_contents: string;
  target_audience: string;
  methodology: string;
  certification: string;
  hrdcorp_approval_no: string;
  brochure_url?: string;
  brochure_path?: string;
  brochure_file_name?: string;
  brochure_file_size?: number;
  brochure_mime_type?: string;
}

interface TrainingOption extends TrainingRecord {
  training_table: TrainingTable;
  training_label: string;
}

interface TrainingSnapshot {
  training_id?: string;
  training_table?: TrainingTable;
  title?: string;
  description?: string;
  duration?: string;
  objectives?: string[];
  course_contents?: string;
  target_audience?: string;
  methodology?: string;
  certification?: string;
  hrdcorp_approval_no?: string;
}

interface Attachment {
  name: string;
  url: string;
  size: number;
}

interface CalendarEventRow {
  id?: string;
  title: string;
  description?: string;
  duration?: string;
  start_time: string;
  end_time: string;
  location?: string;
  all_day: boolean;
  status: boolean;
  linked_trainings_count?: number;
  attachments?: Attachment[];
  training_snapshot?: TrainingSnapshot | null;
  linked_trainings?: Array<{ training_table: TrainingTable; training_id: string; title: string }>;
}

interface LocationSuggestion {
  place_id: number;
  display_name: string;
}

interface BatchSession {
  id: string;
  dateRange?: DateRange;
  startHour: string;
  startMinute: string;
  startPeriod: 'AM' | 'PM';
  endHour: string;
  endMinute: string;
  endPeriod: 'AM' | 'PM';
  location: string;
}

const HOURS = Array.from({ length: 12 }, (_, index) => String(index + 1).padStart(2, '0'));
const MINUTES = ['00', '15', '30', '45'];
const PERIODS = ['AM', 'PM'] as const;

function formatDateLabel(date?: Date) {
  if (!date) return '';
  return date.toLocaleDateString('en-MY', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatRangeLabel(range?: DateRange) {
  if (!range?.from) return 'Pick date range';
  if (!range.to) return `${formatDateLabel(range.from)} - ...`;
  return `${formatDateLabel(range.from)} - ${formatDateLabel(range.to)}`;
}

function parseIsoToTimeParts(value?: string): { hour: string; minute: string; period: 'AM' | 'PM' } {
  if (!value) return { hour: '09', minute: '00', period: 'AM' as 'AM' | 'PM' };
  const date = new Date(value);
  const hour24 = date.getHours();
  const minute = String(Math.round(date.getMinutes() / 15) * 15).padStart(2, '0');
  const period = hour24 >= 12 ? 'PM' : 'AM';
  const hour12 = hour24 % 12 || 12;
  return { hour: String(hour12).padStart(2, '0'), minute, period };
}

function combineDateAndTime(date: Date, hour: string, minute: string, period: 'AM' | 'PM') {
  const hour12 = Number.parseInt(hour, 10) || 12;
  const minuteValue = Number.parseInt(minute, 10) || 0;
  const hour24 = period === 'PM' ? (hour12 % 12) + 12 : hour12 % 12;
  const normalized = new Date(date);
  normalized.setHours(hour24, minuteValue, 0, 0);
  return normalized.toISOString();
}

function getMalaysiaTodayDate() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kuala_Lumpur',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());

  const year = Number(parts.find((part) => part.type === 'year')?.value || '1970');
  const month = Number(parts.find((part) => part.type === 'month')?.value || '01');
  const day = Number(parts.find((part) => part.type === 'day')?.value || '01');

  return new Date(year, month - 1, day);
}

function buildCompositeDescription(snapshot: TrainingSnapshot) {
  const sections: string[] = [];
  if (snapshot.description) sections.push(`Overview:\n${snapshot.description}`);
  if (snapshot.objectives && snapshot.objectives.length > 0) {
    sections.push(`Learning Objectives:\n${snapshot.objectives.map((item) => `- ${item}`).join('\n')}`);
  }
  if (snapshot.course_contents) sections.push(`Course Contents:\n${snapshot.course_contents}`);
  if (snapshot.target_audience) sections.push(`Target Audience:\n${snapshot.target_audience}`);
  if (snapshot.methodology) sections.push(`Methodology:\n${snapshot.methodology}`);
  if (snapshot.certification) sections.push(`Certification:\n${snapshot.certification}`);
  if (snapshot.hrdcorp_approval_no) sections.push(`HRDCorp Approval No:\n${snapshot.hrdcorp_approval_no}`);
  return sections.join('\n\n');
}

function buildSnapshotFromTraining(training: TrainingOption): TrainingSnapshot {
  return {
    training_id: training.id,
    training_table: training.training_table,
    title: training.title,
    description: training.description,
    duration: training.duration,
    objectives: training.objectives || [],
    course_contents: training.course_contents,
    target_audience: training.target_audience,
    methodology: training.methodology,
    certification: training.certification,
    hrdcorp_approval_no: training.hrdcorp_approval_no,
  };
}

function createDefaultBatchSession(): BatchSession {
  const malaysiaToday = getMalaysiaTodayDate();
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    dateRange: { from: malaysiaToday, to: malaysiaToday },
    startHour: '08',
    startMinute: '30',
    startPeriod: 'AM',
    endHour: '05',
    endMinute: '00',
    endPeriod: 'PM',
    location: 'Kuala Lumpur',
  };
}

function TimePickerSelect({
  label,
  value,
  options,
  onChange,
  disabled = false,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-gray-600">{label}</label>
      <select
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900',
          disabled && 'cursor-not-allowed opacity-60'
        )}
      >
        {options.map((option) => (
          <option key={`${label}-${option}`} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function confirmWithToast(message: string) {
  return new Promise<boolean>((resolve) => {
    let settled = false;
    toast(message, {
      duration: 10000,
      action: {
        label: 'Delete',
        onClick: () => {
          settled = true;
          resolve(true);
        },
      },
      cancel: {
        label: 'Cancel',
        onClick: () => {
          settled = true;
          resolve(false);
        },
      },
      onAutoClose: () => {
        if (!settled) resolve(false);
      },
      onDismiss: () => {
        if (!settled) resolve(false);
      },
    });
  });
}

export default function AdminCalendarPage() {
  const [events, setEvents] = useState<CalendarEventRow[]>([]);
  const [trainings, setTrainings] = useState<TrainingOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingBrochure, setUploadingBrochure] = useState(false);
  const [migratingLegacyBrochures, setMigratingLegacyBrochures] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showBatchScheduler, setShowBatchScheduler] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEventRow | null>(null);

  const [trainingSearch, setTrainingSearch] = useState('');
  const [selectedTraining, setSelectedTraining] = useState<TrainingOption | null>(null);

  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [startHour, setStartHour] = useState('09');
  const [startMinute, setStartMinute] = useState('00');
  const [startPeriod, setStartPeriod] = useState<'AM' | 'PM'>('AM');
  const [endHour, setEndHour] = useState('05');
  const [endMinute, setEndMinute] = useState('00');
  const [endPeriod, setEndPeriod] = useState<'AM' | 'PM'>('PM');

  const [locationQuery, setLocationQuery] = useState('');
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([]);
  const [locationLoading, setLocationLoading] = useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const locationContainerRef = useRef<HTMLDivElement | null>(null);

  const [formData, setFormData] = useState<CalendarEventRow>({
    title: '',
    description: '',
    duration: '',
    start_time: '',
    end_time: '',
    location: 'Kuala Lumpur',
    all_day: false,
    status: true,
    attachments: [],
    training_snapshot: { objectives: [] },
  });
  const [batchTrainingSearch, setBatchTrainingSearch] = useState('');
  const [batchSelectedTraining, setBatchSelectedTraining] = useState<TrainingOption | null>(null);
  const [batchBrochureAttachment, setBatchBrochureAttachment] = useState<Attachment | null>(null);
  const [batchSessions, setBatchSessions] = useState<BatchSession[]>([createDefaultBatchSession()]);

  const filteredTrainingOptions = useMemo(() => {
    const search = trainingSearch.trim().toLowerCase();
    if (!search) return trainings.slice(0, 8);
    return trainings
      .filter(
        (training) =>
          training.title.toLowerCase().includes(search) ||
          (training.description || '').toLowerCase().includes(search)
      )
      .slice(0, 8);
  }, [trainings, trainingSearch]);
  const filteredBatchTrainingOptions = useMemo(() => {
    const search = batchTrainingSearch.trim().toLowerCase();
    if (!search) return trainings.slice(0, 8);
    return trainings
      .filter(
        (training) =>
          training.title.toLowerCase().includes(search) ||
          (training.description || '').toLowerCase().includes(search)
      )
      .slice(0, 8);
  }, [batchTrainingSearch, trainings]);

  const loadTrainings = useCallback(async () => {
    const [technicalResponse, nonTechnicalResponse] = await Promise.all([
      fetch('/api/technical-trainings'),
      fetch('/api/non-technical-trainings'),
    ]);

    if (!technicalResponse.ok || !nonTechnicalResponse.ok) {
      throw new Error('Failed to fetch trainings for calendar autofill');
    }

    const technicalPayload = await technicalResponse.json();
    const nonTechnicalPayload = await nonTechnicalResponse.json();

    const technicalTrainings: TrainingOption[] = (technicalPayload.data || []).map((item: TrainingRecord) => ({
      ...item,
      training_table: 'technical_trainings',
      training_label: 'Technical Training',
    }));
    const nonTechnicalTrainings: TrainingOption[] = (nonTechnicalPayload.data || []).map(
      (item: TrainingRecord) => ({
        ...item,
        training_table: 'non_technical_trainings',
        training_label: 'Non-Technical Training',
      })
    );

    setTrainings([...technicalTrainings, ...nonTechnicalTrainings]);
  }, []);

  const loadEvents = useCallback(async () => {
    const response = await fetch('/api/admin/calendar-events');
    if (!response.ok) throw new Error('Failed to fetch events');
    const result = await response.json();
    setEvents(result.data || []);
  }, []);

  const initializePage = useCallback(async () => {
    try {
      await Promise.all([loadEvents(), loadTrainings()]);
    } catch (error) {
      logger.error('Error loading calendar admin data:', error);
    } finally {
      setLoading(false);
    }
  }, [loadEvents, loadTrainings]);

  useEffect(() => {
    initializePage();
  }, [initializePage]);

  useEffect(() => {
    if (!showForm) return;
    const query = locationQuery.trim();
    if (query.length < 3) {
      setLocationSuggestions([]);
      return;
    }
    const timeoutId = window.setTimeout(async () => {
      try {
        setLocationLoading(true);
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=6&q=${encodeURIComponent(query)}`
        );
        if (!response.ok) throw new Error('Failed location lookup');
        const payload = (await response.json()) as LocationSuggestion[];
        setLocationSuggestions(payload);
      } catch (error) {
        logger.error('Location finder lookup failed:', error);
        setLocationSuggestions([]);
      } finally {
        setLocationLoading(false);
      }
    }, 250);
    return () => window.clearTimeout(timeoutId);
  }, [locationQuery, showForm]);

  useEffect(() => {
    const onDocumentClick = (event: MouseEvent) => {
      if (!locationContainerRef.current) return;
      const targetNode = event.target as Node;
      if (!locationContainerRef.current.contains(targetNode)) {
        setShowLocationSuggestions(false);
      }
    };
    document.addEventListener('mousedown', onDocumentClick);
    return () => document.removeEventListener('mousedown', onDocumentClick);
  }, []);

  const resetForm = () => {
    const malaysiaToday = getMalaysiaTodayDate();
    const defaultRange: DateRange = { from: malaysiaToday, to: malaysiaToday };
    setDateRange(defaultRange);
    setStartHour('08');
    setStartMinute('30');
    setStartPeriod('AM');
    setEndHour('05');
    setEndMinute('00');
    setEndPeriod('PM');

    setFormData({
      title: '',
      description: '',
      duration: '',
      start_time: '',
      end_time: '',
      location: 'Kuala Lumpur',
      all_day: false,
      status: true,
      attachments: [],
      training_snapshot: { objectives: [] },
    });

    setEditingEvent(null);
    setSelectedTraining(null);
    setTrainingSearch('');
    setLocationQuery('Kuala Lumpur');
    setLocationSuggestions([]);
    setShowLocationSuggestions(false);
  };

  const applyTrainingToForm = (training: TrainingOption) => {
    const snapshot: TrainingSnapshot = buildSnapshotFromTraining(training);
    setSelectedTraining(training);
    setTrainingSearch(`${training.title} (${training.training_label})`);
    setFormData((prev) => {
      const existingAttachments = prev.attachments || [];
      const trainingBrochure =
        training.brochure_url && training.brochure_file_name
          ? [{ name: training.brochure_file_name, url: training.brochure_url, size: 0 }]
          : [];
      const deduped = [...existingAttachments, ...trainingBrochure].filter(
        (attachment, index, array) =>
          index === array.findIndex((candidate) => candidate.url === attachment.url)
      );

      return {
        ...prev,
        title: training.title,
        description: training.description || '',
        duration: training.duration || '',
        training_snapshot: snapshot,
        attachments: deduped,
      };
    });
  };

  const resetBatchScheduler = () => {
    setBatchTrainingSearch('');
    setBatchSelectedTraining(null);
    setBatchBrochureAttachment(null);
    setBatchSessions([createDefaultBatchSession()]);
  };

  const applyTrainingToBatch = (training: TrainingOption) => {
    setBatchSelectedTraining(training);
    setBatchTrainingSearch(`${training.title} (${training.training_label})`);
    setBatchBrochureAttachment(
      training.brochure_url && training.brochure_file_name
        ? {
            name: training.brochure_file_name,
            url: training.brochure_url,
            size: Number(training.brochure_file_size || 0),
          }
        : null
    );
  };

  const addBatchSession = () => {
    setBatchSessions((prev) => [...prev, createDefaultBatchSession()]);
  };

  const removeBatchSession = (sessionId: string) => {
    setBatchSessions((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((session) => session.id !== sessionId);
    });
  };

  const updateBatchSession = (sessionId: string, updates: Partial<BatchSession>) => {
    setBatchSessions((prev) =>
      prev.map((session) => (session.id === sessionId ? { ...session, ...updates } : session))
    );
  };

  const handleSaveBatchSchedule = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      if (!batchSelectedTraining) {
        throw new Error('Select a training before scheduling multiple sessions');
      }

      const invalidSession = batchSessions.find((session) => !session.dateRange?.from || !session.dateRange?.to);
      if (invalidSession) {
        throw new Error('Every scheduled session needs a valid date range');
      }

      const snapshot = buildSnapshotFromTraining(batchSelectedTraining);
      const baseDescription = buildCompositeDescription(snapshot);
      const baseAttachments = batchBrochureAttachment ? [batchBrochureAttachment] : [];
      if (baseAttachments.length === 0) {
        throw new Error(
          'This training has no brochure yet. Upload one brochure first, then create batch sessions.'
        );
      }

      for (const session of batchSessions) {
        const startIso = combineDateAndTime(
          session.dateRange!.from!,
          session.startHour,
          session.startMinute,
          session.startPeriod
        );
        const endIso = combineDateAndTime(
          session.dateRange!.to!,
          session.endHour,
          session.endMinute,
          session.endPeriod
        );

        const createResponse = await fetch('/api/admin/calendar-events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: batchSelectedTraining.title,
            description: baseDescription,
            duration: batchSelectedTraining.duration || null,
            start_time: startIso,
            end_time: endIso,
            location: session.location || 'Kuala Lumpur',
            all_day: false,
            status: true,
            attachments: baseAttachments,
            training_snapshot: snapshot,
          }),
        });
        const createdPayload = await createResponse.json();
        if (!createResponse.ok) {
          throw new Error(createdPayload.error || 'Failed to create one of the scheduled sessions');
        }

        const eventId = String(createdPayload?.data?.id || '');
        if (!eventId) {
          throw new Error('Failed to retrieve created event id');
        }

        let mergedEventIds: string[] = [eventId];
        try {
          const existingLinksResponse = await fetch(
            `/api/admin/training-calendar-links?training_table=${batchSelectedTraining.training_table}&training_ids=${batchSelectedTraining.id}`
          );
          if (existingLinksResponse.ok) {
            const existingLinksPayload = await existingLinksResponse.json();
            const existingLinks = existingLinksPayload?.data?.[batchSelectedTraining.id] || [];
            mergedEventIds = Array.from(
              new Set([
                ...existingLinks.map((link: { calendar_event_id: string }) => link.calendar_event_id),
                eventId,
              ])
            );
          }
        } catch (error) {
          logger.error('Failed to fetch existing links while batch scheduling:', error);
        }

        const linkResponse = await fetch('/api/admin/training-calendar-links', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            training_table: batchSelectedTraining.training_table,
            training_id: batchSelectedTraining.id,
            event_ids: mergedEventIds,
          }),
        });
        if (!linkResponse.ok) {
          throw new Error('Session created but failed to link it to training');
        }
      }

      await loadEvents();
      setShowBatchScheduler(false);
      resetBatchScheduler();
      toast.success(`Scheduled ${batchSessions.length} session(s) for ${batchSelectedTraining.title}.`);
    } catch (error) {
      logger.error('Error scheduling batch events:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to schedule multiple sessions');
    } finally {
      setSaving(false);
    }
  };

  const handleLegacyBrochureMigration = async () => {
    setMigratingLegacyBrochures(true);
    try {
      const response = await fetch('/api/admin/migrate-legacy-brochures', { method: 'POST' });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || 'Legacy migration failed');
      }

      await loadTrainings();
      const totalMigrated = Number(payload?.data?.totalMigrated || 0);
      const totalFound = Number(payload?.data?.totalFound || 0);

      if (totalFound === 0) {
        toast.info('No Supabase brochure URLs were found in training records.');
      } else {
        toast.success(`Migrated ${totalMigrated} brochure file(s) to Vercel Blob.`);
      }
    } catch (error) {
      logger.error('Legacy brochure migration failed:', error);
      toast.error(error instanceof Error ? error.message : 'Legacy migration failed.');
    } finally {
      setMigratingLegacyBrochures(false);
    }
  };

  const handleEdit = async (event: CalendarEventRow) => {
    try {
      const response = await fetch(`/api/admin/calendar-events?id=${event.id}`);
      if (!response.ok) throw new Error('Failed to load event details');
      const payload = await response.json();
      const detailedEvent: CalendarEventRow = payload.data;

      const startDate = new Date(detailedEvent.start_time);
      const endDate = new Date(detailedEvent.end_time);
      const startParts = parseIsoToTimeParts(detailedEvent.start_time);
      const endParts = parseIsoToTimeParts(detailedEvent.end_time);

      setEditingEvent(detailedEvent);
      setDateRange({ from: startDate, to: endDate });
      setStartHour(startParts.hour);
      setStartMinute(startParts.minute);
      setStartPeriod(startParts.period);
      setEndHour(endParts.hour);
      setEndMinute(endParts.minute);
      setEndPeriod(endParts.period);

      setFormData({
        ...detailedEvent,
        attachments: detailedEvent.attachments || [],
        training_snapshot: detailedEvent.training_snapshot || { objectives: [] },
      });
      setLocationQuery(detailedEvent.location || '');

      const linkedTraining = detailedEvent.linked_trainings?.[0];
      if (linkedTraining) {
        const foundTraining = trainings.find(
          (item) =>
            item.training_table === linkedTraining.training_table && item.id === linkedTraining.training_id
        );
        setSelectedTraining(foundTraining || null);
        setTrainingSearch(linkedTraining.title);
      } else {
        setSelectedTraining(null);
        setTrainingSearch('');
      }

      setShowForm(true);
    } catch (error) {
      logger.error('Error loading event details:', error);
      toast.error('Unable to load event details.');
    }
  };

  const convertEditToBatchScheduler = () => {
    if (!editingEvent) return;
    const snapshot = formData.training_snapshot || {};
    const trainingId = selectedTraining?.id || snapshot.training_id;
    const trainingTable = selectedTraining?.training_table || snapshot.training_table;

    if (!trainingId || !trainingTable) {
      toast.error('This event is not linked to a training. Link a training first to batch schedule.');
      return;
    }

    const matchedTraining =
      trainings.find((item) => item.id === trainingId && item.training_table === trainingTable) || null;

    if (!matchedTraining) {
      toast.error('Linked training was not found. Reload trainings and try again.');
      return;
    }

    const startParts = parseIsoToTimeParts(formData.start_time || editingEvent.start_time);
    const endParts = parseIsoToTimeParts(formData.end_time || editingEvent.end_time);
    const sessionFrom: Date = dateRange?.from || new Date(formData.start_time || editingEvent.start_time);
    const sessionTo: Date = dateRange?.to || new Date(formData.end_time || editingEvent.end_time);

    setBatchSelectedTraining(matchedTraining);
    setBatchTrainingSearch(`${matchedTraining.title} (${matchedTraining.training_label})`);
    setBatchSessions([
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        dateRange: { from: sessionFrom, to: sessionTo },
        startHour: startParts.hour,
        startMinute: startParts.minute,
        startPeriod: startParts.period,
        endHour: endParts.hour,
        endMinute: endParts.minute,
        endPeriod: endParts.period,
        location: formData.location || locationQuery || 'Kuala Lumpur',
      },
    ]);

    setShowForm(false);
    setShowBatchScheduler(true);
  };

  const handleBrochureUpload = async (file: File | null) => {
    if (!file) return;
    setUploadingBrochure(true);
    try {
      const body = new FormData();
      body.append('file', file);
      const response = await fetch('/api/admin/upload-training-brochure', { method: 'POST', body });
      if (!response.ok) throw new Error('Failed to upload brochure');
      const uploaded = await response.json();
      setFormData((prev) => ({
        ...prev,
        attachments: [
          ...(prev.attachments || []),
          {
            name: uploaded.file_name,
            url: uploaded.url,
            size: Number(uploaded.file_size || 0),
          },
        ],
      }));
    } catch (error) {
      logger.error('Error uploading calendar brochure:', error);
      toast.error('Brochure upload failed. Please try again.');
    } finally {
      setUploadingBrochure(false);
    }
  };

  const handleBatchBrochureUpload = async (file: File | null) => {
    if (!file) return;
    if (!batchSelectedTraining) {
      toast.error('Select a training first before uploading brochure.');
      return;
    }

    setUploadingBrochure(true);
    try {
      const body = new FormData();
      body.append('file', file);
      const response = await fetch('/api/admin/upload-training-brochure', { method: 'POST', body });
      if (!response.ok) throw new Error('Failed to upload brochure');
      const uploaded = await response.json();

      const saveResponse = await fetch('/api/admin/training-brochure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          training_table: batchSelectedTraining.training_table,
          training_id: batchSelectedTraining.id,
          brochure_url: uploaded.url,
          brochure_path: uploaded.path,
          brochure_file_name: uploaded.file_name,
          brochure_file_size: uploaded.file_size,
          brochure_mime_type: uploaded.mime_type,
        }),
      });

      if (!saveResponse.ok) {
        const payload = await saveResponse.json();
        throw new Error(payload.error || 'Failed to save brochure to training');
      }

      const nextAttachment = {
        name: uploaded.file_name,
        url: uploaded.url,
        size: Number(uploaded.file_size || 0),
      };
      setBatchBrochureAttachment(nextAttachment);
      setBatchSelectedTraining((prev) =>
        prev
          ? {
              ...prev,
              brochure_url: uploaded.url,
              brochure_path: uploaded.path,
              brochure_file_name: uploaded.file_name,
              brochure_file_size: Number(uploaded.file_size || 0),
              brochure_mime_type: uploaded.mime_type,
            }
          : prev
      );
      setTrainings((prev) =>
        prev.map((item) =>
          item.id === batchSelectedTraining.id && item.training_table === batchSelectedTraining.training_table
            ? {
                ...item,
                brochure_url: uploaded.url,
                brochure_path: uploaded.path,
                brochure_file_name: uploaded.file_name,
                brochure_file_size: Number(uploaded.file_size || 0),
                brochure_mime_type: uploaded.mime_type,
              }
            : item
        )
      );
      toast.success('Brochure uploaded and linked. Future sessions will reuse this brochure.');
    } catch (error) {
      logger.error('Error uploading batch brochure:', error);
      toast.error(error instanceof Error ? error.message : 'Brochure upload failed.');
    } finally {
      setUploadingBrochure(false);
    }
  };

  const removeAttachment = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      attachments: (prev.attachments || []).filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const updateTrainingSnapshot = (key: keyof TrainingSnapshot, value: string | string[]) => {
    setFormData((prev) => ({
      ...prev,
      training_snapshot: {
        ...(prev.training_snapshot || { objectives: [] }),
        [key]: value,
      },
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (!dateRange?.from || !dateRange?.to) {
        throw new Error('Date range is required');
      }

      const snapshot = formData.training_snapshot || {};
      const startIso = formData.all_day
        ? combineDateAndTime(dateRange.from, '12', '00', 'AM')
        : combineDateAndTime(dateRange.from, startHour, startMinute, startPeriod);
      const endIso = formData.all_day
        ? combineDateAndTime(dateRange.to, '11', '59', 'PM')
        : combineDateAndTime(dateRange.to, endHour, endMinute, endPeriod);

      const payload = {
        ...formData,
        start_time: startIso,
        end_time: endIso,
        location: formData.location || locationQuery,
        description: buildCompositeDescription(snapshot),
        duration: formData.duration || snapshot.duration || null,
        training_snapshot: {
          ...snapshot,
          duration: formData.duration || snapshot.duration,
        },
      };

      const response = await fetch('/api/admin/calendar-events', {
        method: editingEvent ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingEvent ? { ...payload, id: editingEvent.id } : payload),
      });
      if (!response.ok) throw new Error('Failed to save event');

      const savedPayload = await response.json();
      const eventId = savedPayload?.data?.id || editingEvent?.id;
      const linkedTrainingId = selectedTraining?.id || snapshot.training_id;
      const linkedTrainingTable = selectedTraining?.training_table || snapshot.training_table;

      if (eventId && linkedTrainingId && linkedTrainingTable) {
        let mergedEventIds: string[] = [eventId];
        try {
          const existingLinksResponse = await fetch(
            `/api/admin/training-calendar-links?training_table=${linkedTrainingTable}&training_ids=${linkedTrainingId}`
          );
          if (existingLinksResponse.ok) {
            const existingLinksPayload = await existingLinksResponse.json();
            const existingLinks = existingLinksPayload?.data?.[linkedTrainingId] || [];
            mergedEventIds = Array.from(
              new Set([
                ...existingLinks.map((link: { calendar_event_id: string }) => link.calendar_event_id),
                eventId,
              ])
            );
          }
        } catch (error) {
          logger.error('Failed to fetch existing links while saving calendar event:', error);
        }

        const linkResponse = await fetch('/api/admin/training-calendar-links', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            training_table: linkedTrainingTable,
            training_id: linkedTrainingId,
            event_ids: mergedEventIds,
          }),
        });
        if (!linkResponse.ok) throw new Error('Event saved but failed to link training');
      }

      await loadEvents();
      setShowForm(false);
      resetForm();
      toast.success(editingEvent ? 'Calendar event updated.' : 'Calendar event created.');
    } catch (error) {
      logger.error('Error saving calendar event:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save calendar event.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await confirmWithToast('Delete this calendar event?');
    if (!confirmed) return;
    try {
      const response = await fetch(`/api/admin/calendar-events?id=${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete event');
      await loadEvents();
      toast.success('Calendar event deleted.');
    } catch (error) {
      logger.error('Error deleting calendar event:', error);
      toast.error('Failed to delete calendar event.');
    }
  };

  const applyRangePreset = (preset: 'today' | 'tomorrow' | 'week') => {
    const now = new Date();
    if (preset === 'today') {
      setDateRange({ from: now, to: now });
      return;
    }
    if (preset === 'tomorrow') {
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDateRange({ from: tomorrow, to: tomorrow });
      return;
    }
    const end = new Date(now);
    end.setDate(end.getDate() + 6);
    setDateRange({ from: now, to: end });
  };

  if (loading) return <AdminTablePageSkeleton />;

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6 lg:mb-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Calendar Management</h1>
              <p className="text-gray-600">
                Search a training to auto-fill and schedule one or multiple sessions with shared brochure details.
              </p>
            </div>
            <button
              onClick={() => {
                setShowBatchScheduler(false);
                resetForm();
                setShowForm(true);
              }}
              className="mt-4 lg:mt-0 bg-indigo-600 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm lg:text-base"
            >
              Add Calendar Event
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                resetBatchScheduler();
                setShowBatchScheduler(true);
              }}
              className="mt-2 lg:mt-0 lg:ml-3 border border-indigo-600 text-indigo-700 px-4 lg:px-6 py-2 lg:py-3 rounded-lg hover:bg-indigo-50 transition-colors font-medium text-sm lg:text-base"
            >
              Batch Schedule Training
            </button>
          </div>
        </motion.div>
      </div>

      {showForm ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-8 mb-6 lg:mb-8">
          <h2 className="text-xl lg:text-2xl font-semibold mb-4 lg:mb-6">{editingEvent ? 'Edit Event' : 'Add Event'}</h2>
          {editingEvent ? (
            <div className="mb-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={convertEditToBatchScheduler}
                className="text-xs px-3 py-1.5 border border-indigo-300 rounded-lg text-indigo-700 hover:bg-indigo-50"
              >
                Add Another Session (Batch)
              </button>
            </div>
          ) : null}
          <form onSubmit={handleSave} className="space-y-6">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <h3 className="font-semibold text-slate-900">Training Lookup and Auto-Fill</h3>
                <button
                  type="button"
                  onClick={handleLegacyBrochureMigration}
                  disabled={migratingLegacyBrochures}
                  className="inline-flex items-center justify-center rounded-lg border border-indigo-300 px-3 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-50 disabled:opacity-60"
                >
                  {migratingLegacyBrochures ? 'Importing Legacy Brochures...' : 'Import Legacy Supabase Brochures'}
                </button>
              </div>
              <p className="text-xs text-gray-500">
                Brochures found for selected training are auto-attached below. You can add more PDFs or remove any before saving.
              </p>
              <input
                value={trainingSearch}
                onChange={(e) => setTrainingSearch(e.target.value)}
                placeholder="Search training title or description..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              {trainingSearch ? (
                <div className="border border-gray-200 rounded-lg bg-white max-h-56 overflow-auto">
                  {filteredTrainingOptions.length === 0 ? (
                    <p className="p-3 text-sm text-gray-500">No matching trainings found.</p>
                  ) : (
                    filteredTrainingOptions.map((training) => (
                      <button
                        key={`${training.training_table}-${training.id}`}
                        type="button"
                        className="w-full text-left px-3 py-2 hover:bg-indigo-50 border-b border-gray-100 last:border-b-0"
                        onClick={() => applyTrainingToForm(training)}
                      >
                        <p className="font-medium text-sm text-gray-900">{training.title}</p>
                        <p className="text-xs text-gray-500">
                          {training.training_label} {training.duration ? `- ${training.duration}` : ''}
                        </p>
                      </button>
                    ))
                  )}
                </div>
              ) : null}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Event title *</label>
                <input
                  required
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Range *</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !dateRange?.from && 'text-gray-500'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formatRangeLabel(dateRange)}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={2}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => applyRangePreset('today')}
                    className="px-3 py-1.5 rounded-full border border-gray-300 text-xs hover:bg-gray-50"
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    onClick={() => applyRangePreset('tomorrow')}
                    className="px-3 py-1.5 rounded-full border border-gray-300 text-xs hover:bg-gray-50"
                  >
                    Tomorrow
                  </button>
                  <button
                    type="button"
                    onClick={() => applyRangePreset('week')}
                    className="px-3 py-1.5 rounded-full border border-gray-300 text-xs hover:bg-gray-50"
                  >
                    Next 7 Days
                  </button>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Time Picker</label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-gray-200 p-3 bg-gradient-to-b from-slate-50 to-white">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Start</p>
                    <div className="grid grid-cols-3 gap-2">
                      <TimePickerSelect label="Hour" value={startHour} options={HOURS} onChange={setStartHour} disabled={formData.all_day} />
                      <TimePickerSelect label="Minute" value={startMinute} options={MINUTES} onChange={setStartMinute} disabled={formData.all_day} />
                      <TimePickerSelect label="Period" value={startPeriod} options={PERIODS} onChange={(value) => setStartPeriod(value as 'AM' | 'PM')} disabled={formData.all_day} />
                    </div>
                  </div>
                  <div className="rounded-2xl border border-gray-200 p-3 bg-gradient-to-b from-slate-50 to-white">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">End</p>
                    <div className="grid grid-cols-3 gap-2">
                      <TimePickerSelect label="Hour" value={endHour} options={HOURS} onChange={setEndHour} disabled={formData.all_day} />
                      <TimePickerSelect label="Minute" value={endMinute} options={MINUTES} onChange={setEndMinute} disabled={formData.all_day} />
                      <TimePickerSelect label="Period" value={endPeriod} options={PERIODS} onChange={(value) => setEndPeriod(value as 'AM' | 'PM')} disabled={formData.all_day} />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location Finder</label>
                <div className="relative" ref={locationContainerRef}>
                  <input
                    value={locationQuery}
                    onChange={(e) => {
                      setLocationQuery(e.target.value);
                      setFormData((prev) => ({ ...prev, location: e.target.value }));
                      setShowLocationSuggestions(true);
                    }}
                    onFocus={() => setShowLocationSuggestions(true)}
                    placeholder="Search venue, building, or address..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  {showLocationSuggestions && (locationQuery.trim().length >= 3 || locationLoading) ? (
                    <div className="absolute left-0 right-0 top-full mt-1 rounded-lg border border-gray-200 bg-white shadow-lg z-20 max-h-56 overflow-auto">
                      {locationLoading ? (
                        <p className="px-3 py-2 text-sm text-gray-500">Searching locations...</p>
                      ) : locationSuggestions.length > 0 ? (
                        locationSuggestions.map((suggestion) => (
                          <button
                            key={suggestion.place_id}
                            type="button"
                            onClick={() => {
                              setLocationQuery(suggestion.display_name);
                              setFormData((prev) => ({ ...prev, location: suggestion.display_name }));
                              setShowLocationSuggestions(false);
                            }}
                            className="w-full px-3 py-2 text-left hover:bg-indigo-50 border-b border-gray-100 last:border-b-0"
                          >
                            <span className="text-sm text-gray-900">{suggestion.display_name}</span>
                          </button>
                        ))
                      ) : (
                        <p className="px-3 py-2 text-sm text-gray-500">No matching locations found.</p>
                      )}
                    </div>
                  ) : null}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                <input
                  value={formData.duration || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, duration: e.target.value }))}
                  placeholder="e.g., 3 days"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="flex items-center gap-4 pt-2 md:col-span-2">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={formData.all_day}
                    onChange={(e) => setFormData((prev) => ({ ...prev, all_day: e.target.checked }))}
                  />
                  All day event
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={formData.status}
                    onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.checked }))}
                  />
                  Active
                </label>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">Course Description (Part by Part)</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Overview</label>
                <textarea
                  rows={3}
                  value={formData.training_snapshot?.description || ''}
                  onChange={(e) => updateTrainingSnapshot('description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Learning Objectives (one per line)</label>
                <textarea
                  rows={4}
                  value={(formData.training_snapshot?.objectives || []).join('\n')}
                  onChange={(e) =>
                    updateTrainingSnapshot(
                      'objectives',
                      e.target.value
                        .split('\n')
                        .map((item) => item.trim())
                        .filter(Boolean)
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Course Contents</label>
                <textarea
                  rows={5}
                  value={formData.training_snapshot?.course_contents || ''}
                  onChange={(e) => updateTrainingSnapshot('course_contents', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                  <textarea
                    rows={3}
                    value={formData.training_snapshot?.target_audience || ''}
                    onChange={(e) => updateTrainingSnapshot('target_audience', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Methodology</label>
                  <textarea
                    rows={3}
                    value={formData.training_snapshot?.methodology || ''}
                    onChange={(e) => updateTrainingSnapshot('methodology', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Certification</label>
                  <textarea
                    rows={2}
                    value={formData.training_snapshot?.certification || ''}
                    onChange={(e) => updateTrainingSnapshot('certification', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">HRDCorp Approval No</label>
                  <input
                    value={formData.training_snapshot?.hrdcorp_approval_no || ''}
                    onChange={(e) => updateTrainingSnapshot('hrdcorp_approval_no', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
              <h3 className="text-lg font-semibold text-slate-900">Brochure PDF Attachments</h3>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => handleBrochureUpload(e.target.files?.[0] || null)}
                className="text-sm"
              />
              {uploadingBrochure ? <p className="text-sm text-indigo-600">Uploading brochure...</p> : null}
              {(formData.attachments || []).length > 0 ? (
                <div className="space-y-2">
                  {(formData.attachments || []).map((attachment, index) => (
                    <div
                      key={`${attachment.url}-${index}`}
                      className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2"
                    >
                      <a
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 underline"
                      >
                        {attachment.name}
                      </a>
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="text-xs text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No brochure attached yet.</p>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowLocationSuggestions(false);
                  setShowForm(false);
                  resetForm();
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Event'}
              </button>
            </div>
          </form>
        </div>
      ) : showBatchScheduler ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-8 mb-6 lg:mb-8">
          <h2 className="text-xl lg:text-2xl font-semibold mb-4 lg:mb-6">Batch Schedule a Training</h2>
          <div className="mb-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setShowBatchScheduler(false);
                resetForm();
                setShowForm(true);
              }}
              className="text-xs px-3 py-1.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Switch to Single Event Form
            </button>
            <button
              type="button"
              onClick={() => setShowBatchScheduler(false)}
              className="text-xs px-3 py-1.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              View Existing Events (Edit/Delete)
            </button>
          </div>
          <form onSubmit={handleSaveBatchSchedule} className="space-y-6">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
              <h3 className="font-semibold text-slate-900">Select Training (brochure + details reused for all sessions)</h3>
              <input
                value={batchTrainingSearch}
                onChange={(e) => setBatchTrainingSearch(e.target.value)}
                placeholder="Search training title or description..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              {batchTrainingSearch ? (
                <div className="border border-gray-200 rounded-lg bg-white max-h-56 overflow-auto">
                  {filteredBatchTrainingOptions.length === 0 ? (
                    <p className="p-3 text-sm text-gray-500">No matching trainings found.</p>
                  ) : (
                    filteredBatchTrainingOptions.map((training) => (
                      <button
                        key={`batch-${training.training_table}-${training.id}`}
                        type="button"
                        className="w-full text-left px-3 py-2 hover:bg-indigo-50 border-b border-gray-100 last:border-b-0"
                        onClick={() => applyTrainingToBatch(training)}
                      >
                        <p className="font-medium text-sm text-gray-900">{training.title}</p>
                        <p className="text-xs text-gray-500">
                          {training.training_label} {training.duration ? `- ${training.duration}` : ''}
                        </p>
                      </button>
                    ))
                  )}
                </div>
              ) : null}
              {batchSelectedTraining ? (
                <div className="space-y-2 rounded-lg border border-indigo-200 bg-indigo-50 p-3">
                  <p className="text-xs text-indigo-700">Selected: {batchSelectedTraining.title}</p>
                  {batchBrochureAttachment ? (
                    <div className="text-xs text-green-700">
                      Using brochure: {batchBrochureAttachment.name}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-xs text-amber-700 font-medium">
                        This training has no brochure. Upload one before batch scheduling.
                      </p>
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => handleBatchBrochureUpload(e.target.files?.[0] || null)}
                        className="text-xs"
                        disabled={uploadingBrochure}
                      />
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">Session Schedule Plan</h3>
              </div>

              {batchSessions.map((session, index) => (
                <div key={session.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-900">Session {index + 1}</p>
                    <button
                      type="button"
                      onClick={() => removeBatchSession(session.id)}
                      className="text-xs text-red-600 hover:text-red-800 disabled:opacity-50"
                      disabled={batchSessions.length <= 1}
                    >
                      Remove
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className={cn(
                            'w-full justify-start text-left font-normal',
                            !session.dateRange?.from && 'text-gray-500'
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formatRangeLabel(session.dateRange)}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="range"
                          selected={session.dateRange}
                          onSelect={(value) => updateBatchSession(session.id, { dateRange: value })}
                          numberOfMonths={2}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-gray-200 p-3 bg-white">
                      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Start</p>
                      <div className="grid grid-cols-3 gap-2">
                        <TimePickerSelect label="Hour" value={session.startHour} options={HOURS} onChange={(value) => updateBatchSession(session.id, { startHour: value })} />
                        <TimePickerSelect label="Minute" value={session.startMinute} options={MINUTES} onChange={(value) => updateBatchSession(session.id, { startMinute: value })} />
                        <TimePickerSelect label="Period" value={session.startPeriod} options={PERIODS} onChange={(value) => updateBatchSession(session.id, { startPeriod: value as 'AM' | 'PM' })} />
                      </div>
                    </div>
                    <div className="rounded-2xl border border-gray-200 p-3 bg-white">
                      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">End</p>
                      <div className="grid grid-cols-3 gap-2">
                        <TimePickerSelect label="Hour" value={session.endHour} options={HOURS} onChange={(value) => updateBatchSession(session.id, { endHour: value })} />
                        <TimePickerSelect label="Minute" value={session.endMinute} options={MINUTES} onChange={(value) => updateBatchSession(session.id, { endMinute: value })} />
                        <TimePickerSelect label="Period" value={session.endPeriod} options={PERIODS} onChange={(value) => updateBatchSession(session.id, { endPeriod: value as 'AM' | 'PM' })} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input
                      value={session.location}
                      onChange={(e) => updateBatchSession(session.id, { location: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              ))}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={addBatchSession}
                  className="text-xs px-3 py-1.5 border border-indigo-300 rounded-lg text-indigo-700 hover:bg-indigo-50"
                >
                  Add Another Session
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowBatchScheduler(false);
                  resetBatchScheduler();
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {saving ? 'Scheduling...' : `Create ${batchSessions.length} Sessions`}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <DataTable
            data={events}
            searchable
            searchPlaceholder="Search events..."
            pageSize={25}
            columns={[
              {
                key: 'title',
                label: 'Event',
                sortable: true,
                width: '30%',
                render: (event) => (
                  <div className="space-y-1">
                    <div className="font-semibold text-gray-900">{event.title}</div>
                    {event.description ? <p className="text-sm text-gray-500 line-clamp-2">{event.description}</p> : null}
                  </div>
                ),
              },
              { key: 'duration', label: 'Duration', sortable: true, width: '10%', render: (event) => event.duration || '-' },
              { key: 'start_time', label: 'Start', sortable: true, width: '14%', render: (event) => new Date(event.start_time).toLocaleString() },
              { key: 'location', label: 'Location', sortable: true, width: '12%', render: (event) => event.location || '-' },
              {
                key: 'linked_trainings_count',
                label: 'Linked Trainings',
                sortable: true,
                width: '12%',
                render: (event) => (
                  <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700">
                    {event.linked_trainings_count || 0}
                  </span>
                ),
              },
              {
                key: 'status',
                label: 'Status',
                sortable: true,
                width: '10%',
                render: (event) => (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${event.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {event.status ? 'Active' : 'Inactive'}
                  </span>
                ),
              },
            ]}
            filters={[
              {
                key: 'status',
                label: 'Status',
                type: 'select',
                options: [
                  { value: 'true', label: 'Active' },
                  { value: 'false', label: 'Inactive' },
                ],
              },
            ]}
            actions={(event) => (
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(event)}
                  className="text-indigo-600 hover:text-indigo-800 px-2 py-1 border border-indigo-600 rounded text-xs"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(event.id || '')}
                  className="text-red-600 hover:text-red-800 px-2 py-1 border border-red-600 rounded text-xs"
                >
                  Delete
                </button>
              </div>
            )}
            onRowClick={handleEdit}
            emptyMessage="No calendar events found. Add your first event to start managing the training calendar."
          />
        </motion.div>
      )}
    </div>
  );
}
