import React from "react";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import CheckBox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

class ActivityPicker extends React.Component {
  mapButtons = activity => {
    const { step, chosenActivities, color, toggleActivity } = this.props;
    //Only maps buttons for current step, based on activity group numbers
    if (activity.categoryId === step) {
      let checked = chosenActivities.includes(activity);
      return (
        <div key={activity.name} className="checkBoxLabel">
          <FormControlLabel
            control={
              <CheckBox
                style={{ color: color }}
                onChange={toggleActivity}
                name={activity.name}
                checked={checked}
              />
            }
            label={activity.name}
          />
        </div>
      );
    }
  };

  render() {
    const { color, time, image, blurbPt1, blurbPt2, activities } = this.props;
    return (
      <div className="activityPicker">
        <div className="activityPickerText">
          <div className="pickerImageBox">
            <img src={image} alt="icon" className="pickerImage" />
          </div>
          <div style={{ marginTop: "7em" }}>
            <Typography variant="h5" align="center" gutterBottom={true}>
              {blurbPt1}
              <span
                style={{
                  color: color
                }}
              >
                <b>{time} Time</b>
              </span>
              {blurbPt2}
            </Typography>
          </div>
        </div>
        <Divider style={{ marginBottom: "1.5em", marginTop: "1.5em" }} />
        <div className="activityButtonBox">
          {activities.map(activity => this.mapButtons(activity))}
        </div>
      </div>
    );
  }
}

export default ActivityPicker;
