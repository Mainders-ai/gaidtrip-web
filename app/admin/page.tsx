"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";

// ─── Types ──────────────────────────────────────

interface Stats {
  overview: {
    totalUsers: number;
    usersWithLearning: number;
    totalItineraries: number;
    totalItinerariesGenerated: number;
    totalPlans: number;
    totalMatches: number;
    onlineNow: number;
    activeLastWeek: number;
    activeLastMonth: number;
    newUsersThisMonth: number;
  };
  registrations: Record<string, number>;
  itinerariesByMonth: Record<string, number>;
  subscriptions: Record<string, number>;
  demographics: {
    gender: Record<string, number>;
    ageRange: Record<string, number>;
    topCountries: Array<[string, number]>;
    topInterests: Array<[string, number]>;
  };
  itineraryStats: {
    topDestinations: Array<[string, number]>;
    avgBudget: number;
    avgDays: number;
  };
  planStats: {
    topCities: Array<[string, number]>;
  };
  preferences: {
    travelStyle: Record<string, number>;
    pace: Record<string, number>;
  };
  activities: {
    topCompleted: Array<[string, number]>;
    topRemoved: Array<[string, number]>;
  };
}

interface UserLearning {
  userId: string;
  name: string;
  email: string;
  photoUrl: string;
  gender: string;
  age: number | null;
  ageRange: string;
  synthesized: Record<string, unknown> | null;
  activityStats: Record<string, Record<string, number>> | null;
  tripHistory: Record<string, unknown> | null;
  visitedPlaces: Record<string, Array<{ name: string }>> | null;
  lastUpdated: string | null;
}

interface UserDetail {
  userId: string;
  user: {
    name: string;
    email: string;
    photoUrl: string;
    gender: string;
    birthDate: string | null;
  } | null;
  profile: Record<string, unknown> | null;
  events: Array<{
    type: string;
    timestamp: { _seconds: number };
    data: Record<string, unknown>;
  }>;
}

type Tab = "overview" | "users";

// ─── Main Dashboard ─────────────────────────────

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("overview");
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<UserLearning[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const [statsRes, usersRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/learning"),
      ]);
      if (statsRes.ok) setStats(await statsRes.json());
      if (usersRes.ok) {
        const data = await usersRes.json();
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchUserDetail(userId: string) {
    setSelectedUser(userId);
    try {
      const res = await fetch(`/api/admin/learning?userId=${userId}`);
      if (res.ok) setUserDetail(await res.json());
    } catch (err) {
      console.error("Error:", err);
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
            Cargando dashboard...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
              Gaid Admin
            </h1>
            <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
              Panel de control
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {stats && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 rounded-lg mr-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-medium text-green-600 dark:text-green-400">
                {stats.overview.onlineNow} en línea
              </span>
            </div>
          )}
          <button
            onClick={fetchData}
            className="p-2 rounded-lg bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-text-primary-light dark:text-text-primary-dark"
            title="Actualizar"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            title="Cerrar sesión"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-surface-light dark:bg-surface-dark rounded-xl p-1 w-fit border border-gray-100 dark:border-gray-800">
        {([
          { key: "overview" as Tab, label: "Estadísticas", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
          { key: "users" as Tab, label: "Usuarios", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
        ]).map((t) => (
          <button
            key={t.key}
            onClick={() => { setTab(t.key); setSelectedUser(null); setUserDetail(null); }}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              tab === t.key
                ? "bg-primary text-white shadow-sm"
                : "text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark"
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={t.icon} />
            </svg>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && stats && <OverviewTab stats={stats} />}
      {tab === "users" && (
        <UsersTab
          users={users}
          selectedUser={selectedUser}
          userDetail={userDetail}
          onSelectUser={fetchUserDetail}
          onBack={() => { setSelectedUser(null); setUserDetail(null); }}
        />
      )}
    </div>
  );
}

// ─── Overview Tab ───────────────────────────────

function OverviewTab({ stats }: { stats: Stats }) {
  const o = stats.overview;

  return (
    <div className="space-y-5">
      {/* Hero Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <HeroCard
          label="Usuarios"
          value={o.totalUsers}
          sub={`+${o.newUsersThisMonth} este mes`}
          icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
          gradient="from-primary to-[#2AA3B0]"
        />
        <HeroCard
          label="Itinerarios"
          value={o.totalItineraries}
          sub={`${o.totalItinerariesGenerated} generados`}
          icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          gradient="from-blue-500 to-blue-600"
        />
        <HeroCard
          label="Planes sociales"
          value={o.totalPlans}
          sub="planes creados"
          icon="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          gradient="from-purple-500 to-purple-600"
        />
        <HeroCard
          label="Matches"
          value={o.totalMatches}
          sub={`${o.activeLastMonth} activos (30d)`}
          icon="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          gradient="from-pink-500 to-rose-500"
        />
      </div>

      {/* Activity bar */}
      <div className="flex flex-wrap gap-3">
        <MiniStat label="En línea ahora" value={o.onlineNow} color="bg-green-500" />
        <MiniStat label="Activos (7d)" value={o.activeLastWeek} color="bg-blue-500" />
        <MiniStat label="Activos (30d)" value={o.activeLastMonth} color="bg-purple-500" />
        <MiniStat label="Con aprendizaje IA" value={o.usersWithLearning} color="bg-primary" />
      </div>

      {/* Charts Row 1: Registrations + Subscriptions */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <BarChartCard
            title="Registros de usuarios"
            data={stats.registrations}
            color="bg-primary"
          />
        </div>
        <DonutCard
          title="Suscripciones"
          data={stats.subscriptions}
          labels={{ free: "Gratis", payPerTrip: "Por viaje", premium: "Premium" }}
          colors={["#6B7280", "#037E8C", "#F59E0B"]}
        />
      </div>

      {/* Charts Row 2: Demographics */}
      <div className="grid md:grid-cols-2 gap-4">
        <DonutCard
          title="Género"
          data={stats.demographics.gender}
          labels={{ male: "Masculino", female: "Femenino", other: "Otro", no_especificado: "No especificado" }}
          colors={["#3B82F6", "#EC4899", "#8B5CF6", "#6B7280"]}
        />
        <HorizontalBarsCard
          title="Rango de edad"
          items={Object.entries(stats.demographics.ageRange).sort(([a], [b]) => a.localeCompare(b))}
          color="bg-primary"
        />
      </div>

      {/* Charts Row 3: Itineraries + Destinations */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <BarChartCard
            title="Itinerarios por mes"
            data={stats.itinerariesByMonth}
            color="bg-blue-500"
          />
        </div>
        <Card title="Datos de itinerarios">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">${stats.itineraryStats.avgBudget.toLocaleString()}</p>
              <p className="text-[11px] text-text-secondary-light dark:text-text-secondary-dark mt-0.5">Presupuesto prom.</p>
            </div>
            <div className="text-center p-3 bg-primary/10 rounded-xl">
              <p className="text-2xl font-bold text-primary">{stats.itineraryStats.avgDays}</p>
              <p className="text-[11px] text-text-secondary-light dark:text-text-secondary-dark mt-0.5">Días promedio</p>
            </div>
          </div>
          {stats.itineraryStats.topDestinations.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider mb-2">Top destinos</p>
              <div className="space-y-1.5">
                {stats.itineraryStats.topDestinations.slice(0, 5).map(([dest, count], i) => (
                  <div key={dest} className="flex items-center gap-2 text-sm">
                    <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">{i + 1}</span>
                    <span className="flex-1 truncate text-text-primary-light dark:text-text-primary-dark">{dest}</span>
                    <span className="text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Charts Row 4: Interests + Countries */}
      <div className="grid md:grid-cols-2 gap-4">
        <TagCloudCard
          title="Intereses populares"
          items={stats.demographics.topInterests}
        />
        <HorizontalBarsCard
          title="Países de los usuarios"
          items={stats.demographics.topCountries}
          color="bg-primary"
        />
      </div>

      {/* Charts Row 5: Learning / Activities */}
      <div className="grid md:grid-cols-2 gap-4">
        <HorizontalBarsCard
          title="Top actividades completadas"
          items={stats.activities.topCompleted}
          color="bg-green-500"
          emptyText="Sin datos de aprendizaje aún"
        />
        <HorizontalBarsCard
          title="Más removidas por usuarios"
          items={stats.activities.topRemoved}
          color="bg-red-500"
          emptyText="Sin datos de aprendizaje aún"
        />
      </div>

      {/* Row 6: Travel preferences */}
      <div className="grid md:grid-cols-2 gap-4">
        <DonutCard
          title="Estilo de viaje (aprendido)"
          data={stats.preferences.travelStyle}
          colors={["#037E8C", "#F59E0B", "#8B5CF6", "#EC4899", "#10B981", "#3B82F6"]}
        />
        <DonutCard
          title="Ritmo de viaje (aprendido)"
          data={stats.preferences.pace}
          colors={["#10B981", "#F59E0B", "#EF4444", "#6B7280"]}
        />
      </div>
    </div>
  );
}

// ─── Components ─────────────────────────────────

function HeroCard({ label, value, sub, icon, gradient }: {
  label: string; value: number; sub: string; icon: string; gradient: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl p-4 bg-surface-light dark:bg-surface-dark border border-gray-100 dark:border-gray-800">
      <div className={`absolute -top-4 -right-4 w-16 h-16 rounded-full bg-gradient-to-br ${gradient} opacity-10`} />
      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-3`}>
        <svg className="w-4.5 h-4.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
        </svg>
      </div>
      <p className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">{value.toLocaleString()}</p>
      <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-0.5">{label}</p>
      <p className="text-[11px] text-text-secondary-light dark:text-text-secondary-dark mt-1 opacity-70">{sub}</p>
    </div>
  );
}

function MiniStat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-surface-light dark:bg-surface-dark rounded-lg border border-gray-100 dark:border-gray-800">
      <div className={`w-2 h-2 rounded-full ${color}`} />
      <span className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">{value}</span>
      <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark">{label}</span>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
      <h3 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">{title}</h3>
      {children}
    </div>
  );
}

function BarChartCard({ title, data, color }: {
  title: string; data: Record<string, number>; color: string;
}) {
  const entries = Object.entries(data);
  const max = Math.max(...entries.map(([, v]) => v), 1);
  const total = entries.reduce((s, [, v]) => s + v, 0);

  // Show last 12 months
  const last12 = entries.slice(-12);
  const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">{title}</h3>
        <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark">Total: {total}</span>
      </div>
      {last12.length === 0 ? (
        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark py-8 text-center">Sin datos</p>
      ) : (
        <div className="flex items-end gap-1.5 h-36">
          {last12.map(([month, value]) => {
            const [, m] = month.split("-");
            const monthLabel = monthNames[parseInt(m) - 1] || m;
            const height = Math.max((value / max) * 100, 4);
            return (
              <div key={month} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] font-medium text-text-primary-light dark:text-text-primary-dark">
                  {value > 0 ? value : ""}
                </span>
                <div
                  className={`w-full rounded-t-md ${color} transition-all hover:opacity-80`}
                  style={{ height: `${height}%` }}
                  title={`${month}: ${value}`}
                />
                <span className="text-[9px] text-text-secondary-light dark:text-text-secondary-dark">
                  {monthLabel}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function DonutCard({ title, data, colors, labels }: {
  title: string;
  data: Record<string, number>;
  colors: string[];
  labels?: Record<string, string>;
}) {
  const entries = Object.entries(data).filter(([, v]) => v > 0);
  const total = entries.reduce((s, [, v]) => s + v, 0);

  const segments = useMemo(() => {
    if (total === 0) return "";
    let acc = 0;
    const parts = entries.map(([, value], i) => {
      const start = acc;
      const deg = (value / total) * 360;
      acc += deg;
      return `${colors[i % colors.length]} ${start}deg ${start + deg}deg`;
    });
    return `conic-gradient(${parts.join(", ")})`;
  }, [entries, total, colors]);

  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
      <h3 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">{title}</h3>
      {entries.length === 0 ? (
        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark py-8 text-center">Sin datos</p>
      ) : (
        <div className="flex items-center gap-6">
          {/* Donut */}
          <div className="relative w-28 h-28 flex-shrink-0">
            <div
              className="w-full h-full rounded-full"
              style={{ background: segments }}
            />
            <div className="absolute inset-3 rounded-full bg-surface-light dark:bg-surface-dark flex items-center justify-center">
              <span className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">{total}</span>
            </div>
          </div>
          {/* Legend */}
          <div className="flex-1 space-y-1.5">
            {entries.map(([key, value], i) => (
              <div key={key} className="flex items-center gap-2 text-sm">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: colors[i % colors.length] }} />
                <span className="flex-1 text-text-primary-light dark:text-text-primary-dark capitalize truncate">
                  {labels?.[key] || formatLabel(key)}
                </span>
                <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark font-medium">
                  {value} <span className="opacity-60">({Math.round((value / total) * 100)}%)</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function HorizontalBarsCard({ title, items, color, emptyText }: {
  title: string; items: Array<[string, number]>; color: string; emptyText?: string;
}) {
  const maxVal = items[0]?.[1] || 1;

  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
      <h3 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">{title}</h3>
      {items.length === 0 ? (
        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark py-8 text-center">{emptyText || "Sin datos"}</p>
      ) : (
        <div className="space-y-2.5">
          {items.map(([label, count]) => (
            <div key={label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-text-primary-light dark:text-text-primary-dark capitalize truncate">
                  {formatLabel(label)}
                </span>
                <span className="text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark ml-2">
                  {count}
                </span>
              </div>
              <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${color} transition-all`}
                  style={{ width: `${(count / maxVal) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TagCloudCard({ title, items }: {
  title: string; items: Array<[string, number]>;
}) {
  const max = items[0]?.[1] || 1;

  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
      <h3 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">{title}</h3>
      {items.length === 0 ? (
        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark py-8 text-center">Sin datos</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {items.map(([label, count]) => {
            const intensity = Math.max(0.15, count / max);
            return (
              <span
                key={label}
                className="px-3 py-1.5 rounded-full text-sm font-medium capitalize"
                style={{
                  backgroundColor: `rgba(3, 126, 140, ${intensity * 0.2})`,
                  color: `rgba(3, 126, 140, ${0.5 + intensity * 0.5})`,
                  fontSize: `${12 + intensity * 4}px`,
                }}
              >
                {formatLabel(label)} <span className="opacity-60 text-[10px]">{count}</span>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Users Tab ──────────────────────────────────

function UsersTab({ users, selectedUser, userDetail, onSelectUser, onBack }: {
  users: UserLearning[];
  selectedUser: string | null;
  userDetail: UserDetail | null;
  onSelectUser: (id: string) => void;
  onBack: () => void;
}) {
  if (selectedUser && userDetail) {
    return <UserDetailView detail={userDetail} onBack={onBack} />;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
          {users.length} usuario{users.length !== 1 ? "s" : ""} con perfil de aprendizaje
        </p>
      </div>
      <div className="grid gap-3">
        {users.map((user) => (
          <button
            key={user.userId}
            onClick={() => onSelectUser(user.userId)}
            className="w-full text-left bg-surface-light dark:bg-surface-dark rounded-2xl p-4 border border-gray-100 dark:border-gray-800 hover:border-primary/40 hover:shadow-sm transition-all"
          >
            <div className="flex items-center gap-3">
              {user.photoUrl ? (
                <img src={user.photoUrl} alt="" className="w-11 h-11 rounded-xl object-cover" />
              ) : (
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-text-primary-light dark:text-text-primary-dark">
                    {user.name}
                  </p>
                  {user.gender && (
                    <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-md text-text-secondary-light dark:text-text-secondary-dark capitalize">
                      {user.gender}
                    </span>
                  )}
                  {user.ageRange && (
                    <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-md text-text-secondary-light dark:text-text-secondary-dark">
                      {user.ageRange}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1">
                  {user.synthesized?.travelStyle ? (
                    <span className="text-xs text-primary font-medium capitalize">
                      {user.synthesized.travelStyle as string}
                    </span>
                  ) : null}
                  {user.tripHistory?.totalTrips != null && (
                    <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                      {user.tripHistory.totalTrips as number} viajes
                    </span>
                  )}
                  {user.lastUpdated && (
                    <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark opacity-60">
                      {new Date(user.lastUpdated).toLocaleDateString("es")}
                    </span>
                  )}
                </div>
              </div>
              <svg className="w-5 h-5 text-text-secondary-light dark:text-text-secondary-dark opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        ))}
      </div>
      {users.length === 0 && (
        <div className="text-center py-16">
          <svg className="w-12 h-12 mx-auto text-text-secondary-light dark:text-text-secondary-dark opacity-30 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">No hay usuarios con perfil de aprendizaje aún</p>
        </div>
      )}
    </div>
  );
}

// ─── User Detail ────────────────────────────────

function UserDetailView({ detail, onBack }: { detail: UserDetail; onBack: () => void }) {
  const profile = detail.profile || {};
  const synthesized = (profile.synthesized || {}) as Record<string, unknown>;
  const activityStats = (profile.activityStats || {}) as Record<string, Record<string, number>>;
  const tripHistory = (profile.tripHistory || {}) as Record<string, unknown>;
  const visitedPlaces = (profile.visitedPlaces || {}) as Record<string, Array<{ name: string }>>;
  const events = detail.events || [];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3 bg-surface-light dark:bg-surface-dark rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
        <button
          onClick={onBack}
          className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-text-primary-light dark:text-text-primary-dark"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        {detail.user?.photoUrl ? (
          <img src={detail.user.photoUrl} alt="" className="w-12 h-12 rounded-xl object-cover" />
        ) : (
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold text-lg">
            {(detail.user?.name || "?").charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <h2 className="font-bold text-lg text-text-primary-light dark:text-text-primary-dark">
            {detail.user?.name || detail.userId}
          </h2>
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
            {detail.user?.email}
            {detail.user?.gender && ` · ${detail.user.gender}`}
          </p>
        </div>
      </div>

      {/* Synthesized profile */}
      {Object.keys(synthesized).length > 0 && (
        <div className="bg-surface-light dark:bg-surface-dark rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
          <h3 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">Perfil aprendido por IA</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {synthesized.travelStyle ? <ProfileField label="Estilo" value={synthesized.travelStyle as string} /> : null}
            {synthesized.pace ? <ProfileField label="Ritmo" value={synthesized.pace as string} /> : null}
            {synthesized.schedule ? <ProfileField label="Horario" value={synthesized.schedule as string} /> : null}
            {synthesized.budgetRange ? <ProfileField label="Presupuesto" value={synthesized.budgetRange as string} /> : null}
            {synthesized.nightlifePreference ? <ProfileField label="Vida nocturna" value={synthesized.nightlifePreference as string} /> : null}
            {synthesized.groupSize ? <ProfileField label="Grupo" value={synthesized.groupSize as string} /> : null}
          </div>

          {(synthesized.topActivityTypes as string[])?.length > 0 && (
            <div className="mt-4">
              <p className="text-[11px] font-semibold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider mb-2">Actividades favoritas</p>
              <div className="flex flex-wrap gap-1.5">
                {(synthesized.topActivityTypes as string[]).map((t) => (
                  <span key={t} className="px-2.5 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg capitalize font-medium">{t}</span>
                ))}
              </div>
            </div>
          )}

          {(synthesized.avoidedActivityTypes as string[])?.length > 0 && (
            <div className="mt-3">
              <p className="text-[11px] font-semibold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider mb-2">Evita</p>
              <div className="flex flex-wrap gap-1.5">
                {(synthesized.avoidedActivityTypes as string[]).map((t) => (
                  <span key={t} className="px-2.5 py-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg capitalize font-medium">{t}</span>
                ))}
              </div>
            </div>
          )}

          {(synthesized.commonChanges as string[])?.length > 0 && (
            <div className="mt-4 p-3 bg-primary/5 rounded-xl">
              <p className="text-[11px] font-semibold text-primary uppercase tracking-wider mb-2">Patrones observados</p>
              {(synthesized.commonChanges as string[]).map((c, i) => (
                <p key={i} className="text-sm text-text-primary-light dark:text-text-primary-dark py-0.5">· {c}</p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Activity Stats + Trip History */}
      <div className="grid md:grid-cols-2 gap-4">
        {Object.keys(activityStats).length > 0 && (
          <div className="bg-surface-light dark:bg-surface-dark rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
            <h3 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">Estadísticas de actividades</h3>
            <div className="space-y-4">
              {Object.entries(activityStats).map(([action, types]) => {
                const sorted = Object.entries(types).sort((a, b) => b[1] - a[1]).slice(0, 6);
                if (sorted.length === 0) return null;
                return (
                  <div key={action}>
                    <p className="text-[11px] font-semibold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider mb-1.5">{formatLabel(action)}</p>
                    {sorted.map(([type, count]) => (
                      <div key={type} className="flex justify-between text-sm py-0.5">
                        <span className="text-text-primary-light dark:text-text-primary-dark capitalize">{type}</span>
                        <span className="text-text-secondary-light dark:text-text-secondary-dark font-medium">{count}</span>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="space-y-4">
          {Object.keys(tripHistory).length > 0 && (
            <div className="bg-surface-light dark:bg-surface-dark rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
              <h3 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">Historial de viajes</h3>
              <div className="grid grid-cols-2 gap-3 mb-3">
                {tripHistory.totalTrips != null && (
                  <div className="text-center p-2.5 bg-primary/10 rounded-xl">
                    <p className="text-xl font-bold text-primary">{tripHistory.totalTrips as number}</p>
                    <p className="text-[10px] text-text-secondary-light dark:text-text-secondary-dark">Viajes</p>
                  </div>
                )}
                {tripHistory.avgTripLength != null && (
                  <div className="text-center p-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{tripHistory.avgTripLength as number}</p>
                    <p className="text-[10px] text-text-secondary-light dark:text-text-secondary-dark">Días prom.</p>
                  </div>
                )}
              </div>
              {(tripHistory.destinations as string[])?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {(tripHistory.destinations as string[]).map((d) => (
                    <span key={d} className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-lg">{d}</span>
                  ))}
                </div>
              )}
            </div>
          )}

          {Object.keys(visitedPlaces).length > 0 && (
            <div className="bg-surface-light dark:bg-surface-dark rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
              <h3 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">Lugares visitados</h3>
              <div className="space-y-3">
                {Object.entries(visitedPlaces).map(([dest, places]) => (
                  <div key={dest}>
                    <p className="text-xs font-semibold text-primary mb-1">{dest}</p>
                    <div className="flex flex-wrap gap-1">
                      {places.map((p, i) => (
                        <span key={i} className="px-2 py-0.5 text-[11px] bg-gray-100 dark:bg-gray-800 rounded text-text-primary-light dark:text-text-primary-dark">{p.name}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Events */}
      {events.length > 0 && (
        <div className="bg-surface-light dark:bg-surface-dark rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
          <h3 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
            Eventos recientes ({events.length})
          </h3>
          <div className="space-y-1.5 max-h-80 overflow-y-auto">
            {events
              .sort((a, b) => (b.timestamp?._seconds || 0) - (a.timestamp?._seconds || 0))
              .slice(0, 30)
              .map((event, i) => (
                <div key={i} className="flex items-start gap-2.5 py-2 border-b border-gray-50 dark:border-gray-800 last:border-0">
                  <EventBadge type={event.type} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text-primary-light dark:text-text-primary-dark">{eventDescription(event)}</p>
                    <p className="text-[10px] text-text-secondary-light dark:text-text-secondary-dark mt-0.5">
                      {event.timestamp?._seconds ? new Date(event.timestamp._seconds * 1000).toLocaleString("es") : ""}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Helpers ────────────────────────────────────

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
      <p className="text-[10px] font-semibold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider">{label}</p>
      <p className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark capitalize mt-0.5">{value}</p>
    </div>
  );
}

function EventBadge({ type }: { type: string }) {
  const cfg: Record<string, { color: string; label: string }> = {
    chat_modification: { color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", label: "Chat" },
    live_trip_day: { color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", label: "Live" },
    itinerary_created: { color: "bg-primary/10 text-primary", label: "Itinerario" },
    plan_created: { color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400", label: "Plan" },
  };
  const c = cfg[type] || { color: "bg-gray-100 text-gray-600", label: type };
  return <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium whitespace-nowrap ${c.color}`}>{c.label}</span>;
}

function eventDescription(event: { type: string; data: Record<string, unknown> }): string {
  const d = event.data || {};
  switch (event.type) {
    case "chat_modification":
      return `${d.actionType || "modificación"} en ${d.destination || "destino"} — "${(d.request as string)?.slice(0, 60) || ""}"`;
    case "live_trip_day":
      return `Día ${((d.dayIndex as number) || 0) + 1} en ${d.destination || "destino"} — ${d.completedCount || 0}/${d.totalActivities || 0} completadas`;
    case "itinerary_created":
      return `Nuevo itinerario: ${d.destination || ""} (${d.days || 0} días, ${d.budget || ""})`;
    case "plan_created":
      return `Nuevo plan: ${d.city || ""} — ${(d.description as string)?.slice(0, 60) || ""}`;
    default:
      return JSON.stringify(d).slice(0, 80);
  }
}

function formatLabel(key: string): string {
  return key.replace(/_/g, " ").replace(/([A-Z])/g, " $1").trim();
}
