
import dayjs, { Dayjs } from "dayjs"
import { DateTimeField } from "@mui/x-date-pickers"
import { useState } from "react";



export default function DateTime() {
  const [ date, setDate ] = useState<Dayjs | null>(dayjs('2019-09-08T23:30'));

  return(
    <DateTimeField 
      label='Demo'
      value={date}
      onChange={(newValue) => setDate(newValue)} 
      ampm={ false }
    />
  )
}
