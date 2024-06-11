import { db } from "@/lib/db";
import { isAddress } from "viem";

export const checkEligible = async (list: string[]) => {
  const uniqueSet = new Set(list);
  const addresses = Array.from(uniqueSet);
  const validAddresses = addresses.map((address) => {
    return address.toLocaleLowerCase();
  });

  const result = await db.eligibility_list.bulkGet(validAddresses);
  console.log(
    555,
    result,
    isAddress("0xa5cc3c03994db5b0d9a5eEdD10Cabab0813678ac", { strict: false }),
  );

  let users = [];

  // id: 1,
  // address: "Tony Reichert",
  // status: "eligible",
  // amount: "29",

  for (let i = 0; i < addresses.length; i++) {
    users.push(
      {
        id: addresses[i],
        address: addresses[i],
        status: isAddress(addresses[i], { strict: false })
          ? (result[i] == undefined ? "noteligible" : "eligible")
          : "invalid",
        amount: result[i] == undefined ? 0 : result[i]?.tokenAmount,
      },
    );
  }
  return users;

  // const validAddresses = addresses.filter((address: string) => {
  //   return isAddress(address);
  // }).map((address) => {
  //   return address.toLocaleLowerCase();
  // });

  // console.log({ validAddresses });
};
