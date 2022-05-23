export const MOCK_TIMES = [
  {
    hours: 10,
    minutes: 0,
  },
  {
    hours: 10,
    minutes: 30,
  },
  {
    hours: 11,
    minutes: 0,
  },
  {
    hours: 11,
    minutes: 30,
  },
  {
    hours: 12,
    minutes: 0,
  },
  {
    hours: 13,
    minutes: 0,
  },
  {
    hours: 13,
    minutes: 30,
  },
  {
    hours: 14,
    minutes: 0,
  },
  {
    hours: 14,
    minutes: 30,
  },
  {
    hours: 15,
    minutes: 0,
  },
];

export const MOCK_MEETING = {
  attendee: "William Wallace",
  date: new Date(),
  endDate: new Date(new Date().setHours(23)),
  description:
    "Meeting to discuss the next steps in the Raid Guild World Domination Schedule ",
};

export const MOCK_MEETINGS = [
  {
    attendee: "William Wallace",
    date: new Date(),
    endDate: new Date(new Date().setHours(6)),
    description:
      "Meeting to discuss the next steps in the Raid Guild World Domination Schedule ",
  },
  {
    attendee: "Brendan Brandon",
    date: new Date(new Date().setHours(10)),
    endDate: new Date(new Date().setHours(11)),
    description: "Meeting to discuss important stuff ",
  },
  {
    attendee: "Matt Murdock",
    date: new Date(new Date().setHours(15)),
    endDate: new Date(new Date().setHours(16)),
    description: "Visual impaired Society Town Hall ",
  },
  {
    attendee: "Jhon Salvatore",
    date: new Date(new Date().setHours(23)),
    endDate: new Date(new Date().setHours(24)),
    description: "Pizza Party!",
  },
];

export const MOCK_PROFILE = {
  address: "0x309D80bd9610696b861af6fD51947e7d169bb16C",
  picture:
    "http://cdn.shopify.com/s/files/1/0583/5341/8448/products/sadPepe_digital_art_x4_8ae327af-c647-4b1d-aa50-20572ab14e13.png?v=1625845340",
  username: "sadpepe42",
  description: `Don't underestimate the Force. I find your lack of faith disturbing. Remember, a Jedi can feel the Force flowing through him. Look, I ain't in this for your revolution, and I'm not in it for you, Princess. I expect to be well paid. I'm in it for the money.`,
};
