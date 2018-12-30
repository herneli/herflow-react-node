import React from "react";
import IconPlus from "mdi-material-ui/Plus";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

export default function AddButton({ className, onClick, disabled }) {
  return (
    <Grid container>
      <Grid item xs={12}>
        <Grid container justify="flex-end">
          <Grid item xs={3}>
            <Button
              fullWidth
              variant="contained"
              onClick={onClick}
              disabled={disabled}
              size="small"
              color="secondary"
            >
              <IconPlus fontSize="small" />
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
