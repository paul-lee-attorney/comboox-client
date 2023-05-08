type DataListType = {
  isOrdered: boolean,
  data: readonly string[],
}

export function DataList({isOrdered, data}: DataListType) {
  const list = data.map((v, i) => <li key={`${i}_${v}`} >{v}</li>);
  return isOrdered ? <ol>{list}</ol> : <ul>{list}</ul>;
}

