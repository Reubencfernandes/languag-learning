export type DialogueScenario = {
  title: string;
  scenario: string;
  description: string;
};

export const DIALOGUE_SCENARIOS: DialogueScenario[] = [
  {
    title: "Airport Check-In",
    scenario: "checking in at an airport counter, asking about baggage, seat choice, and boarding time",
    description: "Baggage, seats, gates, and polite travel questions.",
  },
  {
    title: "Cafe Order",
    scenario: "ordering coffee and food at a busy cafe, asking about ingredients and paying",
    description: "Order naturally, ask follow-ups, and respond to staff.",
  },
  {
    title: "Doctor Visit",
    scenario: "visiting a doctor, explaining symptoms, answering questions, and understanding advice",
    description: "Describe how you feel and understand care instructions.",
  },
  {
    title: "Hotel Reception",
    scenario: "checking into a hotel, confirming a reservation, asking about breakfast and room problems",
    description: "Reservations, requests, timings, and service issues.",
  },
  {
    title: "Job Interview",
    scenario: "a job interview with questions about experience, strengths, schedule, and salary expectations",
    description: "Professional answers with realistic follow-up questions.",
  },
  {
    title: "Apartment Viewing",
    scenario: "viewing an apartment, asking about rent, utilities, neighborhood, and lease terms",
    description: "Housing vocabulary and negotiation practice.",
  },
  {
    title: "Pharmacy",
    scenario: "buying medicine at a pharmacy, explaining a minor illness and asking how to take it",
    description: "Symptoms, dosage, warnings, and simple health questions.",
  },
  {
    title: "Train Station",
    scenario: "buying a train ticket, asking about platforms, delays, and connections",
    description: "Tickets, schedules, delays, and directions.",
  },
  {
    title: "Restaurant Reservation",
    scenario: "calling a restaurant to book a table, requesting a time, special seating, and dietary needs",
    description: "Booking by phone with polite, specific requests.",
  },
  {
    title: "Bank Visit",
    scenario: "opening a bank account or sending a transfer, asking about fees, ID, and processing time",
    description: "Accounts, transfers, IDs, and clarifying fees.",
  },
  {
    title: "Taxi or Rideshare",
    scenario: "taking a taxi or rideshare, giving the destination, talking about route and fare",
    description: "Directions, fares, small talk during the ride.",
  },
  {
    title: "Post Office",
    scenario: "sending a parcel at the post office, comparing shipping speeds, asking about customs and tracking",
    description: "Parcels, customs forms, tracking, and prices.",
  },
  {
    title: "Phone Plan Sign-Up",
    scenario: "signing up for a mobile phone plan, comparing data, contracts, and roaming",
    description: "Plans, data, contracts, and cancellation rules.",
  },
  {
    title: "Tech Support Call",
    scenario: "calling tech support about an internet outage, describing the problem and following steps",
    description: "Describe the issue, follow troubleshooting steps.",
  },
  {
    title: "Haircut",
    scenario: "getting a haircut, describing length, style, and reacting to suggestions from the stylist",
    description: "Style requests, lengths, and polite feedback.",
  },
  {
    title: "Gym Sign-Up",
    scenario: "joining a gym, asking about membership, classes, equipment, and trial passes",
    description: "Memberships, classes, equipment, and trials.",
  },
  {
    title: "Lost & Found",
    scenario: "reporting a lost item at a station, describing it, when and where it was lost",
    description: "Describe the item, time, and place clearly.",
  },
  {
    title: "Customs at Border",
    scenario: "going through customs, declaring items, answering questions about your trip",
    description: "Declarations, trip purpose, and short answers.",
  },
  {
    title: "First Date",
    scenario: "meeting someone for a first date at a cafe, getting to know each other, talking about hobbies",
    description: "Small talk, hobbies, getting to know someone.",
  },
  {
    title: "University Office",
    scenario: "visiting the university registrar, asking about enrollment, deadlines, and required documents",
    description: "Enrollment, paperwork, deadlines, and signatures.",
  },
];
