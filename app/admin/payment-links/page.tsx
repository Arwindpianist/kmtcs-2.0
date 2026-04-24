'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import DataTable from '@/app/components/admin/DataTable';
import { AdminTablePageSkeleton } from '@/app/components/skeletons/PageSkeletons';
import { logger } from '@/app/lib/logger';

type TrainingTable = 'technical_trainings' | 'non_technical_trainings';
type AmountMode = 'total' | 'per_head';

interface TrainingOption {
  id: string;
  title: string;
  training_table: TrainingTable;
  training_label: string;
}

interface PaymentLinkRow {
  id: string;
  training_table: TrainingTable;
  training_id: string;
  training_title: string;
  amount_mode: AmountMode;
  amount_myr: number;
  payment_link_url: string;
  customer_name: string | null;
  company_name: string | null;
  customer_email: string | null;
  status: boolean;
  created_at: string;
}

interface PaymentLinkForm {
  training_id: string;
  training_table: TrainingTable;
  amount_mode: AmountMode;
  amount_myr: string;
  customer_name: string;
  company_name: string;
  customer_email: string;
  notes: string;
}

const initialForm: PaymentLinkForm = {
  training_id: '',
  training_table: 'technical_trainings',
  amount_mode: 'total',
  amount_myr: '',
  customer_name: '',
  company_name: '',
  customer_email: '',
  notes: '',
};

export default function AdminPaymentLinksPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [rows, setRows] = useState<PaymentLinkRow[]>([]);
  const [trainings, setTrainings] = useState<TrainingOption[]>([]);
  const [trainingSearch, setTrainingSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<PaymentLinkForm>(initialForm);

  const loadPageData = useCallback(async () => {
    try {
      const [paymentResponse, technicalResponse, nonTechnicalResponse] = await Promise.all([
        fetch('/api/admin/payment-links'),
        fetch('/api/technical-trainings?status=true'),
        fetch('/api/non-technical-trainings?status=true'),
      ]);

      if (!paymentResponse.ok || !technicalResponse.ok || !nonTechnicalResponse.ok) {
        throw new Error('Failed to load payment link data');
      }

      const paymentPayload = await paymentResponse.json();
      const technicalPayload = await technicalResponse.json();
      const nonTechnicalPayload = await nonTechnicalResponse.json();

      setRows(paymentPayload.data || []);

      const technicalTrainings: TrainingOption[] = (technicalPayload.data || []).map(
        (item: { id: string; title: string }) => ({
          id: item.id,
          title: item.title,
          training_table: 'technical_trainings',
          training_label: 'Technical Training',
        })
      );
      const nonTechnicalTrainings: TrainingOption[] = (nonTechnicalPayload.data || []).map(
        (item: { id: string; title: string }) => ({
          id: item.id,
          title: item.title,
          training_table: 'non_technical_trainings',
          training_label: 'Non-Technical Training',
        })
      );
      setTrainings([...technicalTrainings, ...nonTechnicalTrainings]);
    } catch (error) {
      logger.error('Payment links page load error:', error);
      toast.error('Unable to load payment links.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPageData();
  }, [loadPageData]);

  const filteredTrainingOptions = useMemo(() => {
    const search = trainingSearch.trim().toLowerCase();
    if (!search) return trainings.slice(0, 8);
    return trainings
      .filter(
        (training) =>
          training.title.toLowerCase().includes(search) ||
          training.training_label.toLowerCase().includes(search)
      )
      .slice(0, 8);
  }, [trainingSearch, trainings]);

  const selectedTraining = useMemo(
    () =>
      trainings.find(
        (item) => item.id === form.training_id && item.training_table === form.training_table
      ) || null,
    [form.training_id, form.training_table, trainings]
  );

  const handleChooseTraining = (training: TrainingOption) => {
    setForm((prev) => ({
      ...prev,
      training_id: training.id,
      training_table: training.training_table,
    }));
    setTrainingSearch(`${training.title} (${training.training_label})`);
  };

  const handleCreateLink = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);

    try {
      if (!form.training_id) {
        toast.error('Select a training first.');
        return;
      }
      if (!form.amount_myr || Number.parseFloat(form.amount_myr) <= 0) {
        toast.error('Enter a valid payment amount.');
        return;
      }
      if (!form.customer_name.trim() && !form.company_name.trim()) {
        toast.error('Enter customer name or company name.');
        return;
      }

      const response = await fetch('/api/admin/payment-links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          amount_myr: Number.parseFloat(form.amount_myr),
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || 'Failed to create payment link');
      }

      setRows((prev) => [payload.data, ...prev]);
      setForm(initialForm);
      setTrainingSearch('');
      setShowForm(false);
      toast.success('Payment link created successfully.');
    } catch (error) {
      logger.error('Create payment link error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create payment link.');
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (row: PaymentLinkRow) => {
    try {
      const response = await fetch('/api/admin/payment-links', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: row.id, status: !row.status }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Status update failed');

      setRows((prev) => prev.map((item) => (item.id === row.id ? payload.data : item)));
      toast.success(`Payment link marked as ${payload.data.status ? 'active' : 'inactive'}.`);
    } catch (error) {
      logger.error('Toggle payment link status error:', error);
      toast.error('Failed to update payment link status.');
    }
  };

  const copyLink = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Payment link copied.');
    } catch {
      toast.error('Unable to copy link.');
    }
  };

  if (loading) return <AdminTablePageSkeleton />;

  return (
    <div className="mx-auto max-w-7xl p-4 lg:p-8">
      <div className="mb-6 lg:mb-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Payment Link Management</h1>
              <p className="text-gray-600 mt-1">
                Create Stripe payment links per training with total or per-head pricing.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowForm((prev) => !prev)}
              className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
            >
              {showForm ? 'Close Form' : 'Create Payment Link'}
            </button>
          </div>
        </motion.div>
      </div>

      {showForm ? (
        <div className="mb-6 lg:mb-8 rounded-xl border border-gray-200 bg-white p-4 lg:p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">New Payment Link</h2>
          <form onSubmit={handleCreateLink} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Training Lookup *</label>
              <input
                value={trainingSearch}
                onChange={(e) => setTrainingSearch(e.target.value)}
                placeholder="Search training title..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              />
              {trainingSearch.trim() ? (
                <div className="max-h-56 overflow-auto rounded-lg border border-gray-200">
                  {filteredTrainingOptions.length === 0 ? (
                    <p className="p-3 text-sm text-gray-500">No matching trainings found.</p>
                  ) : (
                    filteredTrainingOptions.map((training) => (
                      <button
                        key={`${training.training_table}-${training.id}`}
                        type="button"
                        onClick={() => handleChooseTraining(training)}
                        className="block w-full border-b border-gray-100 px-3 py-2 text-left hover:bg-indigo-50 last:border-b-0"
                      >
                        <p className="text-sm font-medium text-gray-900">{training.title}</p>
                        <p className="text-xs text-gray-500">{training.training_label}</p>
                      </button>
                    ))
                  )}
                </div>
              ) : null}
              {selectedTraining ? (
                <p className="text-xs text-indigo-700">
                  Selected: {selectedTraining.title} ({selectedTraining.training_label})
                </p>
              ) : null}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount Mode *</label>
                <select
                  value={form.amount_mode}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, amount_mode: e.target.value as AmountMode }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                >
                  <option value="total">Total Amount</option>
                  <option value="per_head">Amount Per Head</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount (MYR) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={form.amount_myr}
                  onChange={(e) => setForm((prev) => ({ ...prev, amount_myr: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  placeholder="e.g. 1200.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
                <input
                  value={form.customer_name}
                  onChange={(e) => setForm((prev) => ({ ...prev, customer_name: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                <input
                  value={form.company_name}
                  onChange={(e) => setForm((prev) => ({ ...prev, company_name: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Customer Email</label>
                <input
                  type="email"
                  value={form.customer_email}
                  onChange={(e) => setForm((prev) => ({ ...prev, customer_email: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Internal Notes</label>
                <input
                  value={form.notes}
                  onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
              >
                {saving ? 'Creating Link...' : 'Create Stripe Payment Link'}
              </button>
            </div>
          </form>
        </div>
      ) : null}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <DataTable
          data={rows}
          searchable
          searchPlaceholder="Search by training, customer, or company..."
          pageSize={20}
          columns={[
            {
              key: 'training_title',
              label: 'Training',
              sortable: true,
              width: '24%',
              render: (item) => (
                <div>
                  <p className="font-medium text-gray-900">{item.training_title}</p>
                  <p className="text-xs text-gray-500">
                    {item.training_table === 'technical_trainings' ? 'Technical' : 'Non-Technical'}
                  </p>
                </div>
              ),
            },
            {
              key: 'amount_myr',
              label: 'Amount',
              sortable: true,
              width: '14%',
              render: (item) => (
                <div>
                  <p className="font-medium text-gray-900">RM {Number(item.amount_myr || 0).toFixed(2)}</p>
                  <p className="text-xs text-gray-500">
                    {item.amount_mode === 'per_head' ? 'Per Head' : 'Total'}
                  </p>
                </div>
              ),
            },
            {
              key: 'company_name',
              label: 'Customer / Company',
              sortable: true,
              width: '18%',
              render: (item) => (
                <div>
                  <p className="text-sm text-gray-900">{item.customer_name || '-'}</p>
                  <p className="text-xs text-gray-500">{item.company_name || '-'}</p>
                </div>
              ),
            },
            {
              key: 'payment_link_url',
              label: 'Payment Link',
              sortable: false,
              width: '22%',
              render: (item) => (
                <button
                  type="button"
                  onClick={() => copyLink(item.payment_link_url)}
                  className="max-w-full truncate rounded border border-indigo-300 px-2 py-1 text-xs text-indigo-700 hover:bg-indigo-50"
                >
                  Copy Link
                </button>
              ),
            },
            {
              key: 'status',
              label: 'Status',
              sortable: true,
              width: '10%',
              render: (item) => (
                <span
                  className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                    item.status ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {item.status ? 'Active' : 'Inactive'}
                </span>
              ),
            },
            {
              key: 'created_at',
              label: 'Created',
              sortable: true,
              width: '12%',
              render: (item) => new Date(item.created_at).toLocaleDateString(),
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
          actions={(item) => (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => window.open(item.payment_link_url, '_blank', 'noopener,noreferrer')}
                className="rounded border border-indigo-600 px-2 py-1 text-xs text-indigo-600 hover:text-indigo-800"
              >
                Open
              </button>
              <button
                type="button"
                onClick={() => toggleStatus(item)}
                className="rounded border border-gray-400 px-2 py-1 text-xs text-gray-700 hover:bg-gray-50"
              >
                {item.status ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          )}
          emptyMessage="No payment links found yet. Create your first Stripe payment link."
        />
      </motion.div>
    </div>
  );
}
