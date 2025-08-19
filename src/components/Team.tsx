"use client";

import { useEffect, useState } from "react";
import { AnimatedTeamCards } from "@/components/ui/animated-team-cards";
import Spinner from "@/components/ui/Spinner";

type TeamMember = {
  quote: string;
  name: string;
  role: string;
  image: string;
  email?: string;
  phone?: string;
};

export function Team() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTeam() {
      try {
        const res = await fetch("/api/team");
        if (!res.ok) throw new Error("Failed to fetch team");
        const data = await res.json();
        setTeamMembers(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchTeam();
  }, []);

  if (loading) return <Spinner name="Team members" />;

  return <AnimatedTeamCards testimonials={teamMembers} />;
}
