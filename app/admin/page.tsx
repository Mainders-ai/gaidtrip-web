"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface UserLearning {
  userId: string;
  name: string;
  email: string;
  photoUrl: string;
  gender: string;
  age: number | null;
  ageRange: string;
  synthesized: {
    travelStyle?: string;
    pace?: string;
    schedule?: string;
    budgetRange?: string;
    nightlifePreference?: string;
    groupSize?: string;
    commonChanges?: string[];
    favoriteDestinations?: string[];
    topActivityTypes?: string[];
    avoidedActivityTypes?: string[];
  } | null;
  activityStats: Record<string, Record<string, number>> | null;
  tripHistory: {
    totalTrips?: number;
    avgTripLength?: number;
    destinations?: string[];
  } | null;
  visitedPlaces: Record<string, Array<{ name: string; lat?: number; lng?: number }>> | null;
  lastUpdated: string | null;
}

interface Stats {
  overview: {
    totalUsers: number;
    usersWithLearning: number;
    totalTrips: number;
    avgTripLength: number;
  };
  demographics: {
    gender: Record<string, number>;
    ageRange: Record<string, number>;
  };
  preferences: {
    travelStyle: Record<string, number>;
    pace: Record<string, number>;
  };
  activities: {
    topCompleted: Array<[string, number]>;
    topRemoved: Array<[string, number]>;
  };
  destinations: {
    top: Array<[string, number]>;
  };
}

type Tab = "overview" | "users";

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("overview");
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<UserLearning[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [userDetail, setUserDetail] = useState<{
    userId: string;
    user: { name: string; email: string; photoUrl: string; gender: string; birthDate: string | null } | null;
    profile: Record<string, unknown> | null;
    events: Array<{ type: string; timestamp: { _seconds: number }; data: Record<string, unknown> }>;
  } | null>(null);
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
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchUserDetail(userId: string) {
    setSelectedUser(userId);
    try {
      const res = await fetch(`/api/admin/learning?userId=${userId}`);
      if (res.ok) {
        setUserDetail(await res.json());
      }
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-text-secondary-light dark:text-text-secondary-dark">
          Cargando datos...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
            Gaid Admin
          </h1>
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
            Dashboard de aprendizaje de usuarios
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="px-3 py-1.5 text-sm bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-text-primary-light dark:text-text-primary-dark"
          >
            Actualizar
          </button>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 text-sm text-red-500 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-surface-light dark:bg-surface-dark rounded-xl p-1 w-fit">
        {(["overview", "users"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => {
              setTab(t);
              setSelectedUser(null);
              setUserDetail(null);
            }}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              tab === t
                ? "bg-primary text-white"
                : "text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark"
            }`}
          >
            {t === "overview" ? "Estadísticas" : "Usuarios"}
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === "overview" && stats && <OverviewTab stats={stats} />}
      {tab === "users" && (
        <UsersTab
          users={users}
          selectedUser={selectedUser}
          userDetail={userDetail}
          onSelectUser={fetchUserDetail}
          onBack={() => {
            setSelectedUser(null);
            setUserDetail(null);
          }}
        />
      )}
    </div>
  );
}

// ─── Overview Tab ────────────────────────────────────

function OverviewTab({ stats }: { stats: Stats }) {
  return (
    <div className="space-y-6">
      {/* Cards resumen */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Usuarios total" value={stats.overview.totalUsers} />
        <StatCard label="Con aprendizaje" value={stats.overview.usersWithLearning} />
        <StatCard label="Viajes totales" value={stats.overview.totalTrips} />
        <StatCard
          label="Días promedio"
          value={stats.overview.avgTripLength}
        />
      </div>

      {/* Demografía */}
      <div className="grid md:grid-cols-2 gap-4">
        <ChartCard title="Género" data={stats.demographics.gender} />
        <ChartCard title="Rango de edad" data={stats.demographics.ageRange} />
      </div>

      {/* Preferencias */}
      <div className="grid md:grid-cols-2 gap-4">
        <ChartCard title="Estilo de viaje" data={stats.preferences.travelStyle} />
        <ChartCard title="Ritmo" data={stats.preferences.pace} />
      </div>

      {/* Actividades y destinos */}
      <div className="grid md:grid-cols-2 gap-4">
        <ListCard
          title="Top actividades completadas"
          items={stats.activities.topCompleted}
          color="text-green-600"
        />
        <ListCard
          title="Más removidas por usuarios"
          items={stats.activities.topRemoved}
          color="text-red-500"
        />
      </div>

      <ListCard
        title="Destinos más visitados"
        items={stats.destinations.top}
        color="text-primary"
      />
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-4 border border-gray-100 dark:border-gray-800">
      <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
        {label}
      </p>
      <p className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mt-1">
        {value}
      </p>
    </div>
  );
}

function ChartCard({
  title,
  data,
}: {
  title: string;
  data: Record<string, number>;
}) {
  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);
  const total = entries.reduce((sum, [, v]) => sum + v, 0);

  if (entries.length === 0) {
    return (
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-5 border border-gray-100 dark:border-gray-800">
        <h3 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
          {title}
        </h3>
        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
          Sin datos
        </p>
      </div>
    );
  }

  const COLORS = [
    "bg-primary",
    "bg-accent",
    "bg-success",
    "bg-warning",
    "bg-blue-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-orange-500",
  ];

  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-5 border border-gray-100 dark:border-gray-800">
      <h3 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark mb-4">
        {title}
      </h3>
      {/* Barra horizontal */}
      <div className="flex rounded-full overflow-hidden h-3 mb-3">
        {entries.map(([key, val], i) => (
          <div
            key={key}
            className={`${COLORS[i % COLORS.length]} transition-all`}
            style={{ width: `${(val / total) * 100}%` }}
            title={`${key}: ${val}`}
          />
        ))}
      </div>
      {/* Leyenda */}
      <div className="space-y-1.5">
        {entries.map(([key, val], i) => (
          <div key={key} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div
                className={`w-2.5 h-2.5 rounded-full ${COLORS[i % COLORS.length]}`}
              />
              <span className="text-text-primary-light dark:text-text-primary-dark capitalize">
                {formatLabel(key)}
              </span>
            </div>
            <span className="text-text-secondary-light dark:text-text-secondary-dark">
              {val} ({Math.round((val / total) * 100)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ListCard({
  title,
  items,
  color,
}: {
  title: string;
  items: Array<[string, number]>;
  color: string;
}) {
  if (items.length === 0) {
    return (
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-5 border border-gray-100 dark:border-gray-800">
        <h3 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
          {title}
        </h3>
        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
          Sin datos
        </p>
      </div>
    );
  }

  const maxVal = items[0]?.[1] || 1;

  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-5 border border-gray-100 dark:border-gray-800">
      <h3 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
        {title}
      </h3>
      <div className="space-y-2">
        {items.map(([label, count]) => (
          <div key={label} className="flex items-center gap-3">
            <span className="text-sm text-text-primary-light dark:text-text-primary-dark w-28 truncate capitalize">
              {formatLabel(label)}
            </span>
            <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${color === "text-primary" ? "bg-primary" : color === "text-green-600" ? "bg-success" : "bg-accent"}`}
                style={{ width: `${(count / maxVal) * 100}%` }}
              />
            </div>
            <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark w-8 text-right">
              {count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Users Tab ────────────────────────────────────

function UsersTab({
  users,
  selectedUser,
  userDetail,
  onSelectUser,
  onBack,
}: {
  users: UserLearning[];
  selectedUser: string | null;
  userDetail: {
    userId: string;
    user: { name: string; email: string; photoUrl: string; gender: string; birthDate: string | null } | null;
    profile: Record<string, unknown> | null;
    events: Array<{ type: string; timestamp: { _seconds: number }; data: Record<string, unknown> }>;
  } | null;
  onSelectUser: (userId: string) => void;
  onBack: () => void;
}) {
  if (selectedUser && userDetail) {
    return <UserDetailView detail={userDetail} onBack={onBack} />;
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
        {users.length} usuario{users.length !== 1 ? "s" : ""} con perfil de aprendizaje
      </p>
      {users.map((user) => (
        <button
          key={user.userId}
          onClick={() => onSelectUser(user.userId)}
          className="w-full text-left bg-surface-light dark:bg-surface-dark rounded-xl p-4 border border-gray-100 dark:border-gray-800 hover:border-primary/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            {user.photoUrl ? (
              <img
                src={user.photoUrl}
                alt=""
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium text-text-primary-light dark:text-text-primary-dark truncate">
                  {user.name}
                </p>
                {user.gender && (
                  <span className="text-xs px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-text-secondary-light dark:text-text-secondary-dark capitalize">
                    {user.gender}
                  </span>
                )}
                {user.ageRange && (
                  <span className="text-xs px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-text-secondary-light dark:text-text-secondary-dark">
                    {user.ageRange}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 mt-0.5">
                {user.synthesized?.travelStyle && (
                  <span className="text-xs text-primary capitalize">
                    {user.synthesized.travelStyle}
                  </span>
                )}
                {user.tripHistory?.totalTrips != null && (
                  <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                    {user.tripHistory.totalTrips} viajes
                  </span>
                )}
                {user.lastUpdated && (
                  <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                    Act: {new Date(user.lastUpdated).toLocaleDateString("es")}
                  </span>
                )}
              </div>
            </div>
            <svg
              className="w-5 h-5 text-text-secondary-light dark:text-text-secondary-dark"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>
      ))}
      {users.length === 0 && (
        <div className="text-center py-12 text-text-secondary-light dark:text-text-secondary-dark">
          No hay usuarios con perfil de aprendizaje aún
        </div>
      )}
    </div>
  );
}

// ─── User Detail ────────────────────────────────

function UserDetailView({
  detail,
  onBack,
}: {
  detail: {
    userId: string;
    user: { name: string; email: string; photoUrl: string; gender: string; birthDate: string | null } | null;
    profile: Record<string, unknown> | null;
    events: Array<{ type: string; timestamp: { _seconds: number }; data: Record<string, unknown> }>;
  };
  onBack: () => void;
}) {
  const profile = detail.profile || {};
  const synthesized = (profile.synthesized || {}) as Record<string, unknown>;
  const activityStats = (profile.activityStats || {}) as Record<string, Record<string, number>>;
  const tripHistory = (profile.tripHistory || {}) as Record<string, unknown>;
  const visitedPlaces = (profile.visitedPlaces || {}) as Record<string, Array<{ name: string }>>;
  const events = detail.events || [];

  return (
    <div className="space-y-6">
      {/* Botón volver + info usuario */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-text-primary-light dark:text-text-primary-dark"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        {detail.user?.photoUrl ? (
          <img src={detail.user.photoUrl} alt="" className="w-10 h-10 rounded-full object-cover" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
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
            {detail.user?.birthDate &&
              ` · ${new Date(detail.user.birthDate).toLocaleDateString("es")}`}
          </p>
        </div>
      </div>

      {/* Perfil sintetizado */}
      {Object.keys(synthesized).length > 0 && (
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-5 border border-gray-100 dark:border-gray-800">
          <h3 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
            Perfil aprendido
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {synthesized.travelStyle ? (
              <ProfileField label="Estilo" value={synthesized.travelStyle as string} />
            ) : null}
            {synthesized.pace ? (
              <ProfileField label="Ritmo" value={synthesized.pace as string} />
            ) : null}
            {synthesized.schedule ? (
              <ProfileField label="Horario" value={synthesized.schedule as string} />
            ) : null}
            {synthesized.budgetRange ? (
              <ProfileField label="Presupuesto" value={synthesized.budgetRange as string} />
            ) : null}
            {synthesized.nightlifePreference ? (
              <ProfileField label="Vida nocturna" value={synthesized.nightlifePreference as string} />
            ) : null}
            {synthesized.groupSize ? (
              <ProfileField label="Grupo" value={synthesized.groupSize as string} />
            ) : null}
          </div>

          {(synthesized.topActivityTypes as string[])?.length > 0 && (
            <div className="mt-3">
              <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-1">
                Actividades favoritas
              </p>
              <div className="flex flex-wrap gap-1.5">
                {(synthesized.topActivityTypes as string[]).map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full capitalize"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {(synthesized.avoidedActivityTypes as string[])?.length > 0 && (
            <div className="mt-2">
              <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-1">
                Actividades que evita
              </p>
              <div className="flex flex-wrap gap-1.5">
                {(synthesized.avoidedActivityTypes as string[]).map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full capitalize"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {(synthesized.commonChanges as string[])?.length > 0 && (
            <div className="mt-3 p-3 bg-primary/5 rounded-lg">
              <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-1">
                Patrones observados
              </p>
              {(synthesized.commonChanges as string[]).map((c, i) => (
                <p
                  key={i}
                  className="text-sm text-text-primary-light dark:text-text-primary-dark"
                >
                  · {c}
                </p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Activity Stats */}
      {Object.keys(activityStats).length > 0 && (
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-5 border border-gray-100 dark:border-gray-800">
          <h3 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
            Estadísticas de actividades
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {Object.entries(activityStats).map(([action, types]) => {
              const sorted = Object.entries(types).sort((a, b) => b[1] - a[1]).slice(0, 8);
              if (sorted.length === 0) return null;
              return (
                <div key={action}>
                  <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-2 capitalize">
                    {formatLabel(action)}
                  </p>
                  {sorted.map(([type, count]) => (
                    <div key={type} className="flex justify-between text-sm py-0.5">
                      <span className="text-text-primary-light dark:text-text-primary-dark capitalize">
                        {type}
                      </span>
                      <span className="text-text-secondary-light dark:text-text-secondary-dark">
                        {count}
                      </span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Trip History */}
      {Object.keys(tripHistory).length > 0 && (
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-5 border border-gray-100 dark:border-gray-800">
          <h3 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
            Historial de viajes
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {tripHistory.totalTrips != null && (
              <ProfileField label="Total viajes" value={String(tripHistory.totalTrips)} />
            )}
            {tripHistory.avgTripLength != null && (
              <ProfileField label="Días promedio" value={String(tripHistory.avgTripLength)} />
            )}
          </div>
          {(tripHistory.destinations as string[])?.length > 0 && (
            <div className="mt-3">
              <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-1">
                Destinos
              </p>
              <div className="flex flex-wrap gap-1.5">
                {(tripHistory.destinations as string[]).map((d) => (
                  <span
                    key={d}
                    className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full"
                  >
                    {d}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Lugares visitados */}
      {Object.keys(visitedPlaces).length > 0 && (
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-5 border border-gray-100 dark:border-gray-800">
          <h3 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
            Lugares visitados
          </h3>
          <div className="space-y-3">
            {Object.entries(visitedPlaces).map(([dest, places]) => (
              <div key={dest}>
                <p className="text-sm font-medium text-primary mb-1">{dest}</p>
                <div className="flex flex-wrap gap-1.5">
                  {(places as Array<{ name: string }>).map((p, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 rounded text-text-primary-light dark:text-text-primary-dark"
                    >
                      {p.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Eventos recientes */}
      {events.length > 0 && (
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-5 border border-gray-100 dark:border-gray-800">
          <h3 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
            Eventos recientes ({events.length})
          </h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {events
              .sort((a, b) => (b.timestamp?._seconds || 0) - (a.timestamp?._seconds || 0))
              .slice(0, 50)
              .map((event, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 py-2 border-b border-gray-100 dark:border-gray-800 last:border-0"
                >
                  <EventBadge type={event.type} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text-primary-light dark:text-text-primary-dark">
                      {eventDescription(event)}
                    </p>
                    <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-0.5">
                      {event.timestamp?._seconds
                        ? new Date(event.timestamp._seconds * 1000).toLocaleString("es")
                        : ""}
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
    <div>
      <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
        {label}
      </p>
      <p className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark capitalize">
        {value}
      </p>
    </div>
  );
}

function EventBadge({ type }: { type: string }) {
  const colors: Record<string, string> = {
    chat_modification: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    live_trip_day: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    itinerary_created: "bg-primary/10 text-primary",
    plan_created: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  };
  const labels: Record<string, string> = {
    chat_modification: "Chat",
    live_trip_day: "Live",
    itinerary_created: "Itinerario",
    plan_created: "Plan",
  };
  return (
    <span
      className={`text-[10px] px-1.5 py-0.5 rounded font-medium whitespace-nowrap ${colors[type] || "bg-gray-100 text-gray-600"}`}
    >
      {labels[type] || type}
    </span>
  );
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
  return key
    .replace(/_/g, " ")
    .replace(/([A-Z])/g, " $1")
    .trim();
}
