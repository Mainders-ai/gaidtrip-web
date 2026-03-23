import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    // Si piden un usuario específico
    if (userId) {
      return await getUserLearning(userId);
    }

    // Listar todos los usuarios con learning profile
    return await getAllUsersLearning();
  } catch (error) {
    console.error("Error fetching learning data:", error);
    return NextResponse.json(
      { error: "Error al obtener datos" },
      { status: 500 }
    );
  }
}

async function getUserLearning(userId: string) {
  const [profileSnap, eventsSnap, userSnap] = await Promise.all([
    getDb().doc(`users/${userId}/learning/profile`).get(),
    getDb().doc(`users/${userId}/learning/events`).get(),
    getDb().doc(`users/${userId}`).get(),
  ]);

  const profile = profileSnap.exists ? profileSnap.data() : null;
  const events = eventsSnap.exists ? eventsSnap.data() : null;
  const user = userSnap.exists ? userSnap.data() : null;

  return NextResponse.json({
    userId,
    user: user
      ? {
          name: user.name || user.displayName || "Sin nombre",
          email: user.email || "",
          photoUrl: user.photoUrl || user.photoURL || "",
          gender: user.gender || "",
          birthDate: user.birthDate?._seconds
            ? new Date(user.birthDate._seconds * 1000).toISOString()
            : null,
        }
      : null,
    profile,
    events: events?.events || [],
  });
}

async function getAllUsersLearning() {
  // Obtener todos los usuarios que tienen learning/profile
  const usersSnap = await getDb().collection("users").get();

  const usersWithLearning: Array<{
    userId: string;
    name: string;
    email: string;
    photoUrl: string;
    gender: string;
    age: number | null;
    ageRange: string;
    synthesized: Record<string, unknown> | null;
    activityStats: Record<string, unknown> | null;
    tripHistory: Record<string, unknown> | null;
    visitedPlaces: Record<string, unknown> | null;
    lastUpdated: string | null;
  }> = [];

  // Batch: obtener perfiles de aprendizaje en paralelo
  const profilePromises = usersSnap.docs.map(async (userDoc) => {
    const userId = userDoc.id;
    const userData = userDoc.data();
    const profileSnap = await getDb().doc(`users/${userId}/learning/profile`).get();

    if (!profileSnap.exists) return null;

    const profile = profileSnap.data()!;
    const birthDate = userData.birthDate?._seconds
      ? new Date(userData.birthDate._seconds * 1000)
      : null;

    let age: number | null = null;
    if (birthDate) {
      const today = new Date();
      age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
    }

    return {
      userId,
      name: userData.name || userData.displayName || "Sin nombre",
      email: userData.email || "",
      photoUrl: userData.photoUrl || userData.photoURL || "",
      gender: userData.gender || "",
      age,
      ageRange: profile.demographics?.ageRange || (age ? getAgeRange(age) : ""),
      synthesized: profile.synthesized || null,
      activityStats: profile.activityStats || null,
      tripHistory: profile.tripHistory || null,
      visitedPlaces: profile.visitedPlaces || null,
      lastUpdated: profile.lastUpdated?._seconds
        ? new Date(profile.lastUpdated._seconds * 1000).toISOString()
        : null,
    };
  });

  const results = await Promise.all(profilePromises);
  results.forEach((r) => {
    if (r) usersWithLearning.push(r);
  });

  // Ordenar por última actualización (más reciente primero)
  usersWithLearning.sort((a, b) => {
    if (!a.lastUpdated) return 1;
    if (!b.lastUpdated) return -1;
    return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
  });

  return NextResponse.json({ users: usersWithLearning });
}

function getAgeRange(age: number): string {
  if (age < 18) return "< 18";
  if (age <= 24) return "18-24";
  if (age <= 34) return "25-34";
  if (age <= 44) return "35-44";
  if (age <= 54) return "45-54";
  return "55+";
}
