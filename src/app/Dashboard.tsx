import {
  Box,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
} from "@material-ui/core";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import { ChangeEvent, MouseEvent } from "react";
import { useDataProvider, useNotify } from "react-admin";

const Dashboard = () => {
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const onUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (readEvent) => {
        const read = readEvent.target?.result;
        if (read && typeof read === "string") {
          const db = JSON.parse(read);
          dataProvider.import(db).then(() => {
            event.target.value = "";
            notify("Import successful");
          });
        } else {
          console.error("Could not read file");
        }
      };
      reader.readAsText(file, "utf-8");
    }
  };
  const onDownload = (event: MouseEvent) => {
    dataProvider.export().then((response: any) => {
      const { db, key } = response.data;
      if (db) {
        const blob = new Blob([JSON.stringify(db, null, 2)], {
          type: "application/json",
        });
        const fakeLink = document.createElement("a");
        fakeLink.style.display = "none";
        document.body.appendChild(fakeLink);
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          // Manage IE11+ & Edge
          window.navigator.msSaveOrOpenBlob(blob, `${key}.json`);
        } else {
          fakeLink.setAttribute("href", URL.createObjectURL(blob));
          fakeLink.setAttribute("download", `${key}.json`);
          fakeLink.click();
        }
      }
    });
  };

  return (
    <Box mt={2}>
      <Grid
        container
        direction="column"
        justify="flex-start"
        alignItems="stretch"
        spacing={3}
      >
        <Grid item>
          <Typography variant="h3" component="h1">
            Welcome to the generic building game plant designer
          </Typography>
        </Grid>
        <Grid item>
          <Card>
            <CardHeader title="Import/Export DB" />
            <CardContent>
              <Grid container spacing={1}>
                <Grid item>
                  <input
                    accept="application/json"
                    id="contained-button-file"
                    style={{ display: "none" }}
                    type="file"
                    onChange={onUpload}
                  />
                  <label htmlFor="contained-button-file">
                    <Button
                      variant="contained"
                      startIcon={<CloudUploadIcon />}
                      component="span"
                    >
                      Import
                    </Button>
                  </label>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    startIcon={<CloudDownloadIcon />}
                    onClick={onDownload}
                  >
                    Export
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
