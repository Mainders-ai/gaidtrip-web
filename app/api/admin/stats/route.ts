import { NextResponse } from "next/server";
import { getDb } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const usersSnap = await getDb().collection("users").get();

    let totalUsers = 0;
    let usersWithLearning = 0;
    const genderCounts: Record<string, number> = {};
    const ageRangeCounts: Record<string, number> = {};
    const allActivityStats: Record<string, Record<string, number>> = {
      kept: {},
      removed: {},
      added: {},
      completed: {},
      skipped: {},
    };
    const destinationCounts: Record<string, number> = {};
    const travelStyleCounts: Record<string, number> = {};
    const paceCounts: Record<string, number> = {};
    let totalTrips = 0;
    let totalTripDays = 0;
    let tripCount = 0;

    const profilePromises = usersSnap.docs.map(async (userDoc) => {
      totalUsers++;
      const userId = userDoc.id;
      const userData = userDoc.data();
      const profileSnap = await getDb().doc(`users/${userId}/learning/profile`).get();

      if (!profileSnap.exists) return;
      usersWithLearning++;

      const profile = profileSnap.data()!;
      const synthesized = profile.synthesized as Record<string, unknown> | undefined;
      const activityStats = profile.activityStats as Record<string, Record<string, number>> | undefined;
      const tripHistory = profile.tripHistory as Record<string, unknown> | undefined;
      const visitedPlaces = profile.visitedPlaces as Record<string, unknown> | undefined;

      // Género
      const gender = (userData.gender as string) || "no_especificado";
      genderCounts[gender] = (genderCounts[gender] || 0) + 1;

      // Edad
      const birthDate = userData.birthDate?._seconds
        ? new Date(userData.birthDate._seconds * 1000)
        : null;
      if (birthDate) {
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        const range = getAgeRange(age);
        ageRangeCounts[range] = (ageRangeCounts[range] || 0) + 1;
      }

      // Estilo de viaje
      if (synthesized?.travelStyle) {
        const style = synthesized.travelStyle as string;
        travelStyleCounts[style] = (travelStyleCounts[style] || 0) + 1;
      }

      // Ritmo
      if (synthesized?.pace) {
        const pace = synthesized.pace as string;
        paceCounts[pace] = (paceCounts[pace] || 0) + 1;
      }

      // Activity stats agregados
      if (activityStats) {
        for (const action of Object.keys(allActivityStats)) {
          const stats = activityStats[action] as Record<string, number> | undefined;
          if (stats) {
            for (const [type, count] of Object.entries(stats)) {
              allActivityStats[action][type] =
                (allActivityStats[action][type] || 0) + (count as number);
            }
          }
        }
      }

      // Destinos
      if (visitedPlaces) {
        for (const dest of Object.keys(visitedPlaces)) {
          destinationCounts[dest] = (destinationCounts[dest] || 0) + 1;
        }
      } else if (synthesized?.favoriteDestinations) {
        for (const dest of synthesized.favoriteDestinations as string[]) {
          destinationCounts[dest] = (destinationCounts[dest] || 0) + 1;
        }
      }

      // Trip history
      if (tripHistory) {
        const trips = (tripHistory.totalTrips as number) || 0;
        const avgLen = (tripHistory.avgTripLength as number) || 0;
        totalTrips += trips;
        if (trips > 0 && avgLen > 0) {
          totalTripDays += avgLen * trips;
          tripCount += trips;
        }
      }
    });

    await Promise.all(profilePromises);

    // Top actividades (más completadas)
    const topActivities = Object.entries(allActivityStats.completed || {})
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    // Top removidas
    const topRemoved = Object.entries(allActivityStats.removed || {})
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    // Top destinos
    const topDestinations = Object.entries(destinationCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15);

    return NextResponse.json({
      overview: {
        totalUsers,
        usersWithLearning,
        totalTrips,
        avgTripLength: tripCount > 0 ? Math.round(totalTripDays / tripCount * 10) / 10 : 0,
      },
      demographics: {
        gender: genderCounts,
        ageRange: ageRangeCounts,
      },
      preferences: {
        travelStyle: travelStyleCounts,
        pace: paceCounts,
      },
      activities: {
        topCompleted: topActivities,
        topRemoved,
        allStats: allActivityStats,
      },
      destinations: {
        top: topDestinations,
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Error al obtener estadísticas" },
      { status: 500 }
    );
  }
}

function getAgeRange(age: number): string {
  if (age < 18) return "< 18";
  if (age <= 24) return "18-24";
  if (age <= 34) return "25-34";
  if (age <= 44) return "35-44";
  if (age <= 54) return "45-54";
  return "55+";
}
