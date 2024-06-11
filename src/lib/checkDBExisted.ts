import { db } from "@/lib/db";

export const checkDBExisted = async () => {
  try {
    console.log("count start");
    const count = await db.eligibility_list.count();
    console.log("count end", count);
    console.log({ count });
    if (count >= 690716) {
      return true;
    }
  } catch (err) {
    console.log(err);
  }

  return false;
};
