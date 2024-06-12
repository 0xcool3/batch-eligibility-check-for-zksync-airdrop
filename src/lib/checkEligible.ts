import { db } from "@/lib/db";
import { isAddress } from "viem";

export const checkEligible = async (list: string[]) => {
  const uniqueSet = new Set(list);
  const addresses = Array.from(uniqueSet);
  const validAddresses = addresses.map((address) => {
    return address.toLocaleLowerCase();
  });

  const result = await db.eligibility_list.bulkGet(validAddresses);

  let users = [];

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
};
