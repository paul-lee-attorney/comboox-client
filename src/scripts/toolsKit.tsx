
export function toPercent(num: number): string {
  let percent = Number(num / 100).toFixed(2) + '%';
  return percent;
}

export function toBasePoint(percent: string): number {
  let strPercent = percent.replace('%', '').replace('.', '');

  let basePoint = parseInt(strPercent);

  return basePoint;
}

export function dateParser(timestamp: number): string {
  let numDate = timestamp * 1000;
  let date1 = new Date(numDate);
  let date2 = date1.toLocaleDateString().replace(/\//g, "-") + ' ' + date1.toTimeString().substring(0,8);

  return date2;
}


