// import React from "react";
const columns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "ADDRESS", uid: "address", sortable: true },
  { name: "AMOUNT", uid: "amount", sortable: true },
  { name: "STATUS", uid: "status", sortable: true },
];

const statusOptions = [
  { name: "Eligible", uid: "eligible" },
  { name: "Not Eligible", uid: "noteligible" },
  { name: "Invalid Address", uid: "invalid" },
];

// const users = [
//   {
//     id: 1,
//     address: "Tony Reichert",
//     status: "eligible",
//     amount: "29",
//   },
//   {
//     id: 2,
//     address: "Zoey Lang",
//     status: "noteligible",
//     amount: "25",
//   },
//   {
//     id: 3,
//     address: "Jane Fisher",
//     amount: "22",
//     status: "eligible",
//   },
//   {
//     id: 4,
//     address: "William Howard",
//     status: "noteligible",
//     amount: "28",
//   },
//   {
//     id: 5,
//     address: "Kristen Copper",
//     status: "eligible",
//     amount: "24",
//   },
// ];

export { columns, statusOptions };
