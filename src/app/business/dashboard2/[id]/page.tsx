'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import {
  MapPin,
  Phone,
  Globe,
  Clock,
  Star,
  Tag,
  ArrowLeft
} from 'lucide-react';

import { use } from 'react';
import GlassTooltip from '@/components/GlassTooltip';
import { Skeleton } from '@/components/Skeleton';

export default function ServiceDashboardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id: serviceId } = use(params);

  const [service, setService] = useState<any>(null);
  const [analytics, setAnalytics] = useState({ views: [], clicks: [] });
  const [alerts, setAlerts] = useState<any[]>([]);
  const [completedToday, setCompletedToday] = useState<any[]>([]);
  const [revenue, setRevenue] = useState(0);
  const [completedBookings, setCompletedBookings] = useState(0);
  const [todayBookings, setTodayBookings] = useState(0);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const card =
    'bg-white border border-slate-200 rounded-xl p-5 shadow-sm';

  const isToday = (timestamp: string | number | Date) => {
    const d = new Date(timestamp);
    const t = new Date();
    return (
      d.getDate() === t.getDate() &&
      d.getMonth() === t.getMonth() &&
      d.getFullYear() === t.getFullYear()
    );
  };

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          router.push('/business/login');
          return;
        }

        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        const [
          serviceRes,
          insightsRes,
          alertsRes,
          revenueRes,
          feedbacksRes,
        ] = await Promise.all([
          axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/businesses/service/${serviceId}`,
            config
          ),
          axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/analytics/insights/service?detailId=${serviceId}`,
            config
          ),
          axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/businesses/alerts/${serviceId}`,
            config
          ),
          axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/analytics/revenue/${serviceId}`,
            config
          ),
          axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/businesses/feedbacks/${serviceId}`,
            config
          ),
        ]);

        setService(serviceRes.data);
        setAnalytics(insightsRes.data);
        setRevenue(revenueRes.data.revenue);
        setCompletedBookings(revenueRes.data.total_completed);
        setTodayBookings(revenueRes.data.today_bookings);
        setFeedbacks(feedbacksRes.data);

        const allAlerts = alertsRes.data;
        setCompletedToday(
          allAlerts.filter(
            (a: any) =>
              a.service_bookings?.status === 'completed' &&
              isToday(a.service_bookings.updated_at)
          )
        );
        setAlerts(
          allAlerts.filter(
            (a: any) => a.service_bookings?.status !== 'completed'
          )
        );
      } catch (err: any) {
        if (err.response?.status === 401) {
          localStorage.removeItem('authToken');
          router.push('/business/login');
        } else {
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [serviceId]);

  /* ---------------- UPDATE BOOKING ---------------- */
  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/status/${bookingId}`,
        { status },
        config
      );

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/businesses/alerts/${serviceId}`,
        config
      );

      const updatedAlerts = res.data;
      setCompletedToday(
        updatedAlerts.filter(
          (a: any) =>
            a.service_bookings?.status === 'completed' &&
            isToday(a.service_bookings.updated_at)
        )
      );
      setAlerts(
        updatedAlerts.filter(
          (a: any) => a.service_bookings?.status !== 'completed'
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="max-w-screen-2xl mx-auto p-6 bg-[#F8FAFC]">
        <Skeleton className="h-7 w-64 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <Skeleton className="h-56 rounded-xl" />
          <Skeleton className="h-56 rounded-xl" />
          <Skeleton className="h-56 rounded-xl" />
          <Skeleton className="h-72 col-span-2 rounded-xl" />
          <Skeleton className="h-72 rounded-xl" />
          <Skeleton className="h-64 col-span-3 rounded-xl" />
        </div>
      </div>
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="max-w-screen-2xl mx-auto p-6 bg-[#F8FAFC] min-h-screen">
<header className="mb-8">
  <button
    onClick={() => router.push('/business/dashboard')}
    className="
      inline-flex items-center gap-2
      text-sm text-slate-600
      hover:text-slate-900
      transition
      mb-3
      group
    "
  >
    <ArrowLeft
      size={18}
      strokeWidth={1.75}
      className="text-slate-400 group-hover:text-slate-700 transition"
    />
    <span>Back to Dashboard</span>
  </button>

  <h1 className="text-2xl font-semibold text-slate-900">
    {service?.name}
  </h1>

  <p className="text-sm text-slate-500">
    Service performance and activity overview
  </p>
</header>


      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* SERVICE INFO */}
        <section className={`${card} col-span-2`}>
          <h2 className="text-sm font-medium text-slate-900 mb-4">
            Service Information
          </h2>

<div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
  <InfoRow
    label="Location"
    value={service?.location}
    icon={MapPin}
  />

  <InfoRow
    label="Contact"
    value={service?.contact}
    icon={Phone}
  />

  <InfoRow
    label="Website"
    value={service?.website}
    icon={Globe}
    link
  />

  <InfoRow
    label="Timings"
    value={service?.timings}
    icon={Clock}
  />

  <InfoRow
    label="Rating"
    value={service?.rating ? `${service.rating} / 5` : 'Not rated'}
    icon={Star}
  />

  <InfoRow
    label="Tags"
    value={
      Array.isArray(service?.tags)
        ? service.tags.join(', ')
        : service?.tags
    }
    icon={Tag}
  />
</div>

        </section>

        {/* STATS */}
        <section className={card}>
          <h2 className="text-sm font-medium text-slate-900 mb-4">
            Today
          </h2>
          <Stat label="Completed" value={completedBookings} />
          <Stat label="Bookings" value={todayBookings} />
          <Stat label="Revenue" value={`₹${revenue}`} />
        </section>

        {/* ANALYTICS */}
        <section className={`${card} col-span-2`}>
          <h2 className="text-sm font-medium text-slate-900 mb-4">
            Engagement
          </h2>

          <Chart title="Views" data={analytics.views} />
          <div className="mt-6">
            <Chart title="Contact Clicks" data={analytics.clicks} />
          </div>
        </section>

        {/* ALERTS */}
        <section className={card}>
          <h2 className="text-sm font-medium text-slate-900 mb-4">
            Booking Alerts
          </h2>

          <div className="space-y-3">
            {alerts.length === 0 ? (
              <p className="text-sm text-slate-500">No alerts</p>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="border border-slate-200 rounded-lg p-3"
                >
                  <p className="text-sm text-slate-700">
                    {alert.message}
                  </p>

                  <div className="flex gap-2 mt-3">
                    {['ongoing', 'completed', 'cancelled'].map((s) => (
                      <button
                        key={s}
                        onClick={() =>
                          updateBookingStatus(alert.booking_id, s)
                        }
                        className="
                          px-2 py-1 text-xs rounded-md
                          bg-[#52C4FF] text-white
                          hover:ring-2 hover:ring-[#52C4FF]/40
                        "
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* FEEDBACK */}
        <section className={`${card} col-span-3`}>
          <h2 className="text-sm font-medium text-slate-900 mb-4">
            Feedback
          </h2>

          <div className="space-y-3">
            {feedbacks.length === 0 ? (
              <p className="text-sm text-slate-500">No feedback</p>
            ) : (
              feedbacks.map((fb) => (
                <div
                  key={fb.id}
                  className="border border-slate-200 rounded-lg p-3"
                >
                  <p className="text-sm text-slate-700">
                    “{fb.comment}”
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Rating {fb.rating} ·{' '}
                    {fb.users?.full_name || 'Anonymous'}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

/* ---------------- SMALL COMPONENTS ---------------- */

function InfoRow({
  label,
  value,
  icon: Icon,
  link,
}: {
  label: string;
  value?: string;
  icon: React.ElementType;
  link?: boolean;
}) {
  if (!value) return null;

  return (
    <div className="flex items-start gap-3">
      {/* ICON */}
      <Icon
        size={18}
        className="text-slate-400 mt-0.5"
        strokeWidth={1.75}
      />

      {/* CONTENT */}
      <div className="flex-1">
        <p className="text-xs text-slate-500">
          {label}
        </p>

        {link ? (
          <a
            href={value}
            target="_blank"
            className="
              text-sm text-[#52C4FF]
              underline-offset-2
              hover:underline
            "
          >
            {value}
          </a>
        ) : (
          <p className="text-sm text-slate-700 leading-snug">
            {value}
          </p>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: any }) {
  return (
    <div className="mb-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-sm font-medium text-slate-900">{value}</p>
    </div>
  );
}

function Chart({ title, data }: any) {
  return (
    <>
      <p className="text-xs text-slate-500 mb-2">{title}</p>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data}>
          <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" />
          <XAxis dataKey="date" stroke="#64748B" />
          <YAxis stroke="#64748B" />
          <Tooltip content={<GlassTooltip />} />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#52C4FF"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}
