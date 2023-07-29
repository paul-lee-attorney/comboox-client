import { useEffect, useState } from "react";

import { useComBooxContext } from "../../../scripts/ComBooxContext";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Paper, Stack, TextField, Toolbar, Typography } from "@mui/material";
import { SettingsOutlined } from "@mui/icons-material";
import { AddrZero, HexType } from "../../../interfaces";
import { ActionsOfSetting } from "./ActionsOfSetting";
import { BookInfo, getBoox, getKeepers, nameOfBooks, titleOfKeepers } from "../../../queries/gk";
import { BooxList } from "./ConfigSetting/BooxList";

interface ConfigSettingProps {
  companyName: string;
  symbol: string;
}

export function ConfigSetting({companyName, symbol}:ConfigSettingProps) {
  const { gk, boox } = useComBooxContext();

  const [ title, setTitle ] = useState<number>(0);
  const [ addr, setAddr ] = useState<HexType>(AddrZero); 

  const [ keepers, setKeepers ] = useState<BookInfo[]>();
  const [ books, setBooks ] = useState<BookInfo[]>();

  const refreshBooks = async () => {
    if (gk) {
      getKeepers(gk).then(
        res => setKeepers(res)
      );
      getBoox(gk).then(
        res => setBooks(res)
      );
    }
  }

  const [ open, setOpen ] = useState(false);

  const handleClick = ()=> {
    refreshBooks();
    setOpen(true);
  }

  return (
    <>
      <IconButton
        size="large"
        onClick={handleClick}      
      >
        <SettingsOutlined />
      </IconButton>

      <Dialog
        maxWidth={false}
        open={open}
        onClose={()=>setOpen(false)}
        aria-labelledby="dialog-title"
      >
        <DialogTitle id="dialog-title" sx={{ textDecoration:'underline' }} >
          <b>Config Setting </b>
        </DialogTitle>

        <DialogContent>

          <table width={980}>
            <thead />
            <tbody>
              <tr>        
                <td colSpan={3}>
                  <TextField 
                    value={ companyName } 
                    variant='outlined' 
                    label="NameOfCompany" 
                    inputProps={{readOnly: true}}
                    fullWidth
                    size='small'
                    sx={{
                      m:1
                    }}
                  />
                </td>
                <td>
                  <TextField 
                    value={ symbol } 
                    variant='outlined' 
                    label="Symbol" 
                    inputProps={{readOnly: true}}
                    fullWidth
                    size='small'
                    sx={{
                      m:1
                    }}
                  />
                </td>
              </tr>

              <tr>
                <td colSpan={4}>
                    <BooxList title="Keepers List" list={keepers} names={titleOfKeepers} setTitle={setTitle} setAddr={setAddr} />
                </td>
              </tr>

              <tr>
                <td colSpan={4}>
                    <BooxList title='Boox List' list={books} names={nameOfBooks} setTitle={setTitle} setAddr={setAddr} />
                </td>
              </tr>

              <tr>
                <td colSpan={4}>
                  <ActionsOfSetting title={title} addr={addr} setTitle={setTitle} setAddr={setAddr} setOpen={setOpen} />
                </td>
              </tr>

            </tbody>
          </table>

        </DialogContent>

        <DialogActions>
          <Button 
            sx={{m:1, ml:5, p:1, minWidth:128 }}
            variant="outlined"
            onClick={()=>setOpen(false)}
          >
            Close
          </Button>
        </DialogActions>
      
      </Dialog>
    </>
  );
}