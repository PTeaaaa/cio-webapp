export interface Order {
  id: number;
  prefix?: string;
  user: {
    image: string;
    firstName: string;
    lastName: string;
    year: string;
  };
  placeName: string;
  whoLastEdited: {
    accounts: string[];
  };
  status: string;
  dateUpdated: string;
}

export const peopleData: Order[] = [
  {
    id: 1,
    user: {
      image: "/images/user/user-17.jpg",
      firstName: "Lindsey",
      lastName: "Curtis",
      year: "ปี 2567",
    },
    placeName: "สำนักงานปลัดกระทรวงสาธารณสุข",
    whoLastEdited: {
      accounts: [
        "Administrator",
      ],
    },
    dateUpdated: "3.9K",
    status: "ดำรงตำแหน่ง",
  },
  {
    id: 2,
    user: {
      image: "/images/user/user-18.jpg",
      firstName: "Kaiya",
      lastName: "George",
      year: "Project Manager",
    },
    placeName: "Technology",
    whoLastEdited: {
      accounts: [
        "Administrator",
      ],
    },
    dateUpdated: "24.9K",
    status: "พ้นตำแหน่ง",
  },
  {
    id: 3,
    user: {
      image: "",
      firstName: "Zain",
      lastName: "Geidt",
      year: "Content Writing",
    },
    placeName: "Blog Writing",
    whoLastEdited: {
      accounts: [
        "Administrator",
        "PJ - Editor"
      ],
    },
    dateUpdated: "12.7K",
    status: "ดำรงตำแหน่ง",
  },
  {
    id: 4,
    user: {
      image: "/images/user/user-20.jpg",
      firstName: "Abram",
      lastName: "Schleifer",
      year: "Digital Marketer",
    },
    placeName: "Social Media",
    whoLastEdited: {
      accounts: [
        "Administrator",
      ],
    },
    dateUpdated: "2.8K",
    status: "ยกเลิก",
  },
  {
    id: 5,
    user: {
      image: "/images/user/user-21.jpg",
      firstName: "Carla",
      lastName: "George",
      year: "Front-end Developer",
    },
    placeName: "Website",
    whoLastEdited: {
      accounts: [
        "",
      ],
    },
    dateUpdated: "4.5K",
    status: "",
  },
];