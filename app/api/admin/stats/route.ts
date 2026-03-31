import { NextResponse } from "next/server";
import { getDb } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = getDb();
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Fetch all collections in parallel
    const [usersSnap, itinerariesSnap, plansSnap, matchesSnap] =
      await Promise.all([
        db.collection("users").get(),
        db.collection("itineraries").get(),
        db.collection("plans").get(),
        db.collection("matches").get(),
      ]);

    // ── Overview ──
    let totalUsers = 0;
    let onlineNow = 0;
    let activeLastWeek = 0;
    let activeLastMonth = 0;
    let newUsersThisMonth = 0;
    let totalItinerariesGenerated = 0;

    // ── Demographics ──
    const genderCounts: Record<string, number> = {};
    const ageRangeCounts: Record<string, number> = {};
    const countryCounts: Record<string, number> = {};
    const interestCounts: Record<string, number> = {};

    // ── Subscriptions ──
    const subscriptionCounts: Record<string, number> = {
      free: 0,
      payPerTrip: 0,
      premium: 0,
    };

    // ── Registrations by month ──
    const registrationsByMonth: Record<string, number> = {};

    // ── Learning data ──
    const travelStyleCounts: Record<string, number> = {};
    const paceCounts: Record<string, number> = {};
    const allActivityStats: Record<string, Record<string, number>> = {
      completed: {},
      removed: {},
    };
    let usersWithLearning = 0;

    // Process users
    const learningPromises = usersSnap.docs.map(async (doc) => {
      totalUsers++;
      const data = doc.data();

      // Online / Active
      if (data.isOnline === true) onlineNow++;

      const lastSeen = data.lastSeen?._seconds
        ? new Date(data.lastSeen._seconds * 1000)
        : null;
      if (lastSeen) {
        if (lastSeen >= sevenDaysAgo) activeLastWeek++;
        if (lastSeen >= thirtyDaysAgo) activeLastMonth++;
      }

      // Registration date
      const createdAt = data.createdAt?._seconds
        ? new Date(data.createdAt._seconds * 1000)
        : null;
      if (createdAt) {
        if (createdAt >= startOfMonth) newUsersThisMonth++;
        const monthKey = `${createdAt.getFullYear()}-${String(createdAt.getMonth() + 1).padStart(2, "0")}`;
        registrationsByMonth[monthKey] =
          (registrationsByMonth[monthKey] || 0) + 1;
      }

      // Subscription
      const tier = (data.subscriptionTier as string) || "free";
      subscriptionCounts[tier] = (subscriptionCounts[tier] || 0) + 1;

      // Itineraries generated count
      if (data.itinerariesGenerated) {
        totalItinerariesGenerated += data.itinerariesGenerated as number;
      }

      // Gender
      const gender = (data.gender as string) || "";
      if (gender) {
        genderCounts[gender] = (genderCounts[gender] || 0) + 1;
      }

      // Age
      const birthDate = data.birthDate?._seconds
        ? new Date(data.birthDate._seconds * 1000)
        : null;
      if (birthDate) {
        let age = now.getFullYear() - birthDate.getFullYear();
        const m = now.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && now.getDate() < birthDate.getDate())) age--;
        const range = getAgeRange(age);
        ageRangeCounts[range] = (ageRangeCounts[range] || 0) + 1;
      }

      // Country
      const country = (data.country as string) || (data.homeCountry as string);
      if (country) {
        countryCounts[country] = (countryCounts[country] || 0) + 1;
      }

      // Interests
      const interests = data.interests as string[] | undefined;
      if (interests) {
        for (const interest of interests) {
          interestCounts[interest] = (interestCounts[interest] || 0) + 1;
        }
      }

      // Learning profile
      const profileSnap = await db
        .doc(`users/${doc.id}/learning/profile`)
        .get();
      if (!profileSnap.exists) return;
      usersWithLearning++;

      const profile = profileSnap.data()!;
      const synthesized = profile.synthesized as Record<string, unknown> | undefined;
      const activityStats = profile.activityStats as Record<string, Record<string, number>> | undefined;

      if (synthesized?.travelStyle) {
        const style = synthesized.travelStyle as string;
        travelStyleCounts[style] = (travelStyleCounts[style] || 0) + 1;
      }
      if (synthesized?.pace) {
        const pace = synthesized.pace as string;
        paceCounts[pace] = (paceCounts[pace] || 0) + 1;
      }

      if (activityStats) {
        for (const action of ["completed", "removed"]) {
          const stats = activityStats[action];
          if (stats) {
            for (const [type, count] of Object.entries(stats)) {
              allActivityStats[action][type] =
                (allActivityStats[action][type] || 0) + count;
            }
          }
        }
      }
    });

    await Promise.all(learningPromises);

    // ── Itineraries ──
    const itinerariesByMonth: Record<string, number> = {};
    const destinationCounts: Record<string, number> = {};
    let totalBudget = 0;
    let totalDays = 0;
    let itinWithBudget = 0;
    let itinWithDays = 0;

    itinerariesSnap.docs.forEach((doc) => {
      const data = doc.data();

      const createdAt = data.createdAt?._seconds
        ? new Date(data.createdAt._seconds * 1000)
        : null;
      if (createdAt) {
        const monthKey = `${createdAt.getFullYear()}-${String(createdAt.getMonth() + 1).padStart(2, "0")}`;
        itinerariesByMonth[monthKey] =
          (itinerariesByMonth[monthKey] || 0) + 1;
      }

      const dest = data.destination as string;
      if (dest) {
        destinationCounts[dest] = (destinationCounts[dest] || 0) + 1;
      }

      if (data.budget && data.budget > 0) {
        totalBudget += data.budget as number;
        itinWithBudget++;
      }

      const days = data.days as unknown[];
      if (days?.length) {
        totalDays += days.length;
        itinWithDays++;
      }
    });

    // ── Plans ──
    const plansByMonth: Record<string, number> = {};
    const planCityCounts: Record<string, number> = {};

    plansSnap.docs.forEach((doc) => {
      const data = doc.data();
      const createdAt = data.createdAt?._seconds
        ? new Date(data.createdAt._seconds * 1000)
        : null;
      if (createdAt) {
        const monthKey = `${createdAt.getFullYear()}-${String(createdAt.getMonth() + 1).padStart(2, "0")}`;
        plansByMonth[monthKey] = (plansByMonth[monthKey] || 0) + 1;
      }
      const city = data.city as string;
      if (city) {
        planCityCounts[city] = (planCityCounts[city] || 0) + 1;
      }
    });

    // ── Matches ──
    const totalMatches = matchesSnap.size;

    // Sort and limit
    const topDestinations = Object.entries(destinationCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    const topCountries = Object.entries(countryCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    const topInterests = Object.entries(interestCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12);
    const topCompleted = Object.entries(allActivityStats.completed || {})
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
    const topRemoved = Object.entries(allActivityStats.removed || {})
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);

    // Sort registration months
    const sortedRegistrations = Object.fromEntries(
      Object.entries(registrationsByMonth).sort(([a], [b]) => a.localeCompare(b))
    );
    const sortedItinByMonth = Object.fromEntries(
      Object.entries(itinerariesByMonth).sort(([a], [b]) => a.localeCompare(b))
    );

    return NextResponse.json({
      overview: {
        totalUsers,
        usersWithLearning,
        totalItineraries: itinerariesSnap.size,
        totalItinerariesGenerated,
        totalPlans: plansSnap.size,
        totalMatches,
        onlineNow,
        activeLastWeek,
        activeLastMonth,
        newUsersThisMonth,
      },
      registrations: sortedRegistrations,
      itinerariesByMonth: sortedItinByMonth,
      subscriptions: subscriptionCounts,
      demographics: {
        gender: genderCounts,
        ageRange: ageRangeCounts,
        topCountries,
        topInterests,
      },
      itineraryStats: {
        topDestinations,
        avgBudget:
          itinWithBudget > 0 ? Math.round(totalBudget / itinWithBudget) : 0,
        avgDays:
          itinWithDays > 0
            ? Math.round((totalDays / itinWithDays) * 10) / 10
            : 0,
      },
      planStats: {
        topCities: Object.entries(planCityCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10),
      },
      preferences: {
        travelStyle: travelStyleCounts,
        pace: paceCounts,
      },
      activities: {
        topCompleted,
        topRemoved,
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
