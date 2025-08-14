export const interleave = (list1: string[], list2: string[]) => {
  const result = [];
  const maxLength = Math.max(list1.length, list2.length);

  for (let i = 0; i < maxLength; i++) {
    if (i < list1.length) result.push([list1[i], "user"]);
    if (i < list2.length) result.push([list2[i], "ai"]);
  }

  return result;
};
