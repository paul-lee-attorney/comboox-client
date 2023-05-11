


export function dateParser(timestamp: number): string {
  let numDate = timestamp * 1000;
  let date1 = new Date(numDate);
  let date2 = date1.toLocaleDateString().replace(/\//g, "-") + ' ' + date1.toTimeString().substring(0,8);

  return date2;
}

