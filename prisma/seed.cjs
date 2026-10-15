require("@next/env").loadEnvConfig(process.cwd());
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const vehicles = [
  {
    id: "demo-fiat-500",
    title: "Fiat 500",
    brand: "Fiat",
    model: "500",
    year: 2020,
    category: "Hatchback",
    city: "Colombo",
    dailyRate: 6500,
    transmission: "Automatic",
    fuel: "Petrol",
    seats: 4,
    image: "/images/hatchback.jpg",
    driveType: "Self-drive",
    owner: "Nimal P.",
    description:
      "A compact companion for city streets and spontaneous coastal escapes. Easy to park, comfortable for two with luggage, and a little bit of fun on every journey.",
  },
  {
    id: "demo-bmw-sedan",
    title: "BMW 5 Series",
    brand: "BMW",
    model: "5 Series",
    year: 2021,
    category: "Sedan",
    city: "Colombo",
    dailyRate: 18000,
    transmission: "Automatic",
    fuel: "Petrol",
    seats: 5,
    image: "/images/sedan.jpg",
    driveType: "With driver",
    owner: "Dilan R.",
    description:
      "Travel in comfort with a spacious premium sedan. A relaxed choice for business trips, airport transfers, and a special weekend away.",
  },
  {
    id: "demo-honda-crv",
    title: "Honda CR-V",
    brand: "Honda",
    model: "CR-V",
    year: 2019,
    category: "SUV",
    city: "Kandy",
    dailyRate: 12000,
    transmission: "Automatic",
    fuel: "Petrol",
    seats: 5,
    image: "/images/suv.jpg",
    driveType: "Self-drive",
    owner: "Kasun M.",
    description:
      "Make room for the whole adventure. This comfortable SUV has space for family, friends, and weekend bags, with a raised driving position for exploring the hill country.",
  },
  {
    id: "demo-range-rover",
    title: "Range Rover Sport",
    brand: "Land Rover",
    model: "Range Rover Sport",
    year: 2020,
    category: "Luxury",
    city: "Negombo",
    dailyRate: 28000,
    transmission: "Automatic",
    fuel: "Diesel",
    seats: 5,
    image: "/images/luxury.jpg",
    driveType: "With driver",
    owner: "Amaya S.",
    description:
      "An elevated way to explore the island. Enjoy a generous cabin, a comfortable ride, and a vehicle that feels just as at home at a special occasion as on a long escape.",
  },
  {
    id: "demo-vw-camper",
    title: "Volkswagen Camper",
    brand: "Volkswagen",
    model: "Camper",
    year: 1978,
    category: "Van",
    city: "Galle",
    dailyRate: 15000,
    transmission: "Manual",
    fuel: "Petrol",
    seats: 6,
    image: "/images/van.jpg",
    driveType: "With driver",
    owner: "Ravindu J.",
    description:
      "Take the scenic route in a classic camper full of character. A memorable backdrop for a coastal day out, a photoshoot, or an unhurried trip with friends.",
  },
  {
    id: "demo-bmw-sports",
    title: "BMW M4",
    brand: "BMW",
    model: "M4",
    year: 2021,
    category: "Sports",
    city: "Colombo",
    dailyRate: 32000,
    transmission: "Automatic",
    fuel: "Petrol",
    seats: 4,
    image: "/images/compact.jpg",
    driveType: "Self-drive",
    owner: "Shan W.",
    description:
      "A spirited coupe for a special drive. A modern cabin and striking design make this a memorable choice for a weekend escape or a celebration.",
  },
];

async function main() {
  for (const { owner, ...vehicle } of vehicles) {
    const user = await prisma.user.upsert({
      where: { email: `${vehicle.id}@example.invalid` },
      update: {},
      create: {
        name: owner,
        email: `${vehicle.id}@example.invalid`,
        role: "OWNER",
      },
    });
    await prisma.vehicle.upsert({
      where: { id: vehicle.id },
      update: {},
      create: {
        ...vehicle,
        ownerId: user.id,
        demo: true,
        features: JSON.stringify([
          "Air conditioning",
          "Bluetooth",
          "USB charging",
        ]),
      },
    });
  }
  console.log(
    "Six clearly labeled demo listings are ready. Demo owners cannot sign in or receive inquiries.",
  );
}
main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
